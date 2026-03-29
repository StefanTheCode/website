---
title: "Strategy Design Pattern will help you refactor code"
subtitle: "The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. "
date: "July 11 2024"
category: "Design Patterns"
readTime: "Read Time: 5 minutes"
meta_description: "The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity <a href="https://www.postman.com/product/flows/" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## What is a Strategy Pattern?
The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable.

The Strategy pattern lets the algorithm vary independently from clients that use it.
What this means?
## Real World Example
Consider a scenario where you need to travel from one place to another and to calculate travel time. You have several options for transportation - car, bus, bike, and walking. Each mode of transportation is a **different strategy for traveling**.

If you have a monolithic design where the mode of travel is hard-coded or tightly coupled with the rest of the travel planning logic, any change in travel options or the addition of new modes becomes a cumbersome task. 

The Strategy pattern elegantly solves these issues **by encapsulating the travel modes into separate strategies**. 

This means you can easily add a new mode of transport, like a taxi or motorcycle option, without disturbing the rest of your code. Each travel mode, be it a car, bike, or bus, gets its own class with a common interface.

Let's see how it looks with a classic switch statement:

```csharp
using System;

public class TravelTimeCalculator
{
    public void CalculateTravelTime(string travelMode, double distance)
    {
        switch (travelMode)
        {
            case "Car":
                Console.WriteLine($"Travel time by Car: {distance / 60} hours.");
                break;
            case "Bus":
                Console.WriteLine($"Travel time by Bus: {distance / 40} hours.");
                break;
            case "Bike":
                Console.WriteLine($"Travel time by Bike: {distance / 15} hours.");
                break;
            case "Walking":
                Console.WriteLine($"Travel time by Walking: {distance / 5} hours.");
                break;
            default:
                throw new ArgumentException("Invalid travel mode");
            }
    }
}

public class Client
{
    public static void Main(string[] args)
    {
        var calculator = new TravelTimeCalculator();
        calculator.CalculateTravelTime("Car", 120);
        calculator.CalculateTravelTime("Bus", 120);
        calculator.CalculateTravelTime("Bike", 120);
        calculator.CalculateTravelTime("Walking", 120);
    }
}
```

Imagine that this switch has another 5,6 conditions, it would be difficult to follow them all.

The Strategy pattern **eliminates the need for conditionals by encapsulating each algorithm in its own class**, all adhering to a common interface.

Rather than implementing all algorithm variations, the original object delegates the execution to one of these encapsulated classes. 

Now, let's refactor the above code to use the Strategy pattern.

## Apply Strategy Design Pattern

**1. Define the Strategy Interface**:
Defines a common interface for all travel strategies.

```csharp
public interface ITravelStrategy
{
    void CalculateTravelTime(double distance);
}
```

**2. Concrete Strategies**:

Implement the travel time calculation for each travel mode (*CarTravelStrategy, BusTravelStrategy, BikeTravelStrategy, WalkingTravelStrategy*).

```csharp
public class CarTravelStrategy : ITravelStrategy
{
    public void CalculateTravelTime(double distance)
    {
        Console.WriteLine($"Travel time by Car: {distance / 60} hours.");
    }
}

public class BusTravelStrategy : ITravelStrategy
{
    public void CalculateTravelTime(double distance)
    {
        Console.WriteLine($"Travel time by Bus: {distance / 40} hours.");
    }
}

public class BikeTravelStrategy : ITravelStrategy
{
    public void CalculateTravelTime(double distance)
    {
        Console.WriteLine($"Travel time by Bike: {distance / 15} hours.");
    }
}

public class WalkingTravelStrategy : ITravelStrategy
{
    public void CalculateTravelTime(double distance)
    {
        Console.WriteLine($"Travel time by Walking: {distance / 5} hours.");
    }
}
```

**3. Context Class**:

Uses a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.

```csharp
public class TravelContext
{
    private ITravelStrategy _travelStrategy;

    public void SetTravelStrategy(ITravelStrategy travelStrategy)
    {
        _travelStrategy = travelStrategy;
    }

    public void CalculateTravelTime(double distance)
    {
        _travelStrategy?.CalculateTravelTime(distance);
    }
}
```

**4. Context Class**:

Uses a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.
```csharp
public class Client
{
    public static void Main(string[] args)
    {
        var travelContext = new TravelContext();

        // Travel by Car
        travelContext.SetTravelStrategy(new CarTravelStrategy());
        travelContext.CalculateTravelTime(120);

        // Travel by Bus
        travelContext.SetTravelStrategy(new BusTravelStrategy());
        travelContext.CalculateTravelTime(120);

        // Travel by Bike
        travelContext.SetTravelStrategy(new BikeTravelStrategy());
        travelContext.CalculateTravelTime(120);

        // Travel by Walking
        travelContext.SetTravelStrategy(new WalkingTravelStrategy());
        travelContext.CalculateTravelTime(120);
    }
}
```

## Benefits?

**1. Eliminates Large Switch/Case Statements**:

The complex conditional logic is replaced with a more flexible and maintainable design.

**2. Encapsulation**:

Each travel mode's logic is encapsulated in its own class

**3. Extensibility**:

New travel modes can be added without modifying existing code. 

Let's demonstrate the extensibility of the Strategy pattern by adding a new travel mode without modifying the existing code.

Initially, we will have travel modes like Car, Bus, Bike, and Walking.

Then, we will add a new travel mode, **Train**, to show how it can be done without changing the existing code structure.

To add a new travel mode (Train), we simply create a **new concrete strategy class without modifying any of the existing classes**.

```csharp
public class TrainStrategy : ITravelStrategy
{
    public void Travel(string destination)
    {
        Console.WriteLine("Traveling to " + destination + " by train.");
    }
}
```

The client code simply sets the new strategy (TrainStrategy) and calls the Travel method without any changes to the existing code.

**4. Interchangeability**:

Travel strategies can be changed at runtime, allowing for dynamic behavior.

By refactoring to use the Strategy pattern, the code becomes cleaner, more maintainable, and easier to extend.

## Cons?

1. If you have just a few algorithms that seldom change, there's no need to complicate your program with additional classes and interfaces that the pattern entails.

**2. Increased Number of Classes**: The Strategy pattern can lead to a proliferation of classes. For each new strategy, you need to create a new class. This can make the system more complex and harder to maintain, especially if there are many different strategies.

**3. Lack of Shared State**: Since strategies are meant to be interchangeable, they should not share state. This means each strategy must maintain its own state, even if some state could be shared. This can lead to duplicated code and increased memory usage if the state cannot be easily shared.

**4. Clients Must Know About Strategies**: Clients must be aware of the different strategies and know when to use each one. This can complicate client code and reduce encapsulation, as clients need to manage the strategy selection logic.
## Bonus: UML Diagram

![Bonus: UML Diagram](/images/blog/posts/strategy-design-pattern-will-help-you-refactor-code/uml-diagram.png)

## Wrapping up

Today I showed one of the real examples in everyday programming and how it is possible to use the Strategy Design pattern to solve that problem.

Although the solution is good, it is not realistic to use the same pattern in every situation.

That is why it is necessary to know the pros & cons of the pattern in a certain situation and make a decision.

Would you use another pattern for this?
What about [Chain Responsibility Pattern](https://thecodeman.net/posts/chain-responsibility-pattern)?
Write to me.

That's all from me today.


---

Want more design patterns with real-world examples? My ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) covers 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with hands-on C# code you can use right away. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

<!--END-->
