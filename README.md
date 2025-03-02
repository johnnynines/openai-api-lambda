# OpenAI API Lambda Setup
This is a clone artifact from my work on [EasyUserPersonas.com](https://easyuserpersonas.com/) that I have modified for others to use in their OpenAI projects.

The purpose of the Lambda function is to provide a secure space to invoke an OpenAI API request and handle the resoponse. The Lambda can be triggered several ways, but this was developed with the intention of using the [AWS API Gateway](https://aws.amazon.com/api-gateway/) to trigger the Lambda function.

## How to use
To use this you will need the following:
- [OpenAI API Key](https://platform.openai.com/docs/overview)
- [Node v20](https://nodejs.org/en) or higher
- An [AWS Lamda](https://aws.amazon.com/lambda/)

Pull the repo to your local environment and run `npm install`.
Once the packages have been installed, you have to zip up the entire root directory, including the `node_modules` directory, and upload it to your Lambda. 
In your Lambda Configuration settings select **Environment Variables** and add your API Key with `OPENAI_API_KEY` as the key and your API key as the Value.

It is suggested that you enable AWS Cloudwatch logs for your API Gateway and Lambda for debugging.

## To Do
- [ ] Add instructions demonstrating how to set up the Lambda from nothing
- [ ] Add details about CORS settings