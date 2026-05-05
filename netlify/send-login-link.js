exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    const { email } = JSON.parse(event.body);
  
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email requis' }) };
    }
  
    try {
      // Appeler l'API Netlify Identity pour envoyer un lien magique
      const response = await fetch(
        `https://archives-coloniales-avancees.netlify.app/.netlify/identity/magiclink`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            redirect_url: 'https://archives-coloniales-avancees.netlify.app/archives'
          })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        return {
          statusCode: response.status,
          body: JSON.stringify({ error: errorData.msg || 'Erreur Identity' })
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Lien envoyé' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };