const express = require('express');
const router = express.Router();
// const path = require('path');
// const multer = require('multer');
const {loginHandler} = require("../modules/auth");
const {adaptRequest, sendResponse} = require('../util/http');


// // Define proper Multer diskStorage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '../../public/uploads'));
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const userId = req.params.userId || 'unknown';
//         cb(null, `${userId}_face${ext}`);
//     }
// });

// //Create upload middleware using diskStorage
// const upload = multer({storage});

// Login route
router.post("/auth/login", async (req, res) => {
    const httpRequest = adaptRequest(req);
    const result = await loginHandler(httpRequest);
    return sendResponse(res, result);
});

// // Attendance punch route
// router.post("/attendance/punch", async (req, res) => {
//     const httpRequest = adaptRequest(req);
//     const result = await punchHandler(httpRequest);
//     return sendResponse(res, result);
// });

module.exports = router;