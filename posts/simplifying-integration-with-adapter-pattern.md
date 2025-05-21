---
title: "Simplifying Integration with the Adapter Pattern"
subtitle: "Imagine you’ve just moved to a new country. You’re excited to set up your home and plug in your laptop, only to realize the power outlets are completely different from the ones back home. "
date: "Jan 27 2025"
category: "Design Patterns"
readTime: "Read Time: 8 minutes"
meta_description: "The Adapter Design Pattern is a structural design pattern that allows two incompatible interfaces to work together by acting as a bridge. "
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### • 🚀 Optimize Dev/test environments in .NET: there's no need to manage seed data, keep environments in sync, or wait for instances to be available. Try **database branching workflow** in Neon right away for free. [Start here!](https://neon.tech/?ref=snn)
&nbsp;   

##### • I launched my YouTube channel and built The CodeMan Community - your hub for .NET content, mini-courses, and expert advice! **The first 100 members get in for just $4/month!** 🚀 Join now and grab my first ebook for free:  - [Join now](https://www.skool.com/thecodeman/about)

<!--START-->

&nbsp; &nbsp; 
### The Problem: A Real-World Story
&nbsp; &nbsp; 
##### Imagine you’ve just moved to a new country. You’re excited to set up your home and plug in your laptop, only to realize the power outlets are completely different from the ones back home. 
&nbsp; 
##### Your laptop’s plug doesn’t fit into the wall socket. Panic sets in - your laptop is essential for work! 
&nbsp; 
##### What can you do?
&nbsp; 
##### You visit a local store and discover the solution: a power adapter. The adapter lets your laptop’s plug fit seamlessly into the foreign socket. It doesn’t change the wall socket or your laptop plug; it simply acts as a bridge, translating one interface into another. 
&nbsp; 
##### Problem solved!
&nbsp; 
##### In the software world, you often encounter mismatched systems. For instance, you’re building a modern application that needs to integrate with a legacy payment gateway.
&nbsp;
##### Your application works with REST APIs, while the payment gateway only supports SOAP-based services. They speak different “languages” and can’t communicate directly.
&nbsp;
##### If you modify the legacy system to support REST APIs, it’s a costly and risky endeavor. Similarly, rewriting your application to support SOAP is time-consuming and unnecessary. 
&nbsp;
##### How do you bridge the gap?

&nbsp; 
&nbsp; 
### The Solution: The Adapter Pattern
&nbsp; 
&nbsp; 

##### The Adapter pattern solves this problem by acting as a translator. It allows two incompatible interfaces to work together without changing their existing code. 
&nbsp; 

##### Here’s how it works:
&nbsp; 

##### 1. Create an Adapter: Build a new class that implements the interface your application expects (e.g., REST APIs).
##### 2. Delegate to the Legacy System: Inside the adapter, translate the REST API calls into the SOAP requests understood by the payment gateway.
##### 3. Return Results in the Expected Format: The adapter translates SOAP responses back into REST API responses for your application.
&nbsp; 

#### Implementing the Adapter Pattern in Code
&nbsp; 

##### Let’s see how this works in C#.
&nbsp; 
##### Problem Setup: You have a IPaymentProcessor interface your application uses:

```csharp

public interface IPaymentProcessor
{
    void ProcessPayment(decimal amount);
}
```

&nbsp; 

##### Your modern application uses this interface, but the legacy payment system only exposes a *LegacyPaymentService* with the following method:

```csharp

public class LegacyPaymentService
{
    public void MakePayment(string amount)
    {
        Console.WriteLine($"Processing payment of {amount} via legacy system.");
    }
}
```
&nbsp; 

##### The Adapter:
&nbsp; 
##### Here’s how you create an adapter:

```csharp

public class PaymentAdapter(LegacyPaymentService legacyService) : IPaymentProcessor
{
    public void ProcessPayment(decimal amount)
    {
        // Convert the amount to a string and delegate to the legacy service
        string amountString = amount.ToString("F2");

        legacyService.MakePayment(amountString);
    }
}
```
&nbsp; 

##### Using the Adapter:
&nbsp; 

##### Now, you can seamlessly integrate the legacy system without modifying its code:

```csharp

internal class Program
{
    static void Main(string[] args)
    {
        LegacyPaymentService legacyService = new();

        IPaymentProcessor paymentProcessor = new PaymentAdapter(legacyService);

        // Your application code uses the modern IPaymentProcessor interface
        paymentProcessor.ProcessPayment(123.4567868m);
    }
}
```
&nbsp; 
&nbsp; 
### Definition
&nbsp; 
&nbsp; 

##### The **Adapter Design Pattern** is a structural design pattern **that allows two incompatible interfaces to work together by acting as a bridge.** It converts the interface of a class into another interface that the client expects, enabling integration without changing the existing code of the involved classes.

&nbsp; 
&nbsp; 
### UML Diagram
&nbsp; 
&nbsp; 
 
##### Object Adapter Pattern
![OpenTelemetry](/images/blog/posts/simplifying-integration-with-adapter-pattern/object-adapter-pattern.jpg)
&nbsp; 

##### Class Adapter Pattern
![OpenTelemetry](/images/blog/posts/simplifying-integration-with-adapter-pattern/class-adapter-pattern.jpg)

&nbsp; 
&nbsp; 
### Object Adapter Pattern
&nbsp; 
&nbsp; 


##### **Definition**
&nbsp; 
##### The ** Object Adapter Pattern** uses **composition** to adapt one interface to another. The adapter contains an instance of the class it is adapting and delegates calls to it.
&nbsp; 

##### *When to Use
&nbsp; 

##### • When you cannot or should not modify the adaptee class (e.g., third-party libraries or legacy code).
##### • When you want to use the adapter with multiple instances of the adaptee.
&nbsp; 
##### Example Scenario: Legacy Printer Integration
&nbsp; 
##### Suppose you have a modern application that prints documents using an ***IPrinter*** interface. However, you need to integrate a legacy LegacyPrinter class that has a different method signature.

&nbsp; 
##### Legacy Code:

```csharp
public class LegacyPrinter
{
    public void Print(string text)
    {
        Console.WriteLine($"Legacy Printer: {text}");
    }
}
```
&nbsp; 
##### Target Interface:

```csharp
public interface IPrinter
{
    void PrintDocument(string content);
}
```
&nbsp; 
##### Object Adapter Implementation:

```csharp
public class PrinterAdapter(LegacyPrinter legacyPrinter) : IPrinter
{
    public void PrintDocument(string content)
    {
        // Delegate the call to the adaptee (LegacyPrinter)
        legacyPrinter.Print(content);
    }
}
```
&nbsp; 
##### Usage:

```csharp
internal class Program
{
    static void Main(string[] args)
    {
        LegacyPrinter legacyPrinter = new();
        IPrinter printerAdapter = new PrinterAdapter(legacyPrinter);

        printerAdapter.PrintDocument("Hello, Object Adapter!");
    }
}
```

&nbsp; 
&nbsp; 
### Class Adapter Pattern
&nbsp; 
&nbsp; 

##### Definition:
&nbsp; 

##### The Class Adapter Pattern uses inheritance to adapt one interface to another. The adapter extends the adaptee class and implements the target interface.
&nbsp; 

##### When to Use:
&nbsp; 

##### • When you can inherit from the adaptee class.
##### • When the adaptee class is not sealed and does not require composition for flexibility.
##### • When multiple inheritance (from the target interface and adaptee class) is acceptable.
&nbsp; 

##### Example
&nbsp; 

##### Class Adapter Implementation:

```csharp

public class PrinterAdapter : LegacyPrinter, IPrinter
{
    public void PrintDocument(string content)
    {
        // Directly call the inherited method from LegacyPrinter
        Print(content);
    }
}
```
&nbsp; 
##### Usage: 

```csharp

internal class Program
{
    static void Main(string[] args)
    {
        IPrinter printerAdapter = new PrinterAdapter();

        printerAdapter.PrintDocument("Hello, Class Adapter!");
    }
}

```
&nbsp; 

&nbsp; 
&nbsp; 
### Choosing Between Object and Class Adapter
&nbsp; 
&nbsp; 

##### Use Object Adapter when:
&nbsp; 

##### • Adaptee class is already implemented, and you can’t modify it.
##### • Flexibility and reusability are important.
##### • The language doesn’t support multiple inheritance (e.g., C#).
&nbsp; 

##### Use Class Adapter when:
&nbsp; 

##### • Inheritance is appropriate and acceptable.
##### • The language supports multiple inheritance (e.g., C++ or through interfaces in C#).
##### • Performance is a concern (fewer indirections compared to composition).

&nbsp; 
&nbsp; 
### Cloud Providers Integration with Adapter Pattern
&nbsp; 
&nbsp; 

#### Adapter for Cloud Storage Providers
&nbsp; 

##### Scenario
&nbsp; 

##### You’re building an application that needs to upload and download files from different cloud storage providers, such as:
&nbsp; 

##### • Amazon S3
##### • Azure Blob Storage
##### • Google Cloud Storage
&nbsp; 

##### Each cloud provider has its own SDK and API methods, which makes the integration process cumbersome and hard to maintain. For instance:
&nbsp; 

##### • Amazon S3 uses the Amazon.S3.IAmazonS3 interface.
##### • Azure Blob Storage uses the Azure.Storage.Blobs library.
##### • Google Cloud Storage uses the Google.Cloud.Storage.V1.StorageClient.
&nbsp; 

##### You need to create a unified interface so your application can interact with any of these providers without changing the main codebase.
&nbsp; 

#### Solution: Adapter Pattern
&nbsp; 

##### The Adapter Pattern can be used to standardize the interaction with these cloud providers. You define a common interface for your application, and each provider gets its own adapter implementation.
&nbsp; 

#### Step-by-Step Implementation
&nbsp; 

##### 1. Define a Common Interface**
&nbsp; 

##### Create an interface that abstracts cloud storage operations like uploading, downloading, and deleting files:

```csharp

public interface ICloudStorage
{
    Task UploadFileAsync(string containerName, string fileName, Stream fileStream);
    Task<Stream> DownloadFileAsync(string containerName, string fileName);
    Task DeleteFileAsync(string containerName, string fileName);
}
```
&nbsp; 
##### **2. Implement Adapters for Each Cloud Provider: Amazon S3 Adapter**

```csharp

public class S3StorageAdapter : ICloudStorage
{
    private readonly IAmazonS3 _s3Client;

    public S3StorageAdapter(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    public async Task UploadFileAsync(string containerName, string fileName, Stream fileStream)
    {
        var request = new PutObjectRequest
        {
            BucketName = containerName,
            Key = fileName,
            InputStream = fileStream
        };

        await _s3Client.PutObjectAsync(request);
    }

    public async Task<Stream> DownloadFileAsync(string containerName, string fileName)
    {
        var request = new GetObjectRequest
        {
            BucketName = containerName,
            Key = fileName
        };
        var response = await _s3Client.GetObjectAsync(request);

        return response.ResponseStream;
    }

    public async Task DeleteFileAsync(string containerName, string fileName)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = containerName,
            Key = fileName
        };

        await _s3Client.DeleteObjectAsync(request);
    }
}
```

##### **Azure Blob Storage Adapter**
&nbsp; 
##### Use the Azure.Storage.Blobs library for Azure integration:
&nbsp; 

##### **Google Cloud Storage Adapter**
&nbsp; 
##### Use the Google.Cloud.Storage.V1 library for Google Cloud integration:

```csharp

public class GoogleCloudStorageAdapter : ICloudStorage
{
    private readonly StorageClient _storageClient;

    public GoogleCloudStorageAdapter(StorageClient storageClient)
    {
        _storageClient = storageClient;
    }

    public async Task UploadFileAsync(string containerName, string fileName, Stream fileStream)
    {
        await _storageClient.UploadObjectAsync(containerName, fileName, null, fileStream);
    }

    public async Task<Stream> DownloadFileAsync(string containerName, string fileName)
    {
        MemoryStream memoryStream = new();

        await _storageClient.DownloadObjectAsync(containerName, fileName, memoryStream);
        memoryStream.Position = 0; // Reset the stream position

        return memoryStream;
    }

    public async Task DeleteFileAsync(string containerName, string fileName)
    {
        await _storageClient.DeleteObjectAsync(containerName, fileName);
    }
}
```
&nbsp; 

##### **3. Registering with DI**
&nbsp; 
##### Create a factory or dependency injection setup to inject the appropriate adapter based on the cloud provider.

```csharp

builder.Services.AddSingleton(new BlobServiceClient("YourAzureConnectionString")); // Azure Blob Storage
builder.Services.AddSingleton(StorageClient.Create()); // Google Cloud Storage
builder.Services.AddSingleton<IAmazonS3>(new AmazonS3Client()); // Amazon S3

// Register Adapters
builder.Services.AddTransient<AzureBlobStorageAdapter>();
builder.Services.AddTransient<GoogleCloudStorageAdapter>();
builder.Services.AddTransient<S3StorageAdapter>();

// Register Factory
builder.Services.AddTransient<Func<string, ICloudStorage>>(sp => provider =>
{
    return provider switch
    {
        "Azure" => sp.GetRequiredService<AzureBlobStorageAdapter>(),
        "Google" => sp.GetRequiredService<GoogleCloudStorageAdapter>(),
        "AWS" => sp.GetRequiredService<S3StorageAdapter>(),
        _ => throw new ArgumentException("Unsupported cloud provider")
    };
});

// Register FileService
builder.Services.AddTransient<FileService>();
```
&nbsp; 

#### **Usage in the Application:**

```csharp

public class FileService
{
    private readonly ICloudStorage _cloudStorage;

    public FileService(ICloudStorage cloudStorage)
    {
        _cloudStorage = cloudStorage;
    }

    public async Task UploadFile(string containerName, string fileName, Stream fileStream)
    {
        await _cloudStorage.UploadFileAsync(containerName, fileName, fileStream);
    }

    public async Task<Stream> DownloadFile(string containerName, string fileName)
    {
        return await _cloudStorage.DownloadFileAsync(containerName, fileName);
    }

    public async Task DeleteFile(string containerName, string fileName)
    {
        await _cloudStorage.DeleteFileAsync(containerName, fileName);
    }
}
```

##### **Explanation**
&nbsp; 

##### 1.Target Interface:
&nbsp; 

##### • ICloudStorage is the target interface that the application expects. It defines three standard methods: UploadFileAsync, DownloadFileAsync, and DeleteFileAsync.
##### • The application works only with this interface and doesn’t know about specific cloud provider SDKs.
&nbsp; 

##### 2.Adaptee:
&nbsp; 

##### • Each cloud provider (Azure Blob Storage, Google Cloud Storage, Amazon S3) has its own SDK with unique method signatures and functionality.
##### • These SDKs are adaptees that need to be adapted to the ICloudStorage interface.
&nbsp; 

##### 3.Adapter:
&nbsp; 

##### • The adapters (AzureBlobStorageAdapter, GoogleCloudStorageAdapter, S3StorageAdapter) implement ICloudStorage and translate calls from the ICloudStorage interface to the specific methods provided by each SDK.
&nbsp; 

##### 4.Client:
&nbsp; 

##### • The client is your application, which interacts with the ICloudStorage interface (via the FileService) without worrying about the underlying implementation details.
&nbsp; 

##### **How the Adapter Pattern is Used**
&nbsp; 

##### • The adapters bridge the gap between the ICloudStorage interface and the specific cloud SDKs.
##### • This decouples the application logic from the specific SDKs, making it easy to switch providers or integrate new ones without changing the main application code.

```csharp

//This is adapter that trying to adapt Azure Blob Storage to my Cloud Storage
public class AzureBlobStorageAdapter : ICloudStorage
{
    private readonly BlobServiceClient _blobServiceClient;

    public AzureBlobStorageAdapter(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task UploadFileAsync(string containerName, string fileName, Stream fileStream)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.UploadAsync(fileStream, overwrite: true);
    }

    public async Task<Stream> DownloadFileAsync(string containerName, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);
        var response = await blobClient.DownloadAsync();

        return response.Value.Content;
    }

    public async Task DeleteFileAsync(string containerName, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.DeleteIfExistsAsync();
    }
}
```

##### **Azure Blob Storage Adapter**

&nbsp;
&nbsp;
### Where to/NOT to Use the Adapter Pattern?
&nbsp;
&nbsp;

##### **Where to use the Adapter Pattern?**
&nbsp;

##### 1. When Integrating Legacy Systems
&nbsp;

##### • Use the Adapter Pattern to modernize old APIs or integrate with newer systems.
##### • Example: Connecting a SOAP-based service with a RESTful API.
&nbsp;

##### 2. When Standardizing Interfaces
&nbsp;

##### • Use adapters to unify multiple incompatible implementations under a common interface.
##### • Example: Supporting multiple logging providers (e.g., Splunk, ElasticSearch, Application Insights).
&nbsp;

##### 3. When Bridging Different Protocols
&nbsp;

##### • Useful for translating between two incompatible communication protocols.
##### • Example: Adapting between gRPC and REST for cross-service communication.
&nbsp;

##### 4. When Adding a Third-Party Library
&nbsp;

##### • Use an adapter to wrap a third-party library, preventing it from leaking into the rest of your system.
##### • Example: Wrapping a payment gateway SDK to conform to your application's interface.
&nbsp;

##### 5. When Switching Implementations
&nbsp;

##### • Use adapters to simplify switching between different libraries or frameworks.
##### • Example: Migrating from Amazon S3 to Azure Blob Storage with minimal client code changes.
&nbsp;

##### **Where NOT to Use the Adapter Pattern**
&nbsp;

##### Inappropriate Use Cases
&nbsp;

##### 1. When Interfaces Are Already Compatible
&nbsp;

##### • Avoid unnecessary adapters if classes can work together without translation.
##### • Example: Wrapping a List<T> as IEnumerable<T>.
&nbsp;

##### 2. When Modifying the Adaptee is Possible
&nbsp;

##### • If you own the adaptee’s code and can modify it, consider making it conform to the target interface directly.
##### • Example: Refactoring a legacy library to support the new system.
&nbsp;

##### 3. For Simple Transformations
&nbsp;

##### • If the required translation logic is minimal, use inline conversion or a utility method instead.
##### • Example: Converting a date string format without a dedicated adapter.
&nbsp;

##### 4. When Performance is Critical
&nbsp;

##### • Avoid adapters in scenarios where even slight performance overhead is unacceptable.
##### • Example: Real-time video streaming where every millisecond counts.
&nbsp;

##### 5. When Over-Abstraction is a Concern
&nbsp;

##### • Avoid the Adapter Pattern if it introduces unnecessary complexity or abstraction for small, straightforward tasks.
##### • Example: Adapting a basic settings reader library with only one method.

&nbsp;
&nbsp;
### Wrapping Up
&nbsp;
&nbsp;

##### The Adapter Pattern is a must-have for .NET developers, enabling smooth integration between incompatible systems while keeping code clean and maintainable. 
&nbsp;

##### Whether you're standardizing APIs, integrating legacy systems, or unifying third-party libraries, this pattern ensures flexibility and scalability without overhauling your codebase.
&nbsp;

##### By keeping adapters focused and lightweight, you can tackle integration challenges with confidence. 
##### Mastering the Adapter Pattern equips you to create robust, adaptable applications ready to meet both current and future needs.
&nbsp;

##### This is a complete chapter from my [Design Patterns that Deliver ebook](https://thecodeman.net/design-patterns-that-deliver-ebook?utm_source=Website&utm_campaign=0212).
&nbsp;
##### Use code: **THECODEMAN** for 45% discount.
&nbsp;
##### The complete code can be found in the [TheCodeMan Community](https://www.skool.com/thecodeman).
&nbsp;

##### That's all from me today. 
&nbsp;

##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->

## <b > dream BIG! </b>