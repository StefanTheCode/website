---
title: "Memento Pattern in .NET"
subtitle: "Save and restore object state without exposing internals. The Memento pattern captures snapshots so you can roll back to any previous state."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Memento design pattern in .NET with real-world C# examples. Implement undo, versioning, and state rollback for editors, forms, and configuration management."
---

<!--START-->

## The Form That Lost Everything

Your multi-step wizard form collects 15 fields across 4 pages. The user fills in personal details, address, payment info, and preferences. On the last page, they click "Back" to change their address.

The form renders page 3. All the data is gone. The previous page state was never saved.

So you add a `Dictionary<string, object>` to hold form values. But when the user clicks "Back" twice and then "Next" again, you're not sure which version of the data is current. And if they want to discard changes and go back to what they had three steps ago? No chance.

You need snapshots. A way to save state at any point and restore it later.

## The Problem: No Way to Roll Back

```csharp
public class WizardForm
{
    public string Name { get; set; }
    public string Email { get; set; }
    public Address ShippingAddress { get; set; }
    public PaymentInfo Payment { get; set; }
    public Dictionary<string, bool> Preferences { get; set; }

    // How do you save "the state at step 2"?
    // How do you restore it?
    // How do you keep multiple snapshots?
}
```

You could clone the object, but then consumers need to know every property. You could serialize to JSON, but you lose type safety. You could expose all internal state via public properties, but that breaks encapsulation.

The object should save and restore its own state. Without the outside world knowing what that state looks like.

## Enter the Memento Pattern

The Memento pattern captures an object's internal state in a snapshot (memento) that can be stored externally and used later to restore the object. The key: the memento is opaque. Nobody except the originator can read or modify it.

## Building It in .NET

Three roles: the Originator (object being saved), the Memento (the snapshot), and the Caretaker (manages snapshots).

```csharp
// Memento - opaque state snapshot
public class FormMemento
{
    // Internal state - only the originator understands this
    internal string SerializedState { get; }
    public DateTime SavedAt { get; }
    public string Label { get; }

    internal FormMemento(string serializedState, string label)
    {
        SerializedState = serializedState;
        SavedAt = DateTime.UtcNow;
        Label = label;
    }
}

// Originator - the object that saves and restores itself
public class WizardForm
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Address ShippingAddress { get; set; } = new();
    public PaymentInfo Payment { get; set; } = new();
    public Dictionary<string, bool> Preferences { get; set; } = new();

    public FormMemento Save(string label)
    {
        // Serialize internal state - only this class knows the format
        var state = JsonSerializer.Serialize(new FormState
        {
            Name = Name,
            Email = Email,
            ShippingAddress = ShippingAddress,
            Payment = Payment,
            Preferences = Preferences
        });

        return new FormMemento(state, label);
    }

    public void Restore(FormMemento memento)
    {
        var state = JsonSerializer.Deserialize<FormState>(memento.SerializedState)!;

        Name = state.Name;
        Email = state.Email;
        ShippingAddress = state.ShippingAddress;
        Payment = state.Payment;
        Preferences = state.Preferences;
    }

    // Private state container - never exposed
    private class FormState
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Address ShippingAddress { get; set; } = new();
        public PaymentInfo Payment { get; set; } = new();
        public Dictionary<string, bool> Preferences { get; set; } = new();
    }
}
```

The Caretaker manages the history:

```csharp
// Caretaker - manages memento history
public class FormHistory
{
    private readonly Stack<FormMemento> _history = new();
    private readonly Stack<FormMemento> _future = new();

    public void Save(FormMemento memento)
    {
        _history.Push(memento);
        _future.Clear();
    }

    public FormMemento? Undo()
    {
        if (_history.Count == 0) return null;
        var memento = _history.Pop();
        _future.Push(memento);
        return _history.Count > 0 ? _history.Peek() : null;
    }

    public FormMemento? Redo()
    {
        if (_future.Count == 0) return null;
        var memento = _future.Pop();
        _history.Push(memento);
        return memento;
    }

    public IEnumerable<(string Label, DateTime SavedAt)> GetHistory()
        => _history.Select(m => (m.Label, m.SavedAt));
}
```

Usage in the wizard:

```csharp
var form = new WizardForm();
var history = new FormHistory();

// Step 1: Personal info
form.Name = "John Doe";
form.Email = "john@example.com";
history.Save(form.Save("Step 1 - Personal Info"));

// Step 2: Address
form.ShippingAddress = new Address { City = "Prague", Country = "CZ" };
history.Save(form.Save("Step 2 - Address"));

// Step 3: User changes mind, go back
var previous = history.Undo();
if (previous != null) form.Restore(previous);
// form.ShippingAddress is back to default, Name and Email preserved

// Step 3: Redo the address
var next = history.Redo();
if (next != null) form.Restore(next);
// Address is "Prague" again
```

## Why This Is Better

**Encapsulation preserved.** The outside world handles opaque mementos. Only `WizardForm` knows how to serialize and deserialize its state.

**Multiple snapshots.** Store as many mementos as you need. Compare states, branch history, or implement persistent undo.

**Clean separation.** The caretaker manages when to save. The originator manages what to save. Neither knows about the other's internals.

## Advanced Usage: Configuration Rollback

Track configuration changes with rollback capability:

```csharp
public class AppConfiguration
{
    public string ConnectionString { get; set; } = string.Empty;
    public int MaxRetries { get; set; }
    public TimeSpan Timeout { get; set; }
    public Dictionary<string, string> FeatureFlags { get; set; } = new();

    public ConfigMemento CreateSnapshot(string reason)
    {
        return new ConfigMemento(
            JsonSerializer.Serialize(this),
            reason,
            DateTime.UtcNow);
    }

    public void RestoreFrom(ConfigMemento memento)
    {
        var snapshot = JsonSerializer.Deserialize<AppConfiguration>(
            memento.SerializedState)!;

        ConnectionString = snapshot.ConnectionString;
        MaxRetries = snapshot.MaxRetries;
        Timeout = snapshot.Timeout;
        FeatureFlags = snapshot.FeatureFlags;
    }
}

public class ConfigManager
{
    private readonly AppConfiguration _config;
    private readonly List<ConfigMemento> _versions = new();

    public void UpdateConfig(Action<AppConfiguration> update, string reason)
    {
        // Save before changing
        _versions.Add(_config.CreateSnapshot(reason));
        update(_config);
    }

    public void Rollback(int versionsBack = 1)
    {
        var index = _versions.Count - versionsBack;
        if (index >= 0)
            _config.RestoreFrom(_versions[index]);
    }
}
```

## Advanced Usage: Game Save System

```csharp
public class GameState
{
    public int Level { get; set; }
    public int Health { get; set; }
    public int Score { get; set; }
    public Vector3 Position { get; set; }
    public List<string> Inventory { get; set; } = new();

    public GameSave SaveGame(string slotName)
    {
        var data = JsonSerializer.Serialize(this);
        return new GameSave(slotName, data, DateTime.UtcNow);
    }

    public void LoadGame(GameSave save)
    {
        var state = JsonSerializer.Deserialize<GameState>(save.Data)!;
        Level = state.Level;
        Health = state.Health;
        Score = state.Score;
        Position = state.Position;
        Inventory = new List<string>(state.Inventory);
    }
}

// Multiple save slots
var saves = new Dictionary<string, GameSave>();
saves["auto"] = gameState.SaveGame("auto");
saves["manual-1"] = gameState.SaveGame("manual-1");

// Load from a save
gameState.LoadGame(saves["manual-1"]);
```

## When NOT to Use It

**When state is trivially small.** If your object has 2 properties, just save them directly. The Memento infrastructure is overkill.

**When state is extremely large.** Saving full snapshots of a 100 MB object graph burns memory fast. Consider saving only deltas (changes) instead of full snapshots.

**When the object graph has circular references.** Serialization-based mementos struggle with circular dependencies. You'll need custom serialization logic.

## Key Takeaways

- Memento captures object state as an opaque snapshot that can be restored later
- The originator creates and restores mementos; the caretaker stores them
- Encapsulation is preserved — only the originator understands the memento's contents
- Use it for undo/redo, form history, configuration rollback, and save systems
- Watch memory usage when storing many snapshots of large objects

## FAQ

### What is the Memento pattern in simple terms?

The Memento pattern saves a snapshot of an object's state so you can restore it later. Like pressing "Save" in a game — you can always go back to that point. The snapshot is opaque: only the original object can read it.

### When should I use the Memento pattern?

When you need undo/redo functionality, state history, rollback capabilities, or save/load features. Common in editors, wizards, configuration managers, and games.

### Is the Memento pattern overkill?

For simple objects with 1-2 properties, yes. For objects with complex state that needs reliable rollback, the pattern provides a clean structure. The decision depends on whether you need multiple snapshots and true encapsulation.

### What is the difference between Memento and Command for undo?

The [Command pattern](https://thecodeman.net/posts/command-pattern-in-dotnet) records operations and reverses them. The Memento pattern records state and restores it. Commands are lighter (just the operation), but require each command to implement undo. Mementos are heavier (full state), but restoration is always reliable.

## Wrapping Up

The Memento pattern is your "save point" pattern. Whenever you need to capture state and restore it later — forms, configs, game saves, document editing — Memento gives you a clean structure with proper encapsulation.

Keep your mementos opaque. Let the originator own its serialization. And watch the memory if you're storing hundreds of snapshots.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->