const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// routes
const authRoutes = require("./src/routers/auth");
const detilUserRoutes = require("./src/routers/detilUser");
const userRoutes = require("./src/routers/user");
const donasiRoutes = require("./src/routers/donasi");
const detilDonasiRoutes = require("./src/routers/detilDonasi");
const artikelRoutes = require("./src/routers/artikel");
const materiRoutes = require("./src/routers/ebook");
const chatRoutes = require("./src/routers/chat");
const leaderboardRoutes = require("./src/routers/leaderboard");
// const apiKeyMiddleware = require("./src/middleware/apiKeyMiddleware");

dotenv.config();
app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
  origin: ["https://aksera.netlify.app", "https://aksera.netlify.app/", "http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:4000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
// middleware API Key
// app.use(apiKeyMiddleware);

// konfigurasi routers
app.use("/auth", authRoutes);
app.use("/detil", detilUserRoutes);
app.use("/user", userRoutes);
app.use("/donasi", donasiRoutes);
app.use("/donasi/detil", detilDonasiRoutes);
app.use("/artikel", artikelRoutes);
app.use("/materi", materiRoutes);
app.use("/chat", chatRoutes);
app.use("/leaderboard", leaderboardRoutes);

// get test api
app.get("/", (req, res) => {
  res.send("Hallo dari Lentera Umat " + req.path);
});

// connect to database MongoDB
const PORT = process.env.PORT;
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Berhasil terhubung dengan mongodb"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log("Server berjalan di PORT " + PORT);
});
