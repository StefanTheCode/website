---
title: "How to implement a Rate Limiter in C#"
category: ".NET"
subtitle: "A rate limiter is a software mechanism that controls the amount of traffic or requests that can be sent to a server or API within a given time period..."
date: "March 27 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "A rate limiter is a software mechanism that controls the amount of traffic or requests that can be sent to a server or API within a given time period. It is used to prevent a single user or application from overwhelming the server or consuming excessive resources."
---

### Background

##### A rate limiter is a software mechanism that controls the amount of traffic or requests that can be sent to a server or API within a given time period. It is used to prevent a single user or application from overwhelming the server or consuming excessive resources.

&nbsp;
##### The rate limiter sets a limit on the number of requests that can be made within a certain time frame, and it can also define how long a user or application must wait before sending another request. This helps to ensure that the server remains available to all users and that its performance is not negatively impacted by excessive traffic.
&nbsp;
##### The new .NET 7 Framework brought us a built-in implementation of rate limiters.
&nbsp;
&nbsp;

### NuGet package
&nbsp;
&nbsp;

##### You don't need it. :)
&nbsp;

##### Rate Limiting is coming from <b> Microsoft.AspNetCore.RateLimiting </b> middleware which is included in .NET 7 by default.

&nbsp;
&nbsp;

### 2#: Rate Limiter Algorithms
&nbsp;
&nbsp;

##### The RateLimiterOptionsExtensions class provides the following extension methods for rate limiting:
&nbsp;
##### • Fixed Window
##### • Sliding Window
##### • Token Bucket
##### • Concurency
&nbsp;
##### We will talk about Fixed Window in this issue. 
&nbsp;
&nbsp;

### Add RateLimiter Service
&nbsp;
&nbsp;

##### We need to add a RateLimiter Service to the service collection. This should be done in Program.cs C# file. 
&nbsp;
##### Here is an example:

![Adding Rate Limiter to Service Collection](/images/blog/posts/how-to-implement-rate-limiter-in-csharp/adding-rate-limiter-to-service-collection.png)
&nbsp;
##### <b> • AddFixedWindowLimiter </b> - the method uses a fixed time window to limit requests. When the time window expires, a new time window starts and the request limit is reset.
##### <b>• PermitLimit </b> - A maximum of 10 requests
##### <b>• Window </b> - per 5 seconds window.
##### <b> • QueueProcessingOrder </b> - behaviour when not enough resources can be leased (Process oldest requests first).
##### <b> • QueueLimit </b> - Maximum cumulative permit count of queued acquisition requests.

&nbsp;
&nbsp;
### Enable using RateLimiter middleware
&nbsp;
&nbsp;

##### After adding a service to the collection of services, it is necessary to enable its use:
![Enabling Rate Limiter Middleware](/images/blog/posts/how-to-implement-rate-limiter-in-csharp/enabling-rate-limiter-middleware.png)

&nbsp;
&nbsp;

### Use it
&nbsp;
&nbsp;

##### Finally, you can use a rate limiting. 
&nbsp;
##### For Minimal API, just call a method <b>RequireRateLimiting</b> on defined API route. Argument "fixed" is a policyName of created RateLimiting service (in our case it is Fixed Window).
&nbsp;
##### For the Controllers, you need also to tell the middleware to require rate limiting:
![Require Rate Limiter](/images/blog/posts/how-to-implement-rate-limiter-in-csharp/require-rate-limiter.png)

##### Or for each contoller and/or actions you can to specify an attribute:
![Rate Limiting Controller Atrribute](/images/blog/posts/how-to-implement-rate-limiter-in-csharp/rate-limiting-controller-attribute.png)
&nbsp;
##### Note: Do not use "magic strings", instead put "fixed" and other values in the configuration file.


&nbsp;
&nbsp;
### How to test?
&nbsp;
&nbsp;

##### Load testing with  [JMeter from Apache](https://jmeter.apache.org/).
&nbsp;
##### That's all from me for today.
&nbsp;
##### Make a coffee and try it on your projects.
&nbsp;

## <b > dream BIG! </b>