---
title: "HashIDs. What are they, and why should we use them?"
subtitle: "Hashids are an effective approach for generating opaque non-sequential IDs derived from numbers/sequential IDs (e.g., Integer) and hashing algorithms; converting numbers like 347 into an opaque strings identifier such as 'ir8'."
readTime: "Read Time: 5 minutes"
date: "Oct 02 2023"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Unlock the secrets of using HashIDs for secure and efficient data referencing in APIs. Learn to protect your .NET applications against security risks while maintaining performance."
---

&nbsp;  
&nbsp;  
### The Problem
&nbsp;  
&nbsp;  
##### It's very common for CRUD operations and REST APIs to use primary keys to reference data that will be accessed or modified. These keys are often implemented as surrogate keys using sequential Integer values.
&nbsp;  
##### A typical API route looks like this:
&nbsp;  
##### *GET /api/v1/user/:id*
##### *GET/api/v1/user/12*
&nbsp;  
##### In this case, Id:12 represents a unique (sequential) identifier for a specific user record in the database. In general, this is the simplest and most effective way of specifying the data/record to retrieve.
&nbsp;  
&nbsp;  
### The question is, what is the problem with this approach?
&nbsp;  
&nbsp;  
##### The main problem is that **it exposes our API to security risks** because we are displaying the raw identifiers to the user, especially sequential ones.
&nbsp;  
##### By exposing these primary keys, we give users the ability to estimate the number of records in our tables and easily guess the values of other records.
&nbsp;  
##### Suppose authorization isn't implemented effectively in our code, or APIs aren't protected. In that case, the users could input the next number in the sequence (for example, number 13) to access information they otherwise shouldn't have.&nbsp;
&nbsp;  
&nbsp;  
### What about GUID identifiers?
&nbsp;  
&nbsp;  
##### There are some positive aspects of GUID values:
&nbsp;  
##### • They are globally unique, across every table, every database, and every server.
##### • They enable the easy merging of records from different databases.
##### • GUID IDs can be Generated anywhere instead of having to roundtrip to the database.
&nbsp;  
##### However, there are many non-intuitive but critical downsides to the use of GUID values for primary keys in a database. The main reason is performance as well as unnecessarily excessive use of server resources within the database:
&nbsp;  
##### **"A GUID as the clustering key isn't optimal, since due to its randomness, it will lead to massive page and index fragmentation and to generally bad performance."** - Kimberly Tripp - the Queen of Indexing
&nbsp;  
##### A GUID is more than 4 times larger than the traditional 4-byte index value; this can have severe performance and storage implications if we aren't careful.
&nbsp;  
##### Here are some quick calculations for using Integer vs. GUID values in a table of 1,000,000 records:
&nbsp;  
##### As Primary Keys:
##### - Integer values use 3.8MB vs. 15.26MB for GUID values.
&nbsp;  
##### As Clustering Keys:
##### With 6 non-clustered indexes,
##### Integer values use 22.89MB vs. 91.55MB for GUID values.
&nbsp;  
##### TOTAL: **25 MB (Integer)** vs. **106 MB (GUID)** for the single table. Calculation borrowed from the [Kimberly Tripp blog](https://www.sqlskills.com/blogs/kimberly/author/kimberly/).
&nbsp;  
&nbsp;  
### The Solution
&nbsp;  
&nbsp;  
##### We have seen that both types of identifiers (sequential Integer &amp; GUIDs) have their respective risks/problems.
&nbsp;  
##### So, can we use the "pros" of both types without their adverse risks?
&nbsp;  
##### Yes, we can.
&nbsp;  
##### One solution is to use **Hashids (Hash ID Values)** …Hashids are an effective approach for generating opaque non-sequential IDs derived from numbers/sequential IDs (e.g., Integer) and hashing algorithms;
&nbsp;  
##### converting numbers like 347 into an opaque strings identifier such as "ir8".
&nbsp;  
##### Let's expand on the example from above. We need to access the data of users with ID 12, but we do not want to display the sequential ID through the API, to minimize security risks...
```csharp

[HttpGet]
public IActionResult Get([FromRoute] string id)
{
    int[] intId = _hashids.Decode(id);

    if (intId.Length == 0) return NotFound();

    User user = _userService.GetUser(intId[0]);

    if (user is null) return NotFound();

    return Ok(user);
}

```
##### The API method above accepts an argument ID of type string. The Hashids library provides a ready-to-use implementation with a Decode function that converts a string identifier back to its original sequential ID/number, derived from the Encode function.
&nbsp;  
##### We can now efficiently retrieve the record from our data warehouse where the data is still stored using its' original sequential identifier.
&nbsp;  
##### Suppose our dataset is a list of users from the database, represented by the following list structure in C#:
```csharp

private List<User> Users = new List<User>
{
  new User { Id = 1, FullName = "Stefan Djokic" },
  new User { Id = 2, FullName = "Ricky Sellers"},
  new User { Id = 3, FullName = "Tasnim Shaffer"}
};

```
##### If we call the example API above in Postman with a hashid (string ID) of **"W8ZwkZY"** (derived from Id:1 in this case), the result is the user with ID = 1.
&nbsp;  
##### To recap, this is because the Hashid derives from, and can be converted back to, its original sequential identifier.
![Workflow Designer on Web Application](/images/blog/posts/what-are-hashids-and-why-should-we-use-them/testing-hashids-via-postman.png)

##### This has enabled us to simultaneously take advantage of the best features of Sequential IDs and GUIDs. We've minimized our security risk by exposing opaque identifiers to the public (which cannot be easily guessed due to the hashing algorithm) while maintaining performance when storing and searching in the database.
&nbsp;  
&nbsp;  
### How does it work?
&nbsp;  
&nbsp;  
##### Remember integers to hex conversions?
&nbsp;  
##### Hex numbers use the alphabet as a **base-sixteen numeral system**.
&nbsp;  
##### Hashids use the same principle of conversion; however, the alphabet is **base62**.
&nbsp;  
##### In addition, the alphabet is shuffled based on a unique salt value that can be set by the user. This makes each implementation algorithm unique and is how our security risks are mitigated.
&nbsp;  
&nbsp;  
### What about performance?
&nbsp;  
&nbsp;  
##### As far as performance is concerned, the general best practice is that these IDs should not be persisted anywhere but should be calculated every time. One of the main reasons for this is that it enables us to change/rotate the SALT key.
&nbsp;  
##### Therefore, most uses of Hashids will require the calculation to be done two times for each request; one calculation is **encoding** (int is converted to string), and the other is **decoding** (string is converted back to int).
&nbsp;  
##### The encoding and decoding execution times (for a 7 characters id) are shown in the following figure (using the venerable [BenchmarkDotNet](https://github.com/dotnet/BenchmarkDotNet) project).
![Benchmarks](/images/blog/posts/what-are-hashids-and-why-should-we-use-them/benchmarks.png)
##### We can see that the encoding function takes approximately 850ns per execution, which is quite fast. The decoding time is a bit longer (not unexpected), taking approximately 1400ns (i.e., 0.0014ms).
&nbsp;  
##### Note: Functions do not return a single value of a particular type, but return a string - encoding returns int []. There is a lot of room for optimization here if someone really needs it.
&nbsp;  
##### Another note: Purely out of curiosity, I tested on 1 million values, although this is far from a realistic or practical use case, and the total duration of the process was slightly less than 900ms.
&nbsp;  
&nbsp;  
### Wrapping up
&nbsp;  
&nbsp;  
##### Hashids are an effective approach for small to medium-scale applications that don't require more complicated strategies like [Snowflake IDs](https://en.wikipedia.org/wiki/Snowflake_ID) (e.g., combining different metadata such as timestamps, shard IDs, etc.). And many industry solutions such as GraphQL have embraced it due to the benefits outlined here.
&nbsp;  
##### *Fun fact: YouTube uses 11 characters to generate an ID for each of the videos. This number of characters allows the existence of 73,786,976,293,838,206,464 video clips, which is equivalent to every human being on the planet uploading video every minute for the next 18,000 years. Just WOW.*
&nbsp;  
##### Github repository of the entire code: [HashIDs](https://github.com/StefanTheCode/HashIds) (The repo is from last year - created in .NET 5 - but everything is the same).
&nbsp;  
##### HashIds library used in the text is [hashids.ne](https://github.com/ullmark/hashids.net).
&nbsp;  
##### That's all from me today.