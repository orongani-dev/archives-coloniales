const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Vérifier que l'utilisateur est connecté (via Netlify Identity)
  const { user } = context.clientContext;
  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Non autorisé. Veuillez vous connecter.' })
    };
  }

  try {
    const response = await fetch(
      'https://app.nocodb.com/api/v3/data/pq7am8s1nap5wn8/mv1t31dy6i4f0iu/records',
      {
        headers: {
          'xc-token': process.env.NOCODB_TOKEN,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`NocoDB a répondu avec le statut ${response.status}`);
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};