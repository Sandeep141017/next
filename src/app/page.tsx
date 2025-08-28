'use client';

import { useEffect, useState } from 'react';

interface Product {
  _id?: string;
  image: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  discount?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    image: '',
    title: '',
    price: 0,
    oldPrice: undefined,
    rating: 0,
    reviewCount: 0,
    discount: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log("fetching");
    const res = await fetch('/api/products');
    const data = await res.json();
    if (Array.isArray(data)) setProducts(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['price', 'rating', 'reviewCount', 'oldPrice'].includes(name)
        ? Number(value)
        : String(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingId ? 'PUT' : 'POST';
    const endpoint = '/api/products';
console.log("fetching 2")
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { ...form, _id: editingId } : form),
    });

    if (res.ok) {
      setForm({
        image: '',
        title: '',
        price: 0,
        oldPrice: undefined,
        rating: 0,
        reviewCount: 0,
        discount: '',
      });
      setEditingId(null);
      fetchProducts();
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditingId(product._id ?? null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
 console.log("fetch 3")
    const res = await fetch(`/api/products?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) fetchProducts();
    else alert('Failed to delete product.');
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Product List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>

        title:
        <input type="text" name="title" placeholder="Enter product title" value={form.title} onChange={handleChange} required />
        image:
        <input type="text" name="image" placeholder="Enter image URL" value={form.image} onChange={handleChange} required />
        price:
        <input type="number" name="price" placeholder="Enter product price" value={form.price} onChange={handleChange} required />
        oldPrice:
        <input type="number" name="oldPrice" placeholder="Enter old price" value={form.oldPrice || ''} onChange={handleChange} />
        rating:
        <input type="number" name="rating" step="0.1" placeholder="Enter product rating" value={form.rating} onChange={handleChange} required />
        reviewCount:
        <input type="number" name="reviewCount" placeholder="Enter review count" value={form.reviewCount} onChange={handleChange} required />
        discount:
        <input type="text" name="discount" placeholder="Enter discount" value={form.discount} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p._id}>
            <img src={p.image} alt={p.title} width={50} height={50} />
            <strong>{p.title}</strong> - ₹{p.price} ({p.rating}★)
            <br />
            <button onClick={() => handleEdit(p)}>Edit</button>{' '}
            <button onClick={() => handleDelete(p._id!)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
