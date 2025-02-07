import OrderModel from "../models/orderModel.js"
import { ObjectId } from "mongodb"

const sortObjects = [
    { code: "name_DESC", name: "Tên giảm dần" },
    { code: "name_ASC", name: "Tên tăng dần" },
    { code: "code_DESC", name: "Mã giảm dần" },
    { code: "code_ASC", name: "Mã tăng dần" },
]

export async function listOrder(req, res) {
    const search = req.query?.search
    const pageSize = !!req.query.pageSize ? parseInt(req.query.pageSize) : 5
    const page = !!req.query.page ? parseInt(req.query.page) : 1
    const skip = (page - 1) * pageSize
    let sort = !!req.query.sort ? req.query.sort : null
    let filters = {
        deletedAt: null
    }
    if (search && search.length > 0) {
        filters.orderNo = search
    }
    if (!sort) {
        sort = { createdAt: -1 }
    } else {
        const sortArray = sort.split('_')
        sort = { [sortArray[0]]: sortArray[1] === "ASC" ? 1 : -1 }
    }
    try {
        const countOrders = await OrderModel.countDocuments(filters)
        const orders = await OrderModel.find(filters).skip(skip).limit(pageSize).sort(sort)
        res.render("pages/orders/list", {
            title: "Order",
            orders: orders,
            countPagination: Math.ceil(countOrders / pageSize),
            pageSize,
            page,
            sort,
            sortObjects
        })
        // res.send({ countOrders, orders })
    } catch (error) {
        console.log(error)
        res.send("Hiện tại không có order nào!")
    }

}
// export async function renderPageCreateProduct(req, res) {
//     const categories = await CategoryModel.find({ deletedAt: null })
//     res.render("pages/products/form", {
//         title: "Create Products",
//         mode: "Create",
//         product: {},
//         sizes: sizes,
//         colors: colors,
//         categories: categories,
//         err: {}
//     })
// }

export async function createOrder(req, res) {
    const { discount, status, orderItems } = req.body
    let subTotal = 0, total = 0, numericalOrder = 1

    const lastOrder = await OrderModel.findOne().sort({ createdAt: -1 })

    if (lastOrder) {
        numericalOrder = lastOrder.numericalOrder + 1
    }

    const orderNo = "order-" + numericalOrder

    if (orderItems.length > 0) {
        for (let orderItem of orderItems) {
            subTotal += (orderItem.quantity * orderItem.price)
        }
    }
    total = subTotal * (100 - discount) / 100
    try {
        const rs = await OrderModel.create({
            orderNo: orderNo,
            discount: discount,
            total: total,
            status: status,
            orderItems: orderItems,
            numericalOrder: numericalOrder,
            createdAt: new Date()
        })
        res.send(rs)
    } catch (error) {
        console.log("err", error)
    }
}


// export async function renderPageUpdateProduct(req, res) {
//     try {
//         const categories = await CategoryModel.find({ deletedAt: null })
//         const { id } = req.params
//         const product = await ProductModel.findOne({ _id: new ObjectId(id), deletedAt: null })
//         if (product) {
//             console.log("product", product, categories)
//             res.render("pages/products/form", {
//                 title: "Update Product",
//                 mode: "Update",
//                 product: product,
//                 sizes: sizes,
//                 colors: colors,
//                 categories: categories,
//                 err: {}
//             })
//         } else {
//             res.send("Hiện không có sản phẩm nào phù hợp!")
//         }
//     } catch (error) {
//         console.log(error)
//         res.send("Trang web này không tồn tại!")
//     }


// }

// export async function updateProduct(req, res) {
//     const { ...data } = req.body
//     const { id } = req.params
//     console.log({})
//     try {
//         const category = await CategoryModel.findOne({ 
//             code: data.code, 
//             deletedAt: null,
//             _id: {$ne: new ObjectId(id)}
//         })
//         if(category){
//             throw("code")
//         }
//         await CategoryModel.updateOne(
//             { _id: new ObjectId(id) },
//             {
//                 ...data,
//                 updatedAt: new Date()
//             })
//         res.redirect("/categories")
//     } catch (error) {
//         console.log("error", error)
//         let err = {}
//         if(error === "code"){
//             err.code = "Mã sản phẩm này đã tồn tại"
//         }
//         if (error.name === "ValidationError") {
//             Object.keys(error.errors).forEach(key => {
//                 err[key] = error.errors[key].message
//             })
//         }
//         console.log("err", err)

//         res.render("pages/categories/form", {
//             title: "Update Categories",
//             mode: "Update",
//             category: { ...data, _id: id },
//             err
//         })
//     }

// }

// export async function renderPageDeleteProduct(req, res) {
//     try {
//         const { id } = req.params
//         const category = await CategoryModel.findOne({ _id: new ObjectId(id), deletedAt: null })
//         if (category) {
//             res.render("pages/categories/form", {
//                 title: "Delete Categories",
//                 mode: "Delete",
//                 category: category,
//                 err: {}
//             })
//         } else {
//             res.send("Hiện không có sản phẩm nào phù hợp!")
//         }
//     } catch (error) {
//         console.log(error)
//         res.send("Trang web này không tồn tại!")
//     }
// }

// export async function deleteProduct(req, res) {
//     const { id } = req.body
//     try {
//         await CategoryModel.updateOne(
//             { _id: new ObjectId(id) },
//             {
//                 deletedAt: new Date()
//             })
//         res.redirect("/categories")
//     } catch (error) {
//         console.log(error)
//         res.send("Xoá loại sản phẩm không thành công!")
//     }

// }

