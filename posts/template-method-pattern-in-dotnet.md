---
title: "Template Method Pattern in .NET"
subtitle: "Define the skeleton of an algorithm and let subclasses fill in the steps. The Template Method pattern locks down the workflow while keeping individual steps flexible."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Template Method design pattern in .NET with real-world C# examples. Build extensible data import pipelines, report generators, and ETL workflows using abstract base classes."
---

<!--START-->

## Three Data Importers With the Same Workflow

You built a CSV importer. Read file, validate rows, transform data, save to database, send notification. Five steps, one flow.

Then the team needed a JSON importer. Same five steps, but the reading and parsing logic differs. So someone copied the CSV importer and changed the file reading part. 200 lines of duplicated workflow logic.

Then an XML importer. Another copy. Now you have three importers with identical workflow management — open file, validate, transform, save, notify — duplicated across all three. When someone adds error handling to the CSV importer, the JSON and XML importers don't get the fix.

```csharp
// CsvImporter.cs
public async Task ImportAsync(string filePath)
{
    var data = ReadCsvFile(filePath);     // Different per format
    var valid = ValidateData(data);       // Same everywhere
    var transformed = TransformData(valid); // Different per format
    await SaveToDatabase(transformed);    // Same everywhere
    await SendNotification(filePath);     // Same everywhere
}

// JsonImporter.cs - 80% duplicated
public async Task ImportAsync(string filePath)
{
    var data = ReadJsonFile(filePath);    // Different
    var valid = ValidateData(data);       // Same (copied)
    var transformed = TransformData(valid); // Different
    await SaveToDatabase(transformed);    // Same (copied)
    await SendNotification(filePath);     // Same (copied)
}
```

The workflow is the same. Only 2 of 5 steps vary. But 100% of the code is duplicated.

## The Problem: Duplicated Algorithm Structure

Copy-paste inheritance leads to drift. One importer gets logging. Another gets retry logic. A third gets a new validation step. They diverge silently, and nobody knows which version is "correct."

You want to define the workflow once and let each format only override what's different.

## Enter the Template Method Pattern

The Template Method defines the skeleton of an algorithm in a base class. The overall workflow is fixed. Individual steps are either implemented in the base (shared) or left abstract for subclasses to implement (format-specific).

## Building It in .NET

```csharp
public abstract class DataImporter<T>
{
    // Template Method - defines the workflow
    // Cannot be overridden - the sequence is locked
    public async Task ImportAsync(string filePath)
    {
        Console.WriteLine($"Starting import: {filePath}");

        // Step 1: Read raw data (format-specific)
        var rawData = await ReadDataAsync(filePath);

        // Step 2: Validate (shared, but can be overridden)
        var validData = Validate(rawData);

        // Step 3: Transform (format-specific)
        var entities = Transform(validData);

        // Step 4: Save to database (shared)
        await SaveAsync(entities);

        // Step 5: Hook - optional post-processing
        await OnImportCompletedAsync(filePath, entities.Count);

        Console.WriteLine($"Import complete: {entities.Count} records");
    }

    // Abstract steps - must be implemented by subclasses
    protected abstract Task<List<Dictionary<string, string>>> ReadDataAsync(string filePath);
    protected abstract List<T> Transform(List<Dictionary<string, string>> validData);

    // Virtual steps - shared default, can be overridden
    protected virtual List<Dictionary<string, string>> Validate(
        List<Dictionary<string, string>> rawData)
    {
        return rawData
            .Where(row => row.Values.All(v => !string.IsNullOrWhiteSpace(v)))
            .ToList();
    }

    // Hook - optional for subclasses to implement
    protected virtual Task OnImportCompletedAsync(string filePath, int count)
        => Task.CompletedTask;

    // Shared implementation - same for all
    private async Task SaveAsync(List<T> entities)
    {
        // Batch insert logic shared across all importers
        foreach (var batch in entities.Chunk(100))
        {
            await _repository.BulkInsertAsync(batch);
        }
    }
}
```

Now each format only implements what's different:

```csharp
public class CsvImporter : DataImporter<Product>
{
    protected override async Task<List<Dictionary<string, string>>> ReadDataAsync(
        string filePath)
    {
        var lines = await File.ReadAllLinesAsync(filePath);
        var headers = lines[0].Split(',');

        return lines.Skip(1)
            .Select(line =>
            {
                var values = line.Split(',');
                return headers.Zip(values, (h, v) => (h, v))
                    .ToDictionary(x => x.h.Trim(), x => x.v.Trim());
            })
            .ToList();
    }

    protected override List<Product> Transform(
        List<Dictionary<string, string>> validData)
    {
        return validData.Select(row => new Product
        {
            Name = row["Name"],
            Price = decimal.Parse(row["Price"]),
            SKU = row["SKU"]
        }).ToList();
    }
}

public class JsonImporter : DataImporter<Product>
{
    protected override async Task<List<Dictionary<string, string>>> ReadDataAsync(
        string filePath)
    {
        var json = await File.ReadAllTextAsync(filePath);
        return JsonSerializer.Deserialize<List<Dictionary<string, string>>>(json)!;
    }

    protected override List<Product> Transform(
        List<Dictionary<string, string>> validData)
    {
        return validData.Select(row => new Product
        {
            Name = row["name"],
            Price = decimal.Parse(row["price"]),
            SKU = row["sku"]
        }).ToList();
    }

    // Override validation for JSON-specific rules
    protected override List<Dictionary<string, string>> Validate(
        List<Dictionary<string, string>> rawData)
    {
        var baseValid = base.Validate(rawData);
        // JSON-specific: require "sku" field
        return baseValid.Where(row => row.ContainsKey("sku")).ToList();
    }

    // Use the hook for JSON-specific logging
    protected override async Task OnImportCompletedAsync(string filePath, int count)
    {
        await _auditLog.LogAsync($"JSON import from {filePath}: {count} products");
    }
}
```

Usage:

```csharp
DataImporter<Product> importer = fileExtension switch
{
    ".csv" => new CsvImporter(),
    ".json" => new JsonImporter(),
    ".xml" => new XmlImporter(),
    _ => throw new NotSupportedException()
};

await importer.ImportAsync(filePath);
// Same workflow, different format handling
```

## Why This Is Better

**Workflow defined once.** The five-step sequence is in the base class. Change the order? One place. Add logging between steps? One place.

**Format-specific code is isolated.** `CsvImporter` only deals with CSV parsing. It doesn't know about batch inserts or notifications.

**Hooks for optional customization.** Subclasses can optionally override `OnImportCompletedAsync` without being forced to implement it.

## Advanced Usage: Report Generator Template

```csharp
public abstract class ReportGenerator
{
    public async Task<byte[]> GenerateAsync(ReportRequest request)
    {
        var data = await FetchDataAsync(request);
        var processed = ProcessData(data);
        var formatted = FormatOutput(processed);
        return formatted;
    }

    protected abstract Task<ReportData> FetchDataAsync(ReportRequest request);
    protected abstract ReportData ProcessData(ReportData rawData);
    protected abstract byte[] FormatOutput(ReportData data);
}

public class SalesReportPdf : ReportGenerator
{
    protected override async Task<ReportData> FetchDataAsync(ReportRequest request)
        => await _salesRepo.GetSalesSummaryAsync(request.StartDate, request.EndDate);

    protected override ReportData ProcessData(ReportData rawData)
    {
        // Add calculated columns: margins, growth rates
        rawData.AddColumn("Margin", row => row.Revenue - row.Cost);
        return rawData;
    }

    protected override byte[] FormatOutput(ReportData data)
        => PdfGenerator.Generate(data, "Sales Report Template");
}
```

## Advanced Usage: ETL Pipeline Template

```csharp
public abstract class EtlPipeline<TSource, TTarget>
{
    public async Task RunAsync(CancellationToken ct)
    {
        await BeforeExtractAsync();

        await foreach (var batch in ExtractAsync(ct))
        {
            var transformed = Transform(batch);
            var validated = Validate(transformed);

            if (validated.Count > 0)
                await LoadAsync(validated, ct);

            await OnBatchProcessedAsync(batch.Count, validated.Count);
        }

        await AfterLoadAsync();
    }

    protected abstract IAsyncEnumerable<List<TSource>> ExtractAsync(CancellationToken ct);
    protected abstract List<TTarget> Transform(List<TSource> batch);
    protected abstract Task LoadAsync(List<TTarget> batch, CancellationToken ct);

    protected virtual List<TTarget> Validate(List<TTarget> items) => items;
    protected virtual Task BeforeExtractAsync() => Task.CompletedTask;
    protected virtual Task AfterLoadAsync() => Task.CompletedTask;
    protected virtual Task OnBatchProcessedAsync(int extracted, int loaded) => Task.CompletedTask;
}
```

Subclasses only define extract/transform/load. The pipeline orchestration, batching, and hooks are handled by the base.

## When NOT to Use It

**When the workflow varies between implementations.** If one importer has 5 steps and another has 3, the template method forces a shared structure that doesn't fit.

**When inheritance causes problems.** Template Method relies on inheritance. If your subclasses already extend another class (C# has single inheritance), you can't use it. Consider the Strategy pattern with composition instead.

**When steps are simple enough to inline.** If the "algorithm" is two lines of code, a base class with abstract methods is ceremony for nothing.

## Key Takeaways

- Template Method defines the workflow skeleton in a base class
- Abstract methods force subclasses to implement format-specific steps
- Virtual methods and hooks provide optional customization points
- The workflow sequence is locked — subclasses customize steps, not the order
- Prefer composition (Strategy pattern) when inheritance causes problems

## FAQ

### What is the Template Method pattern in simple terms?

The Template Method pattern defines an algorithm's structure in a base class and lets subclasses override specific steps without changing the overall workflow. The base class says "do A, then B, then C" — subclasses decide how A, B, or C work.

### When should I use the Template Method pattern?

When multiple classes follow the same workflow but differ in specific steps. Data importers, report generators, ETL pipelines, and test fixtures are classic use cases.

### Is the Template Method pattern overkill?

For two classes with a trivial shared workflow, yes. It's worthwhile when 3+ classes share 60%+ of the same algorithm and you want to avoid duplication.

### What is the difference between Template Method and Strategy?

Template Method uses inheritance: the base class controls the workflow and subclasses fill in steps. The [Strategy pattern](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code) uses composition: you inject different algorithms at runtime. Strategy is more flexible; Template Method is simpler when inheritance fits naturally.

## Wrapping Up

The Template Method pattern is the cleanest way to handle "same workflow, different details." Define the algorithm once, let subclasses customize the parts that vary, and never duplicate orchestration logic again.

The key insight: lock down what's shared. Leave open what varies. The base class is the contract.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->