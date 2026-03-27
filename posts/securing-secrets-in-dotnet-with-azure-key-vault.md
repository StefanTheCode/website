---
title: "Securing Secrets in .NET 8 with Azure Key Vault"
subtitle: "While convenient, this approach can pose security risks if not handled properly. Azure Key Vault offers a secure, managed solution for secret storage, allowing us to keep sensitive data out of local files and within a secure cloud environment."
date: "Nov 04 2024"
category: "Azure"
readTime: "Read Time: 4 minutes"
meta_description: "Learn how to securely manage and access secrets in .NET 8 applications using Azure Key Vault. This guide covers best practices for storing sensitive data, setting up Key Vault, and integrating it with .NET for secure and scalable applications."
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">• Unlock <a href="https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Postman's latest features</a> for seamless API management! Now with a centralized variable experience and secure secret storage via Postman Vault, your team can streamline workflows and safeguard sensitive data effortlessly. <a href="https://community.postman.com/t/the-postman-drop-october-edition/70044?utm_medium=social_sharing&utm_source=newsletter&utm_content=Stefan_Djokic" style="color: #a5b4fc; text-decoration: underline;">Learn more</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers. <a href="https://thecodeman.net/sponsorship" style="color: #a5b4fc; text-decoration: underline;">Become a sponsor</a>.
</p>
</div>


## The Background
In traditional applications, sensitive configuration data, such as database connection strings and API keys, might be stored directly in configuration files like appconfig.json. 
While convenient, this approach can pose security risks if not handled properly. 
**Azure Key Vault** offers a secure, managed solution for secret storage, allowing us to keep sensitive data out of local files and within a secure cloud environment.
In this guide, we'll walk through moving secrets from appconfig.json to Azure Key Vault in a .NET 8 application.

## Without Azure Key Vault

Let's say we have an API with a configuration file [appsettings](https://thecodeman.net/posts/live-loading-appsettings-configuration-file).json with the following content:
```json
{
    "Config": {
        "Database": "mssqlConnectionString",
        "Redis": "redisConnectionString",
        "RedisPassword": "someDummyPassword"
    }
}
```
In your Program.cs, you can load these configurations as follows:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Load configuration from appsettings.json
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

// Register services
builder.Services.AddControllers();

// Access configuration settings and register as services if needed
string databaseConnectionString = builder.Configuration["Config:Database"];
string redisConnectionString = builder.Configuration["Config:Redis"];
string redisPassword = builder.Configuration["Config:RedisPassword"];
```
## Why Keeping Secrets in appsettings.json is a Problem?

Storing sensitive data like connection strings and passwords in appsettings.json is risky for several reasons:
**1. Security Exposure:** The appsettings.json file is part of your application’s source code, so anyone with access to the codebase can see sensitive information.
**2. Accidental Sharing:** If you accidentally upload your code to a public repository (like GitHub), all secrets in appsettings.json become publicly accessible. This can lead to data breaches or unauthorized access to your resources.
**3. Compliance Risks:** Many security standards (like GDPR, HIPAA, and PCI-DSS) require sensitive information to be stored securely, not in plain text. Keeping secrets in appsettings.json can put your application out of compliance.
**4. Environment-Specific Secrets:** Different environments (development, testing, production) often need different secrets. Using appsettings.json for these values requires you to create multiple configuration files, which complicates management and increases the risk of leaks.
Instead, you can use Azure Key Vault to store those secrets. 
Let's see how to do that.

## Step 1: Setting Up Azure Key Vault

1. Create an Azure Key Vault:
- Go to the [Azure Portal](https://portal.azure.com) and search for "Key Vault".
- Click on **Create** and configure the Key Vault's settings:
- **Resource Group:** Choose an existing one or create a new resource group.
- **Key Vault Name:** Provide a unique name for your Key Vault.
- **Region:** Select the region closest to your application.
- **Pricing Tier:** You can choose free tier.

![Azure Portal](/images/blog/posts/securing-secrets-in-dotnet-with-azure-key-vault/azure-portal.png)

2. Access Policies (optional):
- Go to **Access policies** in the Key Vault settings.
- Click **Add Access Policy** and select the necessary permissions:
- **Get** and **List** for secrets (additional permissions may be required depending on use cases).
- **Select principal:** Add your application's identity (usually a service principal for apps running in Azure) or your own account for development purposes.

3. Add Secrets:
- Go to the **Secrets** section and click on **Generate/Import**.
- Name your secret (e.g., DatabaseConnectionString) and add the secret value (e.g., the connection string for your database).
- Save the secret.

![Azure Add Secrets](/images/blog/posts/securing-secrets-in-dotnet-with-azure-key-vault/add-secrets.png)

In this example I add **Config--Database** secret.
Why "--"? 
In Azure Key Vault, the -- (double hyphen) syntax is used to represent **nested configuration structures** when integrating Key Vault secrets with .NET applications.

![Azure Create Secret](/images/blog/posts/securing-secrets-in-dotnet-with-azure-key-vault/create-secret.png)

With this Azure setup we are ready to move to the Visual Studio and write some code.

## Step 2: Configuring .NET to use Azure Key Vault

In .NET 8, integrating Azure Key Vault is straightforward with the Azure.Extensions and Microsoft.Extensions.Configuration packages.

**1. Install the Necessary Packages:** Use NuGet to add the following packages to your project:
- Azure.Identity
- Azure.Extensions.AspNetCore.Configuration.Secrets

**2. Configure Managed Identity (Optional):** If your application is hosted on Azure (e.g., in App Service or an Azure VM), you can use a Managed Identity to simplify authentication. Assign this identity permissions in Key Vault as configured in Access Policies. - You can skip this test for our case.
**3. Add Key Vault Configuration in Program.cs:** Update your Program.cs to include Key Vault configuration::

```csharp
string environment = Environment.GetEnvironmentVariable("ENVIRONMENT");
string jsonFile = $"appsettings.{environment}.json";

builder.Configuration
       .AddJsonFile("appsettings.json", optional: false,reloadOnChange: true)
       .AddJsonFile(jsonFile, optional: true);

string? keyVaultUrl = builder.Configuration["KeyVault"];

var credentials = new DefaultAzureCredential ();
builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUrl), credentials);
```
### Code Explanation:

1. Determine the Environment:

• Environment.GetEnvironmentVariable("ENVIRONMENT"):

This line retrieves the ENVIRONMENT environment variable from the operating system, which tells the application which environment it’s running in (e.g., Development, Staging, or Production).

**• string jsonFile = $"appsettings.{environment}.json";:** 
Using the environment value, this line builds the name of an environment-specific configuration file, like appsettings.Development.json or appsettings.Production.json.

2. Load Configuration Files:

**• .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true):** 
This line tells the application to load the main configuration file, appsettings.json. The optional: false parameter means this file must be present. reloadOnChange: true enables automatic reloading if the file changes, so the application will pick up updates without restarting.

**• .AddJsonFile(jsonFile, optional: true):** 

Here, it loads the environment-specific configuration file (e.g., appsettings.Development.json). Setting optional: true means this file is not required; if it’s not found, the application will continue running without it. This setup allows you to override settings in appsettings.json with environment-specific values if needed.

3. Retrieve Key Vault URL:

**• string? keyVaultUrl = builder.Configuration["KeyVault"];:** 
After loading the configuration files, this line accesses the KeyVault entry from the local configuration. This entry should contain the URL of the Azure Key Vault, such as https://mykeyvault.vault.azure.net/. This is necessary to connect to Key Vault to retrieve secrets.
*Note: Each of the files for individual environments will have its own link for KeyVault if each of the environments has a separate Azure service created - Dev has its own Azure, Test has its own, and so on.*
4. Add Azure Key Vault to Configuration:
• var credentials = new DefaultAzureCredential();:

This line initializes the DefaultAzureCredential, which is a class from the Azure Identity library. DefaultAzureCredential tries various methods to authenticate with Azure, like using Azure CLI, environment variables, managed identity (when running in Azure), and more. It simplifies the authentication process by automatically picking the most appropriate authentication method based on the environment.

**• builder.Configuration.AddAzureKeyVault(new Uri(keyVaultUrl), credentials);:** 
This line adds Azure Key Vault as a configuration source. Using the keyVaultUrl and the credentials, it connects to Key Vault, loading all available secrets into the application’s configuration. This allows the application to access secrets from Key Vault just like any other configuration setting.

### How the Configuration Works Together

1. The application first loads settings from appsettings.json and, optionally, an environment-specific configuration file.
2. It then retrieves the Key Vault URL from the configuration.
3. Finally, it connects to Azure Key Vault using DefaultAzureCredential and adds Key Vault as a configuration provider, allowing secrets stored in Key Vault to be accessed as if they were defined in appsettings.json.

## Step 3: Accessing Secrets in Your Application
After setting up Key Vault, any secrets defined in the vault are automatically loaded into the application’s IConfiguration. You can access them in your code as if they were still in appconfig.json.

```csharp
public class MyService
{
    private readonly string _database;
    private readonly string _redis;

    public MyService(IConfiguration configuration)
    {
        // Retrieve secrets from Key Vault
        _database = configuration["Config:Database"];
        _redis = configuration["Config:Redis"];
    }

    // Use the secrets in your application logic
}
```
This way, you compile the query once, and then execute it with different parameters, without recompiling it every time.
## Wrapping Up
Securing sensitive data, such as database connection strings, API keys, and other secrets, is critical in modern applications. 

Azure Key Vault provides a secure and centralized solution, allowing .NET 8 applications to manage secrets effectively. 

By following this guide, you’ve learned:

• How to set up Key Vault 
• integrate it with .NET
• and configure your app to use appsettings.json and environment-specific settings. 
• Additionally, using DefaultAzureCredential simplifies authentication
• making the setup adaptable to both local and cloud environments.
By implementing these practices, your .NET 8 application will be more secure, maintainable, and compliant with industry standards. 
Using Azure Key Vault not only helps protect sensitive information but also brings flexibility to your configuration management across different environments. 
Keep these techniques in mind as you continue to build secure, scalable applications with .NET and Azure services.

That's all from me today. 
<!--END-->

