---
title: Billing System Redesign
company: Cloud Provider
description: Modernizing backend billing system infrastrcuture and flows
tags: ["backend", "large-scale", "data", "billing", "slow rollout"]
completionYear: 2024
readingTime: long
---

## Background

Company is a cloud provider for the JAMstack, offering an easy way for teams to deploy and manage their sites and worklows.

## Problem statement

A billing system built for an early stage startup with a smaller pool of customers has inherently different needs than a billing system built for a later stage startup or company with millions of users.

The legacy billing system was hitting scalability issues as the user base grew, and the customer's base needs evolved to require more real-time billing usage insights.

### The Legacy Billing System

The Legacy billing system was designed to work well with a smaller pool of users. The system design looked as follows:

![Legacy Billing System](/projects/billing-before.png)

At a glance, this system parsed user traffic log lines to infer usage. Logs were shipped from our logging provider via log drains to a GCP instance, where these logs are archived in bulk. The log archives were then parsed and the data was entered into RedShift.

This system was mostly owned and managed by SRE, and its workings were unclear to the rest of the teams.

### System overview

#### 1. Usage Records

The system used the Usage Record pattern, which is a pattern in usage based billing where individual records in a database are used to keep track of a user's usage in the system.

The system in question uses Ruby on Rails and Mongo DB, and can be described as follows:

- An Account can have many Sites
- A Site can have many UsageRecords
- A UsageRecord can have 1 UsageType
- An Account can have many UsageRecords (through Sites)

![UML Diagram](/projects/uml.png)

#### 2. Daily usage jobs (cron jobs)

The system would run nightly cron jobs at midnight Pacific Time that would iterate over every UsageRecord in the database and do the following:

- Hydrate the UsageRecords by fetching usage data from our billing usage data warehouse (using RedShift).
- Update the usage in our billing platform.

All of this was driven using a Sidekiq job queue in Ruby on Rails, sending usage data for each UsageRecord to our billing platform via REST API.

This system was not smart enough to only update records that had incurred usage, so these daily cron jobs were also spending compute time every day on No Ops.

#### 3. Daily morning bill run

With usage updated in our billing platform the night before, our billing platform would then kick off a daily bill run at 8am Pacific Time. This daily bill run was handled entirely by the billing platform, and was responsible for generating and collecting invoices.

> ❗ RISK: The Daily Usage jobs needed to be complete by 8am Pacific Time, or users would not be billed accurately for the usage.

### Pain points

#### 1. Time bound jobs!

As the company and user base grew, the Daily Cron jobs were taking longer and longer to complete each night. Through our monitoring, we were able to determine these jobs were taking hours to run, and also were hitting resource limitations in CPU usage.

#### 2. Time wasted on No Ops

As mentioned above, the old system was not smart enough to only hydrate records of sites that had generated usage, so we were wasting valuable compute resources and time on No Ops.

#### 3. More real-time data insights

As the user base has grown and evolved, we now have many users running their business on our product. But with this also comes budget limitations for our customers. Our customers want real-time usage data insights, and want to be informed in a timely manner if they are about to hit a bandwidth limit, and incur overage charges.

Since the (old) billing system hydrates usage every 24 hours, this was proving to be too long a feedback loop for our customers.

While we could run the hydration job periodically throughout the day, we still had the constraint explained above, which is that the daily cron jobs were taking hours to run and were hitting resource limits.

#### 4. Usage storage was becoming cost-prohibitive

In addition to the issues above, our RedShift costs were becoming too cost-prohibitive. We could upgrade to a larger instance, but that instance was simply outside our budget.

We were at an inflection point, and we needed a solution that would save the company money, as well as speed things up for our customers.

#### 5. Murky source of truth

With this old system, with usage data scattered across RedShift, the UsageRecord collection in MongoDB, and the billing platform, it was hard to determine what the real source of truth was. The system would also sometimes get out of sync (if the daily hydraton cron jobs didn't finish the night before).

#### 6. Difficult to introduce new metrics for monetization

Introducing new metrics to monetize involved making changes across a variety of systems, and was a time consuming process. This made our pricing and packaging hard to adapt as the needs of the business change.

#### 7. Data inconsistency 

All of the billing data was stored using UTC-7 (to match Pacific Time), but the usage data itself is metered in UTC. This often caused confusion internally, and seemed like an arbitrary decision that was more of an anti-pattern and not an industry standard. Moreover, our use of UTC-7 is not documented anywhere in customer documentation, resulting in confusion from customers.

### Considerations

1. The new system needed to work well with our existing data pipeline
2. The new system should have a clearer source of truth
3. The new system must provide as real-time data insights to users as possible
4. The new system should be in UTC not UTC-7

Bonus:

- New system must make it easier for other teams to contribute, in order to lower the barrier to introduce new billable metrics or products

## Solution overview

![Billing after](/projects/billing-after.png)

This solution was a multi-year, multi-team collaborative effort. The SRE team owned choosing our new data warehouse, related work migrating away from RedShift, and integrating Kafka into the billing flow.

My work involved a multi-phase approach to migrate first to ClickHouse, then to new tables in UTC, and a high-throughput periodic sync job instead of daily cron jobs.

#### 1. Phase 1: Choosing Clickhouse as a new data warehouse

ClickHouse is an open source, column-based relational database similar to RedShift, but with some differences which make it faster for more real-time queries, as well as cheaper due to higher compression capabilities.

This resulted in huge cost savings with the added benefit of speed. We decided to use a managed ClickHouse hosting solution, but again, this was still much cheaper than having stayed with AWS. In addition, because ClickHouse is optimized for real-time queries, the daily usage cron jobs became much faster! 

This first phase of the project involved migrating from RedShift to ClickHouse for data storage. My job here involved ensuring parity between the two systems, to ensure the data in ClickHouse matched what we would expect the data to be in RedShift for UsageRecord hydration.

To do this, we took a "sidecar" approach and sent usage data to both RedShift and ClickHouse at the same time. I then created a script to measure the difference between the two databases, sent that data to DataDog, and created a dashboard to measure the percentage delta between the two systems for all billing metrics. If the percentage was within margin of error, we flipped the switch for UsageRecords to use ClickHouse for hydration instead of RedShift, until all metrics were using ClickHouse to hydrate UsageRecords.

#### 2. Phase 2: UsageRecords stop being source of truth for billing

Though the daily jobs were much faster now, there were still optimizations to be made.

In the old model, UsageRecords were the source of truth of billable data (arguably since this data was replicated in RedShift, UsageRecords, and the billing platform, and this could all get out of sync). Since this data is now much faster to query through ClickHouse, and ClickHouse also offers data exports to S3, I pitched the idea of streamlining how we sync data with our billing platform, and essentially cut out the middleman of UsageRecords.

✅ **Pros:** Having data duplicated in our data warehouse and UsageRecords offers data redundancy

❌ **Cons:** Daily Cron jobs run on Sidekiq are just not fast enough. If a job fails, it has to be re-enqueued manually via command line.

This second phase of the project involved moving away from using the UsageRecord collection in the Mongo DB database, and stop using Daily Cron jobs run by Sidekiq to update our billing platform via REST API, which was an error prone, slow, time-bound process.

In the new system, we leverage a high-throughput syncing mechanism offered by our billing platform, instead of relying on their REST API for updating usage. 

This system uses a shared S3 bucket between us and our billing platform. Our ClickHouse instance exports usage data into the S3 bucket in the form of various csv files with usage data. The billing system then uses an Apache Spark job to import that data into their system.

This entire operation takes a matter of minutes now, and we are able to run this throughout the day.

**By the numbers:**
- 3 million records processed hourly
- 72 million records processed daily
- 26 billion records processed per year

> 📈 **Room to grow:** Our billing platform allows us to scale up to 180 billion events processed per year

By the end of this phase, we had working data syncs from ClickHouse to the billing platform running throughout the day with brand new tables from ClickHouse in UTC, not UTC-7.

#### Phase 3: Migrating to new subscriptions data in UTC

Since all subscriptions were consuming usage data in UTC-7, we had to recreate subscriptions in the billing platform with the corrected timezone now in UTC.

As part of this phase, I worked on a slow roll out of migrating customer subscriptions to use UTC corrected data. As part of this rollout, we would schedule the old subcription using UTC-7 to lapse at the end of the current bill period. Once that lapsed, we programatically recreated the subscription using the correct timezone.

This correction of data has allowed us to eliminate tech debt related to dealing with the arbitrary time shift, made all our data more consistent internally and externally, and reduced customer confusion around usage data timing.

#### Bonus: Easier to introduce new billable metrics!

In the old system, introducing a new billable metric used to not be a straight-forward process that involved changes in too many systems.

In the new system, all that is required to introduce a new billable metric is 3 simple steps:

1. Emit an event to Kafka. How this event is shaped is up to the team introducing the new metric.
2. Create a new table in ClickHouse
3. Process the event and insert the data into ClickHouse

### Benefits of new system

1. **Clear source of truth!** All usage data is now centralized in ClickHouse, and not also stored in the form of UsageRecords in a separate database, which runs the risk of getting out of sync.
2. **Clearer separation of concerns:** ClickHouse now serves as a good service boundary between metering a feature, and billing for a feature. The internal contract is now for teams to handle getting their metered data into ClickHouse, and the billing team owning the process once the data is in ClickHouse.
3. **Faster processing:** Leveraging the high throughput sync via S3, we can process millions of records in a matter of a few minutes. This has enabled us to easily run these sync jobs throughout the day, decreasing the feedback loop for customers. We can now act much faster on usage patterns, and also notify customers sooner if they're at risk of going over their usage.

### Risks

No systsem comes without risks, and in this case the risks are known, and we have ways to monitor and recover.

#### 1. Monitoring event volume

We monitor the event volume we're syncing with our billing platform hourly, and have alerting in place if the volume drops below an expected threshold. This alerting then pages the team.

Instead of needing to re-run jobs manually via a command line (which we had to run by SSHing into a production pod), we can now re-run them using Airflow, which offers a much nicer interface and doesn't require command line access to a production pod.

We also have an extended grace period provided by the billing platform in order to resync the data.

#### 2. Monitoring ClickHouse health

Since ClickHouse now serves as the data source, not just for billing, but for other data needs as well; this system is considered mission critical and is closely monitored. The system has different clusters separated by concerns, so that any issues in one cluster do not affect others.

In addition, there is monitoring in place to alert if the volume of inserts into ClickHouse falls below a certain threshold. This alert then pages the team for action.

## Resources

### ClickHouse
[Real-time analytics](https://clickhouse.com/engineering-resources/what-is-real-time-analytics)
[ClickHouse vs AWS RedShift](https://medium.com/doublecloud-insights/clickhouse-vs-aws-redshift-a-comprehensive-analysis-29fc45ce811b)