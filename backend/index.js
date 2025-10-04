require("dotenv").config();
const express = require("express");
const productService = require("./services/productService");

const app = express();
const PORT = 5001;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Product API Server" });
});

app.get("/api/products", productService.getProducts);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
