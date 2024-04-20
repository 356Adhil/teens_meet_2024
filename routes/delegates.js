const router = require("express").Router();
const { createDelegate, getDelegate } = require("../controllers/delegates");
const multer = require("multer");
const upload = multer(); // for parsing multipart/form-data

router.post("/", upload.none(), createDelegate);
router.get("/", getDelegate);

module.exports = router;
