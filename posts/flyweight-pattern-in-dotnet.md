---
title: "Flyweight Pattern in .NET"
subtitle: "Share common state between thousands of objects to slash memory usage. The Flyweight pattern separates intrinsic and extrinsic state for massive memory savings."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Flyweight design pattern in .NET with real-world C# examples. Reduce memory consumption by sharing common object state across thousands of instances in game engines, text editors, and caching systems."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## Your Map Renderer Just Ate 4 GB of RAM

You're building a game-like map visualization. The map has 500,000 tiles. Each tile has a terrain type (grass, water, mountain, sand), a sprite texture, a color palette, movement cost, and a set of rendering rules.

You create a `Tile` object for each cell. Each tile stores its own copy of the terrain data. Even though 200,000 tiles are all "grass" with the exact same texture, color, and movement cost.

Each terrain data object is 8 KB. Half a million tiles × 8 KB = 4 GB. For data that's 95% duplicated.

The app crashes on any machine with less than 8 GB of RAM.

## The Problem: Duplicating Shared State Across Objects

```csharp
public class Tile
{
    // Intrinsic state - same for all "grass" tiles
    public string TerrainType { get; set; }
    public byte[] SpriteTexture { get; set; }    // 4 KB each
    public Color[] ColorPalette { get; set; }     // 2 KB each
    public float MovementCost { get; set; }
    public RenderingRules Rules { get; set; }     // 2 KB each

    // Extrinsic state - unique per tile
    public int X { get; set; }
    public int Y { get; set; }
    public bool IsExplored { get; set; }
}

// Creating the map
var map = new Tile[500_000];
for (int i = 0; i < 500_000; i++)
{
    var terrain = GetTerrainForPosition(i);
    map[i] = new Tile
    {
        TerrainType = terrain,
        SpriteTexture = LoadTexture(terrain),    // Loaded fresh each time!
        ColorPalette = LoadPalette(terrain),     // Duplicated each time!
        MovementCost = GetMovementCost(terrain),
        Rules = LoadRules(terrain),              // Same data, new object
        X = i % width,
        Y = i / width,
        IsExplored = false
    };
}
```

500,000 objects where only 4-5 unique terrain configurations exist. You're storing the same sprite texture 200,000 times.

## Enter the Flyweight Pattern

The Flyweight pattern shares common state (intrinsic) across many objects while keeping unique state (extrinsic) separate. Instead of 500,000 copies of terrain data, you store 5 and reference them.

## Building It in .NET

Separate shared and unique state:

```csharp
// Flyweight: shared terrain data (intrinsic state)
public class TerrainType
{
    public string Name { get; }
    public byte[] SpriteTexture { get; }
    public Color[] ColorPalette { get; }
    public float MovementCost { get; }
    public RenderingRules Rules { get; }

    public TerrainType(string name, byte[] texture, Color[] palette,
        float movementCost, RenderingRules rules)
    {
        Name = name;
        SpriteTexture = texture;
        ColorPalette = palette;
        MovementCost = movementCost;
        Rules = rules;
    }

    public void Render(int x, int y, bool isExplored)
    {
        // Use shared state + passed-in extrinsic state
        var opacity = isExplored ? 1.0f : 0.3f;
        // Render sprite at (x, y) with opacity...
    }
}

// Flyweight Factory: ensures sharing
public class TerrainFactory
{
    private readonly Dictionary<string, TerrainType> _terrains = new();

    public TerrainType GetTerrain(string name)
    {
        if (!_terrains.TryGetValue(name, out var terrain))
        {
            // Create only once per type
            terrain = name switch
            {
                "grass" => new TerrainType("grass", LoadTexture("grass"),
                    LoadPalette("grass"), 1.0f, GrassRules()),
                "water" => new TerrainType("water", LoadTexture("water"),
                    LoadPalette("water"), 3.0f, WaterRules()),
                "mountain" => new TerrainType("mountain", LoadTexture("mountain"),
                    LoadPalette("mountain"), 5.0f, MountainRules()),
                _ => throw new ArgumentException($"Unknown terrain: {name}")
            };

            _terrains[name] = terrain;
        }

        return terrain;
    }
}

// Lightweight tile - only extrinsic state
public struct Tile
{
    public TerrainType Terrain { get; }  // Reference, not copy
    public int X { get; }
    public int Y { get; }
    public bool IsExplored { get; set; }

    public Tile(TerrainType terrain, int x, int y)
    {
        Terrain = terrain;
        X = x;
        Y = y;
        IsExplored = false;
    }
}
```

Now build the map efficiently:

```csharp
var factory = new TerrainFactory();
var map = new Tile[500_000];

for (int i = 0; i < 500_000; i++)
{
    var terrainName = GetTerrainForPosition(i);
    // All "grass" tiles share the SAME TerrainType instance
    var terrain = factory.GetTerrain(terrainName);

    map[i] = new Tile(terrain, i % width, i / width);
}

// Memory: 5 TerrainType objects (~40 KB total)
//       + 500,000 Tile structs (reference + 2 ints + bool = ~10 bytes each ≈ 5 MB)
// Total: ~5 MB instead of 4 GB
```

From 4 GB to 5 MB. Same functionality.

## Why This Is Better

**Massive memory reduction.** Shared state is stored once. Thousands or millions of objects hold a reference instead of a copy.

**Faster object creation.** No loading textures or building palettes for each tile. The factory returns a cached instance.

**Thread-safe by default.** Flyweight objects are immutable (intrinsic state doesn't change). Safe to share across threads without locks.

## Advanced Usage: String Interning in .NET

.NET already uses the Flyweight pattern internally. `string.Intern()` is a flyweight factory:

```csharp
// Without interning: two separate string objects in memory
string a = new string("hello".ToCharArray());
string b = new string("hello".ToCharArray());
Console.WriteLine(ReferenceEquals(a, b)); // false

// With interning: same object in memory
string c = string.Intern(a);
string d = string.Intern(b);
Console.WriteLine(ReferenceEquals(c, d)); // true
```

You can apply the same idea to any frequently repeated object:

```csharp
public class IconFactory
{
    private readonly ConcurrentDictionary<string, Icon> _icons = new();

    public Icon GetIcon(string name)
    {
        return _icons.GetOrAdd(name, n =>
        {
            // Expensive: load from disk, decode image
            var bytes = File.ReadAllBytes($"icons/{n}.png");
            return new Icon(n, bytes);
        });
    }
}
```

## Advanced Usage: Flyweight for Formatting Runs in a Text Editor

Text editors don't store font/size/color per character. They store formatting "runs":

```csharp
// Flyweight: shared character style
public class CharacterStyle
{
    public string FontFamily { get; }
    public int FontSize { get; }
    public Color Color { get; }
    public bool IsBold { get; }
    public bool IsItalic { get; }

    public CharacterStyle(string font, int size, Color color,
        bool bold, bool italic)
    {
        FontFamily = font;
        FontSize = size;
        Color = color;
        IsBold = bold;
        IsItalic = italic;
    }
}

public class StyleFactory
{
    private readonly Dictionary<string, CharacterStyle> _styles = new();

    public CharacterStyle GetStyle(string font, int size, Color color,
        bool bold, bool italic)
    {
        var key = $"{font}:{size}:{color}:{bold}:{italic}";

        if (!_styles.TryGetValue(key, out var style))
        {
            style = new CharacterStyle(font, size, color, bold, italic);
            _styles[key] = style;
        }

        return style;
    }
}

// A document with 100,000 characters might only have 15 unique styles
// Each character just stores a reference to its CharacterStyle flyweight
public struct FormattedChar
{
    public char Character;
    public CharacterStyle Style;  // Shared flyweight reference
}
```

100,000 characters with 15 unique styles = 15 style objects instead of 100,000.

## When NOT to Use It

**When objects are mostly unique.** If each object has different state with little sharing, the Flyweight adds complexity without saving memory.

**When memory isn't a concern.** If you're dealing with hundreds of objects, not hundreds of thousands, the optimization is premature.

**When intrinsic state mutates.** Flyweight objects must be immutable to be safely shared. If the "shared" state changes per context, the pattern breaks.

## Key Takeaways

- Flyweight separates shared (intrinsic) state from unique (extrinsic) state
- A factory ensures each unique combination is created only once
- Memory savings can be orders of magnitude (GB → MB) for large datasets
- Flyweight objects must be immutable for safe sharing
- .NET already uses this pattern internally (string interning, type caching)
- Don't use it when objects are mostly unique or the dataset is small

## FAQ

### What is the Flyweight pattern in simple terms?

The Flyweight pattern shares common data between many similar objects instead of storing it in each one. A factory ensures only one copy of each unique variant exists. Objects hold a reference to the shared data plus their own unique state.

### When should I use the Flyweight pattern?

When your application creates thousands or millions of similar objects that share most of their data. Common in game development (tiles, particles), text editors (character formatting), and caching systems.

### Is the Flyweight pattern overkill?

For hundreds of objects with moderate data, yes. The pattern pays off when you have thousands+ objects with significant shared state. Profile memory usage first before applying it.

### What are alternatives to the Flyweight pattern?

Object pooling reuses objects instead of creating new ones. Value types (structs) reduce allocation overhead. Data-oriented design with arrays of primitives (struct-of-arrays) can be more cache-friendly. For simple deduplication, `Dictionary` or `HashSet` may be sufficient.

## Wrapping Up

The Flyweight pattern is a performance pattern. You don't reach for it because the code is messy — you reach for it because the memory profile is unacceptable. Profile first. Identify the shared state. Extract it into a flyweight. Let the factory manage instances.

Most developers never need it. But when you do — when millions of objects are eating your memory — it transforms the application.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->