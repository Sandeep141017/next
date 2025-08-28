import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  // id: string;
  image: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: string;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    // id: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    discount: { type: String },
  },
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
