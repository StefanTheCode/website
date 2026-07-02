"use client";

import { useState } from "react";
import CodeRunner from "./CodeRunner";

type Example = { id: string; label: string; code: string };

const EXAMPLES: Example[] = [
  {
    id: "hello",
    label: "Hello, C#",
    code: `using System;

Console.WriteLine("Hello from C# running in your browser!");

for (int i = 1; i <= 5; i++)
    Console.WriteLine($"{i} x {i} = {i * i}");`,
  },
  {
    id: "builder",
    label: "Builder — fluent construction",
    code: `using System;
using System.Collections.Generic;
using System.Linq;

var email = new EmailBuilder()
    .From("billing@acme.io")
    .To("customer@example.com")
    .Subject("Your October invoice")
    .Body("Thanks for your order!")
    .Build();

Console.WriteLine(email);

public sealed record EmailMessage(string From, IReadOnlyList<string> To, string Subject, string Body)
{
    public override string ToString() =>
        $"From: {From}\\nTo: {string.Join(", ", To)}\\nSubject: {Subject}\\n\\n{Body}";
}

public sealed class EmailBuilder
{
    private string _from = "";
    private readonly List<string> _to = new();
    private string _subject = "";
    private string _body = "";

    public EmailBuilder From(string v) { _from = v; return this; }
    public EmailBuilder To(string v) { _to.Add(v); return this; }
    public EmailBuilder Subject(string v) { _subject = v; return this; }
    public EmailBuilder Body(string v) { _body = v; return this; }

    public EmailMessage Build() => new(_from, _to.ToList(), _subject, _body);
}`,
  },
  {
    id: "result",
    label: "Result — errors as values (railway)",
    code: `using System;

var ok  = Parse("42").Bind(Double).Map(x => $"Result = {x}");
var bad = Parse("oops").Bind(Double).Map(x => $"Result = {x}");

Console.WriteLine(ok.IsSuccess  ? ok.Value  : $"Error: {ok.Error}");
Console.WriteLine(bad.IsSuccess ? bad.Value : $"Error: {bad.Error}");

Result<int> Parse(string s) =>
    int.TryParse(s, out var n) ? Result<int>.Ok(n) : Result<int>.Fail($"'{s}' is not a number");

Result<int> Double(int n) => Result<int>.Ok(n * 2);

public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public string Error { get; }
    private Result(bool ok, T v, string e) { IsSuccess = ok; Value = v; Error = e; }

    public static Result<T> Ok(T v) => new(true, v, "");
    public static Result<T> Fail(string e) => new(false, default!, e);

    public Result<TO> Bind<TO>(Func<T, Result<TO>> f) => IsSuccess ? f(Value) : Result<TO>.Fail(Error);
    public Result<TO> Map<TO>(Func<T, TO> f) => IsSuccess ? Result<TO>.Ok(f(Value)) : Result<TO>.Fail(Error);
}`,
  },
  {
    id: "state",
    label: "State — guarded transitions",
    code: `using System;

var order = new Order();
Console.WriteLine($"Start: {order.State}");

order.Pay();   Console.WriteLine($"Pay()  -> {order.State}");
order.Ship();  Console.WriteLine($"Ship() -> {order.State}");

try { order.Cancel(); }
catch (InvalidOperationException ex) { Console.WriteLine($"Blocked: {ex.Message}"); }

public enum OrderState { Pending, Paid, Shipped, Delivered, Cancelled }

public sealed class Order
{
    public OrderState State { get; private set; } = OrderState.Pending;

    public void Pay()  => Move(OrderState.Pending, OrderState.Paid);
    public void Ship() => Move(OrderState.Paid, OrderState.Shipped);

    public void Cancel()
    {
        if (State is OrderState.Shipped or OrderState.Delivered)
            throw new InvalidOperationException($"Cannot cancel a {State} order.");
        State = OrderState.Cancelled;
    }

    private void Move(OrderState from, OrderState to)
    {
        if (State != from)
            throw new InvalidOperationException($"Cannot go {State} -> {to}.");
        State = to;
    }
}`,
  },
  {
    id: "strategy",
    label: "Strategy — swappable algorithms",
    code: `using System;
using System.Collections.Generic;

var checkout = new Checkout(new Dictionary<string, IShipping>
{
    ["standard"] = new Standard(),
    ["express"]  = new Express(),
});

Console.WriteLine($"standard: {checkout.Quote("standard", 3.0m)}");
Console.WriteLine($"express:  {checkout.Quote("express", 3.0m)}");

public interface IShipping { decimal Cost(decimal kg); }
public sealed class Standard : IShipping { public decimal Cost(decimal kg) => 5m + 0.5m * kg; }
public sealed class Express  : IShipping { public decimal Cost(decimal kg) => 15m + 1.2m * kg; }

public sealed class Checkout
{
    private readonly IReadOnlyDictionary<string, IShipping> _strategies;
    public Checkout(IReadOnlyDictionary<string, IShipping> s) => _strategies = s;
    public decimal Quote(string key, decimal kg) => _strategies[key].Cost(kg);
}`,
  },
  {
    id: "specification",
    label: "Specification — composable rules",
    code: `using System;
using System.Linq.Expressions;

var sellable = new ActiveSpec().And(new InStockSpec());

Console.WriteLine(sellable.IsSatisfiedBy(new Product(true, 5)));   // True
Console.WriteLine(sellable.IsSatisfiedBy(new Product(true, 0)));   // False (out of stock)
Console.WriteLine(sellable.IsSatisfiedBy(new Product(false, 5)));  // False (inactive)

public record Product(bool IsActive, int Stock);

public abstract class Spec<T>
{
    public abstract Expression<Func<T, bool>> ToExpr();
    public bool IsSatisfiedBy(T x) => ToExpr().Compile()(x);
    public Spec<T> And(Spec<T> other) => new AndSpec<T>(this, other);
}

public sealed class ActiveSpec : Spec<Product>
{
    public override Expression<Func<Product, bool>> ToExpr() => p => p.IsActive;
}

public sealed class InStockSpec : Spec<Product>
{
    public override Expression<Func<Product, bool>> ToExpr() => p => p.Stock > 0;
}

public sealed class AndSpec<T> : Spec<T>
{
    private readonly Spec<T> _l, _r;
    public AndSpec(Spec<T> l, Spec<T> r) { _l = l; _r = r; }

    public override Expression<Func<T, bool>> ToExpr()
    {
        var p = Expression.Parameter(typeof(T));
        var body = Expression.AndAlso(
            Expression.Invoke(_l.ToExpr(), p),
            Expression.Invoke(_r.ToExpr(), p));
        return Expression.Lambda<Func<T, bool>>(body, p);
    }
}`,
  },
];

export default function CodePlayground() {
  const [exId, setExId] = useState(EXAMPLES[0].id);
  const example = EXAMPLES.find((e) => e.id === exId) ?? EXAMPLES[0];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <label
          htmlFor="pg-example"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: ".14em",
            textTransform: "uppercase",
            color: "#9C92B8",
          }}
        >
          Load an example
        </label>
        <select
          id="pg-example"
          value={exId}
          onChange={(e) => setExId(e.target.value)}
          style={{
            background: "rgba(13,7,34,.55)",
            color: "#F3EFFA",
            border: "1px solid rgba(255,255,255,.12)",
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 14,
            fontFamily: "'Manrope', system-ui, sans-serif",
          }}
        >
          {EXAMPLES.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      {/* key forces a fresh editor (resets code) when the example changes */}
      <CodeRunner key={example.id} initialCode={example.code} autoFocus />
    </div>
  );
}
