exports.handler = async (event, context) => {
  // Vérifier le token Bearer
  const authHeader = event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Non autorisé' }) };
  }

  // Vérifier le token auprès de Netlify Identity
  try {
    const userResponse = await fetch(
      'https://archives-coloniales-avancees.netlify.app/.netlify/identity/user',
      { headers: { Authorization: 'Bearer ' + token } }
    );

    if (!userResponse.ok) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Token invalide' }) };
    }
  } catch (e) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Erreur vérification' }) };
  }

  // Récupérer les archives depuis NocoDB
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
      throw new Error(`Erreur NocoDB: ${response.status}`);
    }

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};