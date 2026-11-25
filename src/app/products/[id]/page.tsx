
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import pb from "@/lib/pocketbase";
import DeleteProductButton from "@/components/DeleteProductButton";

type Product = {
    id: string;
    brand_: string;
    model: string;
    price: number;
    description: string;
    imageURL?: string;
};

export default async function ProductDetailsPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let product: Product;

    try {
        product = await pb.collection("ProductInfo").getOne(id) as Product;
    } catch (error) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-sm">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    {product.brand_}
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    {product.model.trim()}
                </h1>

                {product.imageURL && (
                    <div className="mt-6 flex justify-center">
                        <Image
                            src={product.imageURL}
                            alt={`${product.brand_} ${product.model}`}
                            width={600}
                            height={400}
                            className="h-72 w-full rounded-lg object-contain"
                        />
                    </div>
                )}

                <p className="mt-6 text-gray-700 leading-7">
                    {product.description}
                </p>

                <p className="mt-6 text-3xl font-bold text-gray-900">
                    €{product.price}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">

                    <Link
                        href={`/products/${id}/edit`}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Edit Laptop
                    </Link>

                    <DeleteProductButton id={id} />

                    <Link
                        href="/products"
                        className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100"
                    >
                        Back to Products
                    </Link>

                </div>
            </div>
        </main>
    );
}
