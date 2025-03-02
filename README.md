# OpenAI API Lamda Setup for EasyUserPersonas.com
This is the main prompt used by the EasyUserPersonas.com application to get a response from the OpenAI API. The Lambda is needed for secure invocation of the OpenAI API endpoint.

## How to use
To use this you will need the following:
- [OpenAI API Key](https://platform.openai.com/docs/overview)
- [Node v20](https://nodejs.org/en) or higher
- An [AWS Lamda](https://aws.amazon.com/lambda/)

Pull the repo to your local environment and run `npm install`.
Once the packages have been installed, you have to zip up the entire root directory, including the `node_modules` directory, and upload it to your Lambda before it can be used with an [AWS API Gateway](https://aws.amazon.com/api-gateway/)
Add a `.env` file to the root of your Lambda to store your OpenAI API key

## To Do
- [ ] Add instructions demonstrating how to set up the Lambda from nothing
- [ ] Add details about CORS settings