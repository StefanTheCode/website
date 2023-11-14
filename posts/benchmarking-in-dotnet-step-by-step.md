---
newsletterTitle: "#33 Stefan's Newsletter"
title: "Benchmarking in .NET Step by step"
subtitle: "We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU, memory usage, and the like. In such cases, we approach code optimization. But in order to improve the parts of the code that are not good, it is necessary to measure the performance."
date: "Sep 25 2023"
photoUrl: "/images/blog/newsletter21.png"
---
<br>
<br>

### The background
<br>
<br>
##### <b>"You can't improve what you don't measure."</b> - someone once said.
##### And he/she was right.
<br>
##### We often find ourselves in a situation where a certain method or part of the code does not work as we want in terms of execution speed on the CPU, memory usage, and the like. In such cases, we approach <b>code optimization</b>. But in order to improve the parts of the code that are not good, it is necessary to measure the performance.
<br>
##### You can use the <b>BenchmarkDotNet library</b> for that.

<br>
<br>
### What is BenchamrkDotNet?
<br>
<br>

<br>
##### BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
<br>
##### It takes care of all the best practices related to benchmarking, like:
<br>
##### • Running the benchmarks in a standalone process.
##### • Warming up.
##### • Minimizing side effects.
##### • Collecting and aggregating the data.
##### • Producing detailed performance reports.

<br>
<br>
### How to use BenchamrkDotNet?
<br>
<br>

#### 1. Install the NuGet Package
<br>
##### To start using BenchmarkDotNet, you should install it via NuGet:

![Install NuGet Package DotnetBenchmark](/images/blog/posts/benchmarking-in-dotnet-step-by-step/install-package-benchmarkdotnet.png)
<br>
#### 2. Create Benchmarks
<br>
##### Write the code you want to benchmark in a method and annotate it with the <b>[Benchmark]</b> attribute.


![Create Benchmarks](/images/blog/posts/benchmarking-in-dotnet-step-by-step/create-benchmarks.png)
<br>
#### 3. Run Benchmarks
<br>
##### To run the benchmarks, you create a new instance of the <b>BenchmarkRunner</b> class and call the Run method.

![Running Benchmarks](/images/blog/posts/benchmarking-in-dotnet-step-by-step/running-benchmarks.png)
<br>
##### This will run the benchmark and print the results in the console. The summary object also contains the results, which can be used programmatically if needed.
<br>
##### What do the results look like?
![Benchmarking Results](/images/blog/posts/benchmarking-in-dotnet-step-by-step/benchmarking-results.png)
<br>
#### 4. Interpret Result
<br>
##### BenchmarkDotNet provides a detailed summary including:
<br>
##### • Mean execution time
##### • Standard deviation
##### • Allocated memory (if you enable it)
##### • And many other metrics.

<br>
<br>
### Advanced features
<br>
<br>

<br>
##### BenchmarkDotNet has a wealth of advanced features, including:
<br>
#### • Parameterization
<br>
#####  You can run benchmarks with different parameters to see how they affect performance.
![Parameterized Benchmarks](/images/blog/posts/benchmarking-in-dotnet-step-by-step/parameterized-benchmarks.png)
<br>
#### • Multiple Runtimes
<br>
#####  To run benchmarks against different .NET runtimes, you can use the <b>[CoreJob, ClrJob, MonoJob]</b> attributes. You'll also need to adjust your project file to target multiple frameworks.
<br>
##### First, adjust your .csproj:
<br>
##### <b>< TargetFrameworks >net7.0;net6.0;net5.0</ TargetFrameworks ></b>
<br>
##### Then, in your benchmark class:

![Multi Runtime Benchmarks](/images/blog/posts/benchmarking-in-dotnet-step-by-step/multi-runtime-benchmarks.png)
<br>
#### • Custom Configurations
<br>
##### You can create a custom configuration that controls the benchmarking process.
![Custom Benchmarking Configuration](/images/blog/posts/benchmarking-in-dotnet-step-by-step/custom-benchmarking-configuration.png)
<br>
#### • Diagnostics
<br>
##### To capture diagnostics like memory traffic or GC collections, you'll use the <b>[MemoryDiagnoser]</b> attribute.
<br>
##### For more detailed diagnostics, you might consider other diagnosers available in BenchmarkDotNet, like <b>[DisassemblyDiagnoser]</b>.

![Memory Diagnostics Benchmarking](/images/blog/posts/benchmarking-in-dotnet-step-by-step/memory-diagnostics-benchmarks.png)

<br>
<br>
### Wrapping up
<br>
<br>
##### BenchmarkDotNet is an open-source, efficient .NET library that turns your methods into benchmarks, monitors them, and offers insights into the collected performance data.
<br>
#### Key Takeaways
<br>
##### <b>Basic Usage</b>
<br>
##### • Install via NuGet.
##### • Annotate methods with [Benchmark] to denote them as benchmarks.
##### • Use BenchmarkRunner.Run<> to execute benchmarks.
<br>
##### <b>Advanced Features</b>
<br>
##### • Parameterization: With [Params], one can input different parameters to the benchmarking method, allowing the assessment of performance across various scenarios.
##### • Multiple Runtimes: By targeting different runtimes like .NET Core, .NET Framework, and Mono, you can gauge the cross-runtime performance of code.
##### • Custom Configurations: Define precise benchmarking scenarios, controlling factors like the number of iterations or the warm-up phase.
##### Diagnostics: Beyond just timings, delve into memory allocation, garbage collection, and even disassembly to comprehend the deeper performance attributes and implications of your code.

<br>
##### <b>Best Practices</b>
<br>
##### • Craft concise benchmarks focusing on specific tasks
##### • Isolate benchmarks from external factors such as databases or network calls
##### • Guard against unintended code optimizations by ensuring the benchmarked code produces tangible side effects.
<br>
##### A year ago I created a challenge to optimize some functions and I used Benchmarking there. You can see the code [here](https://github.com/StefanTheCode/OptimizeMePlease).

<br>
##### That's all from me for today.
<br>

## <b > dream BIG! </b>