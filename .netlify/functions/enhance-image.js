const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event) => {
  const formData = new FormData();
  // Parse file dari multipart (gunakan library seperti multer jika perlu, tapi sederhana ini)
  // Untuk sederhana, asumsikan base64; sesuaikan dengan input
  const { image } = JSON.parse(event.body); // Adjust for file upload
  const HF_TOKEN = process.env.HF_TOKEN;
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: image, parameters: { prompt: "enhance quality" } }),
    });
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return {
      statusCode: 200,
      body: JSON.stringify({ image_url: `data:image/png;base64,${base64}` }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
