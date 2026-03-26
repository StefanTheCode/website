---
title: "Retry Failed API calls with Polly"
subtitle: "Polly is a .NET resilience and transient-fault-handling library that allows developers to express policies such as Retry, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback in a fluent and thread-safe manner."
date: "June 03 2024"
readTime: "Read Time: 5 minutes"
meta_description: "Polly is a .NET resilience and transient-fault-handling library that allows developers to express policies such as Retry, Circuit Breaker, Timeout, Bulkhead ..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Discover the principles and best practices of API design with Postman's comprehensive guide. Learn how to create adaptable, testable, and well-documented APIs that support your business objectives. Dive into the full process and enhance your API design capabilities at <a href="https://www.postman.com/api-platform/api-design/" style="color: #a5b4fc; text-decoration: underline;">Postman API Design</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The background
### Polly
Polly is a .NET resilience and transient-fault-handling library that allows developers to express policies such as **Retry**, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback in a fluent and thread-safe manner.

### Retry Policy
A Retry Policy is a strategy used in software development, particularly in distributed systems and microservices, to handle transient failures. This policy dictates that an operation, such as a network request or database transaction, should be attempted again if it fails, for a certain number of times.

Today I will tell you about 3 types of retry policies and I will give the implementation of all 3.
Let's see what Solution looks like first.
**Note**: *The implemented code is not in accordance with best practices because the point is to show the implementation of the Retry policy in the simplest possible way.*

## Project Setup

Solution consists of 2 projects:
**API **- Which represents the "Response" project, ie. which has an endpoint that we will call from another application and for which we will simulate that it does not work at certain moments.
**WebApp** - Simulation of a Web project that calls an endpoint from an API project. In this project, we implement the Retry Policy in order to handle failed requests.
![Polly Retry Policy Web Application](/images/blog/posts/retry-failed-api-calls-with-polly/polly-retry-policy-web-application.png)

### API Project:
The project consists of one simple API controller with one method, ie. one endpoint. This endpoint for the passed Id should return the user. Inside the GetUser method, a random number between 1 and 50 is generated.
If the provided id is less than this random number, the method simulates a **successful operation** and returns a * 200 OK status code *.
If the id is greater or equal to the random number, it **simulates a server** error and returns a *500 Internal Server Error status code *.
In a real-world scenario, instead of randomly determining the success or failure, you'd typically interact with some business logic or data access layer, and the result could depend on various factors.

```csharp

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    [Route("getUser/{id}")]
    [HttpGet]
    public ActionResult GetUser(int id)
    {
        Random random = new Random();

        var failEdge = random.Next(1, 50);

        if (id < failEdge)
        {
            Console.WriteLine("I'm returning Success - 200");
            return Ok();
        }

        Console.WriteLine("I'm returning Error - 500");
        return StatusCode(StatusCodes.Status500InternalServerError);
    }
}

```

## Retry Policies

### Immediate or "Basic" Retry
Retry the operation immediately after a failure. This policy retries a specified number of times when an operation fails. This might be used in situations where the operation is expected to succeed most of the time, and failures are highly transient. 
Example below:
When operation fails, retry the operation 3 times.
### Fixed Interval Retry
Wait for a specific duration before each retry. While the basic retry is helpful, it might not always be the best approach. Sometimes, immediately retrying isn't the solution, especially when dealing with services that need a cooldown period after a fault.
Example below:
When operation fails, retry the operation 3 times every 5 seconds.
### Exponential Backoff
Each retry waits for a longer period. It increases the wait time between retries exponentially, rather than keeping it constant.
This approach can help in situations where repeated immediate retries could exacerbate the problem or where the service you're calling could be undergoing a restart and needs a longer grace period to recover.
Example below:
The first retry will happen after 2 seconds, the second retry after 4 seconds, the third after 8 seconds, and so on.

```csharp

public class ClientRetryPolicy
{
    public AsyncRetryPolicy<HttpResponseMessage> JustHttpRetry { get; set; }
    public AsyncRetryPolicy<HttpResponseMessage> HttpRetryWithWaiting { get; set; }
    public AsyncRetryPolicy<HttpResponseMessage> ExponentialHttpRetry { get; set; }

    public ClientRetryPolicy()
    {
        JustHttpRetry = Policy.HandleResult<HttpResponseMessage>(
            response => !response.IsSuccessStatusCode)
            .RetryAsync(3);

        HttpRetryWithWaiting = Policy.HandleResult<HttpResponseMessage>(
            response => !response.IsSuccessStatusCode)
            .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(5));

        ExponentialHttpRetry = Policy.HandleResult<HttpResponseMessage>(
            response => !response.IsSuccessStatusCode)
            .WaitAndRetryAsync(3,
                attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));
    }
}

```

## Using Policy with HttpClient

As I mentioned, within the Web project we call the API endpoint to get the necessary data.
We call endpoint with the help of HTTP Client, with the fact that we will use the Retry Policy by calling that call.

```csharp

[HttpGet]
[Route("returnUser/{id}")]
public async Task<ActionResult> ReturnUser(int id)
{
    string apiURL = $"https://localhost:7071/api/User/getUser/{id}";

    var response = await _retryPolicy.HttpRetryWithWaiting.ExecuteAsync(() =>
        _client.GetAsync(apiURL));

    if (response.IsSuccessStatusCode)
    {
        Console.WriteLine("Success 200");

        return Ok(response);
    }
    else
    {
        Console.WriteLine("Error 500");

        return StatusCode(StatusCodes.Status500InternalServerError);
    }
}

```
In this example I used the "Fixed Interval Retry" policy. Which would practically mean that if the API returns an error, it will be called **3 times with an interval of 5 seconds between** each or less times if it returns a successful result.
Let's see that.
![Testing Retry Policy with Postman](/images/blog/posts/retry-failed-api-calls-with-polly/testing-retry-policy-with-postman.png)

With the help of Postman, we will call the WebApp project method from the UserManagement controller. The code inside this method calls the API endpoint with the Retry policy.
This is what happened:
![Retry Policy Console result](/images/blog/posts/retry-failed-api-calls-with-polly/retry-policy-console-result.png)
On the left side we have an API running project, and on the right side there is a WebApp project. We can see that just one call to the WebApp called API 4 times. Why?
Because the first time result was ** 500 - Error**. And 2nd time. And 3rd time. After 3 calls (in 5 seconds delay - check the time) the API returns a Success 200 response. In that momment we can return Success 200 to the user from the WebApp call.

## What next?
Test the other 2 Retry Policies and think about how to solve this in a better way using DI in the Program.cs file.
That's all from me for today.
Make a coffee and check out source code directly on my ** [GitHub repository](https://github.com/StefanTheCode/PollyRetryPolicy)**.


For more resilience patterns, check out [Building Resilient APIs in ASP.NET Core](https://thecodeman.net/posts/building-resilient-api-in-aspnet-core-9).

## Wrapping Up

<!--END-->
