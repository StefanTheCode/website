---
newsletterTitle: "#3 Stefan's Newsletter"
title: "How and why I create my own mapper (avoid Automapper)?"
subtitle: "In the beginning I used Automapper constantly and it was a great replacement for the tedious work of typing mapping code. Until the moment when I encountered bigger projects where using Automapper only caused me big problems.
Here I will share my experiences and ways to replace Automapper.
"
date: "February 27 2023"
photoUrl: "/images/blog/newsletter21.png"
---

### Background
<br>
##### Automapper is a popular library in the .NET ecosystem that can help developers automate the mapping of data between different object models.
<br>

##### In the beginning I used Automapper constantly and it was a great replacement for the tedious work of typing mapping code. Until the moment when I encountered bigger projects where using Automapper only caused me big problems.

##### Here I will share my experiences and ways to replace Automapper.

<br>
<br>

### Why am I not using Automapper?
<br>
<br>

##### <b> • Poor code navigation experience</b>
##### When using the default configuration of Automapper to map objects, it can be difficult to trace where a particular field is getting its value from. Even with helpful tools like Visual Studio or Rider and using the "Find Usages" feature, it's not possible to locate the assignment or usage of that field.
<br>

##### <b> • Hard to debug</b>
##### The problem here: fluent configuration. I cannot explain this better than: "Even if you provide mapping code within MapFrom<> method, you can’t put there a breakpoint and expect that program invocation stops when you call Mapper.Map<>() method. And if you have a bug in your mapping code you don’t get an exception in the place where you could potentially expect it." - Cezary Piatek
<br>

##### <b> • Performance</b>
##### AutoMapper can impact the performance of your application, as it takes some time to load during project startup and when mapping between objects. However, in most cases, this should not cause any significant issues.
<br>
<br>

### So what do I do?
### I create my own mapper
<br>

##### Depending on the complexity of the project and what I want to achieve, I choose a certain way of implementing mapping. In the following, I will highlight a few general ways that I use regularly.
<br>
<br>
### #1 Using reflection
<br>
##### If I don't have many properties to map, all property names that I need to map in both objects are identical, and performance is not the most important thing for me at the moment (although this is certainly faster than Automapper), I use simple reflection to map all properties.
<br>

![Custom mapper using reflection](/images/blog/posts/why-to-avoid-automapper/custom-mapper-using-reflection.png)
<br>
##### Usage:
![Using of custom mapper with reflection](/images/blog/posts/why-to-avoid-automapper/using-of-custom-mapper-with-reflection.png)
<br>
<br>
##### <b>Potential problem:</b>
<br>
##### <b>The names of the properties in User and UserModel are different. <b>The solution is to introduce projection by implementing the .Project() method </b> that will enable such mapping.
</b>
<br>
<br>

### #2 Specific Mapper Service
<br>

##### This is the most common way I implement mapping. For a certain entity/DTO, I'm creating a service class that I put in DI. Inside the service class, I implement both mappings. This way I have complete control over the mapping with tremendous ease in debugging and testing the code.
<br>
![Custom Mapper Service](/images/blog/posts/why-to-avoid-automapper/custom-mapper-service.png)
##### Usage:
![Usage Custom Mapper Service](/images/blog/posts/why-to-avoid-automapper/usage-custom-mapper-service.png)
<br>
<br>
##### <b>Potential problem:</b>
<br>
##### Very boring and tedious work - manually writing property mappings.
##### I have a solution for you: <b> Mapping Generator (Visual Studio plugin)</b> which is able to scaffold mapping code in design time.
<br>
![Mapper Generator in Visual Studio](/images/blog/posts/why-to-avoid-automapper/mapper-generator-in-visual-studio.gif)

<br>

### #3 EF .Select() method
<br>
##### I use the .Select() method from EntityFramework mainly when I directly map entities from the domain/database to the DTO without any changes. In an ideal world, I believe there is nothing better than this mapping.


![Custom Mapper Service](/images/blog/posts/why-to-avoid-automapper/custom-mapper-service.png)
##### That's all from me for today.

<br>
<br>
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/3%23%20-%20Mappers)</b>.
<br>

## <b > dream BIG! </b>