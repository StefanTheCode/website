---
newsletterTitle: "#39 Stefan's Newsletter"
title: "Compile-time logging source generation for highly performant logging"
subtitle: "With the release of .NET 6, there's a new tool in town called LoggerMessageAttribute, and it's here to make logging better and easier.
It's a part of the Microsoft.Extensions.Logging family, and when you use it, it generates super-efficient code for logging. This means your application can log things much faster, which is great for performance."
date: "Oct 30 2023"
readTime: "Read Time: 2 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore the power of compile-time logging source generation in .NET 6 with Stefan Đokić's insightful guide. Learn how LoggerMessageAttribute enhances application logging, making it faster and more efficient. Perfect for .NET developers eager to optimize their logging practices using the latest advancements in the Microsoft.Extensions.Logging library."
---

&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### In the world of .NET software development, **logging** is a crucial part of keeping track of what's happening inside your applications. It helps you find and fix issues, understand how your software is behaving, and ensure it runs smoothly.
&nbsp;  
##### With the release of .NET 6, there's a new tool in town called **LoggerMessageAttribute** , and it's here to make logging better and easier.
&nbsp;  
##### It's a part of the Microsoft.Extensions.Logging family, and when you use it, it generates super-efficient code for logging. This means your application can log things much faster, which is great for performance.
&nbsp;  
##### Imagine you're writing code and you want to log something. Instead of writing a bunch of code to set up the logging, you just add this attribute to a  partial method, and LoggerMessageAttribute does the heavy lifting for you. It's like having a personal assistant for your logging tasks!
&nbsp;  
##### Let's take a look...
&nbsp;  
&nbsp;  
### Basic usage
&nbsp;  
&nbsp;  
##### To utilize the LoggerMessageAttribute, both the **consuming class and the associated method must be declared as partial** . During compilation, the code generator is activated and produces an implementation for the partial method.
&nbsp;  
##### Let's see an example:
```csharp

public static partial class Log
{
   [LoggerMessage(
      EventId = 0,
      Level = LogLevel.Critical,
      Message = "Could not open socket to `{HostName}`")
   ]
   public static partial void CouldNotOpenSocket(
      ILogger logger, string hostName);
}
```
&nbsp;  
##### In the example provided earlier, the logging method is static, and the log level is set within the attribute definition. If you intend to use the attribute in a static context, you have two options: either include the ILogger instance as a parameter, or adjust the method's definition by using the 'this' keyword to convert it into an extension method.
&nbsp;  
##### Alternatively, you have the flexibility to employ the attribute within a non-static context. Take the following example, where the logging method is defined as an instance method. In this scenario, the method obtains the logger by accessing an ILogger field within the enclosing class:
```csharp

public partial class InstanceLoggingExample
{
   private readonly ILogger _logger;

   public InstanceLoggingExample(ILogger logger)
   {
      _logger = logger;
   }

   [LoggerMessage(
      EventId = 0,
      Level = LogLevel.Critical,
      Message = "Could not open socket to `{HostName}`")
   ]
   public partial void CouldNotOpenSocket(string hostName);
}
```
&nbsp;  
&nbsp;  
### Dynamic Log Level
&nbsp;  
&nbsp;  
##### At times, you might want the log level **to be flexible and not hardcoded** into your code. To achieve this, you can leave out the log level in the attribute and, instead, make it something you need to provide as a parameter when using the logging method:
```csharp

public static partial class Log
{
   [LoggerMessage(
      EventId = 0,
      Message = "Could not open socket to `{HostName}`")
   ]
   public static partial void CouldNotOpenSocket(
      ILogger logger,
      LogLevel level, /* Dynamic log level as parameter, rather than defined in attribute. */
      string hostName);
}
```
&nbsp;  
&nbsp;  
### Log method constraints
&nbsp;  
&nbsp;  
##### When using the LoggerMessageAttribute on logging methods, some constraints must be followed:
&nbsp;  
##### • Logging methods must be **partial** and return **void** .
##### • Logging method names must **not start** with an underscore.
##### • Parameter names of logging methods must **not start** with an underscore.
##### • Logging methods **may not** be defined in a nested type.
##### • Logging methods **cannot** be generic.
##### • If a logging method is **static** , the **ILogger** instance is required as a parameter.
&nbsp;  
&nbsp;  
### Conslusion
&nbsp;  
&nbsp;  
##### In summary, the **LoggerMessageAttribute** in .NET 6 simplifies and accelerates the process of creating high-performance logging code. By automatically generating **LoggerMessage.Define** calls and optimizing the generated code for performance, it helps developers produce efficient and reliable logging solutions with minimal effort. This attribute is a valuable addition to the .NET logging ecosystem, contributing to better logging practices in modern .NET applications.
&nbsp;  
##### That's all from me today.