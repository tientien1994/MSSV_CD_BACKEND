import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
    code: {
        type: String,
        required: [true, "Bắt buộc phải nhập mã sản phẩm"],
    },
    name: {
        required: [true, "Bắt buộc phải nhập tên"],
        type: String, 
    },
    price: {
        required: [true, "Bắt buộc phải nhập giá sp"],
        type: Number, 
    },
    searchString: {
        required: [true, "Bắt buộc phải nhập chuỗi tìm kiếm"],
        type: String,
    },
    size: [String],
    color: [String],
    active: Boolean,
    description: String,
    infomation: String,
    images: [String],
    categoryId: Object,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
},{
    versionKey: false,
    collection: "products"
})

const ProductModel = mongoose.model("Product", productSchema)
export default ProductModel