# 20 LinkedIn postova iz TheCodeMan blog arhive

Tekstovi su na engleskom, u neformalnom tonu za .NET publiku. Svaki blok „Tekst posta” je kompletna objava. Izvori, tehničke beleške i brief za vizual služe za pripremu i nisu deo teksta za kopiranje.

Pregled obuhvata katalog svih 142 Markdown članka u `posts/`, njihove teme i strukturu, uz detaljniju obradu odabranih izvora. Serija povezuje srodne članke i razvija nove uglove; nije 20 skraćenih blog uvoda. Primeri i računski scenariji su ilustrativni, bez izmišljenih ličnih iskustava ili benchmark rezultata. Redosled ispod je predlog redosleda objavljivanja.

Vizuali su predlozi za izradu, ne generisane slike. Za carousele je dat tekst svakog slajda. Predlog dizajna: 1080 × 1350 px, tamna podloga, belo telo teksta, žuti akcenti u stilu TheCodeMan, monospace za kod. Jedna ideja po slajdu; izbegavati screenshot celog IDE-a i sitan kod. Jednostavne dijagrame crtati kao vektore, bez dekorativnih AI ilustracija.

## 01 — Architecture rules someone can actually break

**Nivo:** praktičan / intermediate. **Format:** tekst + dijagram.

### Tekst posta

Open your solution and pick one architecture rule your team keeps repeating in code reviews.

“Billing must not reach into Orders.Infrastructure.”

Now deliberately break it on a local branch. Add a real dependency, build, and run the tests.

Does anything fail?

If everything stays green, that rule currently depends on someone remembering it during review. Which works reasonably well until the PR is large, the reviewer is tired, or the person who designed the boundary leaves.

This is where I like architecture tests in .NET. Start with one dependency restriction that protects something you actually care about. NetArchTest can inspect the relevant assembly and fail when a type takes a forbidden dependency.

Then keep the deliberate violation for a minute. Run the test again. You want to see the exact offending type in the failure, so the next developer can fix it without reading a ten-page architecture document.

That last step matters. A test scanning the wrong assembly can pass forever and protect absolutely nothing.

I wouldn't begin with twenty naming rules. I'd begin with the boundary that keeps causing painful changes. Maybe it's Domain depending on infrastructure. Maybe it's one module reaching into another module's internals.

Also, be honest about the coverage. A static dependency test won't catch a module querying another module's tables through raw SQL. That needs a different check, or database permissions that prevent it.

One useful rule, one intentional violation, one clear failure. That's a pretty good first afternoon.

If you want a starting point, get my free .NET Code Rules Starter Kit. It includes NetArchTest examples and a CI quality gate:
https://thecodeman.net/dotnet-code-rules-starter-kit

### Vizual

Jedna slika: levo dijagram `Billing → Orders.Infrastructure` sa crvenom strelicom; desno ilustrativan test rezultat `FAIL: Billing.InvoiceService has a forbidden dependency`. Naslov: **“Would your build catch this?”** Dole tri koraka: `Add dependency → Run test → Check failure`. Označiti rezultat kao primer, ne stvarni screenshot testa.

### Izvori i urednička beleška

- [Architecture Tests in .NET](https://thecodeman.net/posts/architecture-tests-dotnet-clean-architecture)
- [Monolith to Modular Monolith to Microservices](https://thecodeman.net/posts/monolith-to-modular-monolith-to-microservices-at-100k-users)
- Dodatni ugao: proveriti da test zaista pada i objasniti granicu statičke analize; bez univerzalne zabrane korišćenja DbContext-a u endpointima.

## 02 — The retry count hiding in three different places

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

Before adding another retry to a .NET service, I'd check how many retries already happen before the request reaches it.

The client SDK might retry. So might the gateway. Your HttpClient might have a resilience handler too.

If three layers each make up to three attempts, a single operation can trigger up to 27 calls at the bottom. That's the worst case, but it's exactly the case worth thinking about when a dependency is struggling.

Small naming detail: MaxRetryAttempts = 3 means one initial attempt plus up to three retries. Four attempts. Easy to misread in a code review.

I'd map the whole path, decide which layer owns retries for each dependency, and give the operation a total time budget. Each attempt gets a smaller timeout. Backoff gets jitter, so callers don't all come back together.

Then I'd look at the operation itself.

A payment timeout doesn't tell you whether the payment happened. It tells you that you didn't get a usable response in time. Blindly retrying that write can create a second charge.

An idempotency key only helps if concurrent requests with the same key cannot both start the side effect. A “check the cache, call the provider, save the result” sequence still has a race. For an external payment, the provider's idempotency support matters too.

The standard .NET HTTP resilience handler retries all HTTP methods by default. Review that policy before putting it in front of writes.

For the next load test, make the dependency slow while keeping it alive. Watch outbound attempts per incoming request. That's a useful graph to have before an incident.

I've put the .NET retry setup and pipeline ordering in the full walkthrough. Read it here:
https://thecodeman.net/posts/when-retries-make-the-outage-worse

### Vizual — carousel

1. **“How many times did you retry that payment?”** One user action. Several retry policies.
2. **“Three layers. Three attempts each.”** `Client × Gateway × Service = up to 27 downstream calls`. Small label: worst-case illustration.
3. **“Count attempts correctly.”** `MaxRetryAttempts = 3` → `1 original + 3 retries`.
4. **“Give the whole operation a deadline.”** Timeline: total budget outside; attempts and jittered waits inside. Bez garantovanih performansi i proizvoljnih produkcionih pragova.
5. **“A timeout can have an unknown outcome.”** `Provider accepts payment → response lost → retry`. Dole: `Atomic deduplication + provider idempotency`.
6. **“Test a slow dependency.”** Track incoming operations, downstream attempts, timeouts and completed side effects. CTA: **"Read the retry walkthrough. Link in the post."**

### Izvori i tehnička provera

- [When Retries Make the Outage Worse](https://thecodeman.net/posts/when-retries-make-the-outage-worse)
- [Building a Resilient API](https://thecodeman.net/posts/building-resilient-api-in-aspnet-core)
- Broj pokušaja, podrazumevani retry HTTP metoda i redosled standardnih strategija provereni prema [Microsoft HTTP resilience dokumentaciji](https://learn.microsoft.com/en-us/dotnet/core/resilience/http-resilience).
- Namerno nije preuzet check-then-act idempotency primer iz bloga kao production-safe implementacija.

## 03 — The EF query that returns far more rows than you asked for

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

An EF Core query can return one Order object and still move hundreds of rows across the network.

Say the order has 20 items and 10 payments. Include both sibling collections in one joined query and you can get 200 result rows for that one order. EF assembles the object graph, so the multiplication is easy to miss when you only inspect the C# result.

AsNoTracking() doesn't change that SQL shape.

AsSplitQuery() can help by fetching the collections through separate queries. But I'd check two things before adding it everywhere.

First, round-trip latency. Several smaller queries can still lose to one query when the database is far away and the joined result wasn't very large.

Second, consistency. Another transaction can change the data between those queries. If your operation needs a consistent view, consider an appropriate snapshot or serializable transaction and measure the cost of that choice too.

There's often a simpler option for a summary screen: don't fetch the collections. Project the values the screen needs. Item count, total amount, payment status. Let the database do the aggregation where it can translate it.

I'd compare the generated SQL, rows transferred, logical reads and endpoint latency using realistic collection sizes. Ten test orders with one item each won't expose this problem.

Also, collection projections can still produce complex SQL. Moving code into Select() isn't proof that the query is now cheap.

The next time a second Include makes an endpoint slow, inspect the result-set shape before changing ORMs. There's a good chance the database is doing exactly what you asked it to do.

For the C# examples behind these query shapes, take a look at my EF Core guide:
https://thecodeman.net/posts/preoptimized-ef-query-techniques-5-steps-to-success

### Vizual — carousel

1. **“1 order. 200 SQL rows.”** Subtitle: what two sibling collection joins can do.
2. **“20 items × 10 payments.”** Grid sa redovima i kolonama, označena ponovljena order polja.
3. **“Tracking and row count are separate costs.”** `AsNoTracking()` ne precrtava JOIN na dijagramu.
4. **“Split the query?”** Fewer duplicated rows; more round trips; consistency to consider.
5. **“Does the screen need the collections?”** `ItemCount / Total / IsPaid` kao tri polja DTO-a.
6. **“Compare with real data shapes.”** SQL, rows, logical reads, latency. Include the biggest orders in the test. CTA: **"Get the EF Core examples. Link in the post."**

### Izvori i tehnička provera

- [Preoptimized EF Query Techniques](https://thecodeman.net/posts/preoptimized-ef-query-techniques-5-steps-to-success)
- [4 Entity Framework Performance Tips](https://thecodeman.net/posts/4-entity-framework-tips-to-improve-performances)
- Trade-off i konzistentnost split upita: [EF Core single vs. split queries](https://learn.microsoft.com/en-us/ef/core/querying/single-split-queries).
- Projekcija, količina podataka i analiza upita: [EF Core efficient querying](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying).

## 04 — A small version of CQRS you can live with

**Nivo:** praktičan / intermediate. **Format:** tekst + dijagram.

### Tekst posta

If a CQRS proposal for a small .NET API starts with two databases and a message broker, I'd ask to see the simpler version first.

Take an order screen.

The write side needs to enforce rules: can this order be cancelled, has payment settled, has fulfillment started? The read side needs a useful summary for the UI.

Those are different jobs. Giving them separate handlers and separate models can be enough to make the code easier to work with. They can still use the same database and ship in the same application.

MediatR is one way to dispatch those requests. Calling a handler directly through DI is another. The package doesn't determine whether the read and write responsibilities are separated.

I like starting with the feature where the two sides are already pulling the code in different directions. A complicated write workflow and a read endpoint full of UI-specific joins are a decent candidate.

A CRUD endpoint that just changes a display name? I'd need a reason before adding commands, dispatchers and a custom pipeline around it.

And if you build your own dispatcher, count the work you're taking on. Validation, cancellation, behavior ordering, exception handling and tests still need to live somewhere. Forty lines in the first commit can become a small framework later.

I'd keep one database until there is a measured reason to separate it. Once reads come from an asynchronously updated store, the UI also needs an answer for “I saved it, why can't I see it yet?”

That's a product behavior to design, not just another infrastructure box.

Want to see what a small implementation looks like? I walk through CQRS without MediatR here:
https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr

### Vizual

Dve putanje ka istoj bazi: `CancelOrder → business rules → Orders DB` i `GetOrderSummary → projection → Orders DB`. Naslov: **“CQRS can start here.”** Mali izdvojeni blok: `Separate read store? Define read-after-write behavior first.`

### Izvori

- [CQRS without MediatR](https://thecodeman.net/posts/how-to-implement-cqrs-without-mediatr)
- [Build Your Own MediatR](https://thecodeman.net/posts/build-your-own-mediatr-lightweight-handler-pipeline-aspnet-core)
- [MediatR Pipeline Behavior](https://thecodeman.net/posts/mediatr-pipeline-behavior)

## 05 — A bounded channel can still leave you with unbounded waiting

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

You gave your Channel<T> a capacity of 1,000. Good start.

Now check how many HTTP requests are waiting to write into it.

With BoundedChannelFullMode.Wait, WriteAsync waits when the buffer is full. That bounds the items inside the channel. It doesn't automatically bound the number of producers waiting outside it, or the payloads those producers are holding.

Under sustained overload, you can have a nicely bounded queue surrounded by thousands of waiting requests.

I'd design three limits together: admission into the endpoint, buffer capacity, and active consumers. The consumer count should match what the downstream resource can handle. Fifty workers won't help a database that is already struggling with ten concurrent writes.

For public HTTP traffic, decide how long admission may wait. A rejection with a clear overload response can be healthier than letting every caller sit there until their timeout expires. For an internal batch producer, waiting may be exactly the behavior you want.

The full-mode choice is part of the feature too. Dropping old samples can make sense for a live dashboard. Dropping accepted invoice work is a very different promise.

Then test shutdown. Complete the writer, stop admission, and give consumers a bounded drain period. If the consumers immediately observe a cancelled stoppingToken, they may exit with buffered items still waiting.

A clean shutdown still doesn't make an in-memory queue durable. A crash can lose the buffer. If “202 Accepted” means the work must survive a restart, persist the job before acknowledging it.

I'd watch queue age as well as queue depth. The oldest item tells you how long somebody has already been waiting.

The producer, channel and worker setup is in my Channels walkthrough. Start there, then test the limits above in your own app:
https://thecodeman.net/posts/producer-consumer-with-channels-in-dotnet

### Vizual — carousel

1. **“Your bounded queue has a waiting room.”** 1,000 buffered jobs + waiting producers outside.
2. **“Capacity bounds the buffer.”** `WriteAsync` waits; pending producers can still retain payloads.
3. **“Set three limits.”** `Admission → Buffer → Active consumers`.
4. **“Choose the overload behavior.”** Internal batch: wait. Public request: bounded wait or reject. Dashboard samples: dropping may be acceptable.
5. **“Test the drain.”** Stop admission → complete writer → drain with a deadline → exit.
6. **“Accepted must mean something.”** In-memory handoff or durable acceptance? Make the response match the guarantee. CTA: **"Build the Channels example. Link in the post."**

### Izvori i tehnička provera

- [Producer–Consumer with Channels](https://thecodeman.net/posts/producer-consumer-with-channels-in-dotnet)
- [BoundedChannel and SignalR](https://thecodeman.net/posts/high-throughput-real-time-data-bounded-channel-signalr)
- Semantika `Wait` i drop režima: [System.Threading.Channels](https://learn.microsoft.com/en-us/dotnet/core/extensions/channels).
- Dodatni ugao: kapacitet bafera nije ukupno ograničenje zahteva/potrošnje memorije; drain mora imati odvojen, namerno osmišljen životni ciklus.

## 06 — What I want back from an AI code review

**Nivo:** praktičan / intermediate. **Format:** tekst + kartica sa promptom.

### Tekst posta

“This endpoint may have an authorization issue.”

Okay. Show me the request that proves it.

That's the standard I'd use when asking an AI agent to review a .NET API. A long list of confident findings isn't particularly useful if I have to investigate every item from scratch.

For each finding, I want the file and line, the route through the application, the conditions required, and a way to reproduce the behavior. If the agent can't verify it, it should say what evidence is missing.

Take a missing [Authorize] attribute. That might be a bug. It might also be an endpoint covered by a fallback policy or authorization applied to its route group. You have to follow the configuration before deciding.

Same with EF Core. A navigation property inside a loop doesn't prove N+1 queries. Is lazy loading enabled? Was that relationship already loaded? What SQL runs when the endpoint is called?

Here's a prompt I'd actually use:

“Review authorization and EF query behavior. Trace configuration before reporting a bug. For each finding, include evidence, a reproduction or verification step, and the smallest proposed fix. Separate confirmed behavior from assumptions. Don't edit files yet.”

Then I'd pick one finding, verify it, and make a focused change. For a performance claim, keep the dataset and test conditions the same before and after.

AI can make repository exploration much faster. I still want a clear chain from “this looks suspicious” to “this request demonstrates the problem.”

That's what makes a review useful to the person who has to merge the fix.

I wrote up the security-review agent and EF Core review skill behind this workflow. You can explore both here:
https://thecodeman.net/posts/ai-agents-for-dotnet-security-and-ef-core

### Vizual

Kartica **“A finding I can act on”** sa šest polja: `Location`, `Execution path`, `Required conditions`, `Evidence`, `Reproduction`, `Smallest fix`. Dole prompt iz posta, ili ga zadržati samo u tekstu ako bi font bio sitan. Dva badge-a: `Confirmed` i `Needs verification`.

### Izvori

- [AI Code Review for .NET](https://thecodeman.net/posts/ai-agents-for-dotnet-security-and-ef-core)
- [Refactoring Legacy .NET with Claude](https://thecodeman.net/posts/refactoring-legacy-dotnet-with-claude)
- Bez tvrdnje da je u ovoj sesiji izvršen security audit korisnikovog .NET koda; ovo je gotova edukativna objava.

## 07 — The crash your outbox test needs

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

Here's the outbox test I'd add before trusting it with order events:

Let the broker accept a message. Kill the publisher before it marks the outbox row as processed. Restart it.

You should expect that message to be published again.

Saving the order and its event in one database transaction closes the gap between “the order exists” and “we recorded an event to send.” It doesn't make the later broker publish and database update one atomic operation.

So the consumer needs a plan for duplicates.

For a database update, a useful approach is a processed-messages table with a unique key on consumer identity and message ID. Insert that marker and apply the business change in the same local transaction. If the transaction fails, both roll back.

A SELECT that asks “have I seen this ID?” isn't enough by itself. Two consumers can both see no row and proceed. The uniqueness constraint is what arbitrates that race.

And there's a second boundary: external side effects. A local deduplication row cannot atomically commit with a payment provider or email API. That call needs its own idempotency mechanism or a workflow that can reconcile an unknown result.

On the publishing side, multiple workers also need a claiming strategy. If you're using PostgreSQL row locks with SKIP LOCKED, those locks need an active transaction for the period you're relying on them.

The test result I want is quite specific: a duplicate arrives, the intended database effect happens once, and the system keeps processing later messages.

That's a much stronger test than sending one event through a healthy broker.

For the outbox table, interceptor and publisher example, start with my .NET walkthrough. Keep the failure cases above beside you as you adapt it:
https://thecodeman.net/posts/outbox-pattern-in-dotnet

### Vizual — carousel

1. **“Crash here.”** Broker accepts message → **CRASH** → mark outbox row processed.
2. **“Restart means replay.”** Same message ID reaches the consumer again.
3. **“One producer transaction.”** `Order + Outbox message` commit together.
4. **“One consumer transaction.”** `Unique processed-message marker + business update` commit together.
5. **“External calls have another boundary.”** DB transaction cannot include a remote payment API. Add provider idempotency or reconciliation.
6. **“Prove duplicate handling.”** Deliver twice. Race two consumers. Crash between steps. Verify one intended effect. CTA: **"Read the .NET outbox walkthrough. Link in the post."**

### Izvori i tehnička provera

- [Outbox Pattern in .NET](https://thecodeman.net/posts/outbox-pattern-in-dotnet)
- [EF Core Interceptors](https://thecodeman.net/posts/ef-interceptors-in-dotnet)
- Deduplikacija u istoj transakciji i unique ključ: [Idempotent Consumer pattern](https://microservices.io/patterns/communication-style/idempotent-consumer.html).
- Row-lock lifecycle potvrđen prema [PostgreSQL explicit locking](https://www.postgresql.org/docs/17/explicit-locking.html). Post ne predstavlja distribuiranu exactly-once garanciju.

## 08 — Task.WhenAll doesn't give you two DbContexts

**Nivo:** advanced. **Format:** tekst + code visual.

### Tekst posta

This looks like a harmless performance improvement:

Start the orders query. Start the payments query. Await Task.WhenAll.

But if both queries use the same EF Core DbContext, you've introduced overlapping operations on an object that doesn't support them.

Scoped registration doesn't help here. It gives you a context for the scope. It doesn't create a fresh context for each task inside that scope.

The simplest fix is often to await the queries sequentially. Before rejecting that as slow, check whether you can get the required result with one projection instead.

If the reads really are independent and parallel execution is worth it, create a separate context for each operation through IDbContextFactory, and dispose each one when its work is done.

There are two costs to think through before shipping that version.

First, database concurrency. An endpoint that used one active query can now use two. Multiply that across concurrent requests before deciding the optimization is free.

Second, consistency. Two contexts don't automatically share one transaction or database snapshot. If these values must describe the same point in time, independent parallel reads may violate the feature's requirements.

Pooling doesn't change any of this. DbContext pooling reuses context instances between units of work. It doesn't make an instance safe to share concurrently, and it's separate from the database driver's connection pool.

I'd compare the sequential query, a single projection, and separate-context parallel reads under load. Include pool waits and tail latency in the comparison.

The fastest version for one request on your laptop may be the version that makes every request wait in production.

I've laid out the DbContext registration options and background-worker examples here. Use the guide to check how your app manages contexts:
https://thecodeman.net/posts/managing-ef-core-dbcontext-lifetime

### Vizual

Dva kratka panela. Levo kod označen `Overlapping operations — same context`:

```csharp
var orders = db.Orders.ToListAsync(ct);
var payments = db.Payments.ToListAsync(ct);
await Task.WhenAll(orders, payments);
```

Desno tri opcije: `Sequential awaits`, `One projection`, `Separate contexts for independent work`. Footer: **“Compare database load and consistency requirements.”** Kod je namerno antipattern, što mora biti vidljivo na slici.

### Izvori i tehnička provera

- [Managing EF Core DbContext Lifetime](https://thecodeman.net/posts/managing-ef-core-dbcontext-lifetime)
- Thread safety, paralelne operacije i factory lifecycle: [DbContext lifetime and configuration](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/).

## 09 — Flipping a flag while three instances are running

**Nivo:** praktičan / intermediate. **Format:** tekst + vremenski dijagram.

### Tekst posta

Try this feature-flag test with more than one API instance:

Turn the flag off. Keep sending requests. Record which instance handled each request and which flag value it used.

You may see both behaviors for a while.

A central configuration store gives your instances a shared source. They can still refresh their local caches at different times. With request-driven refresh, an idle instance may not even check for a change until traffic reaches it.

That's worth knowing if the flag is supposed to stop a problematic integration during an incident.

I'd define the expected propagation delay and test it. I'd also decide what happens if the configuration store is unavailable: keep the last known value, use a conservative default, or reject that operation? The right answer depends on the feature.

There's another easy trap with percentage rollouts. If a customer's experience needs to stay consistent, use a stable targeting decision based on a trusted identity. A fresh random decision on every request can make a checkout behave differently between steps.

And decide whether the flag should stay fixed for the duration of a request or workflow. Re-evaluating it halfway through an operation can mix two implementations in one execution.

Local appsettings.json can support reloads in suitable setups, so “JSON always requires a restart” is too broad. Coordinating a fleet is the part that needs more thought.

Finally, give the flag an owner and a removal condition. Shipping the rollout is a good time to create the cleanup task, while everyone still remembers why both branches exist.

If you're setting this up in .NET, my feature-flags article walks through Azure App Configuration. Start with the setup, then test propagation across your instances:
https://thecodeman.net/posts/feature-flags-in-dotnet-without-redeploying

### Vizual

Timeline `Flag OFF in store` sa tri reda `Instance A/B/C` i različitim tačkama osvežavanja. Naslov: **“One flag. Three refresh times.”** Prikaz je ilustrativan, bez izmišljenih izmerenih sekundi. U uglu: `Test propagation / fallback / stable targeting`.

### Izvori i tehnička provera

- [Feature Flags without Redeploying](https://thecodeman.net/posts/feature-flags-in-dotnet-without-redeploying)
- [Live Loading appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file)
- Refresh pokrenut zahtevima: [Azure App Configuration dynamic configuration](https://learn.microsoft.com/en-us/azure/azure-app-configuration/enable-dynamic-configuration-aspnet-core).
- Zasebna konfiguracija feature-flag refresh-a: [.NET configuration provider](https://learn.microsoft.com/en-us/azure/azure-app-configuration/reference-dotnet-provider). Ne preuzimati tvrdnju da običan sentinel automatski osvežava sve flagove.

## 10 — Follow the reference that keeps the object alive

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

The biggest object in a memory snapshot isn't necessarily the object causing your leak.

It may just be the expensive thing a tiny delegate is keeping alive.

A static event is a good example. A short-lived object subscribes with an instance method. The event keeps the delegate. The delegate keeps its target. That target keeps the rest of its object graph.

From the GC's point of view, everything is reachable. Collecting more often won't fix the ownership mistake.

Before chasing it, I'd separate process memory from the managed heap. A rising working set can involve native allocations, mapped memory or runtime behavior. That graph alone doesn't prove a managed leak.

For a suspected managed leak, compare retained objects under similar load and at comparable collection points. Then follow the root path for a representative instance of a type that keeps accumulating.

dotnet-counters helps establish the trend. Heap snapshots help compare types and retained graphs. When using dotnet-dump, dumpheap and gcroot help investigate what's retaining an object.

If the path leads back to an event subscription, unsubscription needs an owner. Adding IDisposable is only half the fix; something must actually call Dispose. With lambdas, keep the delegate instance if you'll need to remove that subscription later.

Then rerun the same workload and look at retained memory after collection. “Memory dropped once” isn't much evidence. You want the baseline to stop climbing across repeated cycles.

One operational detail: heap capture can pause the process and need extra memory. Plan that before collecting from a container already close to its limit.

If you like working through .NET problems this way, join my free newsletter. I'll send the next practical tip to your inbox:
https://thecodeman.net/

### Vizual — carousel

1. **“Why is this object still alive?”** Putanja, ne fotografija servera.
2. **“Follow the references.”** `Static event → delegate → subscriber → retained graph`.
3. **“Start with the right memory graph.”** Process memory and managed heap are different measurements.
4. **“Compare equivalent moments.”** Same workload; comparable GC points; growing retained types.
5. **“Who owns the subscription?”** Subscribe → use → unsubscribe. `IDisposable` needs a caller.
6. **“Verify repeated cycles.”** Ilustrativan graf: rast pre ispravke, stabilna post-GC osnova posle. Jasno označiti `Illustration, not benchmark data`. CTA: **"Join my free .NET newsletter. Link in the post."**

### Izvori i tehnička provera

- [Hunting a Memory Leak in Production](https://thecodeman.net/posts/hunting-a-memory-leak-in-production-dotnet)
- [Observer Pattern](https://thecodeman.net/posts/observer-pattern-in-dotnet)
- Dijagnostički postupak: [Debug a memory leak](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/debug-memory-leak).
- `gcroot` i operativni troškovi dump-a: [dotnet-dump](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/dotnet-dump).

## 11 — Debug RAG before changing the model

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

When a RAG answer is wrong, I'd like to see the retrieved chunks before hearing which model we should switch to.

Was the answer actually present in the context?

If it wasn't, a better prompt still leaves the model without the information it needs. Start by keeping a small set of realistic questions, the documents that should answer them, and some questions your data cannot answer.

Evaluate retrieval separately from generation. For each question, inspect which chunks make it into the top results, whether they're current, and whether the caller is allowed to see them.

That last part belongs in the retrieval boundary. Don't fetch documents across tenants and ask the model to ignore the unauthorized ones. Derive access scope from trusted identity and enforce it before the content reaches the model.

With PostgreSQL and pgvector, also inspect the query plan when you combine approximate vector search with filters. Filtering can discard candidates found by the index, leaving fewer matching results than you expected. Depending on the workload, iterative scans, different search settings or exact search over a smaller eligible set may help. Measure recall and latency together.

I'd store the embedding model and version alongside the indexing setup too. Two vectors having the same dimension doesn't mean embeddings from different models are comparable. A model change needs a re-indexing plan.

Then inspect generation: does the answer follow the retrieved evidence, cite the right source, and admit when the evidence is insufficient?

A useful debugging session can end with “our chunk split separated the rule from its exception.” That's a much more actionable result than another afternoon tweaking the system prompt.

Want some code to experiment with? Get my free AI in .NET Starter Kit, with semantic search, RAG and MCP examples:
https://thecodeman.net/ai-in-dotnet-starter-kit

### Vizual — carousel

1. **“Wrong answer? Show the retrieved chunks.”** Question → retrieval → context → answer.
2. **“Build a small evaluation set.”** Real questions, expected sources, deliberately unanswerable questions.
3. **“Test retrieval on its own.”** Relevant? Current? Authorized? Enough context?
4. **“Filtered ANN needs measurement.”** Candidate set → eligibility filter → fewer matches. Dole: `Inspect plan; compare recall + latency`.
5. **“Version your embeddings.”** Model A corpus + model B query = incompatible assumptions. Re-index deliberately.
6. **“Then evaluate the answer.”** Grounding, citations, sensible abstention. Example failure: rule and exception split apart. CTA: **"Get the free AI in .NET Starter Kit. Link in the post."**

### Izvori i tehnička provera

- [RAG in .NET](https://thecodeman.net/posts/how-to-implement-rag-in-dotnet)
- [Semantic Search in .NET](https://thecodeman.net/posts/semantic-search-ai-in-dotnet)
- ANN filtriranje i iterative scans: [pgvector zvanični repozitorijum](https://github.com/pgvector/pgvector#filtering).
- Evaluacija, autorizacija i verzionisanje su razvijeni praktični uglovi, ne tvrdnja da originalni demo već rešava te zahteve.

## 12 — Your 100-per-minute limit changed when you scaled out

**Nivo:** advanced. **Format:** tekst + dijagram.

### Tekst posta

“We limit each customer to 100 requests per minute.”

On which instance?

The built-in ASP.NET Core rate limiters keep their state in the application process. Put three instances behind a load balancer and each instance has its own counters.

A client reaching all three may consume three separate budgets. The exact traffic split depends on the balancer, but the configuration hasn't magically become a shared quota.

That's fine if the goal is protecting each instance. It's a different design problem if a paid API plan promises one limit across the whole service. That needs coordination at a gateway or a distributed implementation with the required consistency guarantees.

I'd also separate request rate from expensive work in flight.

A limit of 100 requests per minute can still allow many long-running exports at once. A concurrency limiter caps simultaneous executions. A window or token-bucket limiter controls a different dimension. Some endpoints need both.

Partitioning deserves a review too. For a tenant quota, use trusted tenant identity established by authentication. Letting a caller invent a new partition key on every request defeats the limit. Per-IP limits have their own complications with shared networks and reverse proxies.

And decide whether excess traffic waits or gets rejected. A long queue can consume the caller's entire timeout before useful work starts. Configure the rejection response deliberately; don't assume every limiter can estimate a meaningful Retry-After value.

For testing, send the same caller through multiple instances and include slow requests. Count completed work, rejected work and time spent waiting.

That tells you what your limit actually protects.

For the ASP.NET Core policies, partitioning and rejection-handler examples, read my rate-limiting walkthrough:
https://thecodeman.net/posts/rate-limiting-in-aspnet-core-built-in-ratelimiter

### Vizual

Jedan klijent sa strelicama ka tri instance, svaka ima `100 / minute` brojač. Naslov: **“Local budgets don't become a global quota.”** Ispod druga skica: `Rate = arrivals over time` naspram `Concurrency = active operations`. Broj 300 označiti kao mogući zbir tri lokalna budžeta, ne garantovan izmereni throughput.

### Izvori i tehnička provera

- [Built-in RateLimiter](https://thecodeman.net/posts/rate-limiting-in-aspnet-core-built-in-ratelimiter)
- [What Breaks at 10K Concurrent Connections](https://thecodeman.net/posts/what-breaks-first-at-10k-concurrent-connections-in-aspnet-core)
- Razlika algoritama, partitioning i rejection: [ASP.NET Core rate limiting](https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit?view=aspnetcore-10.0).

## 13 — Where should cancellation stop?

**Nivo:** advanced. **Format:** tekst + sequence diagram.

### Tekst posta

Passing CancellationToken through every layer is a good habit. You still have to decide what cancellation means after a side effect.

Imagine this order flow:

Validate the request. Save the order. Publish OrderPlaced. Return the response.

Now the client disconnects after the database commit. If you use RequestAborted for the publish and stop there, you can leave a saved order with no event sent.

The token did exactly what you asked. The workflow is what needs attention.

For reads, cancellation is usually straightforward: pass the request token to the database and outbound HTTP calls, and stop doing work when the result is no longer wanted.

For a write, identify the point where you've accepted responsibility for completing the operation. One option is saving the order and an outbox message in the same transaction. A separate worker then delivers the message using its own lifecycle and time budget.

Simply replacing RequestAborted with CancellationToken.None after the commit doesn't provide that durability. The process can still crash, and unbounded work can still hang.

There's also an outcome problem for the caller. A timeout or cancellation near a remote commit can leave the caller unsure whether the operation succeeded. Give retries a stable operation identity and provide a way to reconcile the result.

For CPU-heavy work, remember that a token doesn't interrupt the computation by force. The running code needs to observe it. Passing a token to Task.Run doesn't add checks inside your loop.

The test I'd add: disconnect the client at several points around the commit, then inspect durable state. Every accepted order should have a recoverable next step, even when nobody is waiting for the response.

I cover .NET details like this in my free newsletter. If you'd like the next one in your inbox, you can sign up here:
https://thecodeman.net/

### Vizual

Sequence diagram sa `Client`, `API`, `Database`, `Outbox worker`. U bazi jedan okvir `Order + event COMMIT`. Crvena linija prekida klijenta odmah posle commita. Worker i dalje preuzima durable event. Naslov: **“The caller left. Who owns the remaining work?”**

### Izvori i tehnička provera

- [Cancellation Tokens in ASP.NET Core](https://thecodeman.net/posts/cancellation-tokens-in-aspnet-core-mistakes)
- [Request Timeouts](https://thecodeman.net/posts/request-timeouts-in-aspnet-core)
- [Outbox Pattern](https://thecodeman.net/posts/outbox-pattern-in-dotnet)
- Timeout signal i odsustvo automatskog prekida izvršavanja: [ASP.NET Core request timeouts](https://learn.microsoft.com/en-us/aspnet/core/performance/timeouts?view=aspnetcore-10.0).
- Dodatni ugao: poslovna granica otkazivanja i unknown outcome. Ne tvrdi se da svaka timeout/cancellation situacija automatski rollback-uje izvršene operacije.

## 14 — Temporal history leaves some questions unanswered

**Nivo:** advanced. **Format:** tekst + matrica pitanja.

### Tekst posta

A customer asks: “Who changed the delivery address on my order?”

You query the temporal history and find the old address, the new address, and their validity periods.

Useful. But who made the change?

SQL Server temporal tables preserve row versions. They don't automatically know the authenticated application user, the support ticket behind a correction, or why a background job made that update.

If those questions matter, record that context explicitly. An audit record might include actor identity, operation ID, reason and the affected entity. Design how that record commits with the business change, so an update can't silently lose its explanation.

There's a timing detail worth knowing too. Temporal period values use the transaction's begin time in UTC. They aren't an exact timestamp of when someone clicked Save or when a transaction committed. That matters when you reconstruct a sequence of events around a long-running transaction.

I'd also be careful with “tamper-proof” claims. System versioning gives you history behavior, but it isn't a cryptographic proof that a sufficiently privileged operator couldn't alter the setup or historical data.

And restoring one old row doesn't necessarily restore a valid business state. An order address might need to agree with shipment records, labels already created, and other tables. A historical query is a starting point for that investigation.

My test would update the order through the API, a background job and an administrative path. Can support explain every change using the data we've actually stored?

If all three paths only tell you what changed, there's still part of the audit feature to build.

To try temporal history with EF Core, follow my order-history walkthrough. It covers the setup and historical queries:
https://thecodeman.net/posts/temporal-tables-efcore-auditing-history

### Vizual

Naslov **“What can your history answer?”** Matrica: `Previous values → temporal history`, `Validity periods → temporal history`, `Actor / reason / operation → explicit application audit context`, `Proof against privileged tampering → separate controls`. U dnu napomena: `Period time = transaction begin time (UTC)`.

### Izvori i tehnička provera

- [Temporal Tables with EF Core](https://thecodeman.net/posts/temporal-tables-efcore-auditing-history)
- [EF Interceptors](https://thecodeman.net/posts/ef-interceptors-in-dotnet)
- Semantika perioda: [SQL Server temporal table overview](https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal/overview?view=sql-server-ver17).
- Izmene history podataka sa dovoljnim privilegijama nakon isključenja versioning-a: [Stop system-versioning](https://learn.microsoft.com/en-us/sql/relational-databases/tables/temporal/stop-system-versioning?view=sql-server-ver17).
- Post precizira granice history funkcionalnosti; ne ponavlja tvrdnju iz članka da su temporal podaci sami po sebi tamper-evident audit trail.

## 15 — Keep the routing rule after removing the switch

**Nivo:** praktičan / intermediate. **Format:** tekst + dijagram.

### Tekst posta

Keyed services can clean up a factory switch in .NET. I'd still keep the decision about which provider to use easy to find.

Say you have three implementations of IPaymentGateway. Registering them under keys is straightforward. The interesting part is deciding which one should handle a payment.

That decision might depend on the merchant's contract, currency, region, or a provider outage. It's business behavior. Hiding it in calls to GetRequiredKeyedService across six handlers makes the switch disappear while scattering the routing policy.

I'd put the selection behind a small resolver with a clear input and output. The resolver can use keyed DI internally. The rest of the application asks for the gateway appropriate to the operation.

If the key is fixed for a consumer, [FromKeyedServices] can be enough. You don't need to build a dynamic routing abstraction for a dependency that never changes.

The checks I'd add are fairly ordinary: unknown provider, unsupported currency, missing registration, and whether the selected service has the right lifetime. A keyed scoped service is still scoped; the key doesn't make it safe to capture in a singleton.

I'd also treat fallback as an explicit policy. If a payment request times out, immediately trying another provider can create two charges when the first one actually succeeded. That's an outcome to reconcile, not just another implementation to resolve.

For notification channels or storage backends, the trade-offs will be different. That's why I like keeping the policy visible and testable.

Less wiring code is nice. Being able to explain why this request went to this provider is even more useful during support.

If you're working through decisions like this, take a look at my Design Patterns that Deliver ebook. Strategy and Factory are two of the patterns I work through with C# examples and trade-offs:
https://thecodeman.net/design-patterns-that-deliver-ebook

### Vizual

`Payment request → Routing policy → Keyed resolver → Gateway A/B/C`. Iznad routing policy: `Merchant / currency / region`. Ispod: `Unknown outcome ≠ automatic provider fallback`. Naslov: **“Where does your provider choice live?”**

### Izvori i tehnička provera

- [Keyed Services in .NET DI](https://thecodeman.net/posts/keyed-services-in-dotnet-dependency-injection)
- [Strategy Design Pattern](https://thecodeman.net/posts/strategy-design-pattern-will-help-you-refactor-code)
- API i lifetime: [Dependency injection in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection?view=aspnetcore-10.0).
- Ne koristi se pogrešan primer registracije svih servisa sa `KeyedService.AnyKey` iz bloga.

## 16 — The cache refill that brings old data back

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

Deleting the cache entry after a database update still leaves a race worth testing.

Here's one possible interleaving:

A reader misses the cache and reads the old profile from the database. A writer commits a new email address and invalidates the cache. Then the first reader finishes and puts the old profile back into Redis.

The invalidation happened. Stale data still came back.

Now add a second lookup key, such as email → user ID, and there are more states to reason about. The index can point to a missing profile. The profile can contain an email that no longer matches the lookup. The two entries can expire at different times.

Storing the full profile once and using secondary lookup keys avoids duplicated payloads, but it doesn't solve those races by itself.

I'd start by defining how stale the feature is allowed to be. For a display name, a short stale period may be acceptable. For an ownership or authorization decision, a stale cache may be the wrong authority altogether.

If stronger cache consistency is needed, a possible design uses monotonic entity versions plus an atomic conditional write. Keep a version or tombstone long enough to reject an older refill; deleting every trace of the new version removes that protection. Expiry and concurrent writers still need explicit handling.

There's a deployment wrinkle too: in Redis Cluster, multi-key transactions and scripts require the relevant keys to share a hash slot. Arbitrary email and user-ID keys won't necessarily do that.

I'd write the concurrency test before the helper class. Pause a reader after its database read, run the update and invalidation, then release the reader. See which version ends up in the cache.

I explain the primary-entry and secondary-key layout in my dual-key Redis article. Read it alongside the refill race above when designing your cache:
https://thecodeman.net/posts/dual-key-redis-caching-in-dotnet

### Vizual — carousel

1. **“The stale value came back after invalidation.”** Dve sočasne putanje: reader i writer.
2. **“Reader gets V1.”** Cache miss → database read → pause.
3. **“Writer commits V2.”** Update database → invalidate cache.
4. **“Reader resumes.”** Writes V1 into the empty cache. Mark the race.
5. **“Define the consistency you need.”** Bounded staleness? Version-aware refill? Authoritative read? Choose per feature.
6. **“Test the deployment too.”** Secondary-key expiry, dangling index, concurrent refill, Redis Cluster hash slots. CTA: **"Explore the dual-key cache layout. Link in the post."**

### Izvori i tehnička provera

- [Dual-Key Redis Caching](https://thecodeman.net/posts/dual-key-redis-caching-in-dotnet)
- [Memory Caching](https://thecodeman.net/posts/memory-caching-in-dotnet)
- Multi-key ograničenja: [Redis Cluster specification](https://redis.io/docs/latest/operate/oss_and_stack/reference/cluster-spec/).
- Race i version/tombstone pristup su dodatna analiza. Ne tvrdi se da originalni dual-key primer već garantuje konzistentnost; promena email indeksa ne ažurira automatski email u keširanom DTO-u.

## 17 — The slow client holding your database reader open

**Nivo:** advanced. **Format:** tekst + dijagram toka.

### Tekst posta

Changing a large export from ToListAsync() to streaming can fix one memory problem and expose another resource limit.

Suppose an EF Core query is streamed directly into the HTTP response. The client reads slowly. As backpressure travels upstream, the database reader may stay open for much longer, holding a connection while the response drains.

Memory looks better. Meanwhile, normal API requests can start waiting for database connections.

That's why I'd load-test exports with slow clients as well as fast ones. Watch active connections, pool wait time, time to first record, total duration and cancellation behavior.

NDJSON can be useful here: each completed line is an independent JSON value, so consumers can process records incrementally. A truncated final line still needs handling, and “I received some records” isn't proof that the export finished.

Once response headers and data have been sent, you also can't turn a mid-stream failure into a normal JSON error response with a fresh status code. Define how the consumer detects completion or interruption.

For a really large export, I'd consider bounded database pages written to a file in object storage, then serving that file independently of the query. That adds job management and storage, but it separates download speed from database connection lifetime.

If you page, define stable ordering and consistency expectations. Data changing between pages can produce an export that isn't a single snapshot.

IAsyncEnumerable is useful, but I'd trace buffering through the whole path: query execution, EF behavior, serializer, proxy and client. Any of those can change what “streaming” means in practice.

For the JSON Lines format and .NET streaming examples, read the full article here. Then try the slow-client test against your own export:
https://thecodeman.net/posts/streaming-json-in-dotnet-with-json-lines

### Vizual

`Database reader → serializer → proxy → slow client`, sa povratnim strelicama za backpressure. Obeležiti database connection koja ostaje zauzeta. Ispod alternativa: `Bounded DB pages → export file → download`. Naslov: **“Who pays for a slow download?”**

### Izvori i tehnička provera

- [Streaming JSON with JSON Lines](https://thecodeman.net/posts/streaming-json-in-dotnet-with-json-lines)
- [Iterator Pattern in .NET](https://thecodeman.net/posts/iterator-pattern-in-dotnet)
- EF može interno baferovati određene upite uprkos streaming potrošnji: [Efficient querying — buffering and streaming](https://learn.microsoft.com/en-us/ef/core/performance/efficient-querying#buffering-and-streaming).
- Izbegnut preview-specifičan API iz članka; post ne zahteva .NET 11 niti tvrdi da je konkretan serializer API stabilan.

## 18 — Give the agent a tool you can explain

**Nivo:** praktičan / intermediate. **Format:** tekst + tool-contract kartica.

### Tekst posta

For a first MCP server in .NET, I'd expose one boring operation that saves someone repeated manual work.

Get the status of an order. Look up a failed job. Run a bounded diagnostic against a test environment.

I'd avoid starting with “execute arbitrary SQL.” A narrow tool is easier to authorize, test, observe and describe accurately.

Take GetOrderStatus. Its contract should say which identifier it accepts, which fields it returns, and what happens when the order doesn't exist or the caller can't access it. Keep the payload small enough that the useful result doesn't disappear inside a huge response.

The server should derive the caller's scope from trusted authentication context. An order ID supplied by the model is input, not proof that the caller owns that order. The tool still needs the same authorization checks as any other entry point.

Descriptions help the model choose and call a tool. They don't enforce those checks. Neither does a read-only label in the tool metadata.

I'd test cancellation and time limits too. If the tool starts a diagnostic that runs for minutes, the contract needs a clear lifecycle instead of pretending it's a quick lookup.

One small implementation detail for stdio servers: keep protocol output on stdout and send diagnostics to stderr. A stray Console.WriteLine can break communication in a surprisingly annoying way.

Then try requests with missing IDs, inaccessible orders and malformed input. Inspect the actual tool calls and responses.

A small tool that returns reliable, well-scoped data gives the agent something useful to work with. You can add the next operation once that contract holds up.

Want a concrete example? I built a .NET MCP server that exposes API performance-testing tools. Here's the walkthrough:
https://thecodeman.net/posts/building-mcp-server-in-dotnet

### Vizual

Kartica **“GetOrderStatus”**: `Input: orderId`, `Scope: authenticated caller`, `Output: status + allowed summary fields`, `Limits: timeout + bounded payload`, `Errors: explicit and non-leaking`. Sa strane: `Description guides selection. Server enforces access.` Dole mali footer `stdio: protocol → stdout; logs → stderr`.

### Izvori i tehnička provera

- [Build an MCP Server in .NET for Claude (local draft)](../../posts/build-an-mcp-server-in-dotnet-for-claude.md)
- [Building an MCP Server for API Performance](https://thecodeman.net/posts/building-mcp-server-in-dotnet)
- Bezbednosna granica je na serveru; relevantna specifikacija: [MCP authorization security considerations](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2026-07-28/basic/authorization/security-considerations.mdx).
- Ograničenja anotacija: [MCP tool annotations](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/).
- Post ne otkriva stvarne korisničke podatke niti predlaže nekontrolisan pristup produkciji.

## 19 — A refund can fail too

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

The useful part of a saga design review starts around here:

Payment succeeded. Stock reservation failed. We requested a refund. The refund request timed out.

What state is the order in now?

“Rolled back” is probably too confident. You don't know whether the refund happened, and the original charge is already an external fact.

A saga needs explicit states for that uncertainty. Depending on the domain, that might include CompensationPending, RefundConfirmed and ManualReviewRequired. The names matter less than having a durable answer to “what do we know, and what should happen next?”

Compensation is another business operation. It can fail, be retried, arrive late, or need reconciliation with a provider. It needs idempotency just like the forward operation.

Message ordering adds another dimension. A payment notification can arrive after a timeout has moved the order into cancellation. The handler needs a defined transition for that case. Setting Paid = true without considering the current state is rarely enough.

I'd also test two messages reaching the same saga concurrently. A correlation ID routes them to the same logical workflow; it doesn't by itself prevent conflicting state updates. Use the persistence and concurrency controls provided by the framework, and verify their configuration.

Wolverine with durable persistence can handle a lot of the messaging machinery. You still need to define the business transitions and make external effects safe to repeat.

My test set would include duplicates, reversed delivery order, a crash after an external effect, and failed compensation. I'd also monitor how long sagas remain stuck in each state.

An order waiting for reconciliation should be visible to operations, with enough context for someone to resolve it.

For a concrete starting point, read my Wolverine and PostgreSQL saga walkthrough. Then extend the example with the failure paths your workflow needs:
https://thecodeman.net/posts/implementing-the-saga-pattern-with-wolverine-postgres

### Vizual — carousel

1. **“The refund timed out. Now what?”** Payment succeeded → stock failed → refund outcome unknown.
2. **“Persist what you know.”** `PaymentConfirmed → CompensationPending`.
3. **“Compensation can fail.”** Branches: confirmed, retry/reconcile, manual review.
4. **“Late messages need transitions.”** `Cancellation started + late PaymentReceived → explicit policy`.
5. **“Correlation isn't concurrency control.”** Two messages → one saga instance → persistence conflict handling.
6. **“Test the awkward paths.”** Duplicate, reorder, crash, failed compensation. Monitor state age. CTA: **"Start with the Wolverine saga example. Link in the post."**

### Izvori i tehnička provera

- [Saga Pattern with Wolverine and PostgreSQL](https://thecodeman.net/posts/implementing-the-saga-pattern-with-wolverine-postgres)
- [Saga Orchestration](https://thecodeman.net/posts/saga-orchestration-pattern)
- [Saga Implementation in C#](https://thecodeman.net/posts/saga-implementation-in-csharp)
- Framework lifecycle i concurrency: [Wolverine sagas](https://wolverinefx.io/guide/durability/sagas.html); persistence: [durable messaging](https://wolverinefx.io/guide/durability/).
- Refund scenario je novi edukativni primer. Nije predstavljen kao postojeći kompletan flow iz blogovog demonstracionog koda.

## 20 — Why low CPU doesn't mean spare capacity

**Nivo:** advanced. **Format:** carousel, 6 slajdova.

### Tekst posta

An API can run out of useful capacity while CPU still looks comfortable.

Here's a small calculation that helps explain why.

At a stable 200 requests per second and an average request duration of 100 ms, you'd expect roughly 20 requests in flight. If average duration rises to 2 seconds while arrivals stay at 200 per second, that becomes roughly 400.

Same arrival rate. Much more work sitting inside the system. This is an illustration of Little's Law using averages, not a benchmark or a prediction of your API's limit.

Those requests may be waiting for database connections, downstream HTTP calls or available workers. They don't have to consume much CPU while they wait.

I'd start a capacity test with a concrete target for latency and errors, then increase offered load while tracking completed throughput, tail latency, pool waits and queue age.

Be careful with the load generator. In a closed-loop test, virtual users wait for a response before continuing. As the service slows, they can send fewer requests, which changes the pressure you're applying.

An arrival-rate scenario in k6 can keep attempting the intended arrival rate independently of response time, provided the generator has enough capacity. Watch dropped iterations as well; otherwise you can mistake the generator's limit for the API's behavior.

Then deliberately slow a dependency and test recovery. Does the queue drain after traffic falls? Do retries keep the dependency overloaded? Can healthy endpoints still get resources?

The useful result is a measured operating range for a specified workload, deployment and latency target. Keep those conditions beside the number, so the next person knows when it needs to be measured again.

If this is the kind of .NET work you're getting into, join my free newsletter for more practical notes on performance and architecture:
https://thecodeman.net/

### Vizual — carousel

1. **“CPU is fine. Requests are waiting.”** API sa redovima za pool, worker i downstream.
2. **“L ≈ λ × W”** Average in-flight work = throughput × average time, in a stable system.
3. **“An illustrative example.”** `200/s × 0.1s ≈ 20` → `200/s × 2s ≈ 400`. Jasno označiti pretpostavke i da ovo nije benchmark.
4. **“Check how you generate load.”** Closed-loop slows arrivals as responses slow. Arrival-rate tests target a specified arrival rate.
5. **“Watch the waiting.”** Completed throughput, p95/p99, pool waits, queue age, dropped iterations.
6. **“Publish capacity with conditions.”** Workload + deployment + latency/error target + recovery behavior. CTA: **"More .NET performance and architecture by email. Link in the post."**

### Izvori i tehnička provera

- [Capacity Planning for .NET APIs](https://thecodeman.net/posts/capacity-planning-for-dotnet-apis-from-guessing-to-measured-scaling)
- [What Breaks at 10K Concurrent Connections](https://thecodeman.net/posts/what-breaks-first-at-10k-concurrent-connections-in-aspnet-core)
- [Monitoring .NET in Production](https://thecodeman.net/posts/how-to-monitor-dotnet-applications-in-production)
- [Getting Started with OpenTelemetry](https://thecodeman.net/posts/getting-started-with-opentelemetry)
- Arrival-rate model: [k6 constant arrival rate](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/); kapacitet generatora: [arrival-rate VU allocation](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/arrival-rate-vu-allocation/).
- Little's Law primer koristi proseke i pretpostavku stabilnog sistema; ne koristi p95 kao zamenu za prosečno vreme niti tvrdi da sistem u trajnom overload-u ima stacionarno stanje.
