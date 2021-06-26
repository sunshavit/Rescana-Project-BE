require("dotenv").config({ path: "./configs/.env" });
const express = require("express");
const cors = require("cors");
const api = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.use("/api", api);
app.use(async (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong.",
  });
  console.error(err.message);
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
