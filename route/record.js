const express = require("express");
const router = express.Router();
const FinancialRecord = require("../models/RecordModel");
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const wrapAsync = require("../utils/wrapAsync");
const recordController = require("../controller/recordController") ;

//get All records of User

router.get(
  "/",
  requireAuth,
  authorizeRoles("Viewer", "Analyst", "Admin"),
  wrapAsync(recordController.getAllRecords),
);

//create Record
router.post(
  "/",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(recordController.createRecord),
);

// Update Route
router.patch(
  "/",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(recordController.updateRecord),
);


//delete Record
router.delete(
  "/:id",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(recordController.deleteRecord),
);

module.exports = router;
