
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProductPage from "../src/app/products/[id]/edit/page";
import { useParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
    useRouter: jest.fn(),
}));

describe("Edit Product Page", () => {
    const mockPush = jest.fn();
    const mockRefresh = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useParams as jest.Mock).mockReturnValue({ id: "1" });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
            refresh: mockRefresh,
        });

        global.fetch = jest.fn();
    });

    test("loads existing product information", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({
                id: "1",
                brand_: "Dell",
                model: "Inspiron 15",
                price: 699,
                description: "A laptop for everyday use",
            }),
        });

        render(<EditProductPage />);

        expect(await screen.findByDisplayValue("Inspiron 15"))
            .toBeInTheDocument();

        expect(screen.getByDisplayValue("Dell")).toBeInTheDocument();
        expect(screen.getByDisplayValue("699")).toBeInTheDocument();
        expect(
            screen.getByDisplayValue("A laptop for everyday use")
        ).toBeInTheDocument();
    });

    test("submits updated product information", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: "1",
                    brand_: "Dell",
                    model: "Inspiron 15",
                    price: 699,
                    description: "Old description",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        render(<EditProductPage />);

        const modelInput = await screen.findByDisplayValue("Inspiron 15");

        fireEvent.change(modelInput, {
            target: { value: "Inspiron 16" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        expect(global.fetch).toHaveBeenLastCalledWith(
            "/api/products/1",
            expect.objectContaining({
                method: "PATCH",
                body: expect.stringContaining("Inspiron 16"),
            })
        );

        expect(mockPush).toHaveBeenCalledWith("/products/1");
        expect(mockRefresh).toHaveBeenCalled();
    });

    test("displays loading message while product is loading", () => {
    (global.fetch as jest.Mock).mockReturnValue(
        new Promise(() => {})
    );

    render(<EditProductPage />);

    expect(screen.getByText("Loading laptop...")).toBeInTheDocument();
    });

    test("displays an error when product cannot be loaded", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
    });

    render(<EditProductPage />);

    expect(
        await screen.findByText("Could not load this laptop.")
    ).toBeInTheDocument();
    });

    test("displays an error when updating a product fails", async () => {
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: "1",
                brand_: "Dell",
                model: "Inspiron 15",
                price: 699,
                description: "Old description",
            }),
        })
        .mockResolvedValueOnce({
            ok: false,
        });

    render(<EditProductPage />);

    await screen.findByDisplayValue("Inspiron 15");

    fireEvent.click(
        screen.getByRole("button", { name: "Save Changes" })
    );

    expect(
        await screen.findByText("Something went wrong. Please try again.")
    ).toBeInTheDocument();
    });

    test("allows users to change the brand", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: "1",
                    brand_: "Dell",
                    model: "Inspiron 15",
                    price: 699,
                    description: "A laptop for everyday use",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        render(<EditProductPage />);

        await screen.findByDisplayValue("Dell");

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "Lenovo" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenLastCalledWith(
                "/api/products/1",
                expect.objectContaining({
                    method: "PATCH",
                    body: expect.stringContaining("Lenovo"),
                })
            );
        });
    });
    
    test("allows users to change the price and description", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    id: "1",
                    brand_: "Dell",
                    model: "Inspiron 15",
                    price: 699,
                    description: "Old description",
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        render(<EditProductPage />);

        const priceInput = await screen.findByDisplayValue("699");
        const descriptionInput = screen.getByDisplayValue("Old description");

        fireEvent.change(priceInput, {
            target: { value: "799" },
        });

        fireEvent.change(descriptionInput, {
            target: { value: "Updated laptop description" },
        });

        fireEvent.click(
            screen.getByRole("button", { name: "Save Changes" })
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenLastCalledWith(
                "/api/products/1",
                expect.objectContaining({
                    method: "PATCH",
                    body: expect.stringContaining("799"),
                })
            );
        });

        expect(global.fetch).toHaveBeenLastCalledWith(
            "/api/products/1",
            expect.objectContaining({
                method: "PATCH",
                body: expect.stringContaining("Updated laptop description"),
            })
        );
    });
});
