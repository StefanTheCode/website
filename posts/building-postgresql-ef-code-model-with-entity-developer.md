---
title: "Building a PostgreSQL EF Core Model Using Entity Developer"
subtitle: "Working with EF Core and PostgreSQL in .NET can be a rewarding experience - until you find yourself deep in the weeds of manually writing schema definitions."
readTime: "Read Time: 6 minutes"
date: "July 15 2025"
category: "Entity Framewework"
meta_description: "Working with EF Core and PostgreSQL in .NET can be a rewarding experience - until you find yourself deep in the weeds of manually writing schema definitions"
---

<!--START-->
&nbsp;  
&nbsp;  
### Background
&nbsp;  
&nbsp;  
##### Working with EF Core and PostgreSQL in .NET can be a rewarding experience - until you find yourself deep in the weeds of manually writing schema definitions, updating mappings, and constantly jumping between your database and C# code just to keep things in sync.
&nbsp;  

##### That’s where visual modeling becomes a game changer.
&nbsp;  

##### Instead of hand-coding every entity, relationship, and mapping configuration, visual EF Core modeling gives you a high-level, intuitive view of your data model—making it easier to design, refactor, and maintain over time.
&nbsp;  

##### But until recently, this kind of tooling was mostly limited to SQL Server or traditional ORM tools. If you're building .NET applications with PostgreSQL, you’ve probably felt the gap.
&nbsp;  

##### [Entity Developer](https://www.devart.com/entitydeveloper/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q2) bridges that gap beautifully. With full support for EF Core and PostgreSQL-specific features like UUID, JSONB, and array types, it gives you a powerful visual design experience - while still generating clean, production-ready code under the hood.
&nbsp;  

##### In this article, I’ll walk you through how to use Entity Developer to create and manage your PostgreSQL EF Core models the easy (and visual) way - from model design and code generation to schema synchronization and beyond.
&nbsp;  

##### Let’s dive in.

&nbsp;  
&nbsp;  
### Getting Started: 
### Creating Your EF Core Model for PostgreSQL
&nbsp;  
&nbsp; 

##### Whether you’re a Visual Studio enthusiast or prefer working with standalone tools, Entity Developer has you covered. You can launch it as a separate application or install the extension directly into Visual Studio - whichever fits best into your workflow.
&nbsp; 

##### Once you’ve got Entity Developer up and running, it’s time to create your first EF Core model.

![Add Extension](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/add-extension.png)
&nbsp;  

##### Step-by-step:
##### **1. Launch the Create Model Wizard**
##### Start a new project and choose Devart EF Core Model as the model type.

![Create EF Model](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/create-ef-model.png)
&nbsp;  

##### **2. Choose “Model-First” Approach**
##### Select the Model-First option. This lets you design your data model visually first, and then generate both your EF Core code and the corresponding PostgreSQL schema from it.

![Use Model First](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/use-model-first.png)
&nbsp;  

##### **3. Set Up Your Target Environment**
##### Pick your desired EF Core version. 
##### You’ll need to have [dotConnect for PostgreSQL](https://www.devart.com/dotconnect/postgresql/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q2) installed - it handles the communication between EF Core and your PostgreSQL database.

![Model Setup](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/model-setup.png)
&nbsp;  

##### That’s it - you’re ready to start visually designing your EF Core model. 
##### No need to write boilerplate code or fiddle with configuration files just to get started. 
&nbsp;  
##### The next step? 
##### Let’s design your schema the visual way.

&nbsp;  
&nbsp;  
### Designing the Model Visually
&nbsp;  
&nbsp;  

##### For this example, I’m going to model a simple blogging platform using three core entities: **Blog**, **Post**, and **Comment**. 
&nbsp;  

##### Each Blog can have multiple Posts, and each Post can receive multiple Comments. 
&nbsp;  

##### I’ll define key fields like UUID for primary keys, use PostgreSQL-friendly types like JSONB and arrays, and visually set up the relationships using Entity Developer’s drag-and-drop interface. 
&nbsp;  

##### This small but realistic model gives us a solid foundation to explore how visual modeling works - while keeping things practical.
&nbsp;  

##### **Creating Your First Class (Entity) and Properties**
&nbsp;  

##### To start building your model, right-click anywhere on the design surface and choose “Add Class” from the context menu. You can also use the toolbar button for quicker access.
&nbsp;  

##### This will create a new entity - give it a name like Blog, Post, or Comment. Once the class appears on the diagram:
&nbsp;  

##### 1. **Double-click the class** (or right-click and choose **Properties**) to open the property editor.
&nbsp;  

##### 2. Use the **“Add Property”** button to start defining fields:
##### • For Blog, you might add: Id (UUID), Title (Text), Description (Text), Tags (Text[]), CreatedAt (TimestampTZ)
&nbsp;  

##### 3. Set each property’s:
##### • **Name** (e.g., Title)
##### • **Type** (e.g., Text, UUID, JSONB, TimestampTZ)
##### • Whether it's a **Primary Key, Nullable, Default**, etc.
&nbsp;  

##### Entity Developer makes this super visual - no need to write attributes or annotations. You just configure everything through the UI.

![Create Class](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/create-class.png)
&nbsp;  

##### Result:
![Create Class Result](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/create-class-result.png)
&nbsp;  

##### **Setting Up Relationships (Foreign Keys)**
&nbsp;  

##### Once your classes (entities) are in place, it’s time to connect them using relationships - like telling Entity Developer, "Each Post belongs to one Blog", or "Each Comment belongs to one Post".
&nbsp;  

##### This is super easy to do visually:
&nbsp;  

##### 1. **Drag from one class to another**
##### On the design surface, click on the small arrow or anchor point on the edge of the source class (e.g., Post), and drag it to the target class (e.g., Blog).
&nbsp;  

##### 2. A dialog will pop up to define the **association**:
##### - Choose the relationship type:
##### • **One-to-Many:** One Blog has many Posts
##### • **One-to-Many:** One Post has many Comments
##### - Set navigation properties (e.g., Blog.Posts, Post.Comments)
##### - Entity Developer will automatically create the foreign key property (like BlogId in Post) and wire everything up
&nbsp;  

##### 3. You can customize the association further:
##### • Rename navigation properties
##### • Make the relationship required or optional
##### • Configure cascade delete if needed
&nbsp;  

##### No need to manually type **[ForeignKey]** attributes or worry about EF conventions - Entity Developer handles the details behind the scenes.

![Add Foreign Keys](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/add-foreign-keys.png)
&nbsp;  

##### Result:
![Add Foreign Keys Result](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/add-foreign-keys-result.png)
&nbsp;  
##### This step is where the magic of visual modeling really shines. You can literally see your schema and relationships come together - making it easier to reason about and maintain. 
&nbsp;  

##### Now, **we can create EF Code or generate database for PostgreSQL**.
&nbsp;  

##### Let's do that.
&nbsp;  
&nbsp;  
### Code & Database Generation for PostgreSQL
&nbsp;  
&nbsp;  

##### Once your model is complete, you can generate the EF Core classes by using the top menu bar (not the context menu):
&nbsp;  

##### 1. Go to the **Model menu** in the top toolbar
##### 2. Click **Generate Code**...
&nbsp;  

##### Entity Developer will generate:
##### • Your DbContext class with DbSet<TEntity> properties
##### • All your entity classes (Blog, Post, Comment, etc.)
##### • Any extras you enabled in the T4 templates
&nbsp;  

##### *You can even customize the T4 templates if you want to adapt the code style to match your team’s conventions.*
&nbsp;  

##### If you're using Visual Studio integration, the generated files are added directly to your project. In the standalone version, they’re placed in the output folder you specified.

![Generate Code](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/generate-code.png)

&nbsp;  
##### Let's see how part of the **BlogDbContext.cs** file looks like:

```csharp

public partial class BlogDbContext : DbContext
{
    public BlogDbContext(DbContextOptions<BlogDbContext> options) :
        base(options)
    {
        OnCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured ||
            (!optionsBuilder.Options.Extensions.OfType<RelationalOptionsExtension>().Any(ext => !string.IsNullOrEmpty(ext.ConnectionString) || ext.Connection != null) &&
             !optionsBuilder.Options.Extensions.Any(ext => !(ext is RelationalOptionsExtension) && !(ext is CoreOptionsExtension))))
        {
        }

        CustomizeConfiguration(ref optionsBuilder);
        base.OnConfiguring(optionsBuilder);
    }

    public virtual DbSet<Blog> Blogs { get; set; }
    public virtual DbSet<Post> Posts { get; set; }
    public virtual DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        this.BlogMapping(modelBuilder);
        this.CustomizeBlogMapping(modelBuilder);

        this.PostMapping(modelBuilder);
        this.CustomizePostMapping(modelBuilder);

        this.CommentMapping(modelBuilder);
        this.CustomizeCommentMapping(modelBuilder);

        RelationshipsMapping(modelBuilder);
        CustomizeMapping(ref modelBuilder);
    }

    ...
}
```
##### And here is the Blog Entity:

```csharp

public partial class Blog
{
    public Blog()
    {
        this.Posts = new List<Post>();
        OnCreated();
    }

    public Guid ID { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public virtual IList<Post> Posts { get; set; }

    #region Extensibility Method Definitions

    partial void OnCreated();

    #endregion
}
```

##### *Everything is generated to match your model exactly - saving you from writing repetitive boilerplate by hand.*
&nbsp;  

##### **Generate PostgreSQL DDL Scripts**
&nbsp;  

##### Next, let’s turn your model into an actual PostgreSQL schema.
##### • Go to the **Model menu** and choose **Generate Database Script**.
##### • Entity Developer will generate fully PostgreSQL-compatible SQL, including:
##### - Table creation (CREATE TABLE)
##### - Primary and foreign keys
##### - Enums, default values, arrays, and JSONB columns
##### • You can review and tweak the SQL script before executing it - or export it for use in CI/CD pipelines.

![Generate Database Script](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/generate-database-script.png)
&nbsp;  

##### We get SQL result:
![Generate Database Script Result](/images/blog/posts/building-postgresql-ef-code-model-with-entity-developer/database-script.png)

&nbsp;  
&nbsp;  
### Core Benefits for EF Core & 
### PostgreSQL Development
&nbsp;  
&nbsp;  

##### Entity Developer brings a lot of value to EF Core and PostgreSQL development, especially when you're working on complex models or collaborating in larger teams. 
&nbsp;  

##### Here’s why it stands out:
&nbsp;  

##### • **Visual model design** makes it easy to map out your data structure quickly, helping you avoid mistakes and spot relationships at a glance. No more trial-and-error with fluent API or annotations.
##### • It has **full support for PostgreSQL-specific types**, including UUID, JSONB, arrays, and custom enums - letting you take full advantage of PostgreSQL's capabilities without hacks or workarounds.
##### • The **robust code generation engine** ensures that your EF Core classes and DbContext are clean, consistent, and maintainable - whether you're building a new project or refactoring an old one.
##### • **Seamless synchronization tools** help you keep your model, code, and database aligned - even after the initial deployment. You can safely push or pull schema changes without worrying about data loss.
##### • And with **IDE integration**, you get design-time validation, query building, and refactoring tools right inside Visual Studio or in the standalone app - helping you stay productive from start to finish.

&nbsp;  
&nbsp;  
### Wrapping Up
&nbsp;  
&nbsp;  

##### If you're working with EF Core and PostgreSQL, Entity Developer gives you the power to build, manage, and evolve your data model visually - while still generating solid, production-ready code behind the scenes.
&nbsp;  
##### Also, important thing here is to know that **Entity Developer doesn't support ONLY Postgres database**. There are support for other such as MSSQL, MySQL, etc.
&nbsp;  

##### Ready to give it a spin?
&nbsp;  

##### Download the free trial, connect to your PostgreSQL database, and create your first EF Core model in minutes:
&nbsp;  

##### [🔗 Entity Developer](https://www.devart.com/entitydeveloper/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q2)
##### [🔗 dotConnect for PostgreSQL](https://www.devart.com/dotconnect/postgresql/?utm_source=thecodeman&utm_medium=referral&utm_campaign=Q2)
&nbsp;  

##### Let your model shape your application - not the other way around.
&nbsp;  

##### That's all from me today. 

&nbsp;  
 
##### P.S. Follow me on [YouTube](https://www.youtube.com/@thecodeman_).
<!--END-->