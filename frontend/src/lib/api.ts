const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7070";

export const api = {
  getProducts: async () => {
    const response = await fetch(`${BASE_URL}/api/products`);
    return await response.json();
  },

  createProduct: async (productData: any) => {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    return response;
  },

  deleteProduct: async (id: number) => {
    const response = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "DELETE",
    });
    return response;
  },

  // Dễ dàng thêm các method khác (update, getById) tại đây
};
