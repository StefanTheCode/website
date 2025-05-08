---
title: "Refit - The .NET Rest API you should know about"
subtitle: "Refit is a REST API client library for .NET that allows you to define an API as an interface in your application..."
date: "August 27 2024"
category: "APIs"
photoUrl: "/images/blog/newsletter21.png"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Complete 2024 State of the #API survey by Postman for a chance to win prizes including a Apple Vision Pro, a Sony PlayStation 5, gift certificates for Postman swag and more!
##### Complete it [here](https://www.surveymonkey.com/r/2024-state-of-api-survey).
&nbsp;  
&nbsp;  

<!--START-->

##### When Rest API Client is mentioned in .NET, most of us think and most of us use HttpClient which is excellent.
&nbsp;  

##### But did you know that there is something better that is also easier to implement?
&nbsp;  

##### Have you heard of Refit?
&nbsp;  

##### Let's see what it's all about.

&nbsp;  
&nbsp;  
### What is Refit?
&nbsp;  
&nbsp;  

##### [Refit](https://github.com/reactiveui/refit) is a REST API client library for .NET that allows you to define an API as an interface in your application.
&nbsp;  

##### With Refit, you use attributes to define HTTP requests, making it a breeze to call RESTful services.
&nbsp;  

##### Built on top of System.Net.Http.HttpClient, Refit takes care of the heavy lifting, including serialization and deserialization of JSON data, allowing you to focus on writing your business logic.
&nbsp;  

##### Let's take a look on the example.

&nbsp;  
&nbsp;  
### Example: Public GitHub Api
&nbsp;  
&nbsp;  

##### In the example, we will use a simple **GitHub Public Api**. 
&nbsp;  

##### The GitHub API is a great example for demonstrating how to use Refit due to its rich set of features and documentation.
&nbsp;  

##### Let's create a simple client that fetches user information from GitHub.
&nbsp;  
##### **Step 1: Add nuget package Refit.HttpClientFactory:**

```csharp

dotnet add package Refit.HttpClientFactory

```
&nbsp;  

##### **Step 2: Define the GitHub API Interface**
&nbsp;  

##### First, define an interface that represents the GitHub API endpoints you're interested in.
&nbsp;  

##### For this example, we'll fetch user details from the GitHub API.
&nbsp;  

##### Create a new file **IGitHubApi.cs** in your project:

```csharp

using Refit;
using System.Threading.Tasks;

public interface IGitHubApi
{
    [Get("/users/{username}")]
    Task<GitHubUser> GetUserAsync(string username);
}

```
##### Here, we use the **[Get]** attribute to specify that GetUserAsync will perform an HTTP GET request to the */users/{username}* endpoint.
&nbsp;  

##### **Step 3: Define the GitHub User Model**
&nbsp;  

##### Next, create a model that represents the JSON response returned by the GitHub API. Create a new file *GitHubUser.cs*:

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
&nbsp;  
##### This class defines the properties we want to extract from the GitHub API response.
&nbsp;  

##### ** Step 4: Configure Dependency Injection for Refit**
&nbsp;  

##### Now, let's configure Dependency Injection (DI) for Refit in the Program.cs file:
&nbsp;  

##### Open Program.cs and modify it as follows:

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

##### builder.Services.AddRefitClient<IGitHubApi>() registers the Refit client with DI.
&nbsp;  

##### This sets up IGitHubApi as a **typed client**, which **Refit will generate for you**. 
&nbsp;  

##### GitHubSettings represents the settings presented via the IOptions pattern, whose values are mostly found in appsettings.json.
&nbsp;  

##### And that's it, it is necessary to call the method on the API endpoint where you need it.

```csharp

var user = await gitHubService.GetUserAsync("StefanTheCode");

```
&nbsp;  
&nbsp;  
### What benefit do you actually get from this?
&nbsp;  
&nbsp;  
##### If you were to implement this using HttpClient, it would be necessary to create a class that implements IGitHubApi and that somehow uses HttpClient in the GetUserAsync method to call the API and get the data.
&nbsp;  
##### It would roughly look like this:

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
&nbsp;  
##### Here we see the advantages of Refit.

##### Instead of writing this much code, it is necessary to define only the interface and then **Refit will generate everything we need to call the Api endpoint in the background**.

##### Very useful isn't it?

&nbsp;  
&nbsp;  
### Benefits of Using Refit with .NET 8
&nbsp;  
&nbsp;  

##### By using Refit, we significantly reduce the amount of boilerplate code required to make HTTP requests and handle responses.
&nbsp;  

##### This leads to:
&nbsp;  

##### **Improved Readability:** Your API interfaces are clearly defined and separate from the business logic, making the code easier to read and maintain.
&nbsp;  

##### **Easier Testing:** Since the API interactions are defined as interfaces, they can be easily mocked during testing.
&nbsp;  

##### **Seamless Integration**: Refit integrates smoothly with modern .NET features such as dependency injection, HttpClientFactory, and advanced serialization options, making it a perfect fit for .NET 8 projects.

&nbsp;  
&nbsp;  
### Conclusion
&nbsp;  
&nbsp;  

##### Refit is a powerful library that, when combined with .NET 8, offers a robust and streamlined approach to consuming REST APIs.
&nbsp;  

##### In just a few lines of code, we set up a GitHub API client, fetched user data, and displayed it in the console.
&nbsp;  

##### This simplicity, combined with .NET 8’s performance improvements and modern language features, makes Refit an excellent choice for developers looking to build efficient and maintainable applications.
&nbsp;  

##### That's all from me for today. Make a coffee and try Refit.
<!--END-->
