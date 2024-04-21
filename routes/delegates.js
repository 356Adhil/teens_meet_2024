const router = require("express").Router();
const { createDelegate, getDelegates, updateDelegate, deleteDelegate } = require("../controllers/delegates");
const multer = require("multer");
const upload = multer(); // for parsing multipart/form-data

router.post("/", upload.none(), createDelegate);
router.get("/", getDelegates);
router.put("/:id", updateDelegate);
router.delete("/:id", deleteDelegate);

module.exports = router;
