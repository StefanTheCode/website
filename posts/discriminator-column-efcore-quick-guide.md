---
title: "Discriminator Column in EF Core: A Quick Guide"
subtitle: "In Entity Framework (EF) Core, a discriminator is a special column used in Table Per Hierarchy (TPH) inheritance to differentiate between multiple entity types stored in a single table."
date: "Feb 17 2025"
category: "Entity Framework"
readTime: "Read Time: 4 minutes"
meta_description: "In Entity Framework (EF) Core, a discriminator is a special column used in Table Per Hierarchy (TPH) inheritance to differentiate between multiple entity types stored in a single table."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #ffffff;">**• Struggling with slow EF Core performance?** Unlock up to 14x faster operations and cut execution time by 94% with <a href="https://entityframework-extensions.net/" style="color: #a5b4fc; text-decoration: underline;">high-performance library for EF Core</a>.  Seamlessly enhance your app with Bulk Insert, Update, Delete, and Merge—fully integrated into your existing EF Core workflows. Trusted by 5,000+ developers since 2014. Ready to boost your performance? **<a href="https://entityframework-extensions.net/" style="color: #a5b4fc; text-decoration: underline;">Explore the solution</a>**</p>
<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• With Postman’s AI Agent Builder making waves, I can’t wait to see what’s in store at <a href="https://www.postman.com/postcon/?utm_campaign=fy26_global_postcon_25&utm_medium=influencer_pd&utm_source=stefan-djokic&utm_content=save-the-date-influencers" style="color: #a5b4fc; text-decoration: underline;">POST/CON</a> this year. Last year was phenomenal - you remember I attended it in SF. Sign up for updates now! Save the date and join the mailing list <a href="https://www.postman.com/postcon/?utm_campaign=fy26_global_postcon_25&utm_medium=influencer_pd&utm_source=stefan-djokic&utm_content=save-the-date-influencers" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
  
What is a Discriminator in Entity Framework?
In Entity Framework (EF) Core, a **discriminator** is a special column used in **Table Per Hierarchy (TPH)** inheritance to differentiate between multiple entity types stored in a single table.
How Discriminators Work?
When using **inheritance** in EF Core, all derived types are mapped to the same database table. To distinguish between different entity types, EF Core automatically adds a **discriminator column** in the table.
The discriminator column stores a **string or an integer value** representing the type of entity.
Let's see it through example.

## Discriminator in EF Core – Table Per Hierarchy (TPH)

Example: Single Table Inheritance

Imagine you have a **Base Class Vehicle** and two derived classes: Car and Bike.

Step 1: Define the Entities

```csharp

public class Vehicle
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
}

public class Car : Vehicle
{
    public int NumberOfDoors { get; set; }
}

public class Bike : Vehicle
{
    public bool HasGear { get; set; }
}
```

Step 2: Configure EF Core in DbContext
EF Core automatically adds a Discriminator column when you use **TPH inheritance**.

```csharp

public class AppDbContext : DbContext
{
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Car> Cars { get; set; }
    public DbSet<Bike> Bikes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("your_connection_string");
    }
}
```

Step 3: Migration and Database Table
Run the following commands:

```csharp

dotnet ef migrations add InitialCreate
dotnet ef database update
```
Generated Table (Single Table for All Entities)

![Generated Table](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table.png)
Discriminator: Determines if the row is for Car or Bike.
NULL values exist for columns that are **not applicable** to that entity.

## Customizing the Discriminator in EF Core

By default, EF Core names the column Discriminator. 
However, you can customize its name and values.
Example: Custom Discriminator Name and Values
Modify OnModelCreating in AppDbContext:

```csharp

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Vehicle>()
        .HasDiscriminator<string>("VehicleType")
        .HasValue<Car>("CarType")
        .HasValue<Bike>("BikeType");
}
```

Effect on Database Table
![Generated Table with types](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table-with-types.png)

## Querying Entities with Discriminator
 
EF Core **automatically filters** data based on the discriminator.
Query All Vehicles

```csharp

var vehicles = context.Vehicles.ToList();
```

Returns **all** records (both Cars and Bikes).

Query Only Cars
```csharp

var cars = context.Cars.ToList();
```

EF Core translates this into:
```csharp

SELECT * FROM Vehicles WHERE VehicleType = 'CarType';
```
Query Only Bikes
```csharp

var bikes = context.Bikes.ToList();
```
EF Core translates this into:
```csharp

SELECT * FROM Vehicles WHERE VehicleType = 'BikeType';
```

## Changing the Discriminator at Runtime

Sometimes, you may want to **change** the discriminator dynamically.
Example: Convert a Bike to a Car
```csharp

var bike = context.Bikes.FirstOrDefault(b => b.Id == 2);
if (bike != null)
{
    var car = new Car
    {
        Id = bike.Id, // Keep the same ID
        Model = bike.Model,
        NumberOfDoors = 4
    };

    context.Bikes.Remove(bike);
    context.Cars.Add(car);
    context.SaveChanges();
}
```
The discriminator column value changes from 'BikeType' to 'CarType'.

##  Using Enum as Discriminator

EF Core 8 and 9 support enums as discriminator values.
Step 1: Define an Enum

```csharp

public enum VehicleType
{
    Unknown = 0,
    Car = 1,
    Bike = 2
}
```

Step 2: Apply Discriminator with Enum

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Vehicle>()
        .HasDiscriminator<VehicleType>("VehicleType")
        .HasValue<Car>(VehicleType.Car)
        .HasValue<Bike>(VehicleType.Bike);
}
```
Effect on Database Table:
![Generated Table enum](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table-with-enum.png)

## Performance Considerations of Discriminators

Advantages of TPH (Discriminator-Based) Inheritance:
1. Faster queries (single table, no joins).
2. Easier schema management (no multiple tables).
Disadvantages of TPH:
1. Sparse columns (many NULL values in the table).
2. Potential table bloat (storing different types of data in a single table).
Alternative: Table Per Type (TPT)
Instead of using a discriminator, you can use TPT where each entity has its own table.
```csharp

modelBuilder.Entity<Car>().ToTable("Cars");
modelBuilder.Entity<Bike>().ToTable("Bikes");
```

## Wrapping Up

EF Core Discriminators enable Table Per Hierarchy (TPH) inheritance.

The discriminator column is used to differentiate entity types within a single table.

You can customize the discriminator name and values.
EF Core 8 & 9 allow enum-based discriminators.

Performance considerations should guide whether to use TPH (with discriminators) or TPT..

That's all from me today. 

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->

## dream BIG!
