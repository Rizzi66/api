const express = require("express");
const inventoryCtrl = require("../controllers/inventory");
const router = express.Router();
router.get("/:variantId/:locationId", inventoryCtrl.getStock);
module.exports = router;
//# sourceMappingURL=inventory.js.map