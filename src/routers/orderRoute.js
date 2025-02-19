import express from "express";
import { 
    listOrder, 
    createOrder, 
    renderPageSimulateCreateOrder
} from  "../controllers/orderController.js"
const router = express.Router();


router.get("/", listOrder)

router.get("/create", renderPageSimulateCreateOrder)
router.post("/create", createOrder)

export default router;