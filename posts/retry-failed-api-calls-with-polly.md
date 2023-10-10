---
newsletterTitle: "#15 Stefan's Newsletter"
title: "Retry Failed API calls with Polly"
subtitle: "Polly is a .NET resilience and transient-fault-handling library that allows developers to express policies such as Retry, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback in a fluent and thread-safe manner."
date: "May 23 2023"
photoUrl: "/images/blog/newsletter21.png"
---


### The background
<br>
<br>
####<b>Polly</b>
##### Polly is a .NET resilience and transient-fault-handling library that allows developers to express policies such as <b>Retry</b>, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback in a fluent and thread-safe manner.
<br>

####<b>Retry Policy</b>
##### A Retry Policy is a strategy used in software development, particularly in distributed systems and microservices, to handle transient failures. This policy dictates that an operation, such as a network request or database transaction, should be attempted again if it fails, for a certain number of times.

<br>
##### Today I will tell you about 3 types of retry policies and I will give the implementation of all 3.
<br>
##### Let's see what Solution looks like first.
<br>
##### <b>Note</b>: <i>The implemented code is not in accordance with best practices because the point is to show the implementation of the Retry policy in the simplest possible way.</i>
<br>
<br>

### Project Setup
<br>
<br>

##### Solution consists of 2 projects:
<br>
##### <b>API </b>- Which represents the "Response" project, ie. which has an endpoint that we will call from another application and for which we will simulate that it does not work at certain moments.
<br>
##### <b>WebApp</b> - Simulation of a Web project that calls an endpoint from an API project. In this project, we implement the Retry Policy in order to handle failed requests.
<br>
![Polly Retry Policy Web Application](/images/blog/posts/retry-failed-api-calls-with-polly/polly-retry-policy-web-application.png)
<br>

#### API Project:
##### The project consists of one simple API controller with one method, ie. one endpoint. This endpoint for the passed Id should return the user. Inside the GetUser method, a random number between 1 and 50 is generated.
<br>
##### If the provided id is less than this random number, the method simulates a <b>successful operation</b> and returns a <i> 200 OK status code </i>.
<br>
##### If the id is greater or equal to the random number, it <b>simulates a server</b> error and returns a <i>500 Internal Server Error status code </i>.
<br>
##### In a real-world scenario, instead of randomly determining the success or failure, you'd typically interact with some business logic or data access layer, and the result could depend on various factors.

![Finding Randomly Fail Edge](/images/blog/posts/retry-failed-api-calls-with-polly/finding-randomly-fail-edge.png)

<br>
<br>
### Retry Policies
<br>
<br>

#### <b>Immediate or "Basic" Retry</b>
##### Retry the operation immediately after a failure. This policy retries a specified number of times when an operation fails. This might be used in situations where the operation is expected to succeed most of the time, and failures are highly transient. 
<br>
##### Example below:
##### When operation fails, retry the operation 3 times.
<br>
#### <b>Fixed Interval Retry</b>
##### Wait for a specific duration before each retry. While the basic retry is helpful, it might not always be the best approach. Sometimes, immediately retrying isn't the solution, especially when dealing with services that need a cooldown period after a fault.
<br>
##### Example below:
##### When operation fails, retry the operation 3 times every 5 seconds.
<br>
#### <b>Exponential Backoff</b>
##### Each retry waits for a longer period. It increases the wait time between retries exponentially, rather than keeping it constant.
##### This approach can help in situations where repeated immediate retries could exacerbate the problem or where the service you're calling could be undergoing a restart and needs a longer grace period to recover.
<br>
##### Example below:
##### The first retry will happen after 2 seconds, the second retry after 4 seconds, the third after 8 seconds, and so on.

![Client Retry Exponential Backoff](/images/blog/posts/retry-failed-api-calls-with-polly/client-retry-exponential-backoff.png)

<br>
<br>
### Using Policy with HttpClient
<br>
<br>

##### As I mentioned, within the Web project we call the API endpoint to get the necessary data.
<br>
##### We call endpoint with the help of HTTP Client, with the fact that we will use the Retry Policy by calling that call.

![Testing Retry Policy with Postman](/images/blog/posts/retry-failed-api-calls-with-polly/httpclient-retry-policy.png)
<br>
##### In this example I used the "Fixed Interval Retry" policy. Which would practically mean that if the API returns an error, it will be called <b>3 times with an interval of 5 seconds between</b> each or less times if it returns a successful result.
<br>
##### Let's see that.
![Testing Retry Policy with Postman](/images/blog/posts/retry-failed-api-calls-with-polly/testing-retry-policy-with-postman.png)

##### With the help of Postman, we will call the WebApp project method from the UserManagement controller. The code inside this method calls the API endpoint with the Retry policy.
<br>
##### This is what happened:
![Retry Policy Console result](/images/blog/posts/retry-failed-api-calls-with-polly/retry-policy-console-result.png)
<br>
##### On the left side we have an API running project, and on the right side there is a WebApp project. We can see that just one call to the WebApp called API 4 times. Why?
<br>
##### Because the first time result was <b> 500 - Error</b>. And 2nd time. And 3rd time. After 3 calls (in 5 seconds delay - check the time) the API returns a Success 200 response. In that momment we can return Success 200 to the user from the WebApp call.

<br>
<br>
### What next?
<br>
<br>
##### Test the other 2 Retry Policies and think about how to solve this in a better way using DI in the Program.cs file.
<br>
##### That's all from me for today.
<br>
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/PollyRetryPolicy)</b>.
<br>

## <b > dream BIG! </b>