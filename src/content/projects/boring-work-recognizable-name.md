---
title: Boring work, recognizable name
company: Shopify
description: Command Line Tool for third-party developers
tags: ["backend", "cli", "developer tooling"]
completionYear: 2021
readingTime: short
---

## Background

Shopify is a leading e-commerce platform offering merchants a one-stop solution for selling products online.

## Problem statement

Shopify needed to allow third-party developers to create apps that extend Shopify's functionality in a safe way for merchants to intergate into their shop, without breaking or hijacking the Shopify overall experience.

I overall find this project doesn't lend itself to be a good subject of conversation, as it is very complex and kind of dry, but I did want to talk about some of the work I did here, because it allowed me to grow tremendously as a software engineer.

## The App Extensibility team

As part of Shopify, I worked on the App Extensibility team, which provided a framework for running third-party extensions safely on a Shopify shop. These extension environments were safely sandboxed and only allowed to run on very specific parts of a shop.

As part of the App Extensibility team, I worked on the Argo project, which was a framework developed on top of the basic Extensions framework.

There were two main types of extensions at the time I worked on the team:

- **Post-purchase extensions**: extensions that appear in checkout after a purchase has been made
- **Admin UI extensions**: extensions that only appear in the admin dashboard of a shop

The best way I can explain this is Argo was an abstraction over another abstraction. Our main job was to create React components, and a React framework for third-party developers to develop their extensions on top of.

As a backend engineer on the team, I focused on working on the Ruby CLI experience, which served as an orchestration layer between a developer's local environment and the developer's live test shop.

A live test shop is a real shop in "development" mode on the Shopify servers, so an internet connection and tunnel between the developer's local environment and the Shopify servers was required.

The Ruby CLI was responsible for finding an avaiable port, and opening a tunnel using ngrok. Through this tunnel, we would be able to serve the extension from the local environment onto the Shopify dev shop.

![Ruby CLI](/projects/ruby-cli.png)

### Features

#### 1. Contextual

The Ruby CLI needed to be contextual and detect which type of extension a developer was working on by looking at the `package.json` or listing the `node_modules` and detecting the type of extension from the modules. We also needed to account for developers using `npm` or `yarn`.

🔀 [Sample PR](https://github.com/Shopify/shopify-cli/pull/1690)

This was important so we could serve the correct type of extension, as well as reconcile the extension package version.

Everything needed to be backwards compatible as well!

#### 2. Go binary proof of concept

A big feature request developers asked for was the ability to work on more than one extension at a time. This was a big issue in that iteration of the Ruby CLI due to its limitations being able to spin up multiple development servers.

As a way to address this issue, I worked on a Go binary that would have been embedded into the Ruby CLI. The Ruby CLI would have continued to be the primary interface for developers, but the Ruby CLI would itself call upon the embedded Go binary. Go was chosen by our team because it has better concurrency support, and would have enabled us to serve multiple extensions at a time.

You can actually view the Proof of Concept in action here!

🔀 [Sample PR](https://github.com/Shopify/shopify-cli/pull/1690)

Unfortunately, the team in charge of the Ruby CLI governance chose not to use our Go binary idea. Shortly after, the Ruby CLI was deprecated and archived in favor of a Node.js based CLI, which is still in use today, but I did not get to contribute to.

## Review for yourself!

I am incredibly proud of having worked on an open source project during my time at Shopify. If you're curious, you can take a look at my PRs [here](https://github.com/Shopify/shopify-cli/pulls?q=is%3Apr+is%3Aclosed+author%3Acecyc)!

I came into Shopify as a "solidly midlevel developer", and can say I walked out a Senior Engineer, and I think the progression of my work is reflected in my open source PRs.
