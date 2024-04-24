const express = require('express')
const multer = require('multer')
const {
    uploadFile, downloadFile, getFile
} = require('../controllers/file.controller')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${new Date().toISOString()}-${file.originalname}`)
    }
})

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 100 } })

router.post('/upload-file', upload.single('file'), uploadFile)
router.get('/download-file/:task', downloadFile)
router.get('/get-file/:task', getFile)

module.exports = router
