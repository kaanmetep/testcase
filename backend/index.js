const express = require("express");

const app = express();
const PORT = 5001;

app.get("/", (req, res) => {
  res.send("hello from the server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
