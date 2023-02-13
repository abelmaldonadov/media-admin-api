const moment = require("moment")
const fs = require("fs")
const path = require("path")

// Guardar log de pagos realizados por día
const payloadLog = (req, res, next) => {
  const route = req.path
  const filePath = path.join(
    __dirname,
    "../../payloads",
    moment().format("YYYY-MM-DD") + ".log"
  )
  let logger
  try {
    logger = fs.readFileSync(filePath)
  } catch (err) {
    logger = ""
  }
  const fileContent =
    logger +
    moment().format() +
    " - " +
    route +
    " - " +
    JSON.stringify(req.body) +
    "\n"
  fs.writeFileSync(filePath, fileContent)

  next()
  // res.status(200).send()
}

module.exports = payloadLog
