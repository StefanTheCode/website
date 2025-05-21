---
title: "How to use ChatGPT in C# application?"
subtitle: "ChatGPT (Generative Pre-trained Transforer) is a large language model developed by OpenAI. It is designed to understand natural language ... "
category: "AI"
date: "February 20 2023"
readTime: "Read Time: 3 minutes"
photoUrl: "/images/blog/newsletter21.png"
--- 

### Background
&nbsp;
##### ChatGPT (Generative Pre-trained Transforer) is a large language model developed by OpenAI. It is designed to understand natural language input from users and generate appropriate responses using advanced algorithms and machine learning techniques. ChatGPT can be used in a variety of applications, including chatbots, virtual assistants, customer service, and more.
##### Here I will show you how you can integrate/call ChatGPT API using C# programming language in 5 steps in 5 minutes.

&nbsp;
&nbsp;

### Step #1
### Add OpenAI NuGet
&nbsp;

##### In this step, adding the OpenAI NuGet package is crucial for connecting your C# application to ChatGPT. It's a simple yet essential part of integrating AI in .NET.

##### To integrate ChatGPT, the initial step involves installing the OpenAI C# SDK. This can be accomplished by executing the following command in the Package Manager Console using the NuGet package manager:

![Customer class](/images/blog/posts/how-to-use-chatgpt-in-csharp-application/install-package-openai.png)

&nbsp;

### Step #2
### Get API key
&nbsp;

##### In order to be able to call and authenticate to the OpenAI API, it is necessary to generate a unique API key.
&nbsp;
##### To do this:
&nbsp;
##### • Visit: https://platform.openai.com/account/api-keys
##### • Log in
##### • Create your API Key by clicking on "Create new secret key" button.

![Customer class](/images/blog/posts/how-to-use-chatgpt-in-csharp-application/chatgpt-api-secret-key.png)
&nbsp;
&nbsp;

### Step #3
### Instantiate OpenAI
&nbsp;
##### After successfully installing the OpenAI C# SDK, the next step is to initialize it by providing your OpenAI API key. To accomplish this, create an instance of the OpenAI class and pass your API key as a parameter.

![Customer class](/images/blog/posts/how-to-use-chatgpt-in-csharp-application/openai-csharp-sdk.png)

&nbsp;
### Step #4
### Call the API
&nbsp;
##### In order to call the API and get a response to the prompt we set, it is necessary to call the CreateCompletionAsync() method, which accepts the following parameters:

&nbsp;
##### <b>1. prompt</b>
##### A required string parameter that specifies the text prompt for which the API will generate a completion.
&nbsp;
##### <b>2. model</b>
##### A <b>required string parameter</b> that specifies the name of the OpenAI model to use for generating the completion. In this case, it is used the <b>text-davinci-003 model</b>.
&nbsp;
##### <b>3. max_tokens</b>
##### An <b>optional integer parameter</b> that controls the maximum number of tokens (words or symbols) in the generated completion. If set to a low number, the completion will be shorter and more concise. If set to a higher number, the completion will be longer and more detailed.
&nbsp;
##### <b>4. temperature</b>
##### An <b> optional floating point parameter</b> - that controls the "creativity" or randomness of the generated completion. A higher temperature value will result in more diverse and unpredictable output, whereas a lower temperature value will result in more conservative and predictable output. In general, a temperature value between 0.5 and 1.0 tends to produce the most interesting and varied results, while a temperature value closer to 0 tends to be more predictable and safe.

![Customer class](/images/blog/posts/how-to-use-chatgpt-in-csharp-application/create-completitions-openai.png)
&nbsp;
### Step #5
### Read and display result
&nbsp;
##### Once the process of generating the completions has concluded, it is possible to exhibit them within your C# application.
&nbsp;

![Customer class](/images/blog/posts/how-to-use-chatgpt-in-csharp-application/getting-answer-openai.png)
&nbsp;
##### Congratulations! By following these straightforward steps, you now have the ability to seamlessly integrate ChatGPT into your C# code and generate text completions using the model. This was a light and short newsletter issue considering that I haven't commented on ChatGPT so far, so I wanted to do something practical.
&nbsp;
##### Make a coffee and check out source code directly on my <b> [GitHub repository](https://github.com/StefanTheCode/Newsletter)</b>.
&nbsp;

## <b > dream BIG! </b>