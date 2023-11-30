---
newsletterTitle: "#1 Stefan's Newsletter"
title: "4 methods to handle Nullable Reference in .NET"
subtitle: "Reference types in C# have always been nullable, meaning that variables of any reference type can be assigned a value of null. In previous versions of C#, dereferencing a null variable was permitted without any checks.  The Nullable Reference Types feature was introduced in C# 8 to address this issue, and with the release of .NET 6, this feature is now enabled by default.
"
date: "February 13 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore the latest methods to handle Nullable References in .NET. This comprehensive guide covers 4 key strategies, essential for C# developers working with .NET 6 and beyond."
---

### Background
<br>
##### Understanding reference types and their nullable nature in C# programming is foundational. Reference types in C# have always been nullable, meaning that variables of any reference type can be assigned a value of null. In previous versions of C#, dereferencing a null variable was permitted without any checks.

In this article, we delve into the core aspects of handling nullable reference types in .NET, a crucial skill for modern C# programming.
##### The Nullable Reference Types feature was introduced in C# 8 to address this issue, and with the release of .NET 6, this feature is now enabled by default.

### Example
<br>

##### Let's say we have a class:

![Customer class](/images/blog/posts/4-methods-to-handle-nullable-reference/customer-class.png)

##### In .Net we will get a warning for underlined properties:
<br>
##### <b style="color: red">CS8618</b>: Non-nullable field 'Name' must contain a non-null value when exiting constructor. Consider declaring the field as nullable.
<br>
<br>
### How to handle?
### Method #1


<br>
##### Steps
##### • Open .csproj project file
##### • Inside the PropertyGroup change Nullable to disable

![Property group project options](/images/blog/posts/4-methods-to-handle-nullable-reference/property-group-project-options.png)

##### <b>Result</b>: We won't get any more warnings for null references, but we can potentially run into a Null Reference Exception if we don't check objects for null before using them.

<br><br>
### Method #2
<br>

##### Steps
##### • Make properties nullable reference type <b> by using "?" </b>.

![Properties nullable references](/images/blog/posts/4-methods-to-handle-nullable-reference/properties-nullable-reference.png)

<br><br>
### Method #3
<br>

##### Steps
##### • Assign a <b>default value</b> to properties.

![Properties with default value](/images/blog/posts/4-methods-to-handle-nullable-reference/properties-with-default-value.png)

<br><br>
### Method #4
<br>

##### Steps
##### • Write a compiler directive  <b style="color: white"> `#nullable to disable (or enable)` </b> feature.

![Properties with compiler directive](/images/blog/posts/4-methods-to-handle-nullable-reference/properties-with-compiler-directive.png)

##### If you have a .NET 6 project, open it now and try it.
<br>
##### If you haven't, make a coffee and check out these examples directly on my [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/1%23%20-%20NullableReference)

