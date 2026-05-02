---
title: Building CodeGrotto in public
date: 2026-04-26
description: Will build a project using Go and Sveltekit that allows users to learn to code
---

This post is a first post and a note to myself that I am going to build an application in Go and SvelteKit that will be an idle game titled "CodeGrotto" for users to learn to code.

## Some architectural decisions and trade-offs
Going to start by building a scalable and reusable user auth flow that I can use across developed applications. This will likely start with experimenting with Keycloak (currently self-hosted) auth in Go. If this works out, I will take this route but if it falls through will likely need to build the user auth end-to-end.

Some research on Go game engines shows EbitEngine as the forefront for this use case and I might use this heavily as I do not need 3D graphics, this will be an idle game that will mostly display static page elements. Because of this, it also makes me think this might be able to be done with pure Sveltekit. Going to do some initial implementations of each prior to locking in on one single stack.
