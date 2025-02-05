import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema(
    {
        productCode: String,
        productId: Schema.Types.ObjectId,
        quantity: Number,
        total: Number,
        price: Number,
    }, {
    versionKey: false,
});

const orderSchema = new Schema({
    orderNo: String,
    status: {
        type: String,
        enum: ["created", "completed", "cancelled", "delivering"]
    },
    orderItems: [orderItemSchema],
    total: Number,
    discount: Number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date
}, {
    versionKey: false,
    collection: "orders",
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

const OrderModel = mongoose.model("Order", orderSchema)
export default OrderModel