const axios = require("axios");

exports.getGoldPrice = async function getGoldPrice() {
  try {
    const response = await axios.get("https://www.goldapi.io/api/XAU/USD", {
      headers: {
        "x-access-token": process.env.GOLDAPI_ACCESS_TOKEN,
      },
    });

    if (response.data && response.data.price_gram_24k) {
      return response.data.price_gram_24k;
    } else {
      throw new Error("Invalid response format from gold price API");
    }
  } catch (error) {
    console.error("Error fetching gold price:", error.message);
  }
};
