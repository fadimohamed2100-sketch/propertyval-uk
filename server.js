require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/epc', async (req, res) => {
  const { postcode } = req.query;
  if (!postcode) return res.status(400).json({ error: 'postcode required' });

  const email = process.env.EPC_API_EMAIL;
  const key = process.env.EPC_API_KEY;

  if (!email || !key || email === 'your-epc-email' || key === 'your-epc-key') {
    return res.status(503).json({ error: 'EPC API credentials not configured' });
  }

  try {
    const response = await fetch(
      `https://epc.opendatacommunities.org/api/v1/domestic/search?postcode=${encodeURIComponent(postcode)}&size=5`,
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${email}:${key}`).toString('base64'),
          'Accept': 'application/json',
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch EPC data' });
  }
});

app.post('/api/valuation', async (req, res) => {
  const { postcode, messages } = req.body;

  if (!postcode || !messages) {
    return res.status(400).json({ error: 'postcode and messages are required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to contact Anthropic API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
