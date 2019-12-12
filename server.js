require("dotenv").config();
require("colors");

const os = require("os");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(
  morgan(
    `${":method".white} ${`:url`.green} ${`:status`.yellow.bold} - ${
      ":response-time ms".grey
    }`
  )
);

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/uploads/${new Date().getTime()}${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({
      fileName: file.name,
      filePath: `${__dirname}/uploads/${file.name}${new Date().getTime()}`
    });
  });
});

const welcomeMessage = `
${"Node File Upload Server Started".blue}
${`Server Running on port`} ${`${process.env.PORT}`.magenta}
${`[network]`.grey.dim} ${`http://localhost:${process.env.PORT}/upload`.yellow}
${`[ local ]`.grey.dim} ${
  `http://${os.hostname}:${process.env.PORT}/upload`.yellow
}
`;

app.listen(5000, () => console.log(welcomeMessage));
