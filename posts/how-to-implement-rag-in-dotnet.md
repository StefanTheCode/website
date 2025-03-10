---
title: "How to implement RAG system - AI in .NET"
subtitle: "RAG (Retrieval-Augmented Generation) is an AI framework that enhances generative large language models (LLMs) by integrating traditional information retrieval methods, such as search engines and databases. "
date: "Mar 10 2025"
readTime: "Read Time: 5 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "RAG (Retrieval-Augmented Generation) is an AI framework that enhances generative large language models (LLMs) by integrating traditional information retrieval methods, such as search engines and databases."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;   
##### • Boost your C# / .NET development with the best combination of [visual ORM builder](https://www.devart.com/entitydeveloper/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q1) and [ADO.NET data providers](http://ado.net/). Download a 30-day free trial today and enjoy reliable updates, expert developer support, and full compatibility with leading ORMs.
##### Get **15% OFF** with promo code **DOKIC15**. [Check it now](https://www.devart.com/entitydeveloper/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q1)
&nbsp;   

##### • I'm preapring Enforcing Code Style course in my [TheCodeMan Community](https://www.skool.com/thecodeman). For 3 consecutive subscriptions ($12) or annual ($40) you get this course, plus everything else in the group.🚀 [Join now](https://www.skool.com/thecodeman) and grab my first ebook for free.

<!--START-->

&nbsp; &nbsp; 
### What is RAG?
&nbsp; &nbsp; 
&nbsp;
##### **RAG (Retrieval-Augmented Generation)** is an AI framework that enhances generative large language models (LLMs) by integrating traditional information retrieval methods, such as search engines and databases. 
&nbsp;
##### This approach allows LLMs to generate responses that are more accurate, current, and contextually relevant by leveraging both your data and broader world knowledge.

![Rag System](/images/blog/posts/how-to-implement-rag-in-dotnet/rag.png)

&nbsp; 
&nbsp; 
### How does Retrieval-Augmented Generation work?
&nbsp; 
&nbsp; 

##### RAG systems work in a couple of key steps to make AI-generated responses more accurate and useful:
&nbsp; 
##### **Finding and Preparing Information:** Instead of relying only on what an AI model already knows, RAG searches internal sources - like web pages, databases, or company knowledge bases, or anything that we give it - to find relevant information. Once it pulls the data, it cleans it up by breaking it into tokens, removing unnecessary words, and making it easier for the AI to process.
&nbsp; 
##### **Generating Smarter Responses:** The AI then blends this fresh information with what it already knows, creating responses that are not just more accurate but also more relevant and engaging. This way, instead of guessing or relying on outdated knowledge, the AI can deliver answers that are both well-informed and up-to-date.

&nbsp; 
&nbsp; 
### Example: Customer Support Chatbot with RAG
&nbsp; 
&nbsp; 

##### Imagine a company wants to provide instant and accurate answers to customer queries about its products and services. Instead of relying solely on a pre-trained LLM, which may not have the latest company-specific information, the chatbot is designed as a RAG system.
&nbsp; 

##### **How It Works:**
&nbsp; 

##### **1. User Query:** A customer asks, *"What is the return policy for my latest order?"*

##### **2. Retrieval Phase:** The system first searches the company’s internal documentation, knowledge base, or database (e.g., FAQs, policy documents, order history).

##### **3. Augmented Generation:** The retrieved information is then fed into the LLM, which generates a well-structured, context-aware response.

##### **4. Response to User:** The chatbot replies, *"Our return policy allows you to return items within 30 days of purchase. Since your order was placed 15 days ago, you can still request a return. Would you like to start the process?"*
&nbsp; 

##### By using **RAG**, the chatbot ensures its responses are: 
&nbsp; 

##### • Accurate (based on the latest return policy)
##### • Up-to-date (fetches real-time order details)
##### • Relevant (answers specific to the customer’s situation) 

&nbsp; 
&nbsp; 
### How to implement it in .NET?
&nbsp; 
&nbsp; 
 
##### What I'm going to create: 

##### I will use my brand TheCodeMan for these purposes, and I will create a mini-database that tells a little more about my brand, what I do, where TheCodeMan can be seen, a little about sponsorships and partnerships, and the like.
&nbsp; 

##### When I fill my database I will test the system through a couple of questions, to find out if the system knows some information about the brand itself based on the data of who has it. 
&nbsp; 

##### Here I expect to get an answer like *"I don't have such information"*  if I ask a question for which the answer is not actually in the database.
&nbsp; 

##### Let's implement it. 
&nbsp; 

##### If you want to start with AI Basics in .NET, you can read [How to implement Semantic Search in .NET 9](https://thecodeman.net/posts/semantic-search-ai-in-dotnet9?utm_source=Website).

&nbsp; 
&nbsp; 
### Create Embedding Generator
&nbsp; 
&nbsp; 

##### The **OllamaEmbeddingGenerator** generates vector embeddings for textual data by interacting with the **Ollama API**. 
&nbsp; 

##### It converts input text into a numerical representation (float[]), making it useful for **semantic search, Retrieval-Augmented Generation (RAG) systems, and AI-driven applications**. 
&nbsp; 

##### The class sends an HTTP request to **Ollama’s /api/embeddings endpoint**, retrieves the embedding, and processes the response. If the API request fails or returns invalid data, it throws an exception to ensure reliability.
&nbsp; 

##### This embedding generator is essential for applications that require **text similarity comparison, knowledge retrieval, and intelligent search**. By using embeddings instead of traditional keyword matching, it enables **context-aware search and AI-powered content recommendations**. 
&nbsp; 

##### When integrated with **pgvector (PostgreSQL)** or other vector databases, it allows for efficient **semantic retrieval of relevant data** based on meaning rather than exact words. 

```csharp

public class OllamaEmbeddingGenerator(Uri ollamaUrl, string modelId = "mistral") : IEmbeddingGenerator
{
    private readonly HttpClient _httpClient = new();
    private readonly Uri _ollamaUrl = ollamaUrl;
    private readonly string _modelId = modelId;

    public async Task<float[]> GenerateEmbeddingAsync(string text)
    {
        var requestBody = new { model = _modelId, prompt = text };

        var response = await _httpClient.PostAsync(
            new Uri(_ollamaUrl, "/api/embeddings"),
            new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json"));

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Ollama API error: {await response.Content.ReadAsStringAsync()}");
        }

        var responseJson = await response.Content.ReadAsStringAsync();
        Console.WriteLine("Ollama Response: " + responseJson);

        var serializationOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        var embeddingResponse = JsonSerializer.Deserialize<OllamaEmbeddingResponse>(responseJson, serializationOptions);

        if (embeddingResponse?.Embedding == null || embeddingResponse.Embedding.Length == 0)
        {
            throw new Exception("Failed to generate embedding.");
        }

        return embeddingResponse.Embedding;
    }
}

```
&nbsp; 
##### **IEmbeddingGenerator interface:**

```csharp

public interface IEmbeddingGenerator
{
    Task<float[]> GenerateEmbeddingAsync(string text);
}

```
&nbsp; 
##### **OllamaEmbeddingResponse:**

```csharp

public class OllamaEmbeddingResponse
{
    [JsonPropertyName("embedding")]
    public float[] Embedding { get; set; } = [];
}

```

&nbsp; 
&nbsp; 
### Create Vector Database with Neon
&nbsp; 
&nbsp; 

##### The **TextRepository class** is a data access layer that manages text storage and retrieval using [Neon, a serverless PostgreSQL database](https://neon.tech/?refcode=DNZ1AUO3). I created this database in less than 30s with a couple of clicks. 
&nbsp; 

##### It works by storing text with vector embeddings and later retrieving the most relevant texts based on similarity. The repository relies on pgvector, a PostgreSQL extension for vector-based search, enabling efficient semantic retrieval instead of traditional keyword matching.
&nbsp; 

##### When storing text, it first generates an embedding using IEmbeddingGenerator (e.g., Ollama's embedding API) and then saves both the text and its embedding in the database. 
&nbsp; 

##### When retrieving data, it converts the query into an embedding and finds the top 5 most relevant matches using a vector similarity search. 
&nbsp; 

##### This setup allows fast and scalable AI-powered search, leveraging Neon’s serverless PostgreSQL, which was set up in less than 30 seconds, ensuring high availability and automatic scaling without database management overhead. 

```csharp

public class TextRepository(string connectionString, IEmbeddingGenerator embeddingGenerator)
{
    private readonly string _connectionString = connectionString;
    private readonly IEmbeddingGenerator _embeddingGenerator = embeddingGenerator;

    public async Task StoreTextAsync(string content)
    {
        var embedding = await _embeddingGenerator.GenerateEmbeddingAsync(content);

        using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        string query = "INSERT INTO text_contexts (content, embedding) VALUES (@content, @embedding)";
        using var cmd = new NpgsqlCommand(query, conn);
        cmd.Parameters.AddWithValue("content", content);
        cmd.Parameters.AddWithValue("embedding", embedding);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<string>> RetrieveRelevantText(string query)
    {
        var queryEmbedding = await _embeddingGenerator.GenerateEmbeddingAsync(query);

        using var conn = new NpgsqlConnection(_connectionString);
        await conn.OpenAsync();

        string querySql = @" SELECT content FROM text_contexts WHERE embedding <-> CAST(@queryEmbedding AS vector) > 0.7 ORDER BY embedding <-> CAST(@queryEmbedding AS vector) LIMIT 5";

        using var cmd = new NpgsqlCommand(querySql, conn);

        string embeddingString = $"[{string.Join(",", queryEmbedding.Select(v => v.ToString("G", CultureInfo.InvariantCulture)))}]";
        cmd.Parameters.AddWithValue("queryEmbedding", embeddingString);
        return results.Any() ? results : new List<string> { "No relevant context found." };
    }
}

```
&nbsp; 

##### **TextContext class:**

```csharp

public class TextContext
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public float[] Embedding { get; set; } = [];
}
```


&nbsp; 
&nbsp; 
### Implement a RAG Service
&nbsp; 
&nbsp; 

##### The RagService class is the core of the Retrieval-Augmented Generation (RAG) system, combining Neon’s serverless PostgreSQL for semantic search and Ollama’s AI model for response generation. 
&nbsp; 

##### It retrieves relevant stored knowledge using **vector similarity search**, then uses an AI model (default: **"mistral"**) to generate an answer strictly based on the retrieved context.
&nbsp; 

##### When a user asks a question, RagService:
&nbsp; 

##### 1. Queries the database via TextRepository, retrieving the top 5 most relevant records based on vector similarity.
##### 2. Combines the retrieved texts into a single context block.
##### 3. Ensures AI does not hallucinate by enforcing a strict prompt - if the answer isn’t in the provided context, it must respond with: *"I don't know. No relevant data found."*
##### 4. Sends the structured request to the Ollama API, instructing it to generate a response using only the given context.
##### 5. Returns a structured response, including both the retrieved context and the AI-generated answer.
&nbsp; 

```csharp

public class RagService(TextRepository retriever, Uri ollamaUrl, string modelId = "mistral")
{
    private readonly TextRepository _textRepository = retriever;
    private readonly HttpClient _httpClient = new();
    private readonly Uri _ollamaUrl = ollamaUrl;
    private readonly string _modelId = modelId;

    public async Task<object> GetAnswerAsync(string query)
    {
        // Retrieve multiple relevant texts
        List<string> contexts = await _textRepository.RetrieveRelevantText(query);

        // Combine multiple contexts into one string
        string combinedContext = string.Join("\n\n---\n\n", contexts);

        // If no relevant context is found, return a strict message
        if (contexts.Count == 1 && contexts[0] == "No relevant context found.")
        {
            return new
            {
                Context = "No relevant data found in the database.",
                Response = "I don't know."
            };
        }

        var requestBody = new
        {
            model = _modelId,
            prompt = $"""
        You are a strict AI assistant. You MUST answer ONLY using the provided context. 
        If the answer is not in the context, respond with "I don't know. No relevant data found."

        Context:
        {combinedContext}

        Question: {query}
        """,
            stream = false
        };

        var response = await _httpClient.PostAsync(
            new Uri(_ollamaUrl, "/api/generate"),
            new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json"));

        if (!response.IsSuccessStatusCode)
        {
            return new
            {
                Context = combinedContext,
                Response = "Error: Unable to generate response."
            };
        }

        var responseJson = await response.Content.ReadAsStringAsync();
        var serializationOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        var completionResponse = JsonSerializer.Deserialize<OllamaCompletionResponse>(responseJson, serializationOptions);

        return new
        {
            Context = combinedContext,
            Response = completionResponse?.Response ?? "I don't know. No relevant data found."
        };
    }
}

```
&nbsp;
&nbsp;
### Setup and Endpoints
&nbsp;
&nbsp;

##### The **Program** class initializes and runs a **.NET Minimal API** for a **RAG system**, combining Neon’s serverless PostgreSQL with **Ollama’s AI model (mistral)**. 
&nbsp;

##### It sets up **dependency injection**, configuring an IEmbeddingGenerator to generate vector embeddings, a TextRepository to store and retrieve embeddings using **pgvector**, and a RagService to process AI-powered queries while ensuring responses are strictly based on stored knowledge.
&nbsp;

##### The API provides two endpoints: **POST /add-text**, which generates embeddings and stores text for retrieval, and **GET /ask**, which retrieves the most relevant stored contexts, sends them to Ollama, and returns an AI-generated response only if relevant data is found. 

```csharp

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var configuration = builder.Configuration;

        // Load settings from appsettings.json
        var connectionString = configuration.GetConnectionString("PostgreSQL");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Required configuration settings are missing.");
        }

        // Register services
        builder.Services.AddSingleton(sp =>
            new OllamaEmbeddingGenerator(new Uri("http://127.0.0.1:11434"), "mistral"));

        builder.Services.AddSingleton(sp =>
            new TextRepository(connectionString, sp.GetRequiredService<IEmbeddingGenerator>()));

        builder.Services.AddSingleton(sp =>
            new RagService(sp.GetRequiredService<TextRepository>(), new Uri("http://127.0.0.1:11434"), "mistral"));

        var app = builder.Build();

        // Minimal API endpoints
        app.MapPost("/add-text", async (TextRepository textRepository, HttpContext context) =>
        {
            var request = await context.Request.ReadFromJsonAsync<AddTextRequest>();
            if (string.IsNullOrWhiteSpace(request?.Content))
            {
                return Results.BadRequest("Content is required.");
            }
        });

        app.Run();
    }
}
```
&nbsp;
&nbsp;
### Wrapping Up
&nbsp;
&nbsp;

##### In this post, we built a Retrieval-Augmented Generation (RAG) system in .NET, combining Neon’s serverless PostgreSQL for efficient vector storage and retrieval with Ollama’s AI model (mistral) for generating responses based on stored knowledge. 
&nbsp;

##### We structured the system to store text embeddings, perform semantic search using pgvector, and ensure that AI responses are strictly context-aware - eliminating hallucinations and improving reliability.
&nbsp;

##### By leveraging [Neon’s instant setup](https://neon.tech/?refcode=DNZ1AUO3) and automatic scaling, we eliminated database management overhead, while Ollama’s local inference allowed AI-powered responses without relying on external APIs. 
&nbsp;

##### This architecture enables fast, scalable, and intelligent knowledge retrieval, making it ideal for AI-powered chatbots, documentation assistants, and enterprise search solutions.
&nbsp;

#### Next Steps? 
&nbsp;

##### You can extend this system by automatically syncing Confluence documentation, Notion database, or something else, adding user feedback loops, or optimizing vector search with hybrid retrieval techniques. 
&nbsp;

##### Whether you're building a developer assistant, a smart knowledge base, or an AI-powered search engine, this foundation sets you up for scalable and efficient AI-driven retrieval!
&nbsp;

##### Check out the [source code here](https://github.com/StefanTheCode/RAG_System_Basics).
&nbsp;

##### That's all from me today.
&nbsp;
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).

<!--END-->

## <b > dream BIG! </b>