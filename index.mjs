import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    // const { name, age, company, job, industry, personaType, salaryRange, additionalCriteria } = body;
    
    const prompt = `Create a detailed user persona for ${body.name}, who is ${body.age} years old and works as a ${body.job} at ${body.company} in the ${body.industry} industry. This persona represents a ${body.personaType}. ${body.additionalCriteria ? `Additional Context: ${body.additionalCriteria}` : ''} ${body.salaryRange ? `Expected Income Range: ${body.salaryRange}` : ''}
    Please provide the following details in a JSON format:

    {
    "incomeRange": "${body.salaryRange || 'To be determined based on role and experience'}",
    "background": "a detailed paragraph about ${body.name}'s professional background and experience at ${body.company}. Include information about their role, responsibilities, and achievements.",
    "goals": [
        "specific professional goals with metrics",
        "personal development goal tied to career advancement",
        "work-life balance goal with specific activities",
        "financial or investment goal",
        "skill development goal relevant to ${body.industry}"
    ],
    "painPoints": [
        "specific challenge related to their role at ${body.company}",
        "industry-specific challenge in ${body.industry}",
        "management or team-related challenge",
        "technology or tool-related frustration",
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
    }`; // Same prompt as before

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Configure this to your S3 bucket URL in production
        'Access-Control-Allow-Credentials': true,
      },
      body: completion.choices[0].message.content
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
