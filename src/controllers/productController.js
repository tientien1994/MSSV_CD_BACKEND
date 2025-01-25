import ProductModel from "../models/productModel.js"
import { ObjectId } from "mongodb"
import { removeVietnameseAccents } from "../common/index.js"

const sortObjects = [
    { code: "name_DESC", name: "Tên giảm dần" },
    { code: "name_ASC", name: "Tên tăng dần" },
    { code: "code_DESC", name: "Mã giảm dần" },
    { code: "code_ASC", name: "Mã tăng dần" },
]
export async function listProduct(req, res) {
    const search = req.query?.search
    const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
    const page = !!req.query.page ? parseInt(req.query.page) : 1
    const skip = (page - 1) * pageSize
    let sort = !!req.query.sort ? req.query.sort : null
    let filters = {
        deletedAt: null
    }
    if (search && search.length > 0) {
        filters.searchString = { $regex: removeVietnameseAccents(search), $options: "i" }
    }
    if(!sort){
        sort = { createdAt: -1 }
    } else {
        const sortArray = sort.split('_')
        sort = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1}
    }
    try {
        const countCategories = await ProductModel.countDocuments(filters)
        const products = await ProductModel.find(filters).skip(skip).limit(pageSize).sort(sort)
        res.render("pages/products/list", {
            title: "Products",
            products: products,
            countPagination: Math.ceil(countCategories / pageSize),
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
export async function renderPageCreateProduct(req, res) {
    res.render("pages/categories/form", {
        title: "Create Categories",
        mode: "Create",
        category: {},
        err: {}
    })
}

export async function createProduct(req, res) {
    const data = req.body
    try {
        const category = await CategoryModel.findOne({ code: data.code, deletedAt: null})
        if(category){
            throw("code")
        }
        await CategoryModel.create({
            ...data, createdAt: new Date()
        })
        res.redirect("/categories")
    } catch (error) {
        console.log("error", error)
        let err = {}
        if(error === "code"){
            err.code = "Mã sản phẩm này đã tồn tại"
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message
            })
        }
        console.log("err", err)

        res.render("pages/categories/form", {
            title: "Create Categories",
            mode: "Create",
            category: { ...data },
            err
        })
    }
}
export async function createProductByModal(req, res) {
    const data = req.body
    try {
        const category = await CategoryModel.create({
            ...data, createdAt: new Date()
        })
        res.json({ success: true, category: category})
    } catch (error) {
        console.log(error)
        res.json({ success: false, category: {}})
    }
}


export async function renderPageUpdateProduct(req, res) {
    try {
        const { id } = req.params
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
        if (category) {
            res.render("pages/categories/form", {
                title: "Create Categories",
                mode: "Update",
                category: category,
                err: {}
            })
        } else {
            res.send("Hiện không có sản phẩm nào phù hợp!")
        }
    } catch (error) {
        res.send("Trang web này không tồn tại!")
    }


}

export async function updateProduct(req, res) {
    const { ...data } = req.body
    const { id } = req.params
    try {
        const category = await CategoryModel.findOne({ 
            code: data.code, 
            deletedAt: null,
            _id: {$ne: new ObjectId(id)}
        })
        if(category){
            throw("code")
        }
        await CategoryModel.updateOne(
            { _id: new ObjectId(id) },
            {
                ...data,
                updatedAt: new Date()
            })
        res.redirect("/categories")
    } catch (error) {
        console.log("error", error)
        let err = {}
        if(error === "code"){
            err.code = "Mã sản phẩm này đã tồn tại"
        }
        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message
            })
        }
        console.log("err", err)

        res.render("pages/categories/form", {
            title: "Update Categories",
            mode: "Update",
            category: { ...data, _id: id },
            err
        })
    }

}

export async function renderPageDeleteProduct(req, res) {
    try {
        const { id } = req.params
        const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
        if (category) {
            res.render("pages/categories/form", {
                title: "Delete Categories",
                mode: "Delete",
                category: category,
                err: {}
            })
        } else {
            res.send("Hiện không có sản phẩm nào phù hợp!")
        }
    } catch (error) {
        console.log(error)
        res.send("Trang web này không tồn tại!")
    }
}

export async function deleteProduct(req, res) {
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

