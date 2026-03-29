---
title: "Benchmarking in .NET Step by step"
subtitle: "We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU..."
date: "Sep 25 2023"
category: ".NET"
readTime: "Read Time: 4 minutes"
meta_description: "We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU..."
---

<!--START-->

## The background
**"You can't improve what you don't measure."** - someone once said.
And he/she was right.
We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU, memory usage, and the like. In such cases, we approach **code optimization**. But in order to improve the parts of the code that are not good, it is necessary to measure the performance.
You can use the **BenchmarkDotNet library** for that.

## What is BenchamrkDotNet?

BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
It takes care of all the best practices related to benchmarking, like:
• Running the benchmarks in a standalone process.
• Warming up.
• Minimizing side effects.
• Collecting and aggregating the data.
• Producing detailed performance reports.

## How to use BenchamrkDotNet?

### 1. Install the NuGet Package
To start using BenchmarkDotNet, you should install it via NuGet:

```csharp
Install-Package BenchmarkDotNet
```
### 2. Create Benchmarks
Write the code you want to benchmark in a method and annotate it with the **[Benchmark]** attribute.

```csharp
using BenchmarkDotNet.Atrributes;

public class MyBenchmarks
{
    [Benchmark]
    public void SomeBenchmark()
    {
        //Your code here...
    }
}
```
### 3. Run Benchmarks

To run the benchmarks, you create a new instance of the **BenchmarkRunner** class and call the Run method.
```csharp
using BenchmarkDotNet.Running;

class Program
{
    static void Main(string[] args)
    {
        var summary = BenchmarkRunner.Run<MyBenchmarks>();
    }
}
```

This will run the benchmark and print the results in the console. The summary object also contains the results, which can be used programmatically if needed.
What do the results look like?
![Benchmarking Results](/images/blog/posts/benchmarking-in-dotnet-step-by-step/benchmarking-results.png)
### 4. Interpret Result
BenchmarkDotNet provides a detailed summary including:
• Mean execution time
• Standard deviation
• Allocated memory (if you enable it)
• And many other metrics.

## Advanced features

BenchmarkDotNet has a wealth of advanced features, including:
### • Parameterization
You can run benchmarks with different parameters to see how they affect performance.

```csharp
using BenchmarkDotNet.Attributes;

public class ParameterizedBenchmarks
{
    [Params(100, 200, 300)]
    public int N;

    [Benchmark]
    public in SumUpToN()
    {
        int sum = 0;
        
        for(int i=0; i < N; i++)
            sum+=i;

        return sum;
    }
}
```
### • Multiple Runtimes
To run benchmarks against different .NET runtimes, you can use the **[CoreJob, ClrJob, MonoJob]** attributes. You'll also need to adjust your project file to target multiple frameworks.
First, adjust your .csproj:
< TargetFrameworks >net7.0;net6.0;net5.0</ TargetFrameworks >
Then, in your benchmark class:

```csharp
using BenchmarkDotNet.Attributes;
using BenchmarkDotNet.Jobs;

[CoreJob, ClrJob, MonoJob]
public class MultiRuntimeBenchmarks
{
    [Benchmark]
    public void SomeBenchmark()
    {
        //Your code here...
    }
}
```
### • Custom Configurations
You can create a custom configuration that controls the benchmarking process.

```csharp
using BenchmarkDotNet.Configs;
using BenchmarkDotNet.Jobs;
using BenchmarkDotNet.Attributes;

public class CustomConfig : ManualConfig
{
    public CustomConfig()
    {
        AddJob(Job.Default.WithWarmupCount(3).WithIterationCount(10));
    }
}

[Config(typeof(CustomConfig))]
public class CustomConfigurationBenchmarks
{
    [Benchmark]
    public void SomeBenchmark()
    {
        //Your code here...
    }
}
```
### • Diagnostics
To capture diagnostics like memory traffic or GC collections, you'll use the **[MemoryDiagnoser]** attribute.
For more detailed diagnostics, you might consider other diagnosers available in BenchmarkDotNet, like **[DisassemblyDiagnoser]**.

```csharp
using BenchmarkDotNet.Attributes;

[MemoryDiagnoser]
public class MemoryDiagnosticsBenchmarks
{
    [Benchmark]
    public List<int> CreateList()
    {
        return new List<int> { 1, 2, 3, 4, 5 };
    }
}
```
## Wrapping up
BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
### Key Takeaways
Basic Usage
• Install via NuGet.
• Annotate methods with [Benchmark] to denote them as benchmarks.
• Use BenchmarkRunner.Run<> to execute benchmarks.
Advanced Features
• Parameterization: With [Params], one can input different parameters to the benchmarking method, allowing the assessment of performance across various scenarios.
• Multiple Runtimes: By targeting different runtimes like .NET Core, .NET Framework, and Mono, you can gauge the cross-runtime performance of code.
• Custom Configurations: Define precise benchmarking scenarios, controlling factors like the number of iterations or the warm-up phase.
Diagnostics: Beyond just timings, delve into memory allocation, garbage collection, and even disassembly to comprehend the deeper performance attributes and implications of your code.

Best Practices
• Craft concise benchmarks focusing on specific tasks
• Isolate benchmarks from external factors such as databases or network calls
• Guard against unintended code optimizations by ensuring the benchmarked code produces tangible side effects.
A year ago I created a challenge to optimize some functions and I used Benchmarking there. You can see the code [here](https://github.com/StefanTheCode/OptimizeMePlease).

That's all from me for today.

## dream BIG!


---

Want to enforce clean code automatically? My [Pragmatic .NET Code Rules](/pragmatic-dotnet-code-rules) course shows you how to set up analyzers, CI quality gates, and architecture tests - a production-ready system that keeps your codebase clean without manual reviews. Or grab the [free Starter Kit](/dotnet-code-rules-starter-kit) to try it out.

<!--END-->
