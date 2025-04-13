import axios from 'axios';

/**
 * Converts an image File object to a base64 string (without the data URI prefix)
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Strip data:image/... prefix
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Calls OpenAI's API to get a comparison score between two images
 * @param {File} modelImageFile - the reference 3D model image
 * @param {File} drawingImageFile - the user drawing image
 * @returns {Promise<string>} - the score (1-100) or error message
 */
export const generateComparisonScore = async (modelImageFile, drawingImageFile) => {
  try {
    const modelBase64 = await fileToBase64(modelImageFile);
    const drawingBase64 = await fileToBase64(drawingImageFile);

    const res = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text:
                  'This is an app for users to practice 3D spatial awareness. I will give you two images to compare: one is a user drawing, the other is a snapshot of the 3D model. I need a score from 1–100. Only type the number.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${modelBase64}`,
                }
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${drawingBase64}`,
                }
              }
            ]
          }
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error(err);
    return 'Error: Unable to generate response.';
  }
};
