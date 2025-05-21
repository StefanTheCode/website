---
title: "Benchmarking in .NET Step by step"
category: ".NET"
subtitle: "We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU..."
date: "Sep 25 2023"
---
&nbsp;
&nbsp;

### The background
&nbsp;
&nbsp;
##### **"You can't improve what you don't measure."** - someone once said.
##### And he/she was right.
&nbsp;
##### We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU, memory usage, and the like. In such cases, we approach **code optimization**. But in order to improve the parts of the code that are not good, it is necessary to measure the performance.
&nbsp;
##### You can use the **BenchmarkDotNet library** for that.

&nbsp;
&nbsp;
### What is BenchamrkDotNet?
&nbsp;
&nbsp;

&nbsp;
##### BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
&nbsp;
##### It takes care of all the best practices related to benchmarking, like:
&nbsp;
##### • Running the benchmarks in a standalone process.
##### • Warming up.
##### • Minimizing side effects.
##### • Collecting and aggregating the data.
##### • Producing detailed performance reports.

&nbsp;
&nbsp;
### How to use BenchamrkDotNet?
&nbsp;
&nbsp;

#### 1. Install the NuGet Package
&nbsp;
##### To start using BenchmarkDotNet, you should install it via NuGet:

```csharp

Install-Package BenchmarkDotNet

```
&nbsp;
#### 2. Create Benchmarks
&nbsp;
##### Write the code you want to benchmark in a method and annotate it with the **[Benchmark]** attribute.

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
&nbsp;
#### 3. Run Benchmarks
&nbsp;

##### To run the benchmarks, you create a new instance of the **BenchmarkRunner** class and call the Run method.
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

&nbsp;
##### This will run the benchmark and print the results in the console. The summary object also contains the results, which can be used programmatically if needed.
&nbsp;
##### What do the results look like?
![Benchmarking Results](/images/blog/posts/benchmarking-in-dotnet-step-by-step/benchmarking-results.png)
&nbsp;
#### 4. Interpret Result
&nbsp;
##### BenchmarkDotNet provides a detailed summary including:
&nbsp;
##### • Mean execution time
##### • Standard deviation
##### • Allocated memory (if you enable it)
##### • And many other metrics.

&nbsp;
&nbsp;
### Advanced features
&nbsp;
&nbsp;

&nbsp;
##### BenchmarkDotNet has a wealth of advanced features, including:
&nbsp;
#### • Parameterization
&nbsp;
#####  You can run benchmarks with different parameters to see how they affect performance.

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
&nbsp;
#### • Multiple Runtimes
&nbsp;
#####  To run benchmarks against different .NET runtimes, you can use the **[CoreJob, ClrJob, MonoJob]** attributes. You'll also need to adjust your project file to target multiple frameworks.
&nbsp;
##### First, adjust your .csproj:
&nbsp;
##### **< TargetFrameworks >net7.0;net6.0;net5.0</ TargetFrameworks >**
&nbsp;
##### Then, in your benchmark class:

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
&nbsp;
#### • Custom Configurations
&nbsp;
##### You can create a custom configuration that controls the benchmarking process.

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
&nbsp;
#### • Diagnostics
&nbsp;
##### To capture diagnostics like memory traffic or GC collections, you'll use the **[MemoryDiagnoser]** attribute.
&nbsp;
##### For more detailed diagnostics, you might consider other diagnosers available in BenchmarkDotNet, like **[DisassemblyDiagnoser]**.

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
&nbsp;
&nbsp;
### Wrapping up
&nbsp;
&nbsp;
##### BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
&nbsp;
#### Key Takeaways
&nbsp;
##### **Basic Usage**
&nbsp;
##### • Install via NuGet.
##### • Annotate methods with [Benchmark] to denote them as benchmarks.
##### • Use BenchmarkRunner.Run<> to execute benchmarks.
&nbsp;
##### **Advanced Features**
&nbsp;
##### • Parameterization: With [Params], one can input different parameters to the benchmarking method, allowing the assessment of performance across various scenarios.
##### • Multiple Runtimes: By targeting different runtimes like .NET Core, .NET Framework, and Mono, you can gauge the cross-runtime performance of code.
##### • Custom Configurations: Define precise benchmarking scenarios, controlling factors like the number of iterations or the warm-up phase.
##### Diagnostics: Beyond just timings, delve into memory allocation, garbage collection, and even disassembly to comprehend the deeper performance attributes and implications of your code.

&nbsp;
##### **Best Practices**
&nbsp;
##### • Craft concise benchmarks focusing on specific tasks
##### • Isolate benchmarks from external factors such as databases or network calls
##### • Guard against unintended code optimizations by ensuring the benchmarked code produces tangible side effects.
&nbsp;
##### A year ago I created a challenge to optimize some functions and I used Benchmarking there. You can see the code [here](https://github.com/StefanTheCode/OptimizeMePlease).

&nbsp;
##### That's all from me for today.
&nbsp;

## ** dream BIG! **