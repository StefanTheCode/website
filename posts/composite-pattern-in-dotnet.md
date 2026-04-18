---
title: "Composite Pattern in .NET"
subtitle: "Treat individual objects and groups of objects the same way. The Composite pattern builds tree structures that let clients work uniformly with simple and complex elements."
date: "April 21 2026"
category: "Design Patterns"
readTime: "Read Time: 7 minutes"
meta_description: "Learn the Composite design pattern in .NET with real-world C# examples. Build tree structures for permissions, menus, pricing, and organizational hierarchies using uniform interfaces."
---

<!--START-->

## Your Permission System Worked Until Groups Showed Up

The permission system was straightforward. Each user had a list of permissions. Check if the user has `CanEditOrders`? Look it up in the list.

Then someone added roles. A role is a collection of permissions. Now checking `CanEditOrders` means checking the user's direct permissions AND iterating through all their roles.

Then roles got nested. An "Admin" role includes the "Manager" role, which includes the "Editor" role. Now your permission check is three levels deep with different logic at each level.

The checking code became a nightmare of type-checking and special cases:

```csharp
public bool HasPermission(User user, string permission)
{
    // Check direct permissions
    if (user.Permissions.Contains(permission))
        return true;

    // Check roles
    foreach (var role in user.Roles)
    {
        if (role.Permissions.Contains(permission))
            return true;

        // Check nested roles
        foreach (var nestedRole in role.ChildRoles)
        {
            if (nestedRole.Permissions.Contains(permission))
                return true;

            // What about roles nested 3 levels deep?
            // 4 levels? This doesn't scale.
        }
    }

    return false;
}
```

Every new level of nesting requires another loop. And if the structure changes? Every consumer breaks.

## The Problem: Different Treatment for Leaves and Containers

The core issue is that you're treating single permissions and groups of permissions as fundamentally different things. But from the caller's perspective, the question is always the same: "does this grant access?"

It shouldn't matter whether the answer comes from a single permission, a role, or a deeply nested role hierarchy.

## Enter the Composite Pattern

The Composite pattern lets you compose objects into tree structures and then work with these trees as if they were individual objects. Every node — leaf or container — implements the same interface.

## Building It in .NET

Define a unified interface for permissions:

```csharp
// Common interface for all permission nodes
public interface IPermissionComponent
{
    string Name { get; }
    bool HasPermission(string permission);
    IEnumerable<IPermissionComponent> GetChildren();
}

// Leaf: a single permission
public class Permission : IPermissionComponent
{
    public string Name { get; }

    public Permission(string name) => Name = name;

    public bool HasPermission(string permission)
        => Name.Equals(permission, StringComparison.OrdinalIgnoreCase);

    public IEnumerable<IPermissionComponent> GetChildren()
        => Enumerable.Empty<IPermissionComponent>();
}

// Composite: a group of permissions (a role)
public class PermissionGroup : IPermissionComponent
{
    public string Name { get; }
    private readonly List<IPermissionComponent> _children = new();

    public PermissionGroup(string name) => Name = name;

    public void Add(IPermissionComponent component) => _children.Add(component);

    public void Remove(IPermissionComponent component) => _children.Remove(component);

    public bool HasPermission(string permission)
    {
        // Recursively check all children — whether they're
        // individual permissions or nested groups
        return _children.Any(c => c.HasPermission(permission));
    }

    public IEnumerable<IPermissionComponent> GetChildren() => _children;
}
```

Now build permission hierarchies naturally:

```csharp
// Define individual permissions
var canRead = new Permission("CanReadOrders");
var canEdit = new Permission("CanEditOrders");
var canDelete = new Permission("CanDeleteOrders");
var canManageUsers = new Permission("CanManageUsers");
var canViewReports = new Permission("CanViewReports");

// Build role hierarchy
var editorRole = new PermissionGroup("Editor");
editorRole.Add(canRead);
editorRole.Add(canEdit);

var managerRole = new PermissionGroup("Manager");
managerRole.Add(editorRole);       // Manager includes Editor
managerRole.Add(canViewReports);

var adminRole = new PermissionGroup("Admin");
adminRole.Add(managerRole);       // Admin includes Manager
adminRole.Add(canDelete);
adminRole.Add(canManageUsers);

// Check permission - works the same regardless of depth
bool canAdminEdit = adminRole.HasPermission("CanEditOrders");    // true (3 levels deep)
bool canEditorDelete = editorRole.HasPermission("CanDeleteOrders"); // false
```

The caller doesn't care whether it's checking a single permission or a 5-level-deep role hierarchy. Same method, same interface.

## Why This Is Better

**Uniform treatment.** Clients call `HasPermission()` on any node. No type-checking, no special traversal logic.

**Unlimited nesting.** Add as many levels as your business requires. The recursive structure handles it automatically.

**Easy to extend.** Add a `ConditionalPermission` that checks time of day, or a `FeatureFlagPermission` that checks a flag store. As long as it implements `IPermissionComponent`, it plugs right in.

## Advanced Usage: Composite for Pricing Rules

E-commerce pricing is another perfect fit. Discounts can be flat, percentage-based, or combinations:

```csharp
public interface IPricingRule
{
    decimal CalculateDiscount(decimal originalPrice, OrderContext context);
}

// Leaf: single discount
public class PercentageDiscount : IPricingRule
{
    private readonly decimal _percentage;

    public PercentageDiscount(decimal percentage) => _percentage = percentage;

    public decimal CalculateDiscount(decimal originalPrice, OrderContext context)
        => originalPrice * (_percentage / 100m);
}

public class FlatDiscount : IPricingRule
{
    private readonly decimal _amount;

    public FlatDiscount(decimal amount) => _amount = amount;

    public decimal CalculateDiscount(decimal originalPrice, OrderContext context)
        => Math.Min(_amount, originalPrice);
}

// Composite: stacked discounts
public class DiscountBundle : IPricingRule
{
    private readonly List<IPricingRule> _rules = new();

    public void Add(IPricingRule rule) => _rules.Add(rule);

    public decimal CalculateDiscount(decimal originalPrice, OrderContext context)
    {
        // Apply discounts sequentially
        var totalDiscount = 0m;
        var currentPrice = originalPrice;

        foreach (var rule in _rules)
        {
            var discount = rule.CalculateDiscount(currentPrice, context);
            totalDiscount += discount;
            currentPrice -= discount;
        }

        return totalDiscount;
    }
}

// Build a Black Friday deal: 20% off + $10 coupon
var blackFriday = new DiscountBundle();
blackFriday.Add(new PercentageDiscount(20));
blackFriday.Add(new FlatDiscount(10));

var totalDiscount = blackFriday.CalculateDiscount(100m, context); // $30
```

## Advanced Usage: Menu Builder for Navigation

Dynamic navigation menus are tree structures by nature:

```csharp
public interface IMenuItem
{
    string Label { get; }
    string? Url { get; }
    bool IsVisible(UserContext user);
    IReadOnlyList<IMenuItem> Children { get; }
}

public class MenuLink : IMenuItem
{
    public string Label { get; }
    public string? Url { get; }
    private readonly string? _requiredPermission;

    public MenuLink(string label, string url, string? requiredPermission = null)
    {
        Label = label;
        Url = url;
        _requiredPermission = requiredPermission;
    }

    public bool IsVisible(UserContext user)
        => _requiredPermission == null || user.HasPermission(_requiredPermission);

    public IReadOnlyList<IMenuItem> Children => Array.Empty<IMenuItem>();
}

public class MenuGroup : IMenuItem
{
    public string Label { get; }
    public string? Url => null;
    private readonly List<IMenuItem> _children = new();

    public MenuGroup(string label) => Label = label;

    public void Add(IMenuItem item) => _children.Add(item);

    public bool IsVisible(UserContext user)
        => _children.Any(c => c.IsVisible(user));

    public IReadOnlyList<IMenuItem> Children => _children;
}
```

## When NOT to Use It

**When your structure is always flat.** If you never have nesting, the Composite adds complexity for no gain. A simple list is enough.

**When leaf and composite behavior differ significantly.** If operations on groups are fundamentally different from operations on individuals, forcing a common interface creates awkward implementations.

**When you need parent references.** The basic Composite doesn't track parents. If you frequently need "go up the tree," you'll need extra wiring that complicates the pattern.

## Key Takeaways

- Composite lets you treat individual objects and groups uniformly through a shared interface
- It handles recursive tree structures naturally — permissions, menus, pricing, file systems
- Adding new node types doesn't require changing existing traversal code
- The pattern shines when nesting depth is variable or unknown
- Skip it for flat structures where a simple list would do

## FAQ

### What is the Composite pattern in simple terms?

The Composite pattern organizes objects into tree structures where every node — whether it's a single item or a group — implements the same interface. This lets clients treat individual objects and compositions of objects identically.

### When should I use the Composite pattern?

Use it when your data has a natural tree structure (permissions, menus, folders, org charts) and you want uniform operations across the entire tree. If you catch yourself writing recursive type-checking code, Composite is likely the answer.

### Is the Composite pattern overkill?

For flat collections with no nesting, yes. If your data is always a simple list, use a list. Composite adds value when nesting depth varies or when you need to add/remove levels without changing client code.

### What are alternatives to the Composite pattern?

For simple hierarchies, recursive methods on a single class can work. The Visitor pattern pairs well with Composite when you need many different operations on the same tree. For flat structures, standard LINQ on collections is simpler.

## Wrapping Up

The Composite pattern shows up everywhere once you start looking. File systems, UI component trees, permission hierarchies, organizational charts, pricing engines — they're all trees where you need uniform behavior across nodes.

The pattern's power is in its simplicity. One interface. Leaves implement it directly. Composites delegate to their children. Clients never know the difference.

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

---

If you made it this far, you're clearly serious about writing better .NET code. Here's a **20% discount code: DEEP20** for [Design Patterns that Deliver](/design-patterns-that-deliver-ebook). Consider it a thank-you for actually reading the whole thing.

---

Here are 2 ebooks I have about design patterns:

- [Design Patterns that Deliver](/design-patterns-that-deliver-ebook) — 5 essential patterns (Builder, Decorator, Strategy, Adapter, Mediator) with production-ready C# code and real-world examples. Or try a [free chapter on the Builder Pattern](/builder-pattern-free-stuff) first.

- [Design Patterns Simplified](/design-patterns-simplified) — A beginner-friendly guide to understanding design patterns without the academic fluff.

<!--END-->