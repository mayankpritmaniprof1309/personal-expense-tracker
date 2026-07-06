const express =require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const transactionCtrl=require("../controller/transactionController.js");

// Define routes
router.post("/createTransaction", authMiddleware.authProtectMiddleware, transactionCtrl.createTransaction);
router.get("/getTransaction", authMiddleware.authProtectMiddleware, transactionCtrl.getTransactions);
router.get("/getTransactionById/:id", authMiddleware.authProtectMiddleware, transactionCtrl.getTransactionById);
router.put("/updateTransaction/:id", authMiddleware.authProtectMiddleware, transactionCtrl.updateTransaction);
router.delete("/deleteTransaction/:id", authMiddleware.authProtectMiddleware, transactionCtrl.deleteTransaction);
router.get("/summary", authMiddleware.authProtectMiddleware, transactionCtrl.getTransactionSummary);

module.exports = router;