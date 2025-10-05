const fs = require("fs").promises;
const path = require("path");
const { getGoldPrice } = require("./goldPriceService");

const productsData = {
  products: null,
  productsPath: path.join(__dirname, "..", "products.json"),
};

async function loadProducts() {
  try {
    const data = await fs.readFile(productsData.productsPath, "utf8");
    productsData.products = JSON.parse(data);
    return productsData.products;
  } catch (error) {
    console.error("Error loading products:", error.message);
    throw new Error("Failed to load products data");
  }
}

exports.getProducts = async function getProducts(req, res) {
  try {
    if (!productsData.products) {
      await loadProducts();
    }

    const goldPrice = await getGoldPrice();

    let productsWithPrices = productsData.products.map((product) => {
      const price = calculatePrice(product, goldPrice);

      return {
        ...product,
        price: price,
        priceCurrency: "USD",
        calculatedAt: new Date().toISOString(),
      };
    });

    if (req.query.minPrice || req.query.maxPrice) {
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
      const maxPrice = req.query.maxPrice
        ? parseFloat(req.query.maxPrice)
        : Infinity;

      productsWithPrices = productsWithPrices.filter((product) => {
        return product.price >= minPrice && product.price <= maxPrice;
      });
    }

    if (req.query.minPopularity) {
      const minPopularity = parseFloat(req.query.minPopularity);
      productsWithPrices = productsWithPrices.filter((product) => {
        return product.popularityScore >= minPopularity;
      });
    }

    res.json(productsWithPrices);
  } catch (error) {
    console.error("Error getting products:", error.message);
    res.status(500).json({ error: error.message });
  }
};

function calculatePrice(product, goldPrice) {
  const price = (product.popularityScore + 1) * product.weight * goldPrice;
  return parseFloat(price.toFixed(2));
}
