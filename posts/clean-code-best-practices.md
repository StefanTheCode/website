---
title: "Clean Code - Best Practices"
category: "CSharp"
subtitle: "I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the Clean Code book is..."
date: "March 20 2023"
---

### Background
&nbsp;
&nbsp;
##### I'm not sure if I know any programmer, engineer, architect, or even HR who doesn't know who Uncle Bob is and what the Clean Code book is.
&nbsp;
##### If by some miracle you are one of them, it's a concept that refers to writing code that is easy to read and maintain.
&nbsp;
##### Since this is the 6th issue newsletter, today I'm going to show you 6 things you should or shouldn't be doing in your code that you can change in your code right away.
&nbsp;
##### You may know some of these, but it's okay to remember some things because we all make mistakes even after many years of experience.
&nbsp;
&nbsp;

### 1#: Avoid Pyramids
&nbsp;
&nbsp;

##### When we talk about pyramids or ladders in code, we're referring to <b> multiple layers of if/else statements </b> that can quickly become confusing and difficult to read. This can happen when we have a complex set of conditions that we need to check in order to execute a particular block of code.
&nbsp;

##### The problem with pyramids is that they make it hard to follow the logic of the code. It's easy to get lost in the maze of nested statements and lose sight of what's really happening. This can make it difficult to debug and maintain the code in the future.
&nbsp;
![Avoid Pyramids with multiple if statements](/images/blog/posts/clean-code-best-practices/avoid-pyramids-with-multiple-if-statements.png)

##### So, what's the solution?
##### One approach is to use guard clauses, which are essentially early return statements that check for a condition and exit the method or function if it's not met.
![Using Guard Clauses](/images/blog/posts/clean-code-best-practices/using-guard-clauses.png)

&nbsp;
&nbsp;

### 2#: Avoid magic (numbers, strings)
&nbsp;

##### The problem here are hard-coded values that are used throughout the codebase without any clear explanation of what they mean.
&nbsp;
##### For example, imagine a scenario where the number "100" is used multiple times throughout the codebase without any indication of what it represents. This can make the code difficult to understand and maintain over time.
&nbsp;
##### Here is an example:
![Avoid Magic Numbers](/images/blog/posts/clean-code-best-practices/avoid-magic-numbers.png)
&nbsp;
##### Solution?
&nbsp;
##### The key is to use constants or enums to represent these values instead of hard-coding them. This makes it clear what the values represent, and also allows you to change them in a single place if needed, rather than having to update every instance throughout the codebase.
![Avoid Magic Numbers](/images/blog/posts/clean-code-best-practices/using-constants.png)

&nbsp;
&nbsp;

### 3#: Avoid Return null collection
&nbsp;
&nbsp;

##### Why you should not do this:
&nbsp;
##### • Possible NullReferenceException
##### • We always need to check for null   
##### • Slow Performance (checking for null, throwing/catching an exception, etc.)

![Do not return null collection](/images/blog/posts/clean-code-best-practices/do-not-return-null-collection.png)
&nbsp;
##### Instead, just return an empty collection.
![Return Empty Collection](/images/blog/posts/clean-code-best-practices/return-empty-enumerable.png)
&nbsp;
&nbsp;

### 4#: Avoid Too Many Method Parameters
&nbsp;
&nbsp;

##### Let's say we have a class that's working with Addresses. We are calling a method AddAddress to persistence details. The address can have StreetName, StreetNumber, PostalCode, Country, City, and Region properties. If all of these parameters are passed into the method separately, it can become difficult to read and understand the code.

&nbsp;
##### Example:
![Avoid too many parameters](/images/blog/posts/clean-code-best-practices/avoid-too-many-parameters.png)
&nbsp;
##### To avoid too many method parameters, you can use a few different techniques. One approach is to group related parameters into a single object or struct.

![Group parameters to object](/images/blog/posts/clean-code-best-practices/group-parameters-to-object.png)

&nbsp;
&nbsp;

### 5#: Be Strongly Typed
&nbsp;
&nbsp;

##### Don't be "Stringly" typed.
&nbsp;
##### Similar to "Avoid Magic" but on a higher level. Imagine you have an employee class/object with 10+ types in a company (manager, hr, CEO, etc.).
&nbsp;
##### Whenever you check the type through "magic strings", it can be disastrous on multiple levels.
&nbsp;
##### Don't do this ever:
![Group parameters to object](/images/blog/posts/clean-code-best-practices/do-not-use-magic-strings.png)

##### Just create an enum that will represent the type:
![Use enumeration](/images/blog/posts/clean-code-best-practices/use-enumeration.png)
&nbsp;
&nbsp;

### 6#: Your method should do one thing only
&nbsp;
&nbsp;

##### <b>Potential problem:</b>
&nbsp;
##### When you're writing code, it can be tempting to include multiple functions within a single method to make it more efficient. However, this can actually make your code more difficult to read, and maintain over time.
&nbsp;

##### "Bad" example:
![Single Responsibility Principle violation](/images/blog/posts/clean-code-best-practices/single-responsibility-principle-violation.png)
##### Way to resolve?
&nbsp;
##### Single Responsibility Principle (SRP). By following the SRP, you can create more modular and organized code that is easier to work with. 
&nbsp;
##### Just separate concerns:
![Single Responsibility Principle violation](/images/blog/posts/clean-code-best-practices/separate-concerns-srp.png)
&nbsp;
&nbsp;

##### That's all from me for today.

&nbsp;
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/Newsletter/tree/main/6%23%20-%20Clean%20Code)</b>.
&nbsp;

## ** dream BIG! </b>