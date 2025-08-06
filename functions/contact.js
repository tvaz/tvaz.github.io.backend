const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(SUPABASE_URL + '/rest/v1/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text(); // fallback if JSON fails
    throw new Error(`Supabase error: ${response.status} ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error('Supabase returned an empty or invalid JSON response');
  }

};

