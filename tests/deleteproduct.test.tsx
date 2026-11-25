
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteProductButton from "../src/components/DeleteProductButton";

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockFetch = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: mockRefresh
    })
}));

describe("Delete Product Button", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = mockFetch;
        mockFetch.mockReset();
    });

        test("displays an error if deleting a product fails", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false
        });

        window.alert = jest.fn();
        window.confirm = jest.fn().mockReturnValue(true);

        render(<DeleteProductButton id="1" />);

        fireEvent.click(
            screen.getByRole("button", { name: "Delete Laptop" })
        );

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(
                "Could not delete this laptop. Please try again."
            );
        });

        expect(mockPush).not.toHaveBeenCalled();
    });
    test("displays the Delete Laptop button", () => {
        render(<DeleteProductButton id="1" />);

        expect(
            screen.getByRole("button", { name: "Delete Laptop" })
        ).toBeInTheDocument();
    });

    test("deletes the product when deletion is confirmed", async () => {
        window.confirm = jest.fn().mockReturnValue(true);
        mockFetch.mockResolvedValue({ ok: true });

        render(<DeleteProductButton id="1" />);

        fireEvent.click(screen.getByRole("button", { name: "Delete Laptop" }));

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/products/1", {
                method: "DELETE"
            });
        });

        expect(mockPush).toHaveBeenCalledWith("/products");
        expect(mockRefresh).toHaveBeenCalled();
    });

    test("does not delete the product when deletion is cancelled", () => {
        window.confirm = jest.fn().mockReturnValue(false);

        render(<DeleteProductButton id="1" />);

        fireEvent.click(screen.getByRole("button", { name: "Delete Laptop" }));

        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
    });
});
