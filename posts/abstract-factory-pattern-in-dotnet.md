---
title: "Abstract Factory Pattern in .NET"
subtitle: "When your app needs to create families of related objects without coupling to their concrete types, the Abstract Factory pattern keeps things clean and extensible."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Abstract Factory design pattern in .NET with real-world C# examples. Discover how to create families of related objects without tight coupling, with practical dependency injection integration."
---

<!--START-->

## Your Code Works on SQL Server. Now Make It Work on PostgreSQL Too.

The project was built for SQL Server. Every repository, every query builder, every connection factory was hardwired to `SqlConnection`, `SqlCommand`, `SqlDataReader`.

Then the client said: "We need PostgreSQL support for our European deployment."

So someone started adding `if` checks everywhere:

```csharp
if (config.Database == "PostgreSQL")
    connection = new NpgsqlConnection(connectionString);
else
    connection = new SqlConnection(connectionString);
```

This worked for connections. Then they needed it for commands. Then for parameters. Then for data readers. The same `if-else` block appeared in 40+ places.

One developer missed one. Production went down in the EU region.

This is what happens when you create related objects without a unified creation strategy.

## The Problem: Scattered Object Creation

Here is a simplified version of what this looks like in code:

```csharp
public class OrderRepository
{
    private readonly string _connectionString;
    private readonly string _provider;

    public OrderRepository(string connectionString, string provider)
    {
        _connectionString = connectionString;
        _provider = provider;
    }

    public async Task<Order> GetByIdAsync(int id)
    {
        // Provider check repeated everywhere
        IDbConnection connection = _provider switch
        {
            "SqlServer" => new SqlConnection(_connectionString),
            "PostgreSQL" => new NpgsqlConnection(_connectionString),
            "MySQL" => new MySqlConnection(_connectionString),
            _ => throw new NotSupportedException()
        };

        IDbCommand command = _provider switch
        {
            "SqlServer" => new SqlCommand(),
            "PostgreSQL" => new NpgsqlCommand(),
            "MySQL" => new MySqlCommand(),
            _ => throw new NotSupportedException()
        };

        // Same pattern for parameters, readers, etc.
        // ...
    }
}
```

Every time you add a new database provider, you touch every repository. Every switch statement grows. And if you mix a `SqlCommand` with an `NpgsqlConnection`, you get a runtime error that no compiler will catch.

These objects are a family. They belong together. Mixing them is a bug.

## Enter the Abstract Factory Pattern

The Abstract Factory gives you an interface for creating families of related objects without specifying their concrete types. Each factory implementation produces objects that work together.

No more `switch` statements. No more mismatched types.

## Building It in .NET

Define the factory interface and a family of products:

```csharp
// The abstract factory - creates a family of related objects
public interface IDatabaseFactory
{
    IDbConnection CreateConnection(string connectionString);
    IDbCommand CreateCommand(string sql, IDbConnection connection);
    IDbParameter CreateParameter(string name, object value);
}

// SQL Server family
public class SqlServerFactory : IDatabaseFactory
{
    public IDbConnection CreateConnection(string connectionString)
        => new SqlConnection(connectionString);

    public IDbCommand CreateCommand(string sql, IDbConnection connection)
        => new SqlCommand(sql, (SqlConnection)connection);

    public IDbParameter CreateParameter(string name, object value)
        => new SqlParameter(name, value);
}

// PostgreSQL family
public class PostgresFactory : IDatabaseFactory
{
    public IDbConnection CreateConnection(string connectionString)
        => new NpgsqlConnection(connectionString);

    public IDbCommand CreateCommand(string sql, IDbConnection connection)
        => new NpgsqlCommand(sql, (NpgsqlConnection)connection);

    public IDbParameter CreateParameter(string name, object value)
        => new NpgsqlParameter(name, value);
}
```

Now the repository depends only on the factory:

```csharp
public class OrderRepository
{
    private readonly IDatabaseFactory _dbFactory;
    private readonly string _connectionString;

    public OrderRepository(IDatabaseFactory dbFactory, string connectionString)
    {
        _dbFactory = dbFactory;
        _connectionString = connectionString;
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        using var connection = _dbFactory.CreateConnection(_connectionString);
        connection.Open();

        using var command = _dbFactory.CreateCommand(
            "SELECT Id, CustomerId, Total FROM Orders WHERE Id = @Id",
            connection);

        command.Parameters.Add(_dbFactory.CreateParameter("@Id", id));

        using var reader = command.ExecuteReader();
        if (reader.Read())
        {
            return new Order
            {
                Id = reader.GetInt32(0),
                CustomerId = reader.GetString(1),
                Total = reader.GetDecimal(2)
            };
        }

        return null;
    }
}
```

The repository has zero knowledge of SQL Server or PostgreSQL. All created objects are guaranteed to be compatible because they come from the same factory.

## Why This Is Better

**Type safety across families.** You can't accidentally create an `NpgsqlCommand` and use it with a `SqlConnection`. The factory guarantees that all objects in the family are compatible.

**Adding a new provider is one class.** Create `MySqlFactory`, register it in DI, done. No existing code changes.

**Testing is straightforward.** Mock `IDatabaseFactory` and return test doubles. Or create an `InMemoryFactory` for integration tests.

## Advanced Usage: DI Registration With Configuration

Wire the right factory based on configuration:

```csharp
builder.Services.AddScoped<IDatabaseFactory>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var provider = config["Database:Provider"];

    return provider switch
    {
        "SqlServer" => new SqlServerFactory(),
        "PostgreSQL" => new PostgresFactory(),
        _ => throw new InvalidOperationException($"Unknown provider: {provider}")
    };
});
```

The `switch` exists exactly once, in the composition root. Every consumer gets the right factory automatically.

## Advanced Usage: UI Component Families

Abstract Factory is not just for databases. Imagine rendering platform-specific UI components:

```csharp
public interface IUIFactory
{
    IButton CreateButton(string text);
    ITextInput CreateTextInput(string placeholder);
    IModal CreateModal(string title, string content);
}

public class MaterialUIFactory : IUIFactory
{
    public IButton CreateButton(string text) => new MaterialButton(text);
    public ITextInput CreateTextInput(string placeholder) => new MaterialTextInput(placeholder);
    public IModal CreateModal(string title, string content) => new MaterialModal(title, content);
}

public class FluentUIFactory : IUIFactory
{
    public IButton CreateButton(string text) => new FluentButton(text);
    public ITextInput CreateTextInput(string placeholder) => new FluentTextInput(placeholder);
    public IModal CreateModal(string title, string content) => new FluentModal(title, content);
}
```

Same pattern, different domain. The consuming code never knows which UI framework is being used.

## When NOT to Use It

**When you only have one family.** If you'll only ever use SQL Server, a factory adds indirection for no reason.

**When families rarely change.** If you haven't added a new provider in years and likely never will, the abstraction isn't earning its keep.

**When products aren't truly related.** Abstract Factory is for objects that must work together. If your objects are independent, use simple Factory Method instead.

## Key Takeaways

- Abstract Factory creates families of related objects that are guaranteed to be compatible
- The single `switch` or configuration check lives in the composition root, not scattered across consumers
- Adding a new family means adding one class, not modifying existing code
- Use it when mixing objects from different families would cause bugs
- Don't use it when you only have one family or the objects aren't truly related

## FAQ

### What is the Abstract Factory pattern in simple terms?

It's a pattern that provides an interface for creating groups of related objects. Instead of creating objects directly, you ask a factory to create them. The factory guarantees all objects it creates are compatible with each other.

### When should I use the Abstract Factory pattern?

Use it when your system needs to work with multiple families of related objects (like database providers, UI themes, or platform-specific components) and you need to ensure objects from different families don't get mixed together.

### Is the Abstract Factory pattern overkill?

For a system that only supports one family of objects and is unlikely to add more, yes. The pattern adds an abstraction layer that's only valuable when you genuinely need to swap between families.

### What is the difference between Factory Method and Abstract Factory?

Factory Method creates a single object and lets subclasses decide the type. Abstract Factory creates an entire family of related objects. Use Factory Method when you need one product, Abstract Factory when you need a consistent set of products.

## Wrapping Up

The Abstract Factory pattern keeps families of objects together and prevents mismatched combinations. When your system needs to support multiple providers, themes, or platforms, it gives you a clean extension point without scattering creation logic across your codebase.

Start with one factory. Add a second only when the real need shows up. The pattern's value comes from the switch, not the abstraction.

If you're working through patterns like this in production and want a deeper dive, I cover related patterns with production-ready C# in my ebook [Design Patterns that Deliver](/design-patterns-that-deliver-ebook).

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->