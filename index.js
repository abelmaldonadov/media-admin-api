const dotenv = require("dotenv").config()
const express = require("express")
const env = require("./src/helpers/environment")
const path = require("path")
const morgan = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const rfs = require("rotating-file-stream")
const media = require("./src/routes/media")
const payloadLog = require("./src/middlewares/payloadLog")
const os = require("os")

const app = express()
const PORT = env("PORT")

// Global Middlewares
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
})
app.use(
  morgan(
    "[:date[iso]] :remote-addr - :remote-user :method :url :status :res[content-length] - :response-time ms",
    { stream: accessLogStream }
  )
)
app.use(express.static("public"))
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(payloadLog)

// Routes
app.use(`/api/v1/media`, media)

// handle errors
app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  console.log(os.platform())
})
