const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const FAKESTORE_API = process.env.FAKESTORE_API || 'https://fakestoreapi.com/products';

app.use(express.json());

// GET /
app.get('/', (req, res) => {
  res.send('Hello World');
});

// GET /products (all or by category)
app.get('/products', async (req, res) => {
  try {
    const { category } = req.query;
    let url = FAKESTORE_API;
    if (category) {
      url += `/category/${encodeURIComponent(category)}`;
    }
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /products/:id
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${FAKESTORE_API}/${id}`);
    res.json(response.data);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// POST /products
app.post('/products', async (req, res) => {
  const { title, price, description, image, category } = req.body;

  // Validate required fields
  const requiredFields = { title, price, description, image, category };
  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }

  // Validation
  if (typeof title !== 'string' || title.length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }

  if (typeof description !== 'string' || description.length < 10) {
    return res.status(400).json({ error: 'Description must be at least 10 characters' });
  }

  if (!image.match(/^https?:\/\/.+\/.+$/)) {
    return res.status(400).json({ error: 'Image must be a valid URL' });
  }

  try {
    const response = await axios.post(FAKESTORE_API, {
      title,
      price,
      description, 
      image,
      category
    });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 