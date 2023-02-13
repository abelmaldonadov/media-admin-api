const express = require("express")
const router = express.Router()
const multer = require("multer")
const uuid = require("uuid")
const path = require("path")
const fs = require("fs")
const moment = require("moment")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const yearFolder =
      "public/uploads/" +
      req.params.project +
      "/" +
      moment().format("YYYY") +
      "/"
    if (!fs.existsSync(yearFolder)) {
      fs.mkdirSync(yearFolder)
    }

    const monthFolder = yearFolder + moment().format("MM") + "/"
    if (!fs.existsSync(monthFolder)) {
      fs.mkdirSync(monthFolder)
    }

    const dailyFolder = monthFolder + moment().format("DD") + "/"
    if (!fs.existsSync(dailyFolder)) {
      fs.mkdirSync(dailyFolder)
    }

    cb(null, dailyFolder)
  },
  filename: function (req, file, cb) {
    const fileName = uuid.v4() + path.extname(file.originalname)
    const dailyFolder =
      "uploads/" +
      req.params.project +
      "/" +
      moment().format("YYYY/MM/DD") +
      "/"
    if ("uploaded" in req) {
      req.uploaded.push({
        id: req.uploadedFiles.length + 1,
        original: file.originalname,
        name: "/" + dailyFolder + fileName,
      })
    } else {
      req.uploaded = [
        {
          id: 1,
          original: file.originalname,
          name: "/" + dailyFolder + fileName,
        },
      ]
    }
    cb(null, fileName)
  },
})

const upload = multer({ storage: storage })

router.post("/upload/:project", upload.array("files"), async (req, res) => {
  try {
    const { uploaded } = req
    console.log("file loaded")

    res.status(201).json({
      data: {
        uploaded,
      },
    })
  } catch (err) {
    res.status(400).json({
      error: { code: 400, message: "Bad Request" },
    })
  }
})

module.exports = router
