---
title: "How do I implement a workflow using a .NET workflow engine?"
subtitle: "A project workflow is like a roadmap that guides you from the very beginning of a project all the way to its successful..."
date: "Nov 13 2023"
category: ".NET"
readTime: "Read Time: 9 minutes"
meta_description: "Master the art of implementing effective workflows in .NET applications with Stefan Đokić's comprehensive guide. Explore the seamless integration of Workflow Engine into your projects, learn to set up databases, initialize WorkflowRuntime, and connect with WorkflowDesigner for enhanced process management. "
---

<!--START-->

<div style="padding: 20px 24px; margin: 24px 0; border: 1px solid #334155; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
<p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.7);">Sponsored</p>

<p style="margin: 0; font-size: 14px; line-height: 1.6; color: #ffffff;">**- <a href="https://apiinsights.io/?utm_source=newsletter&amp;utm_medium=stefan-email&amp;utm_campaign=api_insights" style="color: #a5b4fc; text-decoration: underline;">Treblle Api Insights</a> ** Treblle has come out with a revolutionary new tool - API Insights. If until now you couldn't tell on the scale how good your API is, now you will be able to. It's a free tool, you only need to upload your .json of the API you're building and you'll get insights on how good your API is in 3 categories: Design, Performance, Security. Check your API <a href="https://apiinsights.io/?utm_source=newsletter&amp;utm_medium=stefan-email&amp;utm_campaign=api_insights" style="color: #a5b4fc; text-decoration: underline;">here</a>.</p>

<p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7);">
Many thanks to the sponsors who make it possible for this newsletter to be free for readers.<br/><br/><a href="https://thecodeman.net/sponsorship" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 10px 20px; font-size: 16px; font-weight: 700; color: #ffffff; background: #6366f1; border-radius: 8px; text-decoration: none;">Want to reach thousands of .NET developers? Sponsor TheCodeMan →</a>
</p>
</div>


## The Background
A **project workflow** is like a roadmap that guides you from the very beginning of a project all the way to its successful completion. It's essentially a series of well-defined steps and processes that you and your team follow to make sure everything gets done correctly and on time. Think of it as a recipe for success, tailored to the unique needs of your project.
Imagine you're building a house. The workflow for that project would include steps like designing the blueprints, getting the necessary permits, laying the foundation, framing the structure, and so on. Each of these steps has its own set of tasks and dependencies.
But compare that to a software development project. Here, your workflow might start with requirements gathering, move on to coding, testing, and finally, deployment. These steps are very different from building a house but are equally important to ensure a successful outcome.
I've seen people create workflows in various tools, and even in Paint.
Today I will show you how I create a workflow in my .NET application.
## My Newsletter Workflow Example
I will show everything on a simple example of my newsletter, so that it is easier to understand. Let me first explain the workflow newsletter process.
Here's an example of a newsletter workflow from the point a user subscribes to my newsletter to the point I send out a newsletter issue:

![Workflow Newsletter Example](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/workflow-example-newsletter.png)

## How do I implement this in .NET?
Have you heard of [Workflow Engine](https://workflowengine.io/)?
Workflow Engine is the perfect solution if you are dealing with business entities life cycle management in a project. Using embedded drag&amp;drop designer you can create processes in your system and manage your workflows via a simple API.
The basic set of elements allows business users to modify workflow schemes themselves. You can integrate Workflow Engine as an embedded component or via REST API.
Check out [demo](https://demo.workflowengine.io/Designer).
Let's see how to integrate it in your .NET application.
## .NET Web Application Integration
Before you continue reading:
- you can watch here video of full integration with .Net.
- you can check the project repository [here](https://github.com/StefanTheCode/WorkflowEngineDemo).
### Steps: 
1. Setting up the database
2. Initializing WorkflowRuntime
3. Connecting the Designer
### 1. Setting up the database 

WorkflowEngine offers multiple Database Providers, from MSSQL, MongoDb, [PostgreSQL](https://thecodeman.net/posts/debug-and-test-multi-environment-postgres), to Redis. I will use MSSQL database.
You can create your database using SQL commands offered by the engine itself. On the following [GitHub link](https://github.com/optimajet/WorkflowEngine.NET/tree/master/Providers/OptimaJet.Workflow.DbPersistence/SQL), you can find **CreatePersistenceObjects.sql**, which you can execute on your database and with that you will create all the necessary tables.
It looks like this:

![Workflow Engine Persistence MSSQL](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/workflowengine-persistence-mssql.png)
### 2. Initializing WorkflowRuntime 
WorkflowRuntime is a project that actually represents the communication between our application and WorkflowEngine.
1. Create a Class Library project
2. Add the following NuGet packages into your project
- **WorkflowEngine.NETCore-Core**
- **WorkflowEngine.NETCore-ProviderForMSSQL** 
3. Create a WorkflowInit.cs file and copy all the code from [here](https://github.com/StefanTheCode/WorkflowEngineDemo/blob/main/WorkflowLib/WorkflowInit.cs).
4. Build the project to make sure there are no errors.
WorkflowRuntime is ready. Now it is necessary to combine it with the designer that you will create yourself - I will show you how in the next step.
### 3. Connecting the Designer
What is WorkflowDesigner?
It is actually a web application identical to the demo project I showed above, in which you can create your own workflow.
WorkflowEngine helps you a lot here, because it gives you all the code you need to add to have a finished designer - in other words, you don't have to write anything yourself in this step.
On the localhost we create, the designer looks like this:
![Workflow Designer on Web Application](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/workflowdesigner-on-web-application.png)

So that you don't waste time on these steps, and that the reading doesn't become boring, I have prepared it for you.
It's on the GitHub repository I posted above. Of course, if you want to get into the depth of this implementation, you can look at the [official documentation](https://workflowengine.io/documentation/how-to-integrate)[](https://workflowengine.io/documentation/how-to-integrate).
## Okay, let's design our Newsletter Workflow!
For the simplicity of the blog and explanation, I will create a simple workflow with a few activities and commands.
Let's create 2 **commands** : **next** and **back** . Commands serve to move from one activity (state) to another. Let's say when the user subscribes to the newsletter, the next activity would be to send a confirmation email.
![Designer create commands](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/designer-create-commands.png)
Now create a couple of **activities** that happen in your process. I created a total of 5, where I have an **initial** (green color) and a **final** (red color), so I have 3 intermediate activities (blue color).
![Designer create activies](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/designer-create-activities.png)
Perfect!
In order to enable the transition from one activity to another by executing additional commands, it is necessary to do this through transitions. I created a transition for each transition from one state to another state.
![Designer create transitions](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/designer-create-transitions.png)
When creating transitions, you have the option to choose the type of transition ( **direct and reverse** ) that actually represents the direction in which the flow moves. What is important for us here is the **Trigger** , which will actually be the command I created - next. For reverses I have the back command. This is good if, for example, the user has not successfully verified the subscription, in that case we have to go back to the previous activity.
The complete workflow looks like this:
![Designer completed workflow](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/designer-completed-workflow.png)
Now we are given the option to record the session - which will actually record it in the database. After restarting the application, the seed will still be there because the runtime will fetch it from the database. We can also download in several formats.
![Designer save scheme](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/designer-save-scheme.png)

## Creating a process and calling commands
The goal of all this is to be able to create a custom application in which we will create through workflow activities and perform various actions on the occasion of them.
For this purpose, it is possible to create a console or web application. You can see an example of the application [here](https://workflowengine.io/documentation/how-to-integrate#commands).
Console application example from the url:
![Console application to test workflow](/images/blog/posts/how-do-i-implement-workflow-using-dotnet-workflow-engine/console-application-to-test-workflow.png)
## Conslusion
By using designer, I can make changes on the fly—like when I decide to change the look of the newsletter or how people receive it. It's like having a remote control for the newsletter process, so I can adjust things without getting my hands dirty with the complicated code. Plus, I won't have to spend time checking and rechecking the code for errors, because I won't be touching it. This makes updating things a whole lot simpler and less stressful.
Optimajet Workflow Engine is one of the easiest workflow engines for document approval when integrating is required. We recommend it to companies that develop information systems with workflow functionality.
In addition, you can download Optimajet samples [here](https://workflowengine.io/downloads/net-core/).
If you have any question, please, do not hesitate to [contact them](https://optimajet.com/book-a-meeting/).
I can only agree with this and add that workflows also help us in our everyday life, without us even noticing it. How many times do we just make a plan and a path in our head, how we will do something today?
That's all from me today.

## Wrapping Up

<!--END-->

