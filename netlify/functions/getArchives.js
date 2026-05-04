exports.handler = async (event, context) => {
    // Vérifier que l'utilisateur est connecté
    const { user } = context.clientContext;
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Non autorisé' })
      };
    }
  
    const url = 'https://app.nocodb.com/api/v3/data/pq7am8s1nap5wn8/mv1t31dy6i4f0iu/records';
  
    try {
      // Utiliser fetch natif de Node.js (pas besoin de node-fetch)
      const response = await fetch(url, {
        headers: {
          'xc-token': process.env.NOCODB_TOKEN,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erreur NocoDB: ${response.status}`);
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