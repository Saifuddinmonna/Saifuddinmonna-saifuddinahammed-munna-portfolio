const axios = require('axios');
const FormData = require('form-data');

const uploadToImageBB = async (fileBuffer) => {
  const apiKey = process.env.IMAGEBB_API_KEY;
  if (!apiKey) throw new Error('ImageBB API key not defined');
  
  const formData = new FormData();
  formData.append('image', fileBuffer.toString('base64'));

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData, {
    headers: formData.getHeaders(),
  });
  return response.data.data.url;
};

module.exports = { uploadToImageBB }; 