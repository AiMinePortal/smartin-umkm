// netlify/functions/generate-copywriting.js
const { HfInference } = require('@huggingface/inference');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Gunakan model text generation (contoh: microsoft/DialoGPT-medium untuk copywriting kreatif)
    const result = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: `Write engaging copywriting for: ${prompt}. Make it persuasive and suitable for UMKM.`,
      parameters: { max_length: 200, temperature: 0.7 }, // Sesuaikan untuk hasil lebih kreatif
    });

    const generatedText = result.generated_text || 'No text generated.';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: generatedText }),
    };
  } catch (error) {
    console.error('Error generating copywriting:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to generate copywriting: ${error.message}` }),
    };
  }
};