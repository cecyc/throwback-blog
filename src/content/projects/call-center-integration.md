---
title: Call Center Integration
company: Thinkful
description: Growth Engineering project featuring legacy call center technology
tags: ["legacy", "microservice", "end-to-end", "full stack", "iterative"]
completionYear: 2018
readingTime: medium
---

## Background

![Thinkful](/projects/thinkful.png)

Thinkful is an online e-learning platform offering formal courses to teach people how to transition into a career in tech. The program offers 1-on-1 mentorship, classes, and career coaching.

## Problem statement

As part of a Growth Engineering initiative, our company needed a way to make our product more accessible to prospective students. Picking a program like Thinkful is a big decision, and offering prospective students the opportunity to talk to a real person can provide better leads for us, while also helping students determine if the program is right for them.

As part of this initative, we offered students the ability to request a phone call from us. This served as a "pre-screen" and was handled by a third-party call center.

## The "Call Me Now" feature

![Call Me Now](/projects/call-me-now.png)

The flow was fairly simple, a user would click "Contact Us", fill out a form, and this would forward this call request to the call center.

The SLA we had to meet was users receiving a phone call within 2 minutes of filling out the form.

This is a feature I owned completely end-to-end, from the frontend implementation, to the backend microservice API that sent call requests to the Call Center.

### 1. Frontend

The frontend of our flagship website was built in VueJS with the Nuxt framework (which is the Vue version of Next). I worked closely with design to implement the form based on their specifications. This was a modal that would pop-up on the screen and had to work both for desktop and mobile users, as a large number of our target base used phones as their primary internet device.

The frontend form would make a `POST` request to a Call API endpoint (behind authentication), with the First Name, Last Name, Phone Number, and Course ID of the course the prospective student was interested in.

### 2. Backend API

The backend API was built in Python using Flask, behind simple authentication. I built the Call Request functionality backend as its own API, because I could forsee a use-case where different surfaces would need to also send call requests to the call center. I wanted an easy way for other sites we owned to send us leads.

In addition to the API, I created a Call Request table, where we would keep track of call requests being made. This data was then synced with our data warehouse in Looker to build reporting and dashboards.

This was a very simple table with the following data:

![Call Requests UML](/projects/call-requests.png)

We would later use this for data reconciliation.

### 3. Integrating with the call center

![Call Center](/projects/call-request-flow.png)

Through this project, I learned call centers tend to use outdated technology, and this became apparent when I saw how they wanted us to send the call information over.

In order to send call requests to the call center, the call center provided a form for us to fill out with the details I mention above (first name, last name, phone number, etc).

As we needed to send the phone requests programatically, I had to build a scraper to fill out the form and submit it. I used Python's `beautifulsoup` to scrape the site and fill out the form, which was actually fun!

But this presented an interesting problem: filling out a form and doing web scraping is not quite like sending a request via a REST API, which is what I was used to! I would not reply on the HTTP status returned when I filled out the form, as that was usually a 200.

I had to scrape the form after submission and check for an error message manually. Luckily this form would return error codes as part of the error message on the form, so I had a way to standardize error handling.

This taught me how to work with non-standard integrations, and still try to find a way to build an interface that is predictable enough for scripting.

### 4. Data reconciliation

At the end of the day, the call center would upload a CSV to an SFTP with the results of the day. The CSV would be deduped by email and phone number combination, and include a status whether the call was completed successfully, or if the person was not reached.

I then built a daily cron job that downloaded the CSV from the SFTP, and reconciled those records with our own database records. In addition to updating our own database records of each call request, I also mainted the status of the lead updated in Salesforce, so we could keep track of where the prospective student was in the funnel, and if they had become unreachable.

The resulting report was then emailed to select members of the team by the cron job.

### 5. Monitoring and observability

I built dashboards to track the volume of calls we were sending to the call center on a given day to ensure the volume is what we would expect. This metric was also used for data reconciliation, to ensure the number of call requests sent matched the number of calls received. This was used to determine the health of the service. 

### 6. Future proofing

Even though this was a fairly simple feature, I was glad I built it as a microservice with its own API, as this made it easier for other surfaces in additon to our flagship site to send us call requests.

![Future proofing](/projects/call-request-expanded.png)

This also allowed partners to send us leads as well, as we were partnering with other schools on whitelabeling courses. This experience taught me how to build with an eye for future opportunities.
