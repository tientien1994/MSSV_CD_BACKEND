import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema({
    code: {
        type: String,
        required: [true, "Bắt buộc phải nhập mã loại sản phẩm"],
        minLength: [5, "Mã loại sản phẩm có độ dài từ 5 đến 10 kí tự"],
        maxLength: [10, "Mã loại sản phẩm có độ dài từ 5 đến 10 kí tự"],
    },
    name: {
        required: [true, "Bắt buộc phải nhập tên"],
        type: String, 
    },
    image: {
        required: [true, "Bắt buộc phải nhập link hình ảnh"],
        type: String, 
    },
    searchString: {
        required: [true, "Bắt buộc phải nhập chuỗi tìm kiếm"],
        type: String,
    },
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
},{
    versionKey: false,
    collection: "categories"
})

const CategoryModel = mongoose.model("Category", categorySchema)
export default CategoryModel