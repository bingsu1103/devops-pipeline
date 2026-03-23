"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7070";
const API_URL = `${BASE_URL}/api/products`;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchProducts();
        setFormData({ name: "", description: "", price: 0, quantity: 0 });
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(API_URL + "/" + id, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Product Inventory
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              DevOps Pipeline Backend - CRUD System
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            D
          </div>
        </header>

        {/* Add Product Form */}
        <section className="mb-12 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200 dark:bg-slate-800 dark:shadow-none">
          <h2 className="mb-6 text-xl font-semibold text-slate-800 dark:text-white">
            Add New Product
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Description"
              className="rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="rounded-lg border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              required
            />
            <button
              type="submit"
              className="h-full rounded-lg bg-blue-600 px-6 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:bg-slate-400"
            >
              Add Product
            </button>
          </form>
        </section>

        {/* Product Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200 dark:bg-slate-800 dark:shadow-none font-medium">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Price
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Test connection...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    No products found. Add your first one above!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm italic">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                      {product.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="mt-12 text-center text-sm text-slate-400">
          Generated with Antigravity AI • 2026
        </footer>
      </div>
    </div>
  );
}
