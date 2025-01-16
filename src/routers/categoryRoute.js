import express from "express";
import { 
    listCategory, 
    createCategory, 
    renderPageCreateCategory, 
    renderPageUpdateCategory,
    updateCategory,
    renderPageDeleteCategory,
    deleteCategory
} from  "../controllers/categoryController.js"
const router = express.Router();


router.get("/", listCategory)

router.get("/create", renderPageCreateCategory)// render ra from create
router.post("/create", createCategory)

router.get("/update/:id", renderPageUpdateCategory)// render ra from update
router.post("/update/:id", updateCategory)

router.get("/delete/:id", renderPageDeleteCategory)// render ra from update
router.post("/delete", deleteCategory)

export default router;