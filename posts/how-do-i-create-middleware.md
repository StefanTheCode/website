---
title: "How do I create Middleware? And what are the alternatives?"
subtitle: "Middleware in the context of web development is a piece of software that sits between two or more software applications or layers... "
category: ".NET"
date: "Sep 18 2023"
---

&nbsp;
&nbsp;
### The background
&nbsp;
&nbsp;
##### <b>Middleware</b> in the context of web development is a piece of software that sits between two or more software applications or layers, enabling them to communicate, manage data, or execute other functions.

&nbsp;
##### Middleware enables us to add extra functionality either before or after the processing of an HTTP request.
&nbsp;
##### You're likely already utilizing several of the framework's pre-existing middleware components (Authentication, Authorization, Routing, etc.).
&nbsp;
##### But it is also possible to create custom middleware for your needs.
&nbsp;
##### Here I will show how I do it and why I think it is the best way.


&nbsp;
&nbsp;
### How do I create Middleware?
&nbsp;
&nbsp;

##### There are a couple of ways that middleware can be implemented, which I'll talk about a little later.
&nbsp;
##### My way is to create <b>Factory-Based Middleware</b> through the implementation of the existing <b>IMiddleware</b> interface.
&nbsp;
##### This class actually represents the middleware itself and has only one <b>InvokeAsync method</b> that is executed during each request. This is where you implement the logic of your middleware.
&nbsp;
##### Here's how you can do it:

![My Custom Middleware](/images/blog/posts/how-do-i-create-middleware/my-custom-middleware.png)
&nbsp;
##### And that's it, you have implemented your Middleware.
&nbsp;
##### Of course, in order for this to work, as for everything else, it is necessary to add the service and configure the middleware in the Program.cs class:

![Registering Middleware Query](/images/blog/posts/how-do-i-create-middleware/registering-middleware.png)

&nbsp;
&nbsp;
### Why is this the way I prefer?
&nbsp;
&nbsp;

####  <b>Explicit Interface</b> 
&nbsp;
##### The IMiddleware interface makes it clear what a middleware component should do, and it ensures that you don't accidentally miss the InvokeAsync method.
&nbsp;
####  <b>Reusability and Testability</b> 
&nbsp;
##### Because it's strongly-typed and follows a clear interface, this kind of middleware is often easier to unit test. You can mock dependencies more easily and validate whether your middleware behaves as expected under different conditions.
&nbsp;
####  <b>Readability</b> 
&nbsp;
##### The strongly-typed nature of the middleware can make the code more readable and easier to understand, particularly for developers who are new to the project or are not as familiar with middleware in general.


&nbsp;
&nbsp;
### What are the alternatives?
&nbsp;
&nbsp;

####  <b>Alternative #1: Convention Middleware</b> 
&nbsp;
##### In this case, instead of implementing the interface, I use RequestDelegate.
&nbsp;
##### Here is the implementation:
![Custom Middleware](/images/blog/posts/how-do-i-create-middleware/custom-middleware.png)
&nbsp;
####  <b>Alternative #2: Middleware with Request Delegate</b> 
&nbsp;
##### You can do that by calling the <b>Use method</b> on the WebApplication instance and providing a lambda method with two arguments. The first argument is the HttpContext and the second argument is the actual next request delegate in the pipeline RequestDelegate.
&nbsp;
##### Here is the implementation:
![Middleware with request delegate](/images/blog/posts/how-do-i-create-middleware/middleware-with-request-delegate.png)
&nbsp;
##### And that's it.

&nbsp;
&nbsp;
### Wrapping up
&nbsp;
&nbsp;
##### In today's Newsletter issue, I showed you how to implement Middleware in ASP.NET Core.
&nbsp;
##### I showed 3 possible ways, how I do it and which way I choose, as well as why I think the implementation of the IMiddleware interface is the best. 
&nbsp;
##### That's all from me for today.
&nbsp;

## <b > dream BIG! </b>