const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const wrapAsync = require("../utils/wrapAsync") ;
const summaryController = require("../controller/summaryController") ;


router.get(
  "/dashboard/summary",
  requireAuth,
  authorizeRoles("Admin", "Analyst"),
  wrapAsync(summaryController.summary));

module.exports = router;
