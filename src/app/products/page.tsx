
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

type Product = {
    id: string;
    brand_: string;
    model: string;
    price: number;
    description: string;
    imageURL?: string;
};

type ProductList = {
    items: Product[];
    totalPages: number;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`/api/products?page=${page}`);

                if (!response.ok) {
                    throw new Error("Could not load laptops");
                }

                const data: ProductList = await response.json();

                setProducts(data.items);
                setTotalPages(data.totalPages);

            } catch (error) {
                setError("Could not load laptops.");
            }

            setLoading(false);
        }

        loadProducts();
    }, [page]);

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">

                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Our Laptops
                    </h1>

                    <p className="mt-3 text-gray-600">
                        Browse our collection of laptops and find the right one for you.
                    </p>
                </div>

                {loading && (
                    <p className="text-center text-gray-600">
                        Loading laptops...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-600">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <Link
                                    href={`/products/${product.id}`}
                                    key={product.id}
                                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    {product.imageURL && (
                                        <Image
                                            src={product.imageURL}
                                            alt={`${product.brand_} ${product.model}`}
                                            width={600}
                                            height={400}
                                            className="mb-4 h-48 w-full rounded-lg object-contain"
                                        />
                                    )}

                                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                        {product.brand_}
                                    </p>

                                    <h2 className="mt-2 text-xl font-bold text-gray-900">
                                        {product.model.trim()}
                                    </h2>

                                    <p className="mt-3 min-h-12 text-sm leading-6 text-gray-600">
                                        {product.description}
                                    </p>

                                    <div className="mt-5 border-t border-gray-100 pt-4">
                                        <p className="text-2xl font-bold text-gray-900">
                                            €{product.price}
                                        </p>
                                    </div>

                                    <p className="mt-4 text-sm font-semibold text-blue-600">
                                        View Details →
                                    </p>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-6">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <p className="font-medium text-gray-700">
                                Page {page} of {totalPages}
                            </p>

                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
                                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

            </div>
        </main>
    );
}
