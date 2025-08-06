const fetch = require('node-fetch');

exports.handler = async (event) => {

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://torivaz.com/",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  try {
    // Parse incoming request body
    const { name, email, message } = JSON.parse(event.body);

    // Load environment variables
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Construct payload
    const payload = { name, email, message };

    // Send POST request to Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(payload)
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase error: ${response.status} ${errorText}`);
    }

    // Safely parse JSON response
    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch (err) {
      console.error("Failed to parse Supabase response:", err);
      data = null;
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://torivaz.com/",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        success: true,
        data: data || "No valid JSON returned from Supabase"
      })
    };

  } catch (error) {
    // Return error response
    console.error("Function error:", error);
    return {
      statusCode: 500,
        headers: {
        "Access-Control-Allow-Origin": "https://torivaz.com/",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
