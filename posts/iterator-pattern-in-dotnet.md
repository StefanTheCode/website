---
title: "Iterator Pattern in .NET"
subtitle: "Traverse collections without exposing their internals. The Iterator pattern gives you a uniform way to walk through any data structure."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Iterator design pattern in .NET with real-world C# examples. Build custom iterators with IEnumerable, yield return, and async streams for paginated APIs, tree traversals, and lazy data processing."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## Your Pagination Code Is Everywhere

You're consuming a REST API that returns paginated results. To get all orders, you call page 1, check if there's a next page, call page 2, and repeat. Every caller that needs "all orders" reimplements the same pagination loop:

```csharp
// In the order report service
var allOrders = new List<Order>();
int page = 1;
bool hasMore = true;
while (hasMore)
{
    var response = await _api.GetOrdersAsync(page, pageSize: 50);
    allOrders.AddRange(response.Items);
    hasMore = response.HasNextPage;
    page++;
}

// Same loop in the export service
// Same loop in the analytics service
// Same loop in the sync job
```

Four services, four identical pagination loops. When the API changes its pagination format from `HasNextPage` to `ContinuationToken`, you fix it in four places. Miss one? Incomplete data.

What if consumers could just `foreach` over all orders and never think about pages?

## The Problem: Traversal Logic Duplicated Across Consumers

The issue is that consumers know too much about how the collection is structured. They know about pages, page sizes, continuation tokens, and when to stop. That's the collection's concern, not the consumer's.

## Enter the Iterator Pattern

The Iterator pattern provides a standard way to traverse a collection without exposing its internal structure. In .NET, this is `IEnumerable<T>` and `IEnumerator<T>`. But the pattern goes much deeper than `foreach` over a list.

## Building It in .NET

Create an iterator that hides pagination entirely:

```csharp
public class PaginatedOrderIterator : IAsyncEnumerable<Order>
{
    private readonly IOrderApiClient _api;
    private readonly int _pageSize;

    public PaginatedOrderIterator(IOrderApiClient api, int pageSize = 50)
    {
        _api = api;
        _pageSize = pageSize;
    }

    public async IAsyncEnumerator<Order> GetAsyncEnumerator(
        CancellationToken ct = default)
    {
        int page = 1;
        bool hasMore = true;

        while (hasMore)
        {
            var response = await _api.GetOrdersAsync(page, _pageSize, ct);

            foreach (var order in response.Items)
                yield return order;

            hasMore = response.HasNextPage;
            page++;
        }
    }
}
```

Now consumers just iterate:

```csharp
var orders = new PaginatedOrderIterator(apiClient);

await foreach (var order in orders)
{
    // Process each order - pagination is invisible
    await ProcessOrderAsync(order);
}
```

No pages. No `while` loops. No continuation tokens. The consumer gets orders one at a time and the iterator handles the plumbing.

## Why This Is Better

**Pagination logic exists once.** Change from page numbers to cursor-based pagination? Update one class. All consumers keep working.

**Lazy evaluation.** Orders are fetched page by page. If the consumer stops after 10 orders (using `break` or `.Take(10)`), the remaining pages are never fetched.

**Uniform interface.** `await foreach` works the same whether it's a database query, a paginated API, or a file reader. Consumers don't care about the source.

## Advanced Usage: Custom Iterators With `yield return`

Build iterators for complex data structures like trees:

```csharp
public class TreeNode<T>
{
    public T Value { get; }
    public List<TreeNode<T>> Children { get; } = new();

    public TreeNode(T value) => Value = value;

    // In-order traversal as an iterator
    public IEnumerable<T> TraverseDepthFirst()
    {
        yield return Value;

        foreach (var child in Children)
        {
            foreach (var value in child.TraverseDepthFirst())
                yield return value;
        }
    }

    // Breadth-first traversal
    public IEnumerable<T> TraverseBreadthFirst()
    {
        var queue = new Queue<TreeNode<T>>();
        queue.Enqueue(this);

        while (queue.Count > 0)
        {
            var node = queue.Dequeue();
            yield return node.Value;

            foreach (var child in node.Children)
                queue.Enqueue(child);
        }
    }
}

// Build an org chart
var ceo = new TreeNode<string>("CEO");
var cto = new TreeNode<string>("CTO");
var vpe = new TreeNode<string>("VP Engineering");
cto.Children.Add(vpe);
ceo.Children.Add(cto);

// Same tree, different traversal - consumer doesn't care how
foreach (var name in ceo.TraverseDepthFirst())
    Console.WriteLine(name);
```

Multiple traversal strategies over the same structure. The consumer picks the iteration order; the tree handles the traversal.

## Advanced Usage: Async Streaming From Databases

Use `IAsyncEnumerable` to stream large datasets without loading everything into memory:

```csharp
public class OrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db) => _db = db;

    public async IAsyncEnumerable<Order> GetAllAsync(
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        // EF Core streams rows instead of loading all into memory
        await foreach (var order in _db.Orders
            .AsNoTracking()
            .OrderBy(o => o.CreatedAt)
            .AsAsyncEnumerable()
            .WithCancellation(ct))
        {
            yield return order;
        }
    }

    // Filtered streaming
    public async IAsyncEnumerable<Order> GetByStatusAsync(
        OrderStatus status,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        await foreach (var order in _db.Orders
            .Where(o => o.Status == status)
            .AsNoTracking()
            .AsAsyncEnumerable()
            .WithCancellation(ct))
        {
            yield return order;
        }
    }
}

// Process millions of orders with constant memory
await foreach (var order in repo.GetAllAsync(ct))
{
    await exporter.ExportAsync(order);
    // Only one order in memory at a time
}
```

This is critical for data exports, ETL pipelines, and report generation where loading a million rows into a `List<T>` would blow up memory.

## Advanced Usage: Composable Iterator Pipeline

Chain iterators together like LINQ:

```csharp
public static class AsyncEnumerableExtensions
{
    public static async IAsyncEnumerable<TResult> SelectAsync<T, TResult>(
        this IAsyncEnumerable<T> source,
        Func<T, Task<TResult>> selector,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        await foreach (var item in source.WithCancellation(ct))
            yield return await selector(item);
    }

    public static async IAsyncEnumerable<T> WhereAsync<T>(
        this IAsyncEnumerable<T> source,
        Func<T, Task<bool>> predicate,
        [EnumeratorCancellation] CancellationToken ct = default)
    {
        await foreach (var item in source.WithCancellation(ct))
        {
            if (await predicate(item))
                yield return item;
        }
    }
}

// Composable pipeline
await foreach (var enrichedOrder in apiClient
    .GetAllOrdersAsync()
    .WhereAsync(async o => await fraudService.IsCleanAsync(o))
    .SelectAsync(async o => await enrichmentService.EnrichAsync(o)))
{
    await processAsync(enrichedOrder);
}
```

## When NOT to Use It

**When the built-in collections are enough.** `List<T>`, `Array`, and `Dictionary` already implement `IEnumerable<T>`. Don't create a custom iterator to wrap a list.

**When you need random access.** Iterators move forward only. If you need to jump to index 500 or go backwards, use an indexed collection directly.

**When full materialization is required.** Some operations (sorting, grouping) need all data in memory. An iterator that lazily yields items can't sort them.

## Key Takeaways

- The Iterator pattern provides uniform traversal without exposing collection internals
- `IAsyncEnumerable<T>` and `yield return` make custom iterators trivial in .NET
- Paginated API results should be wrapped in iterators so consumers just `foreach`
- Async streaming keeps memory constant when processing large datasets
- Don't wrap simple collections — use `IEnumerable<T>` directly

## FAQ

### What is the Iterator pattern in simple terms?

The Iterator pattern gives you a standard way to walk through a collection one element at a time without knowing how the collection is structured internally. In .NET, this is `IEnumerable<T>` with `foreach`.

### When should I use a custom iterator?

When the traversal logic is complex (paginated APIs, tree structures) or when you want lazy evaluation over large datasets. If you're just iterating over a list, the built-in `foreach` is already using the Iterator pattern.

### Is the Iterator pattern overkill?

For simple arrays and lists, a custom iterator is unnecessary — they already implement `IEnumerable<T>`. Build custom iterators when the data source is non-trivial: paginated APIs, databases, file streams, or complex data structures.

### What are alternatives to custom iterators?

LINQ queries over existing collections. Reactive Extensions (Rx.NET) for push-based streams. Channels for producer-consumer patterns. For simple pagination, returning a `List<T>` from each page call is simpler (but uses more memory).

## Wrapping Up

The Iterator pattern is so deeply embedded in .NET that most developers use it daily without realizing it. Every `foreach`, every LINQ query, every `await foreach` is the Iterator pattern in action.

The real skill is recognizing when to build a custom iterator: paginated data, complex structures, or large datasets that shouldn't live entirely in memory. `yield return` and `IAsyncEnumerable` make this almost effortless.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->