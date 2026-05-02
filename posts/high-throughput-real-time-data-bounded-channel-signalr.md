---
title: "High-Throughput Real-Time Data with BoundedChannel and SignalR"
subtitle: "Learn how to bridge fast NATS producers with slower SignalR consumers using a BoundedChannel-based batching pipeline in .NET."
date: "March 31 2026"
category: ".NET"
readTime: "Read Time: 8 minutes"
meta_description: "Learn how to build a high-throughput real-time data pipeline in .NET using BoundedChannel<DataPointValue> with time-and-count batch flushing, NATS ingestion, and SignalR broadcasting via DataPointHub."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">A quick word from me</p>

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 1.6; color: #ffffff;">This issue isn't sponsored - I write these deep dives in my free time and keep them free for everyone. If your company sells AI tools, dev tools, courses, or services that .NET developers would actually use, sponsoring an issue is the most direct way to reach them.</p>

<a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</div>

## Background

If you work on systems that ingest telemetry, sensor readings, trading ticks, or any fast-moving data, you have probably run into this problem:

The producer is way faster than the consumer.

NATS can push thousands of messages per second into your service. But your SignalR hub, database writer, or downstream API cannot keep up one message at a time.

The classic fix? A queue that batches.

In .NET, `System.Threading.Channels` gives us exactly that. No external dependencies. No third-party libraries. Just a built-in, high-performance, thread-safe pipe.

In this post, we will build a `DataPointService` that:

- Consumes data points from NATS at high speed  
- Writes them into a `BoundedChannel<DataPointValue>` (capacity 10,000, single-reader)  
- Flushes in batches (1,000 items or every 50ms, whichever comes first)  
- Broadcasts each batch to connected dashboards through a SignalR `DataPointHub`

By the end, you will have a production-ready pattern for bridging any fast producer with a slower consumer.

## Why BoundedChannel?

`System.Threading.Channels` ships with .NET and comes in two flavors:

- `Channel.CreateUnbounded<T>()` - no capacity limit, can eat all your memory  
- `Channel.CreateBounded<T>(capacity)` - fixed capacity with backpressure

For high-throughput ingestion, always pick bounded.

Here is why:

- **Backpressure** - when the channel is full, the producer waits (or drops), so your service does not run out of memory  
- **Single-reader optimization** - the runtime skips internal locks when it knows only one consumer exists  
- **Predictable memory footprint** - you decide the maximum buffered items upfront

Think of it as a pipe with a known diameter. You control how much water flows through it.

## Step 1: Define the Data Model

Start with the value type that flows through the channel.

```csharp
public sealed record DataPointValue(
    string SensorId,
    double Value,
    DateTime Timestamp);
```

Simple and immutable. Every reading from NATS gets mapped into this.

## Step 2: Configure Dispatch Options

Instead of hardcoding batch size and flush interval, pull them from configuration.

```csharp
public sealed class DataPointDispatchOptions
{
    public int ChannelCapacity { get; set; } = 10_000;
    public int BatchSize { get; set; } = 1_000;
    public int FlushIntervalMs { get; set; } = 50;
    public bool SingleReader { get; set; } = true;
    public bool SingleWriter { get; set; } = false;
}
```

And the matching `appsettings.json` section:

```json
{
  "DataPointDispatch": {
    "ChannelCapacity": 10000,
    "BatchSize": 1000,
    "FlushIntervalMs": 50,
    "SingleReader": true,
    "SingleWriter": false
  }
}
```

`SingleReader: true` tells the channel that only one consumer will read from it. The runtime uses this hint to remove synchronization overhead internally.

`SingleWriter: false` because multiple NATS subscription callbacks may write concurrently.

## Step 3: Create the SignalR Hub

The hub itself is intentionally thin. It is just the broadcast endpoint.

```csharp
public sealed class DataPointHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await base.OnConnectedAsync();
    }
}
```

No methods on the hub. The server pushes to clients, clients just listen.

On the client side (JavaScript), the connection looks like this:

```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/data-point-hub")
    .withAutomaticReconnect()
    .build();

connection.on("ReceiveDataPoints", (batch) => {
    // batch is an array of { sensorId, value, timestamp }
    updateDashboard(batch);
});

await connection.start();
```

Every time the server flushes a batch, all connected clients receive it instantly.

## Step 4: Build the DataPointService

This is the core. A `BackgroundService` that owns the channel and runs two loops:

1. **Writer side** - a NATS subscriber pushes data points into the channel  
2. **Reader side** - a flush loop drains the channel in batches and broadcasts via SignalR

```csharp
public sealed class DataPointService : BackgroundService
{
    private readonly Channel<DataPointValue> _channel;
    private readonly IHubContext<DataPointHub> _hubContext;
    private readonly DataPointDispatchOptions _options;
    private readonly INatsConnection _natsConnection;
    private readonly ILogger<DataPointService> _logger;

    public DataPointService(
        IHubContext<DataPointHub> hubContext,
        IOptions<DataPointDispatchOptions> options,
        INatsConnection natsConnection,
        ILogger<DataPointService> logger)
    {
        _hubContext = hubContext;
        _options = options.Value;
        _natsConnection = natsConnection;
        _logger = logger;

        _channel = Channel.CreateBounded<DataPointValue>(
            new BoundedChannelOptions(_options.ChannelCapacity)
            {
                SingleReader = _options.SingleReader,
                SingleWriter = _options.SingleWriter,
                FullMode = BoundedChannelFullMode.Wait
            });
    }

    public ChannelWriter<DataPointValue> Writer => _channel.Writer;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var consumerTask = ConsumeFromNatsAsync(stoppingToken);
        var flushTask = FlushLoopAsync(stoppingToken);

        await Task.WhenAll(consumerTask, flushTask);
    }
}
```

Let us break this down.

The constructor creates a `BoundedChannel` with `FullMode = Wait`. When the buffer hits 10,000 items, the NATS callback pauses until the reader drains some space. This is backpressure in action.

`ExecuteAsync` starts two concurrent loops. They run for the entire lifetime of the service.

## Step 5: Consume from NATS

The writer side subscribes to a NATS subject and pushes each message into the channel.

```csharp
private async Task ConsumeFromNatsAsync(CancellationToken stoppingToken)
{
    await foreach (var msg in _natsConnection
        .SubscribeAsync<DataPointValue>("datapoints.>", cancellationToken: stoppingToken))
    {
        if (msg.Data is null)
        {
            continue;
        }

        await _channel.Writer.WriteAsync(msg.Data, stoppingToken);
    }

    _channel.Writer.Complete();
}
```

`SubscribeAsync` returns an `IAsyncEnumerable`. Each message arrives, gets unwrapped, and lands in the channel.

When the cancellation token fires, the loop exits and we call `Writer.Complete()` to signal the reader that no more data is coming.

The wildcard subject `datapoints.>` means we subscribe to all subjects under the `datapoints` namespace, so `datapoints.soil`, `datapoints.temperature`, etc.

## Step 6: The Batch Flush Loop

This is where the magic happens. The reader drains up to `BatchSize` items or flushes after `FlushIntervalMs`, whichever triggers first.

```csharp
private async Task FlushLoopAsync(CancellationToken stoppingToken)
{
    var batch = new List<DataPointValue>(_options.BatchSize);
    var reader = _channel.Reader;

    while (!stoppingToken.IsCancellationRequested)
    {
        batch.Clear();

        using var cts = CancellationTokenSource
            .CreateLinkedTokenSource(stoppingToken);
        cts.CancelAfter(TimeSpan.FromMilliseconds(_options.FlushIntervalMs));

        try
        {
            while (batch.Count < _options.BatchSize)
            {
                var item = await reader.ReadAsync(cts.Token);
                batch.Add(item);
            }
        }
        catch (OperationCanceledException)
        {
            // Either the flush interval expired or the service is stopping.
            // In both cases, flush whatever we have collected so far.
        }

        if (batch.Count > 0)
        {
            await BroadcastBatchAsync(batch);
        }
    }

    // Drain remaining items after cancellation
    while (reader.TryRead(out var remaining))
    {
        batch.Add(remaining);
    }

    if (batch.Count > 0)
    {
        await BroadcastBatchAsync(batch);
    }
}
```

The trick is the **linked CancellationTokenSource**.

We create a token that expires after 50ms. The inner loop reads as fast as it can until either:

- It collects 1,000 items (batch full)  
- The 50ms timer fires (time flush)  
- The service shuts down (graceful stop)

In every case, whatever we collected gets flushed.

After the outer loop exits, we drain any leftover items with `TryRead` so nothing is lost.

## Step 7: Broadcast via SignalR

The broadcast method sends the batch to all connected clients.

```csharp
private async Task BroadcastBatchAsync(List<DataPointValue> batch)
{
    try
    {
        await _hubContext.Clients.All.SendAsync(
            "ReceiveDataPoints",
            batch);

        _logger.LogDebug("Broadcasted {Count} data points", batch.Count);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to broadcast {Count} data points", batch.Count);
    }
}
```

We use `IHubContext<DataPointHub>` instead of calling the hub directly. This is how you push messages from outside a hub class in ASP.NET Core.

The try/catch ensures that a single broadcast failure does not crash the entire service.

## Step 8: Wire Everything Up

Register the service and options in `Program.cs`.

```csharp
builder.Services.Configure<DataPointDispatchOptions>(
    builder.Configuration.GetSection("DataPointDispatch"));

builder.Services.AddSignalR();
builder.Services.AddHostedService<DataPointService>();

var app = builder.Build();

app.MapHub<DataPointHub>("/data-point-hub");

app.Run();
```

That is the complete setup. Configuration comes from `appsettings.json`, the channel is created internally, and the two loops start automatically when the host launches.

## How the Pieces Fit Together

Here is the full flow:

![BoundedChannel Pipeline: NATS to SignalR](/images/blog/posts/high-throughput-real-time-data-bounded-channel-signalr/bounded-channel-pipeline.png)

- NATS pushes at full speed  
- The channel absorbs bursts up to 10,000 items  
- The flush loop collects batches efficiently  
- SignalR delivers one batch per flush to all dashboards

No message is processed one at a time. No `Task.Delay` polling. No manual thread management.

## Why This Pattern Matters

Channel-based batching is the modern .NET approach for bridging fast producers with slower consumers.

Here is what you get:

- **Backpressure** - the producer slows down when the consumer cannot keep up, so memory stays predictable  
- **Throughput** - batching reduces the number of SignalR calls from thousands per second to a few dozen  
- **Latency** - the 50ms time trigger ensures clients see updates within 50ms even during low traffic  
- **Graceful shutdown** - remaining items are drained before the service stops  
- **Configurability** - batch size, channel capacity, and flush interval are all in `appsettings.json`

Compare this to the naive approach of calling `SendAsync` for every single data point. At 5,000 messages per second, that is 5,000 SignalR broadcasts. With batching, it drops to roughly 5 flushes of 1,000 items each, or about 100 flushes of 50ms-worth of data during lighter loads.

## When to Tune the Options

The defaults (10,000 capacity / 1,000 batch / 50ms flush) work well for most real-time dashboard scenarios. But you may need to adjust:

- **High burst, low steady-state** - increase `ChannelCapacity` so bursts do not trigger backpressure  
- **Ultra-low latency** - decrease `FlushIntervalMs` to 10-20ms at the cost of more frequent, smaller batches  
- **Heavy payloads** - decrease `BatchSize` so each SignalR message stays within a reasonable size  
- **Multiple consumers** - set `SingleReader: false` if you add a second reader (e.g., a database writer alongside SignalR)

Always benchmark with realistic load. Channel performance is excellent, but your bottleneck is usually the downstream consumer.

## Wrapping Up

You do not need a complex message broker pipeline to handle high-throughput real-time data in .NET.

A `BoundedChannel<T>` with time-and-count-based flushing gives you backpressure, batching, and predictable memory usage out of the box.

Pair it with NATS for ingestion and SignalR for broadcasting, and you have a production-ready pipeline that handles thousands of data points per second with minimal code.

The key takeaway: stop processing messages one at a time. Channels let you absorb bursts, batch intelligently, and push to consumers efficiently.

## Frequently Asked Questions

### What is BoundedChannel in .NET?

`BoundedChannel<T>` is a thread-safe, high-performance in-process producer-consumer queue from `System.Threading.Channels`. Unlike `ConcurrentQueue`, it has a fixed capacity and provides backpressure — when the buffer is full, writers wait until consumers drain space. It supports `SingleReader` and `SingleWriter` optimizations that remove internal lock overhead. It ships with .NET and requires no external packages.

### When should I use BoundedChannel vs. UnboundedChannel?

Use `BoundedChannel` when your producer is faster than your consumer and you need memory safety. The fixed capacity prevents unbounded memory growth during traffic spikes. Use `UnboundedChannel` only when you are certain the consumer can always keep up, or when message loss is acceptable and you prefer never blocking the producer.

### How does time-and-count batch flushing work?

The flush loop reads from the channel into a buffer. It stops when either the batch reaches a count threshold (e.g., 1,000 items) or a time interval expires (e.g., 50ms), whichever comes first. This is implemented using a linked `CancellationTokenSource` with `CancelAfter`. The result is efficient batching under high load and low-latency delivery under light load.

### Can I use BoundedChannel with SignalR for real-time dashboards?

Yes. The pattern in this post is designed exactly for that. NATS (or any fast producer) writes into the channel, a [BackgroundService](https://thecodeman.net/posts/background-tasks-in-dotnet8) reads in batches, and `IHubContext<THub>` broadcasts each batch to all connected SignalR clients. This reduces thousands of individual `SendAsync` calls to a few dozen batch broadcasts per second.

### What is backpressure in System.Threading.Channels?

Backpressure is a flow control mechanism where the producer slows down when the consumer cannot keep up. In `BoundedChannel`, when the buffer reaches capacity, `WriteAsync` awaits until space is available. This prevents memory exhaustion and keeps your service responsive. The `FullMode` option controls the behavior: `Wait` (block the writer), `DropNewest`, `DropOldest`, or `DropWrite`.

For related topics, check out [Real-Time applications with SignalR](https://thecodeman.net/posts/real-time-dotnet-applications-with-signalr) and [A Friendly Introduction to NATS: Real-Time Messaging for .NET Developers](https://thecodeman.net/posts/introduction-to-nats-real-time-messaging).

That's all from me today.

P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).


---

Building APIs like this? Grab my free [Vertical Slice Architecture template](/vertical-slices-architecture) - a clean .NET 10 project with 10 endpoints and zero unnecessary abstractions.

<!--END-->
