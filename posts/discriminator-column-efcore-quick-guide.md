---
title: "Discriminator Column in EF Core: A Quick Guide"
subtitle: "In Entity Framework (EF) Core, a discriminator is a special column used in Table Per Hierarchy (TPH) inheritance to differentiate between multiple entity types stored in a single table."
date: "Feb 17 2025"
category: "Entity Framework"
readTime: "Read Time: 4 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "In Entity Framework (EF) Core, a discriminator is a special column used in Table Per Hierarchy (TPH) inheritance to differentiate between multiple entity types stored in a single table."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### **• Struggling with slow EF Core performance?**
##### Unlock up to 14x faster operations and cut execution time by 94% with [high-performance library for EF Core](https://entityframework-extensions.net/).  Seamlessly enhance your app with Bulk Insert, Update, Delete, and Merge—fully integrated into your existing EF Core workflows.
##### Trusted by 5,000+ developers since 2014. Ready to boost your performance? **[Explore the solution](https://entityframework-extensions.net/)**
&nbsp;  
##### • With Postman’s AI Agent Builder making waves, I can’t wait to see what’s in store at [POST/CON](https://www.postman.com/postcon/?utm_campaign=fy26_global_postcon_25&utm_medium=influencer_pd&utm_source=stefan-djokic&utm_content=save-the-date-influencers) this year. Last year was phenomenal - you remember I attended it in SF. Sign up for updates now! Save the date and join the mailing list [here](https://www.postman.com/postcon/?utm_campaign=fy26_global_postcon_25&utm_medium=influencer_pd&utm_source=stefan-djokic&utm_content=save-the-date-influencers).
&nbsp;   

<!--START-->

&nbsp; &nbsp; 
### The Background
&nbsp; &nbsp; 
##### **What is a Discriminator in Entity Framework?**
&nbsp;
##### In Entity Framework (EF) Core, a **discriminator** is a special column used in **Table Per Hierarchy (TPH)** inheritance to differentiate between multiple entity types stored in a single table.
&nbsp;
##### **How Discriminators Work?**
&nbsp;
##### When using **inheritance** in EF Core, all derived types are mapped to the same database table. To distinguish between different entity types, EF Core automatically adds a **discriminator column** in the table.
&nbsp;
##### The discriminator column stores a **string or an integer value** representing the type of entity.
&nbsp;
##### Let's see it through example.

&nbsp; 
&nbsp; 
### Discriminator in EF Core – Table Per Hierarchy (TPH)
&nbsp; 
&nbsp; 

##### **Example: Single Table Inheritance**
&nbsp; 

##### Imagine you have a **Base Class Vehicle** and two derived classes: Car and Bike.
&nbsp; 

##### **Step 1: Define the Entities**

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
&nbsp; 

##### **Step 2: Configure EF Core in DbContext**
&nbsp; 
##### EF Core automatically adds a Discriminator column when you use **TPH inheritance**.

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
&nbsp; 

##### **Step 3: Migration and Database Table**
&nbsp; 
##### Run the following commands:

```csharp

dotnet ef migrations add InitialCreate
dotnet ef database update
```
&nbsp; 
##### **Generated Table (Single Table for All Entities)**

![Generated Table](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table.png)
&nbsp; 
##### Discriminator: Determines if the row is for Car or Bike.
##### NULL values exist for columns that are **not applicable** to that entity.

&nbsp; 
&nbsp; 
### Customizing the Discriminator in EF Core
&nbsp; 
&nbsp; 

##### By default, EF Core names the column Discriminator. 
##### However, you can customize its name and values.
&nbsp; 
##### **Example: Custom Discriminator Name and Values**
&nbsp; 
##### Modify OnModelCreating in AppDbContext:

```csharp

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Vehicle>()
        .HasDiscriminator<string>("VehicleType")
        .HasValue<Car>("CarType")
        .HasValue<Bike>("BikeType");
}
```
&nbsp; 

##### **Effect on Database Table**
![Generated Table with types](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table-with-types.png)


&nbsp; 
&nbsp; 
### Querying Entities with Discriminator
&nbsp; 
&nbsp; 
 
##### EF Core **automatically filters** data based on the discriminator.
&nbsp; 
##### **Query All Vehicles**

```csharp

var vehicles = context.Vehicles.ToList();
```

##### Returns **all** records (both Cars and Bikes).
&nbsp; 

##### ** Query Only Cars**
```csharp

var cars = context.Cars.ToList();
```
&nbsp; 

##### EF Core translates this into:
```csharp

SELECT * FROM Vehicles WHERE VehicleType = 'CarType';
```
&nbsp; 
##### **Query Only Bikes**
```csharp

var bikes = context.Bikes.ToList();
```
&nbsp; 
##### EF Core translates this into:
```csharp

SELECT * FROM Vehicles WHERE VehicleType = 'BikeType';
```

&nbsp; 
&nbsp; 
### Changing the Discriminator at Runtime
&nbsp; 
&nbsp; 


##### Sometimes, you may want to **change** the discriminator dynamically.
&nbsp; 
##### **Example: Convert a Bike to a Car**
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
&nbsp; 
##### The discriminator column value changes from 'BikeType' to 'CarType'.

&nbsp; 
&nbsp; 
###  Using Enum as Discriminator
&nbsp; 
&nbsp; 

##### EF Core 8 and 9 support enums as discriminator values.
&nbsp; 
##### **Step 1: Define an Enum**

```csharp

public enum VehicleType
{
    Unknown = 0,
    Car = 1,
    Bike = 2
}
```
&nbsp; 

##### **Step 2: Apply Discriminator with Enum**

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Vehicle>()
        .HasDiscriminator<VehicleType>("VehicleType")
        .HasValue<Car>(VehicleType.Car)
        .HasValue<Bike>(VehicleType.Bike);
}
```
&nbsp; 
##### Effect on Database Table:
![Generated Table enum](/images/blog/posts/discriminator-column-efcore-quick-guide/generated-table-with-enum.png)

&nbsp; 
&nbsp; 
### Performance Considerations of Discriminators
&nbsp; 
&nbsp; 

##### **Advantages of TPH (Discriminator-Based) Inheritance:**
##### 1. Faster queries (single table, no joins).
##### 2. Easier schema management (no multiple tables).
&nbsp; 
##### **Disadvantages of TPH:**
##### 1. Sparse columns (many NULL values in the table).
##### 2. Potential table bloat (storing different types of data in a single table).
&nbsp; 
##### **Alternative: Table Per Type (TPT)**
##### Instead of using a discriminator, you can use TPT where each entity has its own table.
```csharp

modelBuilder.Entity<Car>().ToTable("Cars");
modelBuilder.Entity<Bike>().ToTable("Bikes");
```

&nbsp;
&nbsp;
### Wrapping Up
&nbsp;
&nbsp;

##### EF Core Discriminators enable Table Per Hierarchy (TPH) inheritance.
&nbsp;

##### The discriminator column is used to differentiate entity types within a single table.
&nbsp;

##### You can customize the discriminator name and values.
##### EF Core 8 & 9 allow enum-based discriminators.
&nbsp;

##### Performance considerations should guide whether to use TPH (with discriminators) or TPT..
&nbsp;

##### That's all from me today. 
&nbsp;

##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->

## <b > dream BIG! </b>