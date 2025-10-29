// netlify/functions/generate-video-from-image.js
const { HfInference } = require('@huggingface/inference');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const formData = new FormData(); // Netlify otomatis parse multipart/form-data
    // Dalam Netlify, event.body adalah string, jadi parse manual jika perlu
    // Untuk file upload, gunakan library seperti 'multiparty' atau handle buffer

    // Asumsi: File dikirim sebagai 'image' field
    const fileBuffer = Buffer.from(event.body, 'base64'); // Jika dikirim sebagai base64 dari frontend
    // Catatan: Frontend perlu convert file ke base64 sebelum kirim. Jika tidak, gunakan multiparty.

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

    // Gunakan model image-to-video (contoh: stabilityai/stable-video-diffusion)
    const result = await hf.imageToVideo({
      model: 'stabilityai/stable-video-diffusion',
      inputs: fileBuffer, // Buffer gambar
      parameters: { num_frames: 16, fps: 8 }, // Parameter opsional untuk video pendek
    });

    // Hasil biasanya URL atau blob; return sebagai URL
    // Dalam production, upload hasil ke storage (misalnya, Netlify Blob atau Cloudinary) dan return URL
    const videoUrl = result.video_url || 'https://example.com/placeholder-video.mp4'; // Placeholder jika model return blob

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ video_url: videoUrl }),
    };
  } catch (error) {
    console.error('Error generating video from image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to generate video: ${error.message}` }),
    };
  }
};