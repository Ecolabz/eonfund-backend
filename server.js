const express = require("express");
const Mailjet = require("node-mailjet");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

const mailjetClient = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);

app.post("/api/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const listId = "331297";

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const subscribeRequest = {
      Email: email,
      Action: "addforce", 
    };

    const result = await mailjetClient
      .post(`contactslist/${listId}/managecontact`, { version: "v3" })
      .request(subscribeRequest);

    res
      .status(200)
      .json({ message: "Email subscribed successfully!", data: result.body });
  } catch (error) {
    console.error(
      "Error subscribing email:",
      error.response ? error.response.body : error
    );
    res
      .status(500)
      .json({ message: "Failed to subscribe email.", error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
