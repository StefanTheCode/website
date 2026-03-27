---
title: "How and why I create my own mapper (avoid Automapper)?"
subtitle: "In the beginning I used Automapper constantly and it was a great replacement for the tedious work of typing mapping code..."
date: "May 27 2024"
category: ".NET"
readTime: "Read Time: 5 minutes"
meta_description: "In the beginning I used Automapper constantly and it was a great replacement for the tedious work of typing mapping code..."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Postman has brought a lot of new and great things with the new v11 version. For example, today, you can generate API documentation in a few clicks.</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Read more about it here <a href="https://www.postman.com/api-platform/api-documentation/" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>
<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Dive deep into the React ecosystem and harness the power of modern development techniques. Learn everything from React fundamentals to mobile development with React Native.</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">Know more <a href="https://packt.link/BH9Y8" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## Background
Automapper is a popular library in the .NET ecosystem that can help developers automate the mapping of data between different object models.

In the beginning I used Automapper constantly and it was a great replacement for the tedious work of typing mapping code. Until the moment when I encountered bigger projects where using Automapper only caused me big problems.

Here I will share my experiences and ways to replace Automapper.

## Why am I not using Automapper?

• Poor code navigation experience
When using the default configuration of Automapper to map objects, it can be difficult to trace where a particular field is getting its value from. Even with helpful tools like Visual Studio or Rider and using the "Find Usages" feature, it's not possible to locate the assignment or usage of that field.

• Hard to debug
The problem here: fluent configuration. I cannot explain this better than: "Even if you provide mapping code within MapFrom<> method, you can’t put there a breakpoint and expect that program invocation stops when you call Mapper.Map<>() method. And if you have a bug in your mapping code you don’t get an exception in the place where you could potentially expect it." - Cezary Piatek

• Performance
AutoMapper can impact the performance of your application, as it takes some time to load during project startup and when mapping between objects. However, in most cases, this should not cause any significant issues.

## So what do I do?
## I create my own mapper

Depending on the complexity of the project and what I want to achieve, I choose a certain way of implementing mapping. In the following, I will highlight a few general ways that I use regularly.
## #1 Using reflection
If I don't have many properties to map, all property names that I need to map in both objects are identical, and performance is not the most important thing for me at the moment (although this is certainly faster than Automapper), I use simple reflection to map all properties.

```csharp
public class Mapper<TSource, TDestination>
{
    public TDestination Map(TSource source)
    {
        var destination = Activator.CreateInstance<TDestination>();

        foreach (var sourceProperty in typeof(TSource).GetProperties())
        {
            var destinationProperty = typeof(TDestination).GetProperty(sourceProperty.Name);

            if (destinationProperty != null)
            {
                destinationProperty.SetValue(destination, sourceProperty.GetValue(source));
            }
        }

        return destination;
    }

    public List<TDestination> Map(List<TSource> sourceList)
    {
        return sourceList.Select(source => Map(source)).ToList();
    }
}
```
Usage:

```csharp
var mapper = new Mapper<User, UserModel>();
List<UserModel> userModels = mapper.Map(users);
```

Potential problem:
**The names of the properties in User and UserModel are different. **The solution is to introduce projection by implementing the .Project() method ** that will enable such mapping.
**

## #2 Specific Mapper Service

This is the most common way I implement mapping. For a certain entity/DTO, I'm creating a service class that I put in DI. Inside the service class, I implement both mappings. This way I have complete control over the mapping with tremendous ease in debugging and testing the code.

```csharp
public class UserMapperService
{
    public User MapToUser(UserModel userModel)
    {
        return new User
        {
            Id = userModel.Id,
            Address = userModel.Address,
            City = userModel.City,
            Email = userModel.Email,
            FirstName = userModel.FirstName,
            LastName = userModel.LastName,
            Password = userModel.Password,
            PostalCode = userModel.PostalCode,
            Region = userModel.Region
        };
    }

    public UserModel MapToUserModel(User user)
    {
        return new UserModel
        {
            Id = user.Id,
            Address = user.Address,
            City = user.City,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Password = user.Password,
            PostalCode = user.PostalCode,
            Region = user.Region
        };
    }
}
```

Usage:

```csharp
UserModel userModel = _userMapperService.MapToUserModel(user);
```

Potential problem:
Very boring and tedious work - manually writing property mappings.
I have a solution for you: ** Mapping Generator (Visual Studio plugin)** which is able to scaffold mapping code in design time.
![Mapper Generator in Visual Studio](/images/blog/posts/why-to-avoid-automapper/mapper-generator-in-visual-studio.gif)

## #3 LINQ .Select() method
I use the .Select() method from EntityFramework mainly when I directly map entities from the domain/database to the DTO without any changes. In an ideal world, I believe there is nothing better than this mapping.

```csharp
List<User> users = _userRepository.GetUsers();

List<UserModel> userModels = users.Select(x => new UserModel
    {
        Address = x.Address,
        City = x.City,
        Email = x.City,
        FirstName = x.FirstName,
        Id = x.Id,
        LastName = x.LastName,
        Password = x.Password,
        PostalCode = x.PostalCode,
        Region = x.Region
    }).ToList();
```
## Wrapping up

That's all from me for today.

Using AutoMapper is not wrong. Any of these ways has its pros and cons.

I used Automapper myself, but as the project got bigger and bigger, I realized that it was a serious maintenance problem.

These are some of the methods I use. Try it yourself.
Make a coffee and check out source code directly on my ** [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/3%23%20-%20Mappers)**.

<!--END-->
