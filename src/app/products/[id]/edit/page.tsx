
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

type Product = {
    id: string;
    brand_: string;
    model: string;
    price: number;
    description: string;
    imageURL?:   string;
};

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getProduct() {
            try {
                const response = await fetch(`/api/products/${id}`, {
                  cache: "no-store"
});

                if (!response.ok) {
                    throw new Error("Could not find product");
                }

                const product: Product = await response.json();

                setBrand(product.brand_);
                setModel(product.model);
                setPrice(String(product.price));
                setDescription(product.description);
            } catch (error) {
                setError("Could not load this laptop.");
            } finally {
                setLoading(false);
            }
        }

        getProduct();
    }, [id]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "PATCH",
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
                throw new Error("Could not update product");
            }

            setMessage("Product updated successfully!");

            router.push(`/products/${id}`);
            router.refresh();

        } catch (error) {
            setError("Something went wrong. Please try again.");
        }
    }

    if (loading) {
        return <p className="p-8 text-gray-900">Loading laptop...</p>;
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-xl rounded-xl bg-white p-8 shadow-sm">

                <h1 className="mb-6 text-3xl font-bold text-gray-900">
                    Edit Laptop
                </h1>

                {message && (
                    <p className="mb-4 font-medium text-green-600">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="mb-4 font-medium text-red-600">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="mb-2 block font-medium text-gray-900">
                            Brand
                        </label>

                        <select
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
                        <label className="mb-2 block font-medium text-gray-900">
                            Model
                        </label>

                        <input
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium text-gray-900">
                            Price (€)
                        </label>

                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                            min="0.01"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium text-gray-900">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                            rows={4}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Save Changes
                    </button>

                    <Link
                        href={`/products/${id}`}
                        className="block text-center font-medium text-blue-600 hover:underline"
                    >
                        Cancel
                    </Link>

                </form>
            </div>
        </main>
    );
}
