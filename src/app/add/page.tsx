 
"use client";

import { useState } from "react";

export default function AddProductPage() {
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    brand_: brand,
                    model: model.trim(),
                    price: Number(price),
                    description: description.trim()
                })
            });

            if (!response.ok) {
                throw new Error("Could not add product");
            }

            setMessage("Product added successfully!");

            setBrand("");
            setModel("");
            setPrice("");
            setDescription("");

        } catch (error) {
            console.error("Error adding product:", error);
            setError("Something went wrong. Please try again.");
        }
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-sm">
                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Add a Laptop
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {message && (
                        <p className="font-medium text-green-600">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="font-medium text-red-600">
                            {error}
                        </p>
                    )}

                    <div>
                        <label htmlFor="brand" className="mb-2 block font-medium text-gray-900">
                            Brand
                        </label>

                        <select
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                            required
                        >
                            <option value="">Select a brand</option>
                            <option value="Dell">Dell</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="Acer">Acer</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="model" className="mb-2 block font-medium text-gray-900">
                            Model
                        </label>

                        <input
                            id="model"
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500"
                            placeholder="e.g. Dell Inspiron 15"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="mb-2 block font-medium text-gray-900">
                            Price (€)
                        </label>

                        <input
                            id="price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500"
                            placeholder="e.g. 699"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="mb-2 block font-medium text-gray-900">
                            Description
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-500"
                            rows={4}
                            placeholder="Describe the laptop..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </main>
    );
}

