const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const authorizeRoles = require("../middleware/authorizeRoles");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controller/userController");

//get all Users

router.get(
  "/",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(userController.getAllUsers),
);

// create user
router.post(
  "/",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(userController.createUser),
);

//update user's Status
router.patch(
  "/:id",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(userController.updateStatus),
);

router.patch(
  "/:id/role",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(userController.updateUserRole),
);

//delete User

router.delete(
  "/:id",
  requireAuth,
  authorizeRoles("Admin"),
  wrapAsync(userController.deleteUser),
);

module.exports = router;
