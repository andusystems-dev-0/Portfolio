---
title: Migrating Some Stuff to AWS
date: 2026-05-22
description: Starting with my terraform state, I will be migrating elements of my homelab to AWS
---

#AWS Migration
I have determined I migrating my Pangolin server instance from Hostinger to AWS to better support a full AWS/On-Prem environment. Adding AWS functionality to my deployment for redundancy, resiliency, and future server locale enhancements so that I can better locate where my services are being served from. For now using us-east-1 and local (us-east) but future enhancements will allow me to serve resources from a machine closer to the client for lower response times. I will continue to serve clients on the east coast of the US via local servers but am looking at experimenting with AWS edge/cache functionality for faster response times to my publicly hosted resources such as my Portfolio or Blog site (this one you are currently on!)
