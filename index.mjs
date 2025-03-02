import { OpenAI } from "openai";
import "dotenv/config";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific origin. It is recommended to restrict it to your domain as much as possible
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Must include OPTIONS
  'Access-Control-Allow-Headers': 'content-type, content-allow-methods, content-allow-origin', // Your requested headers
  'Access-Control-Max-Age': '86400', // Optional caching of preflight response
};

export async function handler(event) {
  // Add detailed logging for debugging
  console.log('Event received:', {
    httpMethod: event.httpMethod,
    headers: event.headers,
    body: event.body,
  });

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  try {
    // Validate OpenAI key first
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    if (!event.body) {
      console.error('Missing body in event:', event);
      throw new Error('Request body is missing');
    }
    // Parse the body and log its success or failure. This can be removed once you are confident in the input
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body); 
      console.log('Successfully parsed body:', parsedBody);
    } catch (e) {
      console.error('Failed to parse body:', event.body);
      throw new Error(`Invalid JSON in request body: ${e.message}`);
    }

    // Validate required fields
    const required = ['']; // Add your required fields here
    const missing = required.filter(field => !parsedBody[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Initialize OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    // Create a new prompt and get the response. You can customize with your own prompt engineering. This is a simple example to retrieve a JSON object
    const prompt = `Create a new prompt and retun the response as JSON object with the following data:
        {
          "key01": "value01",
          "key02": "value02",
          "key03": "value03"
        }`;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: prompt
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" } // Refer to the API documentation for more options
    });

    const aiResponse = completion.choices[0].message.content;

    // Parse the response and log its success or failure. This can be removed once you are confident in the output
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          data: parsedResponse
        })
      };
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', aiResponse);
      throw new Error('Invalid JSON response from OpenAI');
    }
  // Handle errors and return a response
  } catch (error) {
    console.error('Lambda error:', {
      message: error.message,
      stack: error.stack,
      details: error
    });

    return {
      statusCode: error.statusCode || 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};