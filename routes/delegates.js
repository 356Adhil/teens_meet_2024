const router = require("express").Router();
const { createDelegate, getDelegates, updateDelegate, deleteDelegate } = require("../controllers/delegates");
const multer = require("multer");
const upload = multer(); // for parsing multipart/form-data

router.post("/", upload.none(), createDelegate);
router.get("/", getDelegates);
router.put("/:id", updateDelegate);
router.delete("/:id", deleteDelegate);

const { addEmployee } = require('../restWebAPI'); // Import your SOAP module

router.post('/add-employee', async (req, res) => {
  const employeeData = {
    APIKey: 'your_api_key', // Replace with actual data
    EmployeeCode: '12345',
    EmployeeName: 'John Doe',
    CardNumber: '67890',
    SerialNumber: 'SN12345',
    UserName: 'your_username',
    UserPassword: 'your_password',
    CommandId: 1,
  };

  try {
    const result = await addEmployee(employeeData);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

module.exports = router;

module.exports = router;
