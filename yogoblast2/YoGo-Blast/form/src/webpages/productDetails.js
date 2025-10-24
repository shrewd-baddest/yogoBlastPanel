import axios from 'axios';

export const productDetails = async ({ params }) => {
  const { id } = params;
  const p_id = {
    product_id: id,
  };
  try {
    const response = await axios.post('https://yogoblastpanel-3.onrender.com/pages/display', p_id);
    if (response.data) {
      return response.data;
    }
    throw new Response('Not Found', { status: 404 });
  } catch (error) {
    // avoid alert in loader; return null so route can handle
    console.error('productDetails loader error:', error.message || error);
    return null;
  }
};
