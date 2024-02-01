const express = require('express')
const multer = require('multer')
const upload = multer({ dest: './src/uploads/' })
const {
    uploadFile, downloadFile
} = require('../controllers/file.controller')

const router = express.Router()

router.post('/upload-file', upload.single('file'), uploadFile)
router.get('/download-file/:task', downloadFile)

module.exports = router
