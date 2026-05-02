---
title: "Visitor Pattern in .NET"
subtitle: "Add new operations to object structures without modifying the classes. The Visitor pattern lets you define new behavior outside the objects it operates on."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Visitor design pattern in .NET with real-world C# examples. Add operations like export, validation, and pricing calculation to class hierarchies without modifying existing code."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## You Need 5 Different Operations on the Same Class Hierarchy

You've built a document model. It has `TextElement`, `ImageElement`, `TableElement`, and `CodeBlockElement`. Clean hierarchy. Each element renders itself.

Then someone needs HTML export. Then PDF export. Then word count. Then accessibility validation. Then SEO analysis.

Do you add 5 methods to every element class?

```csharp
public class TextElement : DocumentElement
{
    public string Content { get; set; }

    public string ToHtml() => $"<p>{Content}</p>";
    public byte[] ToPdf() => PdfRenderer.RenderText(Content);
    public int GetWordCount() => Content.Split(' ').Length;
    public List<string> ValidateAccessibility() => /* ... */;
    public SeoScore AnalyzeSeo() => /* ... */;
}
```

Every new operation means modifying every element class. `TextElement` now knows about HTML, PDF, word counting, accessibility rules, and SEO. It should only know about being text.

And when you add a sixth operation? You touch all four element classes again.

## The Problem: New Operations Require Modifying Existing Classes

The issue is that operations keep accumulating inside the element classes. These classes grow with every new cross-cutting feature. Testing an SEO analyzer requires loading the entire element class. And the dependencies for each operation (PDF library, accessibility rules, SEO configuration) leak into classes that shouldn't know about them.

## Enter the Visitor Pattern

The Visitor pattern separates algorithms from the objects they operate on. Each operation becomes its own class (a visitor). The object structure stays clean — elements just accept visitors and let them do their work.

## Building It in .NET

Define the visitor interface and the accept method:

```csharp
// Visitor interface - one method per element type
public interface IDocumentVisitor
{
    void Visit(TextElement element);
    void Visit(ImageElement element);
    void Visit(TableElement element);
    void Visit(CodeBlockElement element);
}

// Elements accept visitors
public abstract class DocumentElement
{
    public abstract void Accept(IDocumentVisitor visitor);
}

public class TextElement : DocumentElement
{
    public string Content { get; set; } = string.Empty;
    public string FontSize { get; set; } = "16px";

    public override void Accept(IDocumentVisitor visitor) => visitor.Visit(this);
}

public class ImageElement : DocumentElement
{
    public string Src { get; set; } = string.Empty;
    public string AltText { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }

    public override void Accept(IDocumentVisitor visitor) => visitor.Visit(this);
}

public class TableElement : DocumentElement
{
    public List<string> Headers { get; set; } = new();
    public List<List<string>> Rows { get; set; } = new();

    public override void Accept(IDocumentVisitor visitor) => visitor.Visit(this);
}

public class CodeBlockElement : DocumentElement
{
    public string Code { get; set; } = string.Empty;
    public string Language { get; set; } = "csharp";

    public override void Accept(IDocumentVisitor visitor) => visitor.Visit(this);
}
```

Now add operations as visitors — no element classes change:

```csharp
// HTML export visitor
public class HtmlExportVisitor : IDocumentVisitor
{
    private readonly StringBuilder _html = new();

    public string GetResult() => _html.ToString();

    public void Visit(TextElement element)
    {
        _html.AppendLine($"<p style=\"font-size:{element.FontSize}\">{element.Content}</p>");
    }

    public void Visit(ImageElement element)
    {
        _html.AppendLine($"<img src=\"{element.Src}\" alt=\"{element.AltText}\" " +
            $"width=\"{element.Width}\" height=\"{element.Height}\" />");
    }

    public void Visit(TableElement element)
    {
        _html.AppendLine("<table>");
        _html.AppendLine("<tr>" +
            string.Join("", element.Headers.Select(h => $"<th>{h}</th>")) + "</tr>");
        foreach (var row in element.Rows)
        {
            _html.AppendLine("<tr>" +
                string.Join("", row.Select(c => $"<td>{c}</td>")) + "</tr>");
        }
        _html.AppendLine("</table>");
    }

    public void Visit(CodeBlockElement element)
    {
        _html.AppendLine($"<pre><code class=\"language-{element.Language}\">" +
            $"{element.Code}</code></pre>");
    }
}

// Word count visitor
public class WordCountVisitor : IDocumentVisitor
{
    public int TotalWords { get; private set; }

    public void Visit(TextElement element)
    {
        TotalWords += element.Content.Split(' ',
            StringSplitOptions.RemoveEmptyEntries).Length;
    }

    public void Visit(ImageElement element)
    {
        TotalWords += element.AltText.Split(' ',
            StringSplitOptions.RemoveEmptyEntries).Length;
    }

    public void Visit(TableElement element)
    {
        foreach (var row in element.Rows)
            foreach (var cell in row)
                TotalWords += cell.Split(' ',
                    StringSplitOptions.RemoveEmptyEntries).Length;
    }

    public void Visit(CodeBlockElement element)
    {
        // Don't count code as words
    }
}

// Accessibility validation visitor
public class AccessibilityVisitor : IDocumentVisitor
{
    public List<string> Violations { get; } = new();

    public void Visit(TextElement element)
    {
        // Check font size accessibility
        if (element.FontSize == "10px" || element.FontSize == "8px")
            Violations.Add($"Text font size {element.FontSize} may be too small");
    }

    public void Visit(ImageElement element)
    {
        if (string.IsNullOrWhiteSpace(element.AltText))
            Violations.Add($"Image '{element.Src}' is missing alt text");
    }

    public void Visit(TableElement element)
    {
        if (element.Headers.Count == 0)
            Violations.Add("Table is missing header row");
    }

    public void Visit(CodeBlockElement element)
    {
        if (string.IsNullOrWhiteSpace(element.Language))
            Violations.Add("Code block missing language for screen readers");
    }
}
```

Usage:

```csharp
var document = new List<DocumentElement>
{
    new TextElement { Content = "Welcome to the guide" },
    new ImageElement { Src = "diagram.png", AltText = "" },
    new TableElement { Headers = new() { "Name", "Score" }, Rows = new() },
    new CodeBlockElement { Code = "var x = 42;", Language = "csharp" }
};

// Run HTML export
var htmlVisitor = new HtmlExportVisitor();
foreach (var element in document)
    element.Accept(htmlVisitor);
var html = htmlVisitor.GetResult();

// Run accessibility check
var a11yVisitor = new AccessibilityVisitor();
foreach (var element in document)
    element.Accept(a11yVisitor);
// Violations: ["Image 'diagram.png' is missing alt text"]

// Run word count
var wordCounter = new WordCountVisitor();
foreach (var element in document)
    element.Accept(wordCounter);
// TotalWords: 5
```

Three different operations. Zero element classes modified.

## Why This Is Better

**New operations don't touch element classes.** Adding PDF export is creating `PdfExportVisitor`. No existing code changes.

**Each operation is self-contained.** The HTML visitor only contains HTML logic. The accessibility visitor only contains accessibility rules. Clean separation.

**Gather results across the structure.** Visitors accumulate state as they traverse. Word counts, violations, and output all build up naturally.

## Advanced Usage: Pricing Calculator for Shopping Cart

```csharp
public interface ICartItemVisitor
{
    void Visit(PhysicalProduct item);
    void Visit(DigitalProduct item);
    void Visit(SubscriptionProduct item);
}

public class TaxCalculator : ICartItemVisitor
{
    public decimal TotalTax { get; private set; }

    public void Visit(PhysicalProduct item)
    {
        // Physical goods: 20% VAT
        TotalTax += item.Price * 0.20m;
    }

    public void Visit(DigitalProduct item)
    {
        // Digital goods: varies by region
        TotalTax += item.Price * item.RegionalTaxRate;
    }

    public void Visit(SubscriptionProduct item)
    {
        // Subscriptions: reduced rate
        TotalTax += item.MonthlyPrice * 0.10m;
    }
}

public class ShippingCalculator : ICartItemVisitor
{
    public decimal TotalShipping { get; private set; }

    public void Visit(PhysicalProduct item)
    {
        TotalShipping += item.Weight * 0.50m; // weight-based
    }

    public void Visit(DigitalProduct item)
    {
        // No shipping for digital products
    }

    public void Visit(SubscriptionProduct item)
    {
        // No shipping for subscriptions
    }
}
```

Tax, shipping, and any future calculation (loyalty points, carbon footprint) are separate visitors. Product classes stay clean.

## When NOT to Use It

**When the element hierarchy changes frequently.** Adding a new element type (e.g., `VideoElement`) requires adding a `Visit(VideoElement)` method to every existing visitor. If you add elements often, this becomes a burden.

**When there are few operations.** If you only need HTML export and nothing else, putting `ToHtml()` directly in each element is simpler.

**When double dispatch feels confusing.** The `Accept(visitor) → visitor.Visit(this)` indirection confuses developers who aren't familiar with the pattern. On small teams, this overhead in understanding may not be worth it.

## Key Takeaways

- Visitor separates operations from the objects they operate on
- Adding a new operation is creating a new visitor class — no existing classes change
- Works best when the element hierarchy is stable but operations change frequently
- Uses double dispatch: element calls `visitor.Visit(this)` to route to the correct overload
- Don't use it when elements change frequently — every new element modifies every visitor

## FAQ

### What is the Visitor pattern in simple terms?

The Visitor pattern lets you add new operations to a class hierarchy without modifying the classes. You create a "visitor" class for each operation. Each class in the hierarchy accepts the visitor and lets it perform the operation.

### When should I use the Visitor pattern?

When you have a stable set of classes (elements) but frequently need new operations on them. Document processing, AST traversal, and tax/pricing calculations are typical use cases.

### Is the Visitor pattern overkill?

For one or two operations on a small hierarchy, yes. The double dispatch mechanism adds complexity. It pays off when you have 4+ operations and the element hierarchy rarely changes.

### What are alternatives to the Visitor pattern?

Pattern matching with `switch` expressions in C# can handle type-based dispatch without the Visitor infrastructure. Extension methods can add behavior without modifying classes. For simple cases, virtual methods on the base class work fine.

## Wrapping Up

The Visitor pattern trades one kind of change for another. Adding operations is easy. Adding element types is hard. That's the tradeoff.

If your class hierarchy is stable and operations keep growing, Visitor keeps your element classes clean and your operations organized. If elements change often, use pattern matching or virtual methods instead.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->