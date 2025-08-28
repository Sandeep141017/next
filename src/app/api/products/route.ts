// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import { connectToDB } from '../../../lib/mongoose';
import { connectToDB } from '@/lib/mongoose';

import Product from '@models/product';

export async function GET() {
  try {
    await connectToDB();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  await connectToDB();
  try {
    const body = await request.json();

    // Optional validation of required fields
    const { title, image, price, rating, reviewCount } = body;

    if (!title || !image || price == null || rating == null || reviewCount == null) {
      return NextResponse.json({ error: 'Missing required product fields.' }, { status: 400 });
    }

    // ✅ No 'id' validation or lookup
    const product = await Product.create({
      title,
      image,
      price,
      oldPrice: body.oldPrice,
      rating,
      reviewCount,
      discount: body.discount,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//  Update product
export async function PUT(request: NextRequest) {
  await connectToDB();
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Delete product by ID from query string
export async function DELETE(request: NextRequest) {
  await connectToDB();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}