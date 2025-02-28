import { OpenAI } from "openai";
import "dotenv/config";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or your specific origin
  'Access-Control-Allow-Methods': 'POST, OPTIONS', // Must include OPTIONS
  'Access-Control-Allow-Headers': 'content-type, content-allow-methods, content-allow-origin', // Your requested headers
  'Access-Control-Max-Age': '86400', // Optional
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

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
      console.log('Successfully parsed body:', parsedBody);
    } catch (e) {
      console.error('Failed to parse body:', event.body);
      throw new Error(`Invalid JSON in request body: ${e.message}`);
    }

    // Validate required fields
    const required = ['name', 'age', 'job', 'company', 'industry', 'personaType'];
    const missing = required.filter(field => !parsedBody[field]);
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `Create a detailed user persona for ${parsedBody.name}, who is ${parsedBody.age} years old and works as a ${parsedBody.job} at ${parsedBody.company} in the ${parsedBody.industry} industry. This persona represents a ${parsedBody.personaType}. ${parsedBody.additionalCriteria ? `Additional Context: ${parsedBody.additionalCriteria}` : ''} ${parsedBody.salaryRange ? `Expected Income Range: ${parsedBody.salaryRange}` : ''}
    Please provide the following details in a JSON format:

    {
    "incomeRange": "${parsedBody.salaryRange || 'To be determined based on role and experience'}",
    "background": "a detailed paragraph about ${parsedBody.name}'s professional background and experience at ${parsedBody.company}. Include information about their role, responsibilities, and achievements.",
    "goals": [
        "specific professional goals with metrics",
        "personal development goal tied to career advancement",
        "work-life balance goal with specific activities",
        "financial or investment goal",
        "skill development goal relevant to ${parsedBody.industry}"
    ],
    "painPoints": [
        "specific challenge related to their role at ${parsedBody.company} as a ${parsedBody.job}",
        "industry-specific challenge in ${parsedBody.industry}",
        "management or team-related challenge",
        "technology or tool-related frustration or challenges",
        "work-life balance challenge"
    ],
    "hobbies": [
        "active hobby with frequency and motivation",
        "creative hobby with description",
        "social hobby with community involvement",
        "technical hobby related to their field",
        "relaxation activity"
    ],
    "preferences": [
        "preferred work environment (remote/hybrid/office)",
        "communication style and tools",
        "learning and development preferences",
        "collaboration style preference",
        "technology stack or tool preferences"
    ]
    }`;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: prompt
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0].message.content;

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