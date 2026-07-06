---
title: Hireship is Live
date: 2026-07-06
description: Releasing Hireship, the job aggregator and scoring engine I have been building
---

The job scraper I posted about a while back is finally live. It is called Hireship and you can find it at [hireship.io](https://hireship.io).

## What it is
Hireship pulls postings from a bunch of job boards and scores every one of them against your resume and preferences so you are not scrolling through hundreds of listings that do not fit. Everything gets ranked and tiered, and the bad-fit and non-US ones get filtered out before they ever reach your inbox.

## How the scoring works
The scoring runs in passes. A keyword pass and two local LLM passes handle the cheap filtering, and only the listings that make it through get a final pass from Claude for a closer read. I did it this way because most jobs get filtered out early and cost nothing to score, so the expensive model only ever touches the close matches. This keeps it fast and cheap while still giving the ones that matter a proper look.

## Self-hosted
The whole thing runs on my Kubernetes homelab -- the app, the Postgres database, and the scoring engine. The local models run on a box here and the app reaches them over an mTLS tunnel, so nothing sensitive leaves the cluster in the clear.

There is more I want to add but it is already useful for my own job search, so I am putting it out there. Give it a try at [hireship.io](https://hireship.io).
