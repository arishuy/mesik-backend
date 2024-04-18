import dotenv from "dotenv";

dotenv.config();

export default {
  servers: [
    {
      url: `https://pbl6-server.onrender.com/v1`,
      description: "Hosting",
    },
    {
      url: `http://localhost:${process.env.PORT}/v1`,
      description: "Local server",
    },
  ],
};
