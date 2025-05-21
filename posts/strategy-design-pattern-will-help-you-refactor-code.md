---
title: "Strategy Design Pattern will help you refactor code"
subtitle: "The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable. "
category: "Design Patterns"
date: "July 11 2024"
---

&nbsp;  
##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;  
##### • Transform your API development process with Postman Flows! Experience a new way to visually create, debug, and automate complex API workflows with ease. Dive into the future of API management and enhance your productivity [here](https://www.postman.com/product/flows/).
&nbsp;  
&nbsp;  

<!--START-->

### What is a Strategy Pattern?
&nbsp;  
&nbsp;  
##### The Strategy pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each one, and makes them interchangeable.

&nbsp;  
##### The Strategy pattern lets the algorithm vary independently from clients that use it.
&nbsp;  
##### What this means?
&nbsp;  
&nbsp;  
### Real World Example
&nbsp;  
&nbsp;  
##### Consider a scenario where you need to travel from one place to another and to calculate travel time. You have several options for transportation - car, bus, bike, and walking. Each mode of transportation is a **different strategy for traveling**.
&nbsp;  

##### If you have a monolithic design where the mode of travel is hard-coded or tightly coupled with the rest of the travel planning logic, any change in travel options or the addition of new modes becomes a cumbersome task. 
&nbsp;  

##### The Strategy pattern elegantly solves these issues **by encapsulating the travel modes into separate strategies**. 
&nbsp;  

##### This means you can easily add a new mode of transport, like a taxi or motorcycle option, without disturbing the rest of your code. Each travel mode, be it a car, bike, or bus, gets its own class with a common interface.
&nbsp;  

##### Let's see how it looks with a classic switch statement:

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
&nbsp;  

##### Imagine that this switch has another 5,6 conditions, it would be difficult to follow them all.
&nbsp;  

##### The Strategy pattern **eliminates the need for conditionals by encapsulating each algorithm in its own class**, all adhering to a common interface.
&nbsp;  

##### Rather than implementing all algorithm variations, the original object delegates the execution to one of these encapsulated classes. 
&nbsp;  

##### Now, let's refactor the above code to use the Strategy pattern.
&nbsp;  

&nbsp;  
&nbsp;  
### Apply Strategy Design Pattern
&nbsp;  
&nbsp;  


##### **1. Define the Strategy Interface**:
&nbsp;  
##### Defines a common interface for all travel strategies.

```csharp

public interface ITravelStrategy
{
    void CalculateTravelTime(double distance);
}

```
&nbsp;  

##### **2. Concrete Strategies**:
&nbsp;  

##### Implement the travel time calculation for each travel mode (*CarTravelStrategy, BusTravelStrategy, BikeTravelStrategy, WalkingTravelStrategy*).

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
&nbsp;  

##### **3. Context Class**:
&nbsp;  

##### Uses a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.

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
&nbsp;   

##### **4. Context Class**:
&nbsp;   

##### Uses a strategy object to perform the travel time calculation, allowing the strategy to be set dynamically.
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

&nbsp;  
&nbsp;  
### Benefits?
&nbsp;  
&nbsp;  

##### **1. Eliminates Large Switch/Case Statements**:
&nbsp;  

##### The complex conditional logic is replaced with a more flexible and maintainable design.
&nbsp;  

##### **2. Encapsulation**:
&nbsp;  

##### Each travel mode's logic is encapsulated in its own class
&nbsp;  

##### **3. Extensibility**:
&nbsp;  

##### New travel modes can be added without modifying existing code. 
&nbsp;  

##### Let's demonstrate the extensibility of the Strategy pattern by adding a new travel mode without modifying the existing code.
&nbsp;  

##### Initially, we will have travel modes like Car, Bus, Bike, and Walking.
&nbsp;  

##### Then, we will add a new travel mode, **Train**, to show how it can be done without changing the existing code structure.
&nbsp;  

##### To add a new travel mode (Train), we simply create a **new concrete strategy class without modifying any of the existing classes**.

```csharp

public class TrainStrategy : ITravelStrategy
{
    public void Travel(string destination)
    {
        Console.WriteLine("Traveling to " + destination + " by train.");
    }
}

```
&nbsp;  

##### The client code simply sets the new strategy (TrainStrategy) and calls the Travel method without any changes to the existing code.

##### **4. Interchangeability**:

##### Travel strategies can be changed at runtime, allowing for dynamic behavior.

##### By refactoring to use the Strategy pattern, the code becomes cleaner, more maintainable, and easier to extend.

&nbsp;  
&nbsp; 
### Cons?
&nbsp;  
&nbsp;  

##### 1. If you have just a few algorithms that seldom change, there's no need to complicate your program with additional classes and interfaces that the pattern entails.
&nbsp;  

##### **2. Increased Number of Classes**: The Strategy pattern can lead to a proliferation of classes. For each new strategy, you need to create a new class. This can make the system more complex and harder to maintain, especially if there are many different strategies.
&nbsp;  

##### **3. Lack of Shared State**: Since strategies are meant to be interchangeable, they should not share state. This means each strategy must maintain its own state, even if some state could be shared. This can lead to duplicated code and increased memory usage if the state cannot be easily shared.
&nbsp;  

##### **4. Clients Must Know About Strategies**: Clients must be aware of the different strategies and know when to use each one. This can complicate client code and reduce encapsulation, as clients need to manage the strategy selection logic.
&nbsp;  
### Bonus: UML Diagram
&nbsp;  

![Bonus: UML Diagram](/images/blog/posts/strategy-design-pattern-will-help-you-refactor-code/uml-diagram.png)


&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  

##### Today I showed one of the real examples in everyday programming and how it is possible to use the Strategy Design pattern to solve that problem.
&nbsp;  

##### Although the solution is good, it is not realistic to use the same pattern in every situation.
&nbsp;  

##### That is why it is necessary to know the pros & cons of the pattern in a certain situation and make a decision.
&nbsp;  

##### Would you use another pattern for this?
##### What about [Chain Responsibility Pattern](https://thecodeman.net/posts/chain-responsibility-pattern)?
&nbsp;  
##### Write to me.
&nbsp;  

##### That's all from me today.

<!--END-->
