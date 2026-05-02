---
title: "Prototype Pattern in .NET"
subtitle: "Cloning objects instead of building them from scratch. The Prototype pattern lets you copy existing objects without coupling to their concrete classes."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Prototype design pattern in .NET with real-world C# examples. Clone complex objects efficiently using ICloneable, deep copy strategies, and record types for production-grade duplication logic."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## When Creating an Object Is More Expensive Than Copying One

You're building a document editor. Users can create templates: page layout, fonts, margins, headers, footers, watermarks, paragraph styles. A single template object has 30+ properties and nested child objects.

When a user clicks "New Document from Template", you need a fresh copy. Not a reference to the template. A completely independent copy they can modify without affecting the original.

Building this from scratch every time means re-reading the template from the database, re-applying all the styles, re-building the nested objects. That's slow and fragile.

What if you could just... copy the existing object?

## The Problem: Object Creation Is Complex and Slow

Here's the brute-force approach:

```csharp
public class DocumentService
{
    private readonly ITemplateRepository _repo;

    public async Task<Document> CreateFromTemplateAsync(int templateId)
    {
        var template = await _repo.GetByIdAsync(templateId);

        // Manually copying 30+ properties
        var doc = new Document
        {
            Title = "Untitled",
            PageWidth = template.PageWidth,
            PageHeight = template.PageHeight,
            MarginTop = template.MarginTop,
            MarginBottom = template.MarginBottom,
            MarginLeft = template.MarginLeft,
            MarginRight = template.MarginRight,
            Font = template.Font,
            FontSize = template.FontSize,
            HeaderText = template.HeaderText,
            FooterText = template.FooterText,
            Watermark = template.Watermark,
            // 20 more properties...
            Paragraphs = template.Paragraphs
                .Select(p => new Paragraph
                {
                    Text = p.Text,
                    Style = p.Style,
                    Alignment = p.Alignment
                    // More nested copying...
                })
                .ToList()
        };

        return doc;
    }
}
```

Every time the template gets a new property, this method must be updated. Miss one? Silent bug. And the nested object copying is a minefield for shallow copy mistakes where both documents share the same `Paragraph` list.

## Enter the Prototype Pattern

The Prototype pattern lets you copy existing objects without depending on their concrete classes. The object itself knows how to clone itself, including all its nested state.

## Building It in .NET

Define a prototype interface and a self-cloning document:

```csharp
// Prototype interface
public interface IPrototype<T>
{
    T DeepClone();
}

public class Document : IPrototype<Document>
{
    public string Title { get; set; } = string.Empty;
    public double PageWidth { get; set; }
    public double PageHeight { get; set; }
    public Margins Margins { get; set; } = new();
    public FontSettings Font { get; set; } = new();
    public string? HeaderText { get; set; }
    public string? FooterText { get; set; }
    public WatermarkSettings? Watermark { get; set; }
    public List<Paragraph> Paragraphs { get; set; } = new();

    public Document DeepClone()
    {
        return new Document
        {
            Title = Title,
            PageWidth = PageWidth,
            PageHeight = PageHeight,
            // Clone nested objects - not just copy references
            Margins = Margins.DeepClone(),
            Font = Font.DeepClone(),
            HeaderText = HeaderText,
            FooterText = FooterText,
            Watermark = Watermark?.DeepClone(),
            Paragraphs = Paragraphs.Select(p => p.DeepClone()).ToList()
        };
    }
}

public class Margins : IPrototype<Margins>
{
    public double Top { get; set; }
    public double Bottom { get; set; }
    public double Left { get; set; }
    public double Right { get; set; }

    public Margins DeepClone() => new()
    {
        Top = Top, Bottom = Bottom, Left = Left, Right = Right
    };
}

public class Paragraph : IPrototype<Paragraph>
{
    public string Text { get; set; } = string.Empty;
    public ParagraphStyle Style { get; set; } = new();
    public TextAlignment Alignment { get; set; }

    public Paragraph DeepClone() => new()
    {
        Text = Text,
        Style = Style.DeepClone(),
        Alignment = Alignment
    };
}
```

Now creating from a template is trivial:

```csharp
public class DocumentService
{
    private readonly ITemplateRepository _repo;

    public async Task<Document> CreateFromTemplateAsync(int templateId)
    {
        var template = await _repo.GetByIdAsync(templateId);

        // One line. Deep clone handles everything.
        var doc = template.DeepClone();
        doc.Title = "Untitled";

        return doc;
    }
}
```

The template knows how to clone itself, including all nested objects. The service doesn't need to know the internal structure.

## Why This Is Better

**Encapsulated cloning logic.** The object owns its copy logic. Adding a new property means updating one class, not every place that creates copies.

**Deep copy safety.** Each nested object clones itself. No shared references, no mutation bugs.

**Works with any object graph.** Doesn't matter how deep the nesting goes. Each level handles its own cloning.

## Advanced Usage: Prototype Registry

Cache commonly used prototypes so you don't hit the database every time:

```csharp
public class TemplateRegistry
{
    private readonly ConcurrentDictionary<string, Document> _templates = new();

    public void Register(string name, Document template)
    {
        _templates[name] = template;
    }

    public Document Create(string templateName)
    {
        if (!_templates.TryGetValue(templateName, out var template))
            throw new KeyNotFoundException($"Template '{templateName}' not found");

        // Always return a clone, never the original
        return template.DeepClone();
    }
}

// Register at startup
registry.Register("invoice", invoiceTemplate);
registry.Register("report", reportTemplate);
registry.Register("letter", letterTemplate);

// Create documents instantly from cached prototypes
var invoice = registry.Create("invoice");
```

The registry holds live prototypes in memory. Creating a new document is a clone operation — no database hit, no complex construction.

## Advanced Usage: Serialization-Based Deep Clone

For objects where writing manual `DeepClone()` is impractical, use serialization:

```csharp
public static class CloneExtensions
{
    public static T DeepClone<T>(this T source) where T : class
    {
        var json = JsonSerializer.Serialize(source);
        return JsonSerializer.Deserialize<T>(json)!;
    }
}

// Works on any serializable object
var clone = complexObject.DeepClone();
```

This is slower than manual cloning but requires zero boilerplate. Good for objects that change frequently or have massive property counts. Just make sure all properties are serializable.

## Advanced Usage: Records as Lightweight Prototypes

C# records with `with` expressions give you a built-in shallow prototype mechanism:

```csharp
public record OrderTemplate(
    string Region,
    string Currency,
    decimal TaxRate,
    string ShippingMethod,
    List<string> DefaultTags);

var usTemplate = new OrderTemplate("US", "USD", 0.08m, "USPS", new() { "domestic" });

// 'with' creates a shallow copy with overrides
var caTemplate = usTemplate with { Region = "CA", Currency = "CAD", TaxRate = 0.13m };
```

Be careful: `with` on records is a shallow copy. The `DefaultTags` list is shared between both instances. For deep copies of collections, you still need manual cloning or the serialization approach.

## When NOT to Use It

**When objects are simple to create.** If construction is just setting 3-4 properties, `new` is simpler and more obvious than cloning.

**When objects have circular references.** Deep cloning with circular dependencies is tricky and error-prone. You'll need custom logic or serialization that handles cycles.

**When objects hold unmanaged resources.** Cloning a database connection or file handle doesn't make sense. The Prototype pattern works best for pure data objects.

## Key Takeaways

- Prototype pattern clones existing objects instead of building from scratch
- Deep cloning prevents shared reference bugs between original and copy
- Prototype registries cache commonly used templates for instant creation
- Serialization-based cloning works as a zero-boilerplate alternative
- C# records with `with` expressions provide lightweight shallow prototypes
- Don't use it for simple objects or objects with unmanaged resources

## FAQ

### What is the Prototype pattern in simple terms?

The Prototype pattern creates new objects by copying existing ones. Instead of constructing from scratch with `new`, you clone a fully configured object and customize the copy. The object itself handles the cloning logic.

### When should I use the Prototype pattern?

Use it when object creation is expensive (database calls, complex setup), when you need copies of complex objects with deep nesting, or when you want to create variations of a preconfigured template without repeating construction logic.

### Is the Prototype pattern overkill?

For simple objects with a few properties and no nesting, yes. Just use `new`. The pattern earns its keep when objects are deeply nested, expensive to construct, or frequently duplicated from templates.

### What are alternatives to the Prototype pattern?

The [Builder pattern](https://thecodeman.net/posts/builder-pattern-in-dotnet) works when you want step-by-step construction. Copy constructors are a simpler alternative for flat objects. C# records with `with` expressions offer lightweight shallow copying.

## Wrapping Up

The Prototype pattern is more common than most developers realize. Every time you copy an Excel template, duplicate a Kubernetes deployment config, or fork a Git repo, you're using the Prototype pattern. In .NET, it shows up in document generation, configuration management, and game development.

The key decision is shallow vs. deep clone. Get that wrong and you'll spend hours debugging shared state bugs. Get it right and object creation becomes trivial.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->