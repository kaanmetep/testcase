require("dotenv").config();
const express = require("express");
const productService = require("./services/productService");

const app = express();
const PORT = 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Product API Server" });
});

app.get("/api/products", productService.getProducts);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
