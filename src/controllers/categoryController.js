import CategoryModel from "../models/categoryModel.js"
export async function listCategory(req, res) {
    try {
        const categories = await CategoryModel.find()
        res.render("pages/categories/list", {
            title: "Categories",
            categories: categories,
        })
    } catch (error) {
        console.log(error)
        res.send("Hiện tại không có sản phẩm nào!")
    }

}
export async function renderPageCreateCategory(req, res) {
    res.render("pages/categories/create", {
        title: "Create Categories",
    })
}

export async function createCategory(req, res) {
    const { code, name, image } = req.body
    try {
        await CategoryModel.create({
            code, name, image, createdAt: new Date()
        })
        res.redirect("/categories")
    } catch (error) {
        console.log(error)
        res.send("Tạo loại sản phẩm không thành công!")
    }

}