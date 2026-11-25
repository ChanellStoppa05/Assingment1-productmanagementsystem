import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ProductsPage from "../src/app/products/page";

// Mock Next.js Image
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => {
        return <img {...props} />;
    },
}));

describe("Products Page", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test("displays products correctly", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                items: [
                    {
                        id: "1",
                        brand_: "Dell",
                        model: "Inspiron 15",
                        price: 699,
                        description: "A laptop for everyday use",
                        imageURL: "",
                    },
                ],
                totalPages: 3,
            }),
        });

        render(<ProductsPage />);

        // Check that the product is displayed
        expect(
            await screen.findByText("Inspiron 15")
        ).toBeInTheDocument();

        expect(screen.getByText("Dell")).toBeInTheDocument();
        expect(screen.getByText("€699")).toBeInTheDocument();
        expect(
            screen.getByText("A laptop for everyday use")
        ).toBeInTheDocument();

        // Check the pagination information
        expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
});

test("displays an error when products cannot be loaded", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false
    });

    render(<ProductsPage />);

    expect(
        await screen.findByText("Could not load laptops.")
    ).toBeInTheDocument();
});

test("displays a product image when an image URL is available", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
            items: [
                {
                    id: "1",
                    brand_: "Dell",
                    model: "Inspiron 15",
                    price: 699,
                    description: "A laptop for everyday use",
                    imageURL: "https://example.com/laptop.jpg"
                }
            ],
            totalPages: 1
        })
    });

    render(<ProductsPage />);

    expect(
        await screen.findByAltText("Dell Inspiron 15")
    ).toBeInTheDocument();
});

test("allows users to move between product pages", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
            items: [],
            totalPages: 3
        })
    });

    render(<ProductsPage />);

    expect(await screen.findByText("Page 1 of 3")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("Page 2 of 3")).toBeInTheDocument();

    await waitFor(() => {
        expect(global.fetch).toHaveBeenLastCalledWith("/api/products?page=2");
    });

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(await screen.findByText("Page 1 of 3")).toBeInTheDocument();
});
