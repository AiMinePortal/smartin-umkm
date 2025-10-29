const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { prompt } = JSON.parse(event.body);
  const HF_TOKEN = process.env.HF_TOKEN;
  try {
    // Generate image dulu
    const imgRes = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: prompt }),
    });
    const imgBuffer = await imgRes.arrayBuffer();
    // Lalu convert ke video (gunakan model video; ini placeholder)
    const vidRes = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-video-diffusion-img2vid', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${HF_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: imgBuffer }),
    });
    const vidBuffer = await vidRes.arrayBuffer();
    const base64 = Buffer.from(vidBuffer).toString('base64');
    return {
      statusCode: 200,
      body