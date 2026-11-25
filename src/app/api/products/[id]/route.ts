
import { NextResponse } from "next/server";
import pb from "@/lib/pocketbase";

// GET: Retrieve one product using its ID
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await pb.collection("ProductInfo").getOne(id);

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error retrieving product:", error);

        return NextResponse.json(
            { message: "Could not find product" },
            { status: 404 }
        );
    }
}

// PATCH: Update an existing product
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedProduct = await pb.collection("ProductInfo").update(id, {
            brand_: body.brand_,
            model: body.model,
            price: Number(body.price),
            description: body.description
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);

        return NextResponse.json(
            { message: "Could not update product" },
            { status: 500 }
        );
    }
}

// DELETE: Remove a product using its ID
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await pb.collection("ProductInfo").delete(id);

        return NextResponse.json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);

        return NextResponse.json(
            { message: "Could not delete product" },
            { status: 500 }
        );
    }
}
