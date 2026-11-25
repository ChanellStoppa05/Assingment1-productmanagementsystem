
import { NextResponse } from "next/server";
import pb from "@/lib/pocketbase";

// use GET to retrieve products with pagination as one of
// the optimasation techniques to avoid loading all products at once.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = Number(searchParams.get("page")) || 1;
        const perPage = 4;

        const products = await pb.collection("ProductInfo").getList(
            page,
            perPage
        );

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);

        return NextResponse.json(
            { message: "Could not retrieve products" },
            { status: 500 }
        );
    }
}

// POST: Add a new product
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newProduct = await pb.collection("ProductInfo").create({
            brand_: body.brand_,
            model: body.model,
            price: Number(body.price),
            description: body.description
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);

        return NextResponse.json(
            { message: "Could not add product" },
            { status: 500 }
        );
    }
}
