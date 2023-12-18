---
newsletterTitle: "#45 Stefan's Newsletter"
title: "Better Error Handling with Result<T> object"
subtitle: "Exceptions are designed to handle unexpected and rare events. Using them for regular control flow, like handling business logic or validations, is generally considered a bad practice because it misrepresents the intention of the exception mechanism."
date: "Dec 11 2023"
readTime: "Read Time: 6 minutes"
photoUrl: "/images/blog/newsletter21.png"
meta_description: "Explore the latest methods to handle Nullable References in .NET. This comprehensive guide covers 4 key strategies, essential for C# developers working with .NET 6 and beyond."
---

##### **Many thanks to the sponsors who make it possible for this newsletter to be free for readers.**
&nbsp;
##### • If you have ever used **Postman** to debug and write tests for your REST APIs, guess what, those are the same concepts you need to know for ** [writing tests for your gRPC requests in Postman](https://blog.postman.com/testing-grpc-apis-with-postman/) **
##### For more info about gRPC, they created a great beginner article ** [here](https://blog.postman.com/what-is-grpc/) **.
&nbsp;  
##### • [**Workflow Engine**](https://workflowengine.io/) is the perfect solution if you are dealing with business entities life cycle management in a project. Using embedded drag&amp;drop designer you can create processes in your system and manage your workflows via a simple API. Check it out ** [here](https://workflowengine.io/) **.
&nbsp;  
&nbsp;  
### The Background
&nbsp;  
&nbsp;  
##### **Exceptions should be rare.**
&nbsp;  
##### Why?
&nbsp;  
##### Throwing and catching exceptions **is slow** relative to other code flow patterns. Because of this, exceptions shouldn't be used to control normal program flow.
&nbsp;  
##### Also...
&nbsp;  
##### Code that relies heavily on exceptions for control flow can become **difficult to read and maintain** . It can be challenging to follow the logic of a program that jumps from one exception handler to another, as opposed to one that follows a more straightforward, linear flow.
&nbsp;  
##### Also...
&nbsp;  
##### Improperly handled exceptions can lead to resource leaks.
&nbsp;  
##### Exceptions are designed to **handle unexpected and rare events** . Using them for regular control flow, like handling business logic or validations, is generally considered a bad practice because it misrepresents the intention of the exception mechanism.
&nbsp;  
##### Even Microsoft has a recommendation:
&nbsp;  
##### • Do not use throwing or catching exceptions as a means of normal program flow, especially in hot code paths.&nbsp;
##### • Do include logic in the app to detect and handle conditions that would cause an exception.&nbsp;
##### • Do throw or catch exceptions for unusual or unexpected conditions.
&nbsp;  
##### So what to do?
&nbsp;  
##### Minimize them. Try something else.
&nbsp;  
##### In today's article, I'll explain how you can minimize using exceptions, and change them for the **Result&lt;T&gt;** object in the normal flow of the application.
&nbsp;  
##### Let's dive in...
&nbsp;  
&nbsp;  
### Handling errors with regular Exceptions&nbsp;
&nbsp;  
&nbsp;  
##### Let's consider a common business logic scenario: validating user input for a registration form.
##### Initially, let's see how this might be done using exceptions:

```csharp

public class UserRegistration
{
    public void RegisterUser(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Username and password are required.");
        }

        if (password.Length &lt; 8)
        {
            throw new ArgumentException("Password must be at least 8 characters long.");
        }

        // Proceed with registration
    }
}
```

##### In this approach, validation failures are treated as exceptions, which is not ideal for common scenarios like invalid input.
&nbsp;  
##### They are best reserved for truly exceptional, unforeseen, and irregular situations.
&nbsp;  
##### For regular and predictable events like input validation, standard control flow mechanisms (like Result&lt;T&gt;) are more appropriate and efficient.
&nbsp;  
&nbsp;  
### Handling errors with Result&lt;T&gt; object
&nbsp;  
&nbsp;  
##### By using Result, you're ensuring that your code is handling expected scenarios (like invalid user input) in a more predictable and maintainable way, improving the overall quality and readability of your codebase.
&nbsp;  
##### Let's see the same example with Result&lt;T&gt; object:
```csharp

public class UserRegistration
{
    public Result RegisterUser(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
        {
            return Result.Failure("Username and password are required.");
        }

        if (password.Length &lt; 8)
        {
            return Result.Failure("Password must be at least 8 characters long.");
        }

        // Proceed with registration
        return Result.Success();
    }
}
```

##### Here the flow is quite normal, we return values in relation to the code being executed instead of throwing an exception where it is not necessary.
&nbsp;  
##### Result&lt;T&gt; does not come with any library (there are various libraries that already implement the Result object, like FluentResults) which means that I created it myself.
&nbsp;  
##### Let me show you how:
```csharp

public class Result
{
    public bool IsSuccess { get; private set; }
    public bool IsFailure { get; private set; } =&gt; !IsSuccess
    public string ErrorMessage { get; private set; }

    protected Result(bool isSuccess, string errorMessage)
    {
        IsSuccess = isSuccess;
        ErrorMessage = errorMessage;
    }

    public static Result Success() =&gt; new Result(true, null);
    public static Result Failure(string message) =&gt; new Result(false, message);
}
```

##### • **Success/Failure Indicator** : At its core, a Result object contains a flag indicating whether the operation was successful. This is usually a boolean value.
&nbsp;  
##### • **Return Value** : In the case of success, the Result object can hold the resulting value of the operation. For instance, if the operation was to process a file, the Result might contain the processed data.
&nbsp;  
##### • **Error Message or Error Object:** In case of failure, the Result can hold an error message or an entire error object that provides more details about why the operation failed. This is more informative than a simple false or null return value.
&nbsp;  
##### • **Additional Metadata:** Depending on the implementation, a Result object can also contain additional metadata about the operation, like error codes, timestamps, or diagnostic information.
&nbsp;  
##### Really nice, right?
&nbsp;  
##### What can we improve here?
&nbsp;  
&nbsp;  
### A better way to express the error
&nbsp;  
&nbsp;  
##### In this case, I don't like the fact that the magic string is used for errors.
&nbsp;  
##### Here we can create a class (or record) that will display the error as a combination of error type and error description.
&nbsp;  
##### Let' take a look how to represent it:
```csharp

public record Error(string Type, string Description)
{
    public static readonly Error None = new(string.Empty, string.Empty);
}
```

##### And now for each of the failed validations we can create a separate Error object that will represent a unique error for that type of validation:
```csharp

public static class RegistrationErrors
{
    public static readonly Error UsernameAndPasswordRequired = new Error(
        "Registration.UsernameAndPasswordRequired", "Username and password are required.");

    public static readonly Error PasswordTooShort = new Error(
        "Registration.PasswordTooShort", "Password must be at least 8 characters long.");
}
```

##### So, instead of an ordinary string, we can return a more structured value (this means that Error in the Result&lt;T&gt; object should be an Error type, and no longer a string):
```csharp

return Result.Failure(RegistrationErrors.PasswordTooShort);
```

&nbsp;  
### Why the change?
&nbsp;  
&nbsp;  
##### **Improved Readability** :
##### The Result pattern clearly indicates that user input validation is a part of the normal flow and not an exceptional circumstance.
&nbsp;  
##### **Easier Error Handling:**
##### It guides the caller to handle both success and failure cases explicitly, making the code more robust.
&nbsp;  
##### **Enhanced Performance:**
##### Avoiding exceptions for regular control flow scenarios like input validation is more performance-efficient.
&nbsp;  
##### **Flexibility and Extensibility:**
##### The Result pattern can easily be extended or modified to include additional details about the failure or even success scenarios, without changing the method signature.
&nbsp;  
&nbsp;  
### Conclusion
&nbsp;  
&nbsp;  
##### Let's distill the essence of this week's discussion: reserve exceptions for truly unforeseen events.
##### They are best suited for situations where the error is beyond your immediate handling capabilities.
##### For everything else, the clarity and structure offered by the Result pattern are far more beneficial.
&nbsp;  
##### Embracing the Result class in your code allows you to:
&nbsp;  
##### • Clearly indicate that a method might not always succeed.
##### • Neatly wrap up an error occurring within your application.
##### • Offer a streamlined, functional approach to managing errors.
&nbsp;  
##### What's more, you can systematically catalog all the errors in your application using the Error class. This is incredibly useful, providing a clear guide on which errors to anticipate and handle.
&nbsp;  
##### I highly recommend giving the Result pattern a try in your projects. It could significantly elevate the quality of your code.
&nbsp;  
##### That's all from me today.