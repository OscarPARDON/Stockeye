import axios from 'axios';

export async function searchStock(query) {
  try {
    const response = await axios.get('http://localhost:8000/api/values/search/' + query);
    const data = response.data;

    if (data.status === 200) {
      return data.results;
    } else {
      console.error("Erreur dans la réponse :", data.status);
      return [];
    }
  } catch (error) {
    console.error("Erreur Axios :", error);
    return [];
  }
}

export async function getDailyChange(symbol) {
  try {
    const response = await axios.get('http://localhost:8000/api/values/dailyvar/' + symbol);
    const data = response.data;

    if (data.status === 200) {
      return data.results;
    } else {
      console.error("Erreur dans la réponse :", data.status);
      return [];
    }
  } catch (error) {
    console.error("Erreur Axios :", error);
    return [];
  }
}

export async function getStockDetails(symbol) {
  try {
    const response = await axios.get('http://localhost:8000/api/values/details/' + symbol);
    const data = response.data;

    if (data.status === 200) {
      return data.results;
    } else {
      console.error("Erreur dans la réponse :", data.status);
      return [];
    }
  } catch (error) {
    console.error("Erreur Axios :", error);
    return [];
  }
}