# OpenAI API Lamda Setup for EasyUserPersonas.com
This is the main prompt used by the EasyUserPersonas.com application to get a response from the OpenAI API. The Lambda is needed for secure invocation of the OpenAI API endpoint.

## How to use
To use this you will need the following:
- [OpenAI API Key](https://platform.openai.com/docs/overview)
- [Node v20](https://nodejs.org/en) or higher
- An [AWS Lamda](https://aws.amazon.com/lambda/)

The Lambda needs to be configured locally before being added to your AWS console and is meant to be used with a [AWS API Gateway](https://aws.amazon.com/api-gateway/)
### Requirements

## To Do
- [ ] Modify code to allow for a public repo
- [ ] Update prompt for some more detail
- [ ] Fix CORS so it is more secure