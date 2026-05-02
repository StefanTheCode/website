---
title: "Refit - The .NET Rest API you should know about"
subtitle: "Refit is a REST API client library for .NET that allows you to define an API as an interface in your application..."
date: "August 12 2025"
category: "APIs"
readTime: "Read Time: 4 minutes"
meta_description: "Refit is a REST API client library for .NET that allows you to define an API as an interface in your application..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

When Rest API Client is mentioned in .NET, most of us think and most of us use HttpClient which is excellent.

But did you know that there is something better that is also easier to implement?

Have you heard of Refit?

Let's see what it's all about.

## What is Refit?

[Refit](https://github.com/reactiveui/refit) is a REST API client library for .NET that allows you to define an API as an interface in your application.

With Refit, you use attributes to define HTTP requests, making it a breeze to call RESTful services.

Built on top of System.Net.Http.HttpClient, Refit takes care of the heavy lifting, including serialization and deserialization of JSON data, allowing you to focus on writing your business logic.

Let's take a look on the example.

## Example: Public GitHub Api

In the example, we will use a simple **GitHub Public Api**. 

The GitHub API is a great example for demonstrating how to use Refit due to its rich set of features and documentation.

Let's create a simple client that fetches user information from GitHub.
Step 1: Add nuget package Refit.HttpClientFactory:

```csharp
dotnet add package Refit.HttpClientFactory
```

Step 2: Define the GitHub API Interface

First, define an interface that represents the GitHub API endpoints you're interested in.

For this example, we'll fetch user details from the GitHub API.

Create a new file **IGitHubApi.cs** in your project:

```csharp
using Refit;
using System.Threading.Tasks;

public interface IGitHubApi
{
    [Get("/users/{username}")]
    Task<GitHubUser> GetUserAsync(string username);
}
```
Here, we use the **[Get]** attribute to specify that GetUserAsync will perform an HTTP GET request to the */users/{username}* endpoint.

Step 3: Define the GitHub User Model

Next, create a model that represents the JSON response returned by the GitHub API. Create a new file *GitHubUser.cs*:

```csharp
public class GitHubUser
{
    public string Login { get; set; };
    public string Name { get; set; };
    public string Company { get; set; };
    public int Followers { get; set; };
    public int Following { get; set; };
    public string AvatarUrl { get; set; };
}
```
This class defines the properties we want to extract from the GitHub API response.

Step 4: Configure Dependency Injection for Refit

Now, let's configure Dependency Injection (DI) for Refit in the Program.cs file:

Open Program.cs and modify it as follows:

```csharp
builder.Services.AddRefitClient<IGitHubApi>()
    .ConfigureHttpClient((sp, client) =>
    {
        var settings = sp.GetRequiredService<IOptions<GitHubSettings>().Value;

        client.BaseAddress = new Uri(settings.BaseAddress);
        client.DefaultRequestHeaders.Add("Authorization", settings.AccessToken);
        client.DefaultRequestHeaders.Add("User-Agent", settings.UserAgent);
    });
```

builder.Services.AddRefitClient<IGitHubApi>() registers the Refit client with DI.

This sets up IGitHubApi as a **typed client**, which **Refit will generate for you**. 

GitHubSettings represents the settings presented via the IOptions pattern, whose values are mostly found in [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json.

And that's it, it is necessary to call the method on the API endpoint where you need it.

```csharp
var user = await gitHubService.GetUserAsync("StefanTheCode");
```
## What benefit do you actually get from this?
If you were to implement this using HttpClient, it would be necessary to create a class that implements IGitHubApi and that somehow uses HttpClient in the GetUserAsync method to call the API and get the data.
It would roughly look like this:

```csharp
public class GitHubApiClient : IGitHubApi
{
    private readonly HttpClient _httpClient;

    public GitHubApiClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.github.com");
    }

    public async Task<GitHubUser> GetUserAsync(string username)
    {
        var response = await _httpClient.GetAsync($"/users/{username}");

        response.EnsureSuccessStatusCode();

        var user = await response.Content.ReadFromJsonAsync<GitHubUser>();

        return user;
    }
}
```
Here we see the advantages of Refit.

Instead of writing this much code, it is necessary to define only the interface and then **Refit will generate everything we need to call the Api endpoint in the background**.

Very useful isn't it?

## Benefits of Using Refit with .NET 8

By using Refit, we significantly reduce the amount of boilerplate code required to make HTTP requests and handle responses.

This leads to:

**Improved Readability:** Your API interfaces are clearly defined and separate from the business logic, making the code easier to read and maintain.

**Easier Testing:** Since the API interactions are defined as interfaces, they can be easily mocked during testing.

**Seamless Integration**: Refit integrates smoothly with modern .NET features such as dependency injection, HttpClientFactory, and advanced serialization options, making it a perfect fit for .NET 8 projects.

## Wrapping Up

Refit is a powerful library that, when combined with .NET 8, offers a robust and streamlined approach to consuming REST APIs.

In just a few lines of code, we set up a GitHub API client, fetched user data, and displayed it in the console.

This simplicity, combined with .NET 8’s performance improvements and modern language features, makes Refit an excellent choice for developers looking to build efficient and maintainable applications.

That's all from me for today. Make a coffee and try Refit.
<!--END-->

