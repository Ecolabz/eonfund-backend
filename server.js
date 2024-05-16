const request = require("request");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/subscribe", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  const options = {
    url: "https://api.mailjet.com/v3/REST/contactslist/331297/managecontact",
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.MAILJET_PUBLIC_KEY}:${process.env.MAILJET_SECRET_KEY}`
        ).toString("base64"),
      "Content-Type": "application/json",
    },
    json: {
      Email: email,
      Action: "addnoforce",
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.status(response.statusCode).send(body);
  });
});

app.listen(port, () => {
  console.log(`Proxy server listening at http://localhost:${port}`);
});
