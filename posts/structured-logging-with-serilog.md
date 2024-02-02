---
newsletterTitle: "#14 Stefan's Newsletter"
title: "Structured Logging with Serilog"
subtitle: "Traditional plain-text logs can be hard to read and analyze..."
readTime: "Read Time: 5 minutes"
date: "May 15 2023"
photoUrl: "/images/blog/structured-logging-with-serilog.png"
meta_description: "Enhance .NET applications with Structured Logging using Serilog: A practical guide to advanced logging techniques for clearer context, improved analytics, and searchability."
---

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
#### **Structured Logging**
&nbsp;  
##### Traditional plain-text logs can be hard to read and analyze. Structured logging aims to improve this by logging events that are structured as key-value pairs. This provides a standard, predictable format that's easier to query and analyze. In most cases JSON is used.
&nbsp;  
#### **Introducing Serilog**
&nbsp;  
##### Serilog is a popular structured logging library for .NET applications. It's easy to set up, feature-rich, and supports a wide variety of **"sinks"** - outputs where your logs can be sent.
&nbsp;  
#### **What is a Sink?**
&nbsp;  
##### ​​​​A sink in Serilog is a destination where your log events are sent. There are sinks for various outputs like the console, files, databases, and even other logging platforms like **Seq**, which we'll explore in more detail.
&nbsp;  
##### *This will be a completely practical issue, without touching theory on some deeper level.*
&nbsp; 
##### Let's start...

&nbsp;  
&nbsp;  
### Configuring Serilog with .NET 7
&nbsp;  
&nbsp;  
##### For demo purposes, we will use .NET Web Api project application.
&nbsp;  
##### To start using Serilog, you need to add the relevant NuGet packages:
```csharp

dotnet add package Serilog
dotnet add package Serilog.Extensions.Logging
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File

```
&nbsp;  
#### **Serilog.Extensions.Logging:**
&nbsp;  
##### This package is a provider for Microsoft's built-in ILogger<T> interface. It allows you to use Serilog as the underlying logging system while using Microsoft's ILogger<T> interface in your application code.

&nbsp;  
#### **Serilog.Sinks.Console:**
&nbsp;  
##### This package provides a "sink" (a destination for log events) that outputs log events to the console.
&nbsp;  
#### **Serilog.Sinks.File:**
&nbsp;  
##### This package provides a sink that outputs log events to a file.
&nbsp;  
##### Then, you need to configure Program.cs class.
```csharp

using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Logging.AddSerilog();

var app = builder.Build();

app.Run();

Log.CloseAndFlush();

```
&nbsp;  
#### **- Log.Logger = new LoggerConfiguration()...:**
&nbsp;  
##### This code block is configuring the global static Log class provided by Serilog. Here is a breakdown of the configuration:
&nbsp; 
##### **- .WriteTo.Console():** This tells Serilog to use the Console Sink, which outputs log events to the console.
&nbsp;  
##### **- .WriteTo.File**("logs/app.txt", rollingInterval: RollingInterval.Day): This tells Serilog to use the File Sink, which outputs log events to a file.
&nbsp;  
##### **- The rollingInterval:** RollingInterval.Day option means a new log file will be created every day.
&nbsp;  
##### **- .CreateLogger():** This builds the logger configuration and creates a logger instance.
&nbsp;  
#### **- builder.Logging.AddSerilog();:** 
&nbsp;  
##### This is adding the Serilog provider to the Microsoft.Extensions.Logging system. This allows you to use the ILogger<T> interface throughout your application, with Serilog as the underlying provider.

&nbsp;  
&nbsp;  
### Serilog Sinks
&nbsp;  
&nbsp;
#### Console Sink
&nbsp;
##### The Console Sink outputs log events to the console or terminal. This can be useful for local development and debugging, as you can see log events in real-time as they occur. However, console logs aren't persisted when the application is stopped, and you may need to handle console output differently if your application is running in a container or cloud environment.

```csharp

.WriteTo.Console();
```
&nbsp;  
##### Example:
![Serilog sink console](/images/blog/posts/structured-logging-with-serilog/serilog-sink-console.png)
&nbsp;
#### File Sink
&nbsp;
##### The File Sink outputs log events to a text file. You can specify the path to the file, and you can also set a rolling interval to create a new log file at regular intervals (e.g., daily, hourly). This can be useful for maintaining a historical record of log events that you can review later. However, be aware that log files can become large over time, and you'll need to manage log file rotation and retention to avoid using up too much disk space.
```csharp

.WriteTo.File("logs/app.txt", rollingInterval: RollingInterval.Day);
```
&nbsp;  
##### Example:
![Serilog sink file](/images/blog/posts/structured-logging-with-serilog/serilog-sink-file.png)
&nbsp;
#### Database Sink
&nbsp;
##### Outputs log events to a database. There are several different database sinks available, depending on your database system.
&nbsp;
##### For example:
&nbsp;
##### - Serilog.Sinks.MSSqlServer for SQL Server
##### - Serilog.Sinks.PostgreSQL for PostgreSQL
##### - Serilog.Sinks.MySql for MySQL.
&nbsp;
##### Logging to a database can provide a centralized location for log data and allow you to query and analyze logs using SQL. However, writing logs to a database can be slower than other sinks and you may need to consider the impact on database performance and storage.

```csharp

.WriteTo.MSSqlServer("Data Source=localhost;Initial Catalog=Logging;Integrated Security=SSPI",
                    new MSSqlServerSinkOptions
                    {
                        TableName = "Logs",
                        SchemaName = "dbo",
                        AutoCreateSqlTable = true
                    })

```
&nbsp;
#### Seq Sink
&nbsp;
##### The Seq Sink outputs log events to Seq, which is a centralized log data platform (install it from: [url](https://datalust.co/download)). Seq makes it easy to search, analyze, and alert on structured log data. It collects logs and provides a web interface where you can use SQL-like queries to filter and analyze your logs. Seq also supports dashboards, alerts, and integrations with other tools.
&nbsp;
##### Seq is particularly useful in combination with structured logging, as it allows you to query your logs based on the structured properties in your log events.
&nbsp;
##### To use the Seq Sink, you need to install the **Serilog.Sinks.Seq** NuGet package.

```csharp

dotnet add package Serilog.Sinks.Seq

```
&nbsp;  

##### Then, you configure the Seq Sink in your Serilog configuration:
```csharp

.WriteTo.Seq("http://localhost:5341")
```

&nbsp;  
##### When you install Seq, it will start a web server with the certain port (5341).
&nbsp;  
##### In this example, Seq is running on the local machine. If you're running Seq in a different location, you would replace "http://localhost:5341" with the URL where Seq is running.
&nbsp;  
##### You can access it via url:
![Serilog sink file](/images/blog/posts/structured-logging-with-serilog/serilog-sink-seq.png)
&nbsp;  
&nbsp;  
### Structured Logging
&nbsp;  
&nbsp;  
##### Let's start with the example:
```csharp

string firstName = "Stefan";
string lastName = "Djokic";

_logger.Information("User Name: {FirstName} {LastName}", firstName, lastName);
```
&nbsp;  
##### In this example, instead of using string formatting to include the firstName and lastName in the log message, we're using placeholders **{FirstName}** and **{LastName}** in the message template.
&nbsp;  
##### Serilog will replace these placeholders with the actual values of firstName and lastName when it outputs the log event, but it will also capture the threse as a structured properties of the log event.
&nbsp;  
##### When this log event is output as JSON, it might look something like this:
```csharp

{
    "Timestamp": "2023-05-14T18:32:00.1234567Z",
    "Level": "Information",
    "MessageTemplate": "User Name: {FirstName} {LastName}",
    "Properties": {
        "FirstName": "Stefan",
        "LastName": "Djokic"
    }
}

```
&nbsp;  
##### As you can see, firstName and lastName are included as a structured properties FirstName and LastName in the log event. This means you can query or filter your logs based on First or Last name, which would be much more difficult with traditional plain-text logs.
&nbsp;  
#### Benefits?
&nbsp;  
##### Structured logging has several advantages:
&nbsp;  
##### **1. Improved Searchability:** You can search for specific log entries using the properties in the structured data. This can be particularly powerful when combined with a log management system that supports structured logs, like Seq or Elasticsearch.
&nbsp;  
##### **2. Better Analytics:** Since the log data is structured, you can easily analyze it. For example, you could count the number of errors associated with a specific FirstName or calculate the average processing time for requests.
&nbsp;  
##### **3. Clearer Context:** Structured properties can provide more context about what was happening when the log event was created. For example, you could include properties like UserId or RequestId to understand who or what was involved in the log event.

&nbsp;  
&nbsp;  
### Example
&nbsp;  
&nbsp;  

```csharp

[HttpGet(Name = "GetWeatherForecast")]
public IEnumerable<WeatherForecast> Get()
{
    _logger.LogInformation("Logging from {Controller}/{Action}.", typeof(WeatherForecastController).Name, nameof(Get));

    _logger.LogError(new Exception("Some Exception message"), "Exception");

    return GenerateRandomWeatherValues();
}

```
&nbsp;  
##### Let's say we have a default API project with a default WeatherController. Within the GetWeatherForecast method we will log 2 things, one informative log and one exception logging. We will use structured logging.
&nbsp;  
##### We have logging set up in console, in file and in Seq. Let's take a look at the Seq tool.
&nbsp;  
##### In the browser we will access the Seq platform (via url http://localhost:5341) where we can see all the logs from the application.
![Serilog Seq Logs](/images/blog/posts/structured-logging-with-serilog/serilog-seq-logs.png)
&nbsp;  
##### We can see both logos. As for Exception, it is clearly indicated by a red cross in front of the name that it is an Error logging.
&nbsp;  
##### If we expand this log, we can see all the details that are logged including the error text of the exception, RequestPath, SourceContext, ActionName and other details.
![Serilog Seq Logs Details](/images/blog/posts/structured-logging-with-serilog/serilog-seq-logs-details.png)
&nbsp;  
##### This allows us to more easily understand and search the logs.

&nbsp;  
&nbsp;  
### What next?
&nbsp;  
&nbsp;  
##### Remember, good logging practices can save you significant time and effort when debugging issues or understanding usage patterns. It's a worthwhile investment to set up good logging early in your project.
&nbsp;  
##### That's all from me today. 
&nbsp;  
##### It's Monday, make a coffee and check the whole project implementation on [GitHub repository](https://github.com/StefanTheCode/StructuredLogging).
