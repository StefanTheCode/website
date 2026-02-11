---
title: "How to Monitor .NET Applications in Production with Health Checks, Prometheus, and Grafana"
subtitle: "Learn a complete, production-ready monitoring setup for .NET: liveness and readiness health checks, PostgreSQL dependency checks, Prometheus scraping via /metrics, Grafana dashboards, Docker Compose wiring, and custom metrics you can extend."
readTime: "Read Time: 10 minutes"
date: "Feb 11 2026"
category: ".NET"
meta_description: "Learn a complete, production-ready monitoring setup for .NET: liveness and readiness health checks, PostgreSQL dependency checks, Prometheus scraping via /metrics, Grafana dashboards, Docker Compose wiring, and custom metrics you can extend."
---

<!--START-->
##### This issue is **self-sponsored**.
##### By supporting my work and purchasing my products, you directly help me keep this newsletter free and continue creating high-quality, practical .NET content for the community. 
&nbsp;

##### Thank you for the support 🙌  
&nbsp;

##### P.S. I’m currently building a new course, [Pragmatic .NET Code Rules](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226), focused on creating a predictable, consistent, and self-maintaining .NET codebase using .editorconfig, analyzers, Visual Studio code cleanup, and CI enforcement.
&nbsp;

##### The course is available for pre-sale until the official release, with early-bird pricing for early adopters.
##### You can find all the details [here](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_source=website&utm_campaign=020226).

&nbsp;  
&nbsp;  
### Why .NET Monitoring Is Not Optional in Production
&nbsp;  
&nbsp;
##### A .NET app rarely “dies” in production.
&nbsp;
##### More often:
##### • the API is running but **can’t reach the database**
##### • requests start timing out because **connection pool is exhausted**
##### • background jobs silently stop, but the process remains alive
##### • latency increases after a deployment, and you notice it **hours later**
&nbsp;
##### That’s why production monitoring needs two layers:
##### 1. **Health checks** - “Is the service alive? Is it ready? 
##### 2. **Metrics** - “How is it behaving over time?”
&nbsp;
##### This guide builds a complete .NET monitoring setup with:
##### • ASP.NET Core health checks (liveness + readiness)
##### • PostgreSQL dependency health
##### • Prometheus /metrics endpoint
##### • Grafana dashboards
##### • Docker Compose to run the entire stack locally like production
##### • custom metrics you can extend later

&nbsp;  
&nbsp;  
### What Problem Health Checks and Metrics Actually Solve
&nbsp;  
&nbsp;  
##### Before writing code, let’s be clear about why this setup exists.
&nbsp;  
##### In production, you need answers to questions like:
##### • Is the service running or just stuck?
##### • Is it ready to receive traffic?
##### • Are dependencies healthy?
##### • Are background jobs actually executing?
##### • Is performance degrading over time?
&nbsp;  

#### Health checks and metrics solve different problems:
&nbsp;  
##### Health checks answer binary questions
##### • Is the service alive?
##### • Is it ready to serve requests?
&nbsp;  
##### Metrics answer behavioral questions
##### • How many requests per second?
##### • How long do requests take?
##### • How many jobs were processed?
##### • How often do failures happen?
&nbsp;  
##### You need **both**.

&nbsp;  
&nbsp;  
### What Prometheus Is?
&nbsp;  
&nbsp;  

##### Prometheus is a time-series metrics system.
&nbsp;  
##### It does three key things:
##### • scrapes metrics from apps (pull model)
##### • stores them over time
##### • lets you query them using PromQL
&nbsp;  
##### Important detail for juniors:
 
##### ✅ Your app exposes `/metrics`
##### ✅ Prometheus periodically calls `/metrics`
##### ✅ Prometheus stores the numeric values
##### ❌ Prometheus is not a dashboard  

&nbsp;  
&nbsp;  
### What Grafana Is?
&nbsp;  
&nbsp;  

##### **Grafana** is a visualization layer.
&nbsp;  
##### It: 
##### • connects to Prometheus as a data source (in our case)
##### • turns metrics into dashboards
##### • can trigger alerts
&nbsp;  
##### Prometheus stores data.
##### Grafana makes it visible. 

&nbsp;  
&nbsp;  
### Understanding Liveness and Readiness Health Checks in .NET
&nbsp;  
&nbsp;  

##### One of the most common production mistakes is exposing a single health endpoint.
&nbsp;  

##### That leads to broken deployments and unnecessary restarts.
&nbsp;  

#### Liveness checks
&nbsp;  

##### Liveness answers one question:
&nbsp;  

##### *Is the process running?*
&nbsp;  
 
##### It must not check databases, HTTP calls, or external dependencies.
&nbsp;  
 
##### If this fails, the service is considered dead.
&nbsp;  
 
#### Readiness checks
&nbsp;  
 
##### Readiness answers a different question:
&nbsp;  
 
##### *Is the service ready to handle traffic?*
&nbsp;  
 
##### This must check:
##### • databases
##### • external APIs
##### • message brokers
&nbsp;  

##### If readiness fails, traffic should be stopped, but the service should not be killed.
&nbsp;  
 
##### We will expose two endpoints:
##### • `/health/live`
##### • `/health/ready`

&nbsp;  
&nbsp;  
### The Demo System We’ll Build (Two .NET Services + PostgreSQL)
&nbsp;  
&nbsp;  

##### We’ll build a small but realistic system consisting of:
&nbsp;  
##### **1. Orders API**
##### • ASP.NET Core Web API
##### • Exposes health checks
##### • Exposes /metrics for Prometheus
&nbsp;  
##### **2. Billing Worker**
##### • Background service
##### • Periodically processes jobs
##### • Exposes health checks
##### • Includes **custom metric**: `billing_jobs_processed_total`
&nbsp;  
##### **3. PostgreSQL database**
##### • Used as a readiness dependency
&nbsp;  
##### **4. Prometheus**
##### • Scrapes metrics from both services 
&nbsp;  
##### **5. Grafana**
##### • Visualizes metrics via dashboards
&nbsp;  
##### All services will run locally using Docker Compose, exactly like a real environment.

&nbsp;  
&nbsp;  
### Orders API: Implementing Health Checks and Metrics
&nbsp;  
&nbsp;  

##### **Add required NuGet packages:**
```csharp

dotnet add OrderManagement.Api package AspNetCore.HealthChecks.NpgSql
dotnet add OrderManagement.Api package prometheus-net.AspNetCore
```
&nbsp;  
##### **Explanation**
##### • `AspNetCore.HealthChecks.NpgSql` gives us a ready-made PostgreSQL health probe.
##### • `prometheus-net.AspNetCore` exposes `/metrics` and HTTP request metrics.
&nbsp;  
##### **Health check configuration (Program.cs):**
```csharp

var postgres = builder.Configuration.GetConnectionString("Postgres")
    ?? "Host=localhost;Port=5432;Database=orders;Username=postgres;Password=postgres";

// Health checks
builder.Services.AddHealthChecks()
    // Liveness: “process is alive”
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: new[] { "live" })
    // Readiness: “dependencies are reachable”
    .AddNpgSql(postgres, name: "postgres", tags: new[] { "ready" });
```
&nbsp;  

##### • self is the liveness probe
##### • PostgreSQL is checked only for readiness
&nbsp;  

##### **Health endpoints:**
```csharp

var app = builder.Build();

app.UseHttpMetrics();
app.MapMetrics("/metrics");

app.MapHealthChecks("/health/live", new HealthCheckOptions {
    Predicate = r => r.Tags.Contains("live")
});

app.MapHealthChecks("/health/ready", new HealthCheckOptions {
    Predicate = r => r.Tags.Contains("ready")
});

app.MapGet("/api/ping", () => Results.Ok (new { ok = true, at = DateTimeOffset.UtcNow }));
```
&nbsp;  

##### **Explanation**
##### • `/health/live` checks only the app itself.
##### • `/health/ready` checks PostgreSQL connectivity.
##### • `/metrics` exposes Prometheus-format metrics.
##### • `UseHttpMetrics()` auto-collects request metrics.

&nbsp;  
&nbsp;  
### Billing Worker: Add an HTTP host + Health + Custom Metrics
&nbsp;  
&nbsp;  

##### You need the same packages as for the Order API.
&nbsp;  
##### A worker template doesn’t expose HTTP endpoints by default.
&nbsp;  

##### But we want:
##### • `/health/*`
##### • `/metrics`
&nbsp;  

##### So we host a minimal web server **inside the worker**.
&nbsp;  
 
##### **Billing.Worker/Program.cs**
```csharp
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Prometheus;

namespace OrderManagement.Billing.Worker;

public partial class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        var postgres = builder.Configuration.GetConnectionString("Postgres")
                     ?? "Host=localhost;Port=5432;Database=appdb;Username=app;Password=app";

        // Health checks
        builder.Services.AddHealthChecks()
            .AddCheck("self", () => HealthCheckResult.Healthy(), tags: new[] { "live" })
            .AddNpgSql(postgres, name: "postgres", tags: ["ready"]);

        // Background job runner
        builder.Services.AddHostedService<BillingJobRunner>();

        var app = builder.Build();

        // Metrics
        app.UseHttpMetrics();
        app.MapMetrics("/metrics");

        // Health endpoints
        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = r => r.Tags.Contains("live")
        });

        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = r => r.Tags.Contains("ready")
        });

        app.Run();
    }

    // Custom business metric: how many jobs were processed
    public static readonly Counter JobsProcessed = Metrics.CreateCounter(
        "billing_jobs_processed_total",
        "Total number of billing jobs processed.");

    internal sealed class BillingJobRunner : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Simulate “job processed”
                JobsProcessed.Inc();

                await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
            }
        }
    }
}
```
&nbsp;  
##### **Explanation**
##### • This worker now exposes `/metrics` and health endpoints.
##### • `billing_jobs_processed_total` is a **custom metric** you’ll graph in Grafana.
##### • This is how you monitor background processing in real systems..

&nbsp;  
&nbsp;  
### Docker: Containerize both .NET services correctly  
&nbsp;  
&nbsp;  

##### This is where my previous version was too hand-wavy.
&nbsp;  

##### Here’s the correct, production-style approach: **multi-stage Dockerfiles**.  
&nbsp;  

##### **OrderManagement.Api/Dockerfile:**

```csharp

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OrderManagement.Api/OrderManagement.Api.csproj", "OrderManagement.Api/"]
RUN dotnet restore "./OrderManagement.Api/OrderManagement.Api.csproj"
COPY . .
WORKDIR "/src/OrderManagement.Api"
RUN dotnet build "./OrderManagement.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./OrderManagement.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrderManagement.Api.dll"]
```
&nbsp;
##### **Billing.Worker/Dockerfile:**

```csharp

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["OrderManagement.Billing.Worker/OrderManagement.Billing.Worker.csproj", "OrderManagement.Billing.Worker/"]
RUN dotnet restore "./OrderManagement.Billing.Worker/OrderManagement.Billing.Worker.csproj"
COPY . .
WORKDIR "/src/OrderManagement.Billing.Worker"
RUN dotnet build "./OrderManagement.Billing.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./OrderManagement.Billing.Worker.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OrderManagement.Billing.Worker.dll"]
```
&nbsp;  

##### **Explanation**
##### • The SDK image builds the app.
##### • The runtime image runs the published output.
##### • Both listen on port 8080 inside their containers.


&nbsp;  
&nbsp;  
### Docker Compose: Start in the correct order (DB → apps → Prometheus → Grafana) 
&nbsp;  
&nbsp;  

#####  Create `docker-compose.yml` in the solution root:

```csharp
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5433"

  orders-api:
    build:
      context: .
      dockerfile: OrderManagement.Api/Dockerfile
    environment:
      ConnectionStrings__Postgres:
      Host=postgres;Port=5433;Database=orders;Username=postgres;Password=postgres
    ports:
      - "8082:8080"
    depends_on:
      - postgres

  billing-worker:
    build:
      context: .
      dockerfile: OrderManagement.Billing.Worker/Dockerfile
    environment:
      ConnectionStrings__Postgres:
      Host=postgres;Port=5433;Database=orders;Username=postgres;Password=postgres
    ports:
      - "8081:8080"
    depends_on:
      - postgres

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
    ports:
      - "9090:9090"
    depends_on:
      - orders-api
      - billing-worker

  grafana:
    image: grafana/grafana:latest
    volumes:
      - ./ops/grafana/provisioning:/etc/grafana/provisioning:ro
      - ./ops/grafana/dashboards:/var/lib/grafana/dashboards:ro
    ports:
      - "3003:3000"
    depends_on:
      - prometheus
```
&nbsp; 

##### **Explanation**
##### • Postgres must exist before readiness checks can pass.
##### • Both .NET apps start after Postgres.
##### • Prometheus starts after apps because it needs targets to scrape.
##### • Grafana starts after Prometheus because it needs a data source.

![Docker Compose Up](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/docker.png)

&nbsp;  
&nbsp;  
### How to Add Scraping Configuration with Prometheus - /metrics
&nbsp;  
&nbsp;

##### Create `ops/prometheus/prometheus.yml` in your root folder of the solution:

```csharp

global:
  scrape_interval: 5s

scrape_configs:
  - job_name: "orders-api"
    metrics_path: /metrics
    static_configs:
      - targets:
          - "orders-api:8080"

  - job_name: "billing-worker"
    metrics_path: /metrics
    static_configs:
      - targets:
          - "billing-worker:8080"
```
&nbsp;

##### **Explanation**
##### • Prometheus scrapes every 5 seconds.
##### • Each .NET service becomes its own job.
##### • targets are Docker service names  - Docker Compose provides DNS for them.

&nbsp;  
&nbsp;  
### How to Add a Grafana Container: Provision the Prometheus datasource automatically
&nbsp;  
&nbsp;  

##### `ops/grafana/provisioning/datasources/datasource.yml`

```csharp

apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
```

##### **Explanation**
##### • Grafana will start with Prometheus already connected.
##### • This is how teams avoid the “works on my machine” dashboard setup.

&nbsp;  
&nbsp;  
### Run everything and verify each layer
&nbsp;  
&nbsp; 

##### Start the stack:

```csharp

docker compose up --build
```
&nbsp; 

##### Now verify in this order:
&nbsp; 
 
#### 1) Check health endpoints
##### • Orders API liveness: `http://localhost:8082/health/live`
##### • Orders API readiness: `http://localhost:8082/health/ready`
##### • Worker readiness: `http://localhost:8081/health/ready`

![HealthCheck endpoints](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/health-check-endpoints.png)
&nbsp;  

#### 2) Check /metrics
##### • Orders API metrics: `http://localhost:8082/metrics`
##### • Worker metrics: `http://localhost:8081/metrics`
![Metrics](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/metrics.png)
&nbsp;

##### Look for:
##### • `http_requests_received_total`
##### • `billing_jobs_processed_total`
&nbsp;
  
#### 3) Check Prometheus targets
##### • Prometheus UI: `http://localhost:9090`
##### • Go to **Status → Targets**
##### • Both targets should be **UP**
![Prometheus](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/prometheus.png)
&nbsp;

####  4) Check the Grafana dashboard
##### • Grafana: `http://localhost:3000` (default login `admin`/`admin`)
&nbsp;

##### At this point, Prometheus is already running and successfully scraping metrics from both .NET services.
&nbsp;

##### Grafana is also running, but it doesn’t show anything yet, because dashboards do not exist by default.
&nbsp;
 
##### So, let's create the first dashboard.
&nbsp;

##### Before creating a dashboard, Grafana needs to know **where the metrics are coming from**.
&nbsp;

##### 1. In the left-hand menu, click **Connections → Data sources**
##### 2. You should already see **Prometheus** in the list
##### • If you used provisioning, it will be there automatically
##### 3. Click on **Prometheus**
##### 4. Verify the URL: `http://prometheus:9090 `
##### 5. Click **Save & Test**
&nbsp;

##### You should see a green confirmation message saying that the data source is working.
&nbsp;

##### Now we can create a dashboard.
&nbsp;

##### 1. In the left-hand menu, click **Dashboards**
##### 2. Click New
##### 3. Click New dashboard
##### 4. Click **Add visualization**
&nbsp;

##### Grafana will now ask you to choose a **data source**.
##### 5. Select **Prometheus**
&nbsp;

##### At this point, you are inside the panel editor.
![Grafana Dashboard](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/grafana-dashboard.png)
&nbsp;

#### 5) Create Your First Panel (HTTP Requests per Second)
&nbsp;
 
##### Let’s start with a very common and useful metric: HTTP requests per second for the Orders API.
&nbsp;
 
##### **Write the PromQL query**
&nbsp;
 
##### In the **Query section**, enter:

```csharp

rate(http_requests_received_total{job="orders-api"}[1m])
```
##### You should get something like this:
![Http Requests Grafana](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/http-request-grafana.png)
&nbsp;

##### Give it a name and save Dashboard. 
&nbsp;

##### Okay, what about the custom metric we have added: `billing_jobs_processed_total`
&nbsp;

##### Let's use the same approach and in the Query section write:

```csharp
rate(billing_jobs_processed_total[1m]) * 60
```
##### What this shows
##### • approximate **jobs per minute**
##### • easier for non-technical stakeholders to understand
![First Grafana Dashboard](/images/blog/posts/how-to-monitor-dotnet-applications-in-production/first-grafana-dashboard.png)

&nbsp;  
&nbsp;  
### Wrapping Up: Monitoring Is a Skill, Not a Tool
&nbsp;  
&nbsp;  

##### Monitoring is not something you “add later”.
&nbsp;  
 
##### It’s a **skill**.
##### And like every skill, it’s built through:
##### • understanding the concepts
##### • wiring the system end to end
##### • knowing what actually matters in production
&nbsp;  

##### In this article, you saw:
##### • How liveness and readiness health checks should really be used
##### • How to expose meaningful /metrics from .NET
##### • How Prometheus scrapes those metrics
##### • How Grafana turns them into answers
##### • How to monitor **background work**, not just HTTP requests
&nbsp;  

##### This is the baseline I expect in real .NET systems, not an advanced setup, not over-engineered, just correct.
&nbsp;  
  
##### **📦 Want the Full Source Code?**
&nbsp;  
 
##### All source code from this article (projects, Docker setup, Prometheus config, Grafana dashboards) is available for free inside [my private .NET community](https://www.skool.com/thecodeman-community-2911).
&nbsp;  
 
#### [🎓 This Topic Goes Even Deeper in My Upcoming Course](https://thecodeman.net/pragmatic-dotnet-code-rules?utm_medium=website?utm_campaign=how_to_monitor)
&nbsp;  
 
##### I’m currently building a course focused on **production-grade .NET practices**, not theory, not “hello world”.
&nbsp;  
 
##### Monitoring is a **core chapter** in that course.
&nbsp;  
 
##### We’ll go deeper into:
##### • alerting strategies (what should wake you up at night)
##### • PromQL basics for .NET developers
##### • choosing the right metrics (and avoiding metric noise)
##### • OpenTelemetry integration
##### • structuring monitoring across multiple services
##### • and common production mistakes teams repeat for years
&nbsp;  

##### The course is currently available for **$59.89**.
&nbsp;  
 
##### Here is the **HINT**:👇
##### **Community members get an even bigger discount.** (shhh, I didn't say that)
&nbsp;  
 
##### So if you’re thinking: *“I want the source code anyway…”*
&nbsp;  
 
##### Joining the group first is simply the smarter move. 
&nbsp;  

##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->