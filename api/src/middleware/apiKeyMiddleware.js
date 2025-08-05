const dotenv = require("dotenv");
dotenv.config();

const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers["apikey"]; // API Key dikirim melalui header
  const validApiKey = process.env.API_KEY; // API Key yang valid dari .env

  if (!apiKey) {
    return res.status(401).json({ message: "API Key is missing" });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: "Invalid API Key" });
  }

  next(); // Lanjutkan ke handler berikutnya jika API Key valid
};

module.exports = apiKeyMiddleware;
