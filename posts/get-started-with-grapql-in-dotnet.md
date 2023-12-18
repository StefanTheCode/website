---
newsletterTitle: "#46 Stefan's Newsletter"
title: "Get Started with GraphQL in .NET"
subtitle: "The GraphQL is a query language for our API that allows us to define the data structure we need, and the server will return only the requested data."
date: "December 18 2023"
readTime: "Read Time: 7 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore the world of GraphQL in .NET with Stefan's Newsletter's latest blog post. Dive into a detailed guide on implementing GraphQL, understanding its benefits over REST, and setting up a .NET project. This post offers practical steps, from creating entity models to running queries, and provides insights into enhancing GraphQL schemas. Ideal for developers looking to advance their skills in GraphQL and .NET."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **
##### For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/) **.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### **The GraphQL** is a query language for our API that allows us to define the data structure we need, and the server will return only the requested data.
&nbsp;  
##### Unlike **REST**, where the endpoints are fixed, in GraphQL **the client can request exactly the data it needs** . That allows for more efficient and flexible data fetching, reducing the need for multiple round trips to the server.
&nbsp;  
##### It's important to notice that GraphQL is not a replacement for REST but a complementary technology that we can use to make the API more flexible and efficient.
&nbsp;  
##### GraphQL allows us to request specific data, and the server will only return what we asked for, and we can make multiple requests and retrieve different data each time. That makes it an ideal solution for projects that require a high level of flexibility and scalability.
&nbsp;  
##### Whether we're building a new application or looking to upgrade an existing one, GraphQL is worth considering as a powerful tool for our technical stack.
&nbsp;  
##### Let's see how we can implement it in .NET (very easly)...
&nbsp;  
&nbsp;  
### Setup the project&nbsp;
&nbsp;  
&nbsp;  
##### 1. Create your ASP.NET Web API project
&nbsp;  
##### 2. Add some packages for GraphQL:
```csharp

dotnet add package HotChocolate.AspNetCore
dotnet add package HotChocolate.AspNetCore.Playground
```

&nbsp;  
### Let's create some simple entity model&nbsp;
&nbsp;  
&nbsp;  
##### Part of almost every system in our applications is a user. Let's take the entity User as an example for demonstration purposes. We will create a **User entity** with the appropriate properties:
```csharp

public class User
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
}
```

##### With a REST approach, you would now create some controller with a route or a minimal api endpoint to get the data.
&nbsp;  
##### Let's say that we want to return a list of users, in GraphQL we will create a Query class for this purpose that will return the required values:
```csharp

public class UserQuery
{
    private static List&lt;User&gt; users = new List&lt;User&gt;()
    {
        new User { Id = 1, FirstName = "Stefan", LastName = "Djokic", BirthDate = new DateTime(1995, 7, 4)},
        new User { Id = 2, FirstName = "Dajana", LastName = "Milosevic", BirthDate = new DateTime(1996, 6, 22)},
    };

    public List&lt;User&gt; GetUsers() =&gt; users;
}
```

&nbsp;  
### Her Highness - Program.cs class
&nbsp;  
&nbsp;  
##### Of course we have to register everything in DI:
```csharp

services
    .AddRouting()
    .AddGraphQLServer()
    .AddQueryType&lt;UserQuery&gt;();
```
&nbsp;  

##### And let's say the app what services to use:
```csharp

app.UseRouting();
app.MapGraphQL();
app.UsePlayground();
```

&nbsp;  
##### And now...
&nbsp;  
&nbsp;  
### Start the engine: dotnet run
&nbsp;  
&nbsp;  
##### That's it. You can start the application and run your first query.
&nbsp;  
##### You can run your query in 3 possible ways:
&nbsp;  
##### 1. Open *localhost:7075/graphql/* (use your own port). Here you'll access **Banaca Cake Pop dashboard**. 
&nbsp;  
##### Write your first query something like:

```csharp

{  
    users {    
        id    
        firstName  
    }
}

```
##### With this query you'll get all the users but only with id and firstName fields. **There is no any other field which will remain empty.**
![Banaca Cake Pop dashboard](/images/blog/posts/get-started-with-grapql-in-dotnet/banana-cake-pop-dashboard.png)

&nbsp;  
##### That's it. You can start the application and run your first query.
&nbsp;  
##### 2. Open *localhost:7075/playground/* (use your own port). Here you'll access **Hot Chocolate Playground**. The process is really similiar.
&nbsp;  
##### 3. Run your queries via Postman. This is my favourite way to go:
![Running GraphQL Queries in Postman](/images/blog/posts/get-started-with-grapql-in-dotnet/running-graphql-queries-in-postman.png)

&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### And there you have it!
&nbsp;  
##### You've successfully created a functional GraphQL API with .NET Core and C# in just a few simple steps.
&nbsp;  
##### What's next?
&nbsp;  
##### It's time to enhance your schema, connect with databases, incorporate mutations, add subscriptions, and beyond.
&nbsp;  
##### Keep in mind, with increased capabilities comes increased accountability. As you enable your clients to request precisely what they require, make sure to manage their expectations and address any possible challenges. For more comprehensive insights, delve into the official **[Hot Chocolate documentation](https://chillicream.com/docs/hotchocolate/v13)** , which is an incredibly rich resource.
&nbsp;  
##### Did you like this issue?
##### Do you want to continue deeper with GraphQL in .NET? Write me.
&nbsp;  
##### That's all from me today.