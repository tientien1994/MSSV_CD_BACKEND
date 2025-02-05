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
    images: [String],
    sizes: {
        type: [String],
        enum: ["S", "M", "L", "XL"]
    },
    colors: {
        type: [String],
        enum: ["red", "green", "yellow", "white", "black"]
    },
    active: String,
    description: String,
    information: String,
    categoryId: Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}, {
    versionKey: false,
    collection: "products",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

productSchema.virtual("category", {
    ref: "Category",
    localField: "categoryId",
    foreignField: "_id",
    justOne: true
})
productSchema.virtual("categoryIdString").get(function(){
    return !!this.categoryId ? this.categoryId.toString() : ""
})


const ProductModel = mongoose.model("Product", productSchema)
export default ProductModel