---
newsletterTitle: "#49 Stefan's Newsletter"
title: "Health Checks in .NET 8"
subtitle: "Health Checks in ASP.NET are a way to assess the health of an application and its dependencies.
They are used to monitor the status and performance of various components of an application, such as databases, external services, or internal services."
readTime: "Read Time: 4 minutes"
date: "Jan 08 2024"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Master Health Checks in .NET 8: Essential Guide for ASP.NET Core Apps - Learn to monitor application health effectively and ensure reliability. Ideal for .NET developers."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/). For more info about gRPC, they created a great beginner article [here](https://blog.postman.com/what-is-grpc/).
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### **Health Checks** in ASP.NET are a way to assess the health of an application and its dependencies.
&nbsp;  
##### They are used to monitor the status and performance of various components of an application, such as databases, external services, or internal services.
&nbsp;  
##### Health Checks provide insights into whether an application is running as expected or if there are issues that need to be addressed.
&nbsp;  
##### Health checks in your application are essential because they act as a diagnostic tool to ensure your app's components, like databases and external services, are running smoothly.
&nbsp;  
##### By regularly monitoring the health of your app, you can quickly identify and fix issues, maintaining a reliable and efficient service for your users.
&nbsp;  
##### How to implement it?
&nbsp;  
##### Let's take a look deeply!
&nbsp;  
&nbsp;  
### The Basic One&nbsp;
&nbsp;  
&nbsp;  
##### In simpler terms, setting up health checks in your app involves two main steps.
&nbsp;  
##### First, you add health check services in your app's configuration. This doesn't automatically check specific parts of your app, like databases or other systems.
&nbsp;  
##### Your app is considered **'healthy' if it can simply respond to a special URL that checks its health** . When someone visits this URL, they get a simple text message saying whether your app is healthy, somewhat healthy ('degraded'), or unhealthy.
&nbsp;  
##### There are three HealthStatus values:
&nbsp;  
##### **• HealthStatus.Healthy**
##### **• HealthStatus.Degraded**
##### **• HealthStatus.Unhealthy**
&nbsp;  
##### You can use the HealthStatus to indicate the different states of your application.
&nbsp;  
##### To do all this, you need to write some code in your app's Program.cs file:
```csharp

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks();

var app = builder.Build();

app.MapHealthChecks("/healthz");

app.Run();
```

&nbsp;  
### How to create custom health checks?&nbsp;
&nbsp;  
&nbsp;  
##### Health checks in an application are set up by using the **IHealthCheck** interface.
&nbsp;  
##### You implement a method called **CheckHealthAsync()** which determines the health of the app and returns a result. This result can show the app as 'Healthy', 'Somewhat Healthy' (or 'Degraded'), or 'Unhealthy'.
&nbsp;  
##### When someone checks your app's health, they receive this result as a simple text message.
&nbsp;  
##### The HTTP status code for this message can be adjusted as needed.
&nbsp;  
##### Additionally, you can include optional details in the form of key-value pairs.
&nbsp;  
##### The process for configuring these settings is outlined in the section on Health Check options.
&nbsp;  
##### For example, a simple health check for database health:
```csharp

public class SqlHealthCheck : IHealthCheck
{
    private readonly string _connString;

    public SqlHealthCheck(IConfiguration configuration)
    {
        _connString = configuration.GetConnectionString("SQL");
    }

    public async Task&lt;HealthCheckResult&gt; CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            using var sqlConnection = new SqlConnection(_connString);

            await sqlConnection.OpenAsync(cancellationToken);

            using var command = sqlConnection.CreateCommand();
            command.CommandText = "SELECT 1";

            await command.ExecuteScalarAsync(cancellationToken);

            return HealthCheckResult.Healthy();
        }
        catch(Exception ex)
        {
            return HealthCheckResult.Unhealthy(
                context.Registration.FailureStatus,
                exception: ex);
        }
    }
}
```

##### What this code does?
&nbsp;  
##### This code creates a health check for a SQL database in a .NET application. It works by first retrieving the database's connection string from the application's configuration.
&nbsp;  
##### Then, it tries to open a connection to the database and executes a simple query.
&nbsp;  
##### If the connection and query are successful, it reports that the database is healthy.
##### If there's an issue, like a connection failure, it catches the error and reports that the database is unhealthy, including details about the error encountered.
&nbsp;  
##### This health check is a way to monitor the status of the database and ensure it's functioning correctly as part of the application's overall health.
&nbsp;  
&nbsp;  
### Enabling Health Checks UI&nbsp;
&nbsp;  
&nbsp;  
##### Normally, when you check your application's health status, the endpoint gives you a simple string like 'Healthy' or 'Unhealthy'.
&nbsp;  
##### However, this becomes less helpful if your app has several health checks for different services. If just one service fails, the entire app is labeled 'Unhealthy', but it's not clear which service is the problem.
&nbsp;  
##### To get around this, you can use a ResponseWriter.
&nbsp;  
##### This tool provides more detailed information about each service's health.
&nbsp;  
##### There's already one available in the ' **AspNetCore.HealthChecks.UI.Client** ' library, which you can use to easily see the status of each individual service in your app:
```csharp

Install-Package AspNetCore.HealthChecks.UI.Client
```

##### Now you need to update MapHealthChecks to use the ResponseWriter:
```csharp

app.MapHealthChecks("/healthz", new HealthCheckOptions
  {
      ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
  });
```

&nbsp;  
### Customizing output
&nbsp;  
&nbsp;  
##### Let's say you want to customize output in JSON format. You can achieve this by using ResponseWriter:
&nbsp;  
##### *code is taken from [official Microsoft documentation](https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks?view=aspnetcore-8.0)
```csharp

private static Task WriteResponse(HttpContext context, HealthReport healthReport)
{
    context.Response.ContentType = "application/json; charset=utf-8";

    var options = new JsonWriterOptions { Indented = true };

    using var memoryStream = new MemoryStream();
    using (var jsonWriter = new Utf8JsonWriter(memoryStream, options))
    {
        jsonWriter.WriteStartObject();
        jsonWriter.WriteString("status", healthReport.Status.ToString());
        jsonWriter.WriteStartObject("results");

        foreach (var healthReportEntry in healthReport.Entries)
        {
            jsonWriter.WriteStartObject(healthReportEntry.Key);
            jsonWriter.WriteString("status",
                healthReportEntry.Value.Status.ToString());
            jsonWriter.WriteString("description",
                healthReportEntry.Value.Description);
            jsonWriter.WriteStartObject("data");

            foreach (var item in healthReportEntry.Value.Data)
            {
                jsonWriter.WritePropertyName(item.Key);

                JsonSerializer.Serialize(jsonWriter, item.Value,
                    item.Value?.GetType() ?? typeof(object));
            } 
            jsonWriter.WriteEndObject();
            jsonWriter.WriteEndObject();
        }

        jsonWriter.WriteEndObject();
        jsonWriter.WriteEndObject();
    }

    return context.Response.WriteAsync(
        Encoding.UTF8.GetString(memoryStream.ToArray()));
}
```

##### The health checks API doesn't provide built-in support for complex JSON return formats because the format is specific to your choice of monitoring system. Customize the response in the preceding examples as needed
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### Monitoring your application is key for keeping an eye on its availability, how it uses resources, and any performance changes.
&nbsp;  
##### Health checks have been really useful for me, especially in cloud deployments where they help with failover strategies.
&nbsp;  
##### If an instance of the application starts failing, the health checks can trigger the creation of a new instance to ensure uninterrupted service.
&nbsp;  
##### Implementing these health checks in ASP.NET Core applications is straightforward and helps keep tabs on the health of various services.
&nbsp;  
##### While you have the option to create your own custom health checks, it's often a good idea to first look into existing solutions that might already meet your needs.
&nbsp;  
##### That's all from me today.