
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import { getHomepageContent } from "../src/lib/homepageContent";

// Mock the Redis homepage content function
jest.mock("../src/lib/homepageContent", () => ({
    getHomepageContent: jest.fn(),
}));

describe("Homepage", () => {
    beforeEach(() => {
        jest.mocked(getHomepageContent).mockResolvedValue({
            title: "Welcome to Laptop Store",
            subtitle: "Find the right laptop for you",
            description: "Explore our collection of laptops.",
            buttonText: "Browse Laptops",
            sectionTitle: "Laptops for Every Need",
            sectionDescription: "Options for studying, work and gaming.",
        });
    });

    test("displays the homepage content", async () => {
        // Load the homepage
        const page = await Home();

        // Render the homepage
        render(page);

        // Check that the content is displayed
        expect(
            screen.getByRole("heading", { name: "Welcome to Laptop Store" })
        ).toBeInTheDocument();

        expect(
            screen.getByText("Find the right laptop for you")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("link", { name: "Browse Laptops" })
        ).toHaveAttribute("href", "/products");

        expect(
            screen.getByText("Laptops for Every Need")
        ).toBeInTheDocument();
    });
});
