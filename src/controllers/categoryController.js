import CategoryModel from "../models/categoryModel.js"
import { ObjectId } from "mongodb"
import { removeVietnameseAccents } from "../common/index.js"

const sortObjects = [
    {code: "name_DESC", name: "Tên giảm dần"},
    {code: "name_ASC", name: "Tên tăng dần"},
    {code: "code_DESC", name: "Mã giảm dần"},
    {code: "code_ASC", name: "Mã tăng dần"},
]
export async function listCategory(req, res) {
    const search = req.query?.search
    const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
    const page = !!req.query.page ? parseInt(req.query.page) : 1
    const skip = (page-1) * pageSize
    const sort = !!req.query.sort ? req.query.sort : null
    let filters = {
        deletedAt: null
    }
    if(search && search.length > 0) {
        filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" }
    }
    try {
        const countCategories = await CategoryModel.countDocuments(filters)
        const categories = await CategoryModel.find(filters).skip(skip).limit(pageSize)
        res.render("pages/categories/list", {
            title: "Categories",
            categories: categories,
            countPagination: Math.ceil(countCategories/pageSize),
            pageSize,
            page,
            sort,
            sortObjects
        })
    } catch (error) {
        console.log(error)
        res.send("Hiện tại không có sản phẩm nào!")
    }

}
export async function renderPageCreateCategory(req, res) {
    res.render("pages/categories/form", {
        title: "Create Categories",
        mode: "Create",
        category: {}
    })
}

export async function createCategory(req, res) {
    const data = req.body
    try {
        await CategoryModel.create({
            ...data, createdAt: new Date()
        })
        res.redirect("/categories")
    } catch (error) {
        console.log(error)
        res.send("Tạo loại sản phẩm không thành công!")
    }
}


export async function renderPageUpdateCategory(req, res) {
    try{
        const { id } = req.params
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
        if (category) {
            res.render("pages/categories/form", {
                title: "Create Categories",
                mode: "Update",
                category: category
            })
        } else {
            res.send("Hiện không có sản phẩm nào phù hợp!")
        }
    }catch(error){
        res.send("Trang web này không tồn tại!")
    }


}

export async function updateCategory(req, res) {
    const { id, ...data } = req.body
    try {
        await CategoryModel.updateOne(
            { _id: new ObjectId(id) },
            {
                ...data,
                updatedAt: new Date()
            })
        res.redirect("/categories")
    } catch (error) {
        console.log(error)
        res.send("Cập nhât loại sản phẩm không thành công!")
    }

}

export async function renderPageDeleteCategory(req, res) {
    try {
        const { id } = req.params
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
        if (category) {
            res.render("pages/categories/form", {
                title: "Delete Categories",
                mode: "Delete",
                category: category
            })
        } else {
            res.send("Hiện không có sản phẩm nào phù hợp!")
        }
    } catch (error) {
        console.log(error)
        res.send("Trang web này không tồn tại!")
    }
}

export async function deleteCategory(req, res) {
    const { id } = req.body
    try {
        await CategoryModel.updateOne(
            { _id: new ObjectId(id) },
            {
                deletedAt: new Date()
            })
        res.redirect("/categories")
    } catch (error) {
        console.log(error)
        res.send("Xoá loại sản phẩm không thành công!")
    }

}

