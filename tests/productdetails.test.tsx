
import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import ProductDetailsPage from "../src/app/products/[id]/page";
import pb from "../src/lib/pocketbase";

jest.mock("../src/lib/pocketbase", () => ({
    __esModule: true,
    default: {
        collection: jest.fn(),
    },
}));

jest.mock("../src/components/DeleteProductButton", () => {
    return function MockDeleteButton() {
        return <button>Delete Product</button>;
    };
});

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
}));

describe("Product Details Page", () => {

    test("displays the correct product information", async () => {
        const product = {
            id: "1",
            brand_: "Dell",
            model: "Inspiron 15",
            price: 699,
            description: "A laptop for everyday use",
            imageURL: "",
        };

        (pb.collection as jest.Mock).mockReturnValue({
            getOne: jest.fn().mockResolvedValue(product),
        });

        const page = await ProductDetailsPage({
            params: Promise.resolve({ id: "1" }),
        });

        render(page);

        expect(screen.getByRole("heading", {
            name: "Inspiron 15",
        })).toBeInTheDocument();

        expect(screen.getByText("Dell")).toBeInTheDocument();
        expect(screen.getByText("€699")).toBeInTheDocument();
        expect(
            screen.getByText("A laptop for everyday use")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: "Edit Laptop" })
        ).toHaveAttribute("href", "/products/1/edit");

        expect(
            screen.getByRole("link", { name: "Back to Products" })
        ).toHaveAttribute("href", "/products");
    });
    
    test("calls notFound when the product cannot be found", async () => {
    (pb.collection as jest.Mock).mockReturnValue({
        getOne: jest.fn().mockRejectedValue(
            new Error("Product not found")
        ),
    });

    await expect(
        ProductDetailsPage({
            params: Promise.resolve({ id: "999" }),
        })
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
    });

    test("displays the product image when an image URL is available", async () => {
        const product = {
            id: "1",
            brand_: "Dell",
            model: "Inspiron 15",
            price: 699,
            description: "A laptop for everyday use",
            imageURL: "https://example.com/laptop.jpg",
        };

        (pb.collection as jest.Mock).mockReturnValue({
            getOne: jest.fn().mockResolvedValue(product),
        });

        const page = await ProductDetailsPage({
            params: Promise.resolve({ id: "1" }),
        });

        render(page);

        expect(
            screen.getByAltText("Dell Inspiron 15")
        ).toBeInTheDocument();
    });

});
