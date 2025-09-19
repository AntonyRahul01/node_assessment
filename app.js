require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { connect } = require("./config/db");
const redis = require("./config/redis");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/account");
const destinationRoutes = require("./routes/destination");
const memberRoutes = require("./routes/member");
const incomingRoutes = require("./routes/incoming");
const logsRoutes = require("./routes/logs");

const Role = require("./models/Role");

const PORT = process.env.PORT || 3000;

async function main() {
  await connect(process.env.MONGO_URI);

  const roles = ["Admin", "Normal user"];
  for (const r of roles) {
    const existing = await Role.findOne({ role_name: r });
    if (!existing) {
      await Role.create({ role_name: r });
      console.log("Role created", r);
    }
  }

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json({ limit: "1mb" }));

  // routes
  app.use("/auth", authRoutes);
  app.use("/accounts", accountRoutes);
  app.use("/accounts", destinationRoutes);
  app.use("/", memberRoutes);
  app.use("/", incomingRoutes);
  app.use("/", logsRoutes);

  app.get("/", (req, res) => {
    res.json({ message: "Server Running Successfully!" });
  });

  app.use((err, res) => {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  });

  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
