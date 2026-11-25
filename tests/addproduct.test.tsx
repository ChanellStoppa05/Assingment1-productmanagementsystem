
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddProductPage from "../src/app/add/page";

// Mock the API request
global.fetch = jest.fn();

describe("Add Product Page", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Check the page loads
    test("displays the Add Product page", () => {
        render(<AddProductPage />);

        expect(
            screen.getByRole("heading", { name: "Add a Laptop" })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: "Add Product" })
        ).toBeInTheDocument();
    });

    // Test 2: Check all form fields exist
    test("displays all product fields", () => {
        render(<AddProductPage />);

        expect(screen.getByLabelText("Brand")).toBeInTheDocument();
        expect(screen.getByLabelText("Model")).toBeInTheDocument();
        expect(screen.getByLabelText("Price (€)")).toBeInTheDocument();
        expect(screen.getByLabelText("Description")).toBeInTheDocument();
    });

    // Test 3: Check users can enter product information
    test("allows users to enter product details", () => {
        render(<AddProductPage />);

        fireEvent.change(screen.getByLabelText("Brand"), {
            target: { value: "Dell" }
        });

        fireEvent.change(screen.getByLabelText("Model"), {
            target: { value: "Inspiron 15" }
        });

        fireEvent.change(screen.getByLabelText("Price (€)"), {
            target: { value: "699" }
        });

        fireEvent.change(screen.getByLabelText("Description"), {
            target: { value: "A laptop for everyday use" }
        });

        expect(screen.getByLabelText("Brand")).toHaveValue("Dell");
        expect(screen.getByLabelText("Model")).toHaveValue("Inspiron 15");
        expect(screen.getByLabelText("Price (€)")).toHaveValue(699);
        expect(screen.getByLabelText("Description")).toHaveValue(
            "A laptop for everyday use"
        );
    });

    // Test 4: Check successful product submission
    test("submits product details successfully", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({ id: "test123" })
        });

        render(<AddProductPage />);

        fireEvent.change(screen.getByLabelText("Brand"), {
            target: { value: "Dell" }
        });

        fireEvent.change(screen.getByLabelText("Model"), {
            target: { value: "Inspiron 15" }
        });

        fireEvent.change(screen.getByLabelText("Price (€)"), {
            target: { value: "699" }
        });

        fireEvent.change(screen.getByLabelText("Description"), {
            target: { value: "A laptop for everyday use" }
        });

        fireEvent.click(screen.getByRole("button", {
            name: "Add Product"
        }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/api/products",
                expect.objectContaining({
                    method: "POST"
                })
            );
        });

        expect(
            await screen.findByText("Product added successfully!")
        ).toBeInTheDocument();
    });

    // Test 5: Check failed submission
    test("displays an error when submission fails", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false
        });

        render(<AddProductPage />);

        fireEvent.change(screen.getByLabelText("Brand"), {
            target: { value: "Dell" }
        });

        fireEvent.change(screen.getByLabelText("Model"), {
            target: { value: "Inspiron 15" }
        });

        fireEvent.change(screen.getByLabelText("Price (€)"), {
            target: { value: "699" }
        });

        fireEvent.change(screen.getByLabelText("Description"), {
            target: { value: "A laptop for everyday use" }
        });

        fireEvent.click(screen.getByRole("button", {
            name: "Add Product"
        }));

        expect(
            await screen.findByText(
                "Something went wrong. Please try again."
            )
        ).toBeInTheDocument();
    });

});


// Input testing
test("accepts a short model name and decimal price", () => {
    render(<AddProductPage />);

    fireEvent.change(screen.getByLabelText("Brand"), {
        target: { value: "Dell" }
    });

    fireEvent.change(screen.getByLabelText("Model"), {
        target: { value: "XPS" }
    });

    fireEvent.change(screen.getByLabelText("Price (€)"), {
        target: { value: "499.99" }
    });

    fireEvent.change(screen.getByLabelText("Description"), {
        target: { value: "Laptop" }
    });

    expect(screen.getByLabelText("Model")).toHaveValue("XPS");
    expect(screen.getByLabelText("Price (€)")).toHaveValue(499.99);
});

test("accepts special characters in text fields", () => {
    render(<AddProductPage />);

    fireEvent.change(screen.getByLabelText("Model"), {
        target: { value: "ThinkPad X1 - Gen 2!" }
    });

    fireEvent.change(screen.getByLabelText("Description"), {
        target: { value: "Laptop for work & study (2026)." }
    });

    expect(screen.getByLabelText("Model")).toHaveValue("ThinkPad X1 - Gen 2!");
    expect(screen.getByLabelText("Description")).toHaveValue(
        "Laptop for work & study (2026)."
    );
});

test("does not allow an empty required field to be submitted", () => {
    render(<AddProductPage />);

    expect(screen.getByLabelText("Brand")).toBeRequired();
    expect(screen.getByLabelText("Model")).toBeRequired();
    expect(screen.getByLabelText("Price (€)")).toBeRequired();
    expect(screen.getByLabelText("Description")).toBeRequired();
});

test("price field has a minimum value of 0.01", () => {
    render(<AddProductPage />);

    expect(screen.getByLabelText("Price (€)")).toHaveAttribute(
        "min",
        "0.01"
    );
});