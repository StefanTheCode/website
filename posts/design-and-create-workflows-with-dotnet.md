---
newsletterTitle: "#40 Stefan's Newsletter"
title: "How do I implement a workflow using a .NET workflow engine?"
subtitle: "In .NET, background tasks are asynchronous operations that run independently of the main application thread.
They are used to perform tasks that should not block the main thread, such as long-running computations, I/O operations, or tasks that can be executed concurrently."
date: "Nov 06 2023"
photoUrl: "/images/blog/newsletter21.png"
---

### The background
<br>
<br>
##### A <b> project workflow </b>is like a roadmap that guides you from the very beginning of a project all the way to its successful completion. It's essentially a series of well-defined steps and processes that you and your team follow to make sure everything gets done correctly and on time. Think of it as a recipe for success, tailored to the unique needs of your project.
<br>
##### Imagine you're building a house. The workflow for that project would include steps like designing the blueprints, getting the necessary permits, laying the foundation, framing the structure, and so on. Each of these steps has its own set of tasks and dependencies.
<br>
##### But compare that to a software development project. Here, your workflow might start with requirements gathering, move on to coding, testing, and finally, deployment. These steps are very different from building a house but are equally important to ensure a successful outcome.
<br>
##### I've seen people create workflows in various tools, and even in Paint.
##### Today I will show you how I create a workflow in my .NET application.

<br>
<br>
### My Newsletter Workflow Example
<br>
<br>

##### I will show everything on a simple example of my newsletter, so that it is easier to understand. Let me first explain the workflow newsletter process.
<br>
##### Here's an example of a newsletter workflow from the point a user subscribes to my newsletter to the point I send out a newsletter issue:
<br>
![Newsletter Workflow example](/images/blog/posts/design-and-create-workflows-with-dotnet/workflow-example-newsletter.png)

<br>
<br>
### How do I implement this in .NET?
<br>
<br>
##### Have you heard of [Workflow Engine](https://workflowengine.io/)?
<br>
#####  Workflow Engine is the perfect solution if you are dealing with business entities life cycle management in a project. Using embedded drag&drop designer you can create processes in your system and manage your workflows via a simple API.
##### The basic set of elements allows business users to modify workflow schemes themselves. You can integrate Workflow Engine as an embedded component or via REST API.
<br>
##### Check out demo [here](https://demo.workflowengine.io/Designer).
<br>
##### Let's see how to integrate it in your .NET application. 
<br>
<br>
### .NET Web Application Integration
<br>
<br>

<br>
##### Before you continue reading:
<br>

##### • you can watch [here](https://www.youtube.com/watch?v=Tqe_LNwEYgU&ab_channel=OptimaJet) the video of full integration with .Net.
##### • you can check the project repository [here](https://github.com/StefanTheCode/WorkflowEngineDemo).
<br>
#### • Steps:
<br>
##### 1. Setting up the database
##### 2. Initializing WorkflowRuntime
##### 3. Connecting the Designer

<br>
<br>
####  <b>1. Setting up the database</b>
<br>
##### WorkflowEngine offers multiple Database Providers, from MSSQL, MongoDb, PostgreSQL, to Redis. I will use MSSQL database.
<br>
##### You can create your database using SQL commands offered by the engine itself. On the following [GitHub link](https://github.com/optimajet/WorkflowEngine.NET/tree/master/Providers/OptimaJet.Workflow.DbPersistence/SQL), you can find <b>CreatePersistenceObjects.sql</b>, which you can execute on your database and with that you will create all the necessary tables. 
<br>

##### It looks like this:
<br>
![Workflow Engine Persistence with MSSQL](/images/blog/posts/design-and-create-workflows-with-dotnet/workflowengine-persistence-mssql.png)

<br>
<br>
####  <b>2. Initializing WorkflowRuntime</b>
<br>

##### WorkflowRuntime is a project that actually represents the communication between our application and WorkflowEngine. 
##### It can be implemented as a ClassLibrary and it is necessary to do a few things:
<br>
##### 1. Create a Class Library project
##### 2. Add the following NuGet packages into your project
#####  <b> • WorkflowEngine.NETCore-Core </b>
##### <b>  • WorkflowEngine.NETCore-ProviderForMSSQL</b>
##### 3. Create a WorkflowInit.cs file and copy all the code from [here](https://github.com/StefanTheCode/WorkflowEngineDemo/blob/main/WorkflowLib/WorkflowInit.cs).
##### 4. Build the project to make sure there are no errors.
<br>

##### WorkflowRuntime is ready. Now it is necessary to combine it with the designer that you will create yourself - I will show you how in the next step.

<br>
<br>
####  <b>3. Connecting the Designer</b>
<br>

#### What is WorkflowDesigner?
<br>

##### It is actually a web application identical to the demo project I showed above, in which you can create your own workflow.
##### WorkflowEngine helps you a lot here, because it gives you all the code you need to add to have a finished designer - in other words, you don't have to write anything yourself in this step.
<br>

##### On the localhost we create, the designer looks like this:
<br>

![Workflow Designer on Web Application](/images/blog/posts/design-and-create-workflows-with-dotnet/workflowdesigner-on-web-application.png)
<br>
##### So that you don't waste time on these steps, and that the reading doesn't become boring, I have prepared it for you. 
<br>
##### It's on the GitHub repository I posted above. Of course, if you want to get into the depth of this implementation, you can look at the [official documentation](https://workflowengine.io/documentation/how-to-integrate).
<br>
<br>
### Okay, let's design our Newsletter Workflow!
<br>
<br>

##### For the simplicity of the blog and explanation, I will create a simple workflow with a few activities and commands.
<br>
##### Let's create 2 <b>commands</b>: <b>next</b> and <b>back</b>. Commands serve to move from one activity (state) to another. Let's say when the user subscribes to the newsletter, the next activity would be to send a confirmation email.
<br>
![Workflow Designer Create Commands](/images/blog/posts/design-and-create-workflows-with-dotnet/designer-create-commands.png)

<br>
##### Now create a couple of <b>activities</b> that happen in your process. I created a total of 5, where I have an <b>initial</b> (green color) and a <b>final</b> (red color), so I have 3 intermediate activities (blue color).
<br>
![Workflow Designer Create Activities](/images/blog/posts/design-and-create-workflows-with-dotnet/designer-create-activities.png)

<br>
##### Perfect!
<br>
##### In order to enable the transition from one activity to another by executing additional commands, it is necessary to do this through transitions. I created a transition for each transition from one state to another state.
<br>
![Workflow Designer Create Activities](/images/blog/posts/design-and-create-workflows-with-dotnet/designer-create-transitions.png)
<br>
##### When creating transitions, you have the option to choose the type of transition (<b>direct and reverse</b>) that actually represents the direction in which the flow moves. What is important for us here is the <b>Trigger</b>, which will actually be the command I created - next. For reverses I have the back command. This is good if, for example, the user has not successfully verified the subscription, in that case we have to go back to the previous activity.
<br>
##### The complete workflow looks like this:
<br>
![Workflow Designer Completed Workflow](/images/blog/posts/design-and-create-workflows-with-dotnet/designer-completed-workflow.png)
<br>
<br>
##### Now we are given the option to record the session - which will actually record it in the database. After restarting the application, the seed will still be there because the runtime will fetch it from the database. We can also download in several formats.
<br>
![Workflow Designer Save Scheme](/images/blog/posts/design-and-create-workflows-with-dotnet/designer-save-scheme.png)

<br>
<br>
### Creating a process and calling commands
<br>
<br>

##### The goal of all this is to be able to create a custom application in which we will create through workflow activities and perform various actions on the occasion of them.
<br>
##### For this purpose, it is possible to create a console or web application. You can see an example of the application [here](https://workflowengine.io/documentation/how-to-integrate#commands)
<br>
##### Console application example from the url: 
<br>
![Console application to test workflow](/images/blog/posts/design-and-create-workflows-with-dotnet/console-application-to-test-workflow.png)

<br>
<br>
### Conclusion
<br>
<br>

##### Directly from authors:
<br>
##### By using designer, I can make changes on the fly—like when I decide to change the look of the newsletter or how people receive it. It's like having a remote control for the newsletter process, so I can adjust things without getting my hands dirty with the complicated code. Plus, I won't have to spend time checking and rechecking the code for errors, because I won't be touching it. This makes updating things a whole lot simpler and less stressful.
<br>

##### Optimajet Workflow Engine is one of the easiest workflow engines for document approval when integrating is required. We recommend it to companies that develop information systems with workflow functionality.
<br>

##### In addition, you can download Optimajet samples [here](https://workflowengine.io/downloads/net-core/).
##### If you have any question, please, do not hesitate to [contact them](https://optimajet.com/book-a-meeting/).

<br>
##### I can only agree with this and add that workflows also help us in our everyday life, without us even noticing it. How many times do we just make a plan and a path in our head, how we will do something today?

<br>
##### That's all from me for today.
<br>

## <b > dream BIG! </b>