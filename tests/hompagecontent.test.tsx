
import { getHomepageContent } from "../src/lib/homepageContent";
import { getRedisClient } from "../src/lib/redis";

// Mock the Redis connection
jest.mock("../src/lib/redis", () => ({
    getRedisClient: jest.fn(),
}));

describe("Redis Homepage Content", () => {
    const mockGet = jest.fn();
    const mockSet = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (getRedisClient as jest.Mock).mockResolvedValue({
            get: mockGet,
            set: mockSet,
        });
    });

    test("retrieves homepage content from Redis", async () => {
        const cachedContent = {
            title: "Welcome to Laptop Store",
            subtitle: "Find the right laptop for you",
            description: "Explore our laptops.",
            buttonText: "Browse Laptops",
            sectionTitle: "Laptops for Every Need",
            sectionDescription: "Laptops for studying and work.",
        };

        mockGet.mockResolvedValue(JSON.stringify(cachedContent));

        const result = await getHomepageContent();

        expect(mockGet).toHaveBeenCalledWith("homepage:content");
        expect(result).toEqual(cachedContent);
        expect(mockSet).not.toHaveBeenCalled();
    });

    test("saves default content when Redis is empty", async () => {
        mockGet.mockResolvedValue(null);

        const result = await getHomepageContent();

        expect(result.title).toBe("Welcome to Laptop Store");
        expect(mockSet).toHaveBeenCalledWith(
            "homepage:content",
            JSON.stringify(result)
        );
    });
});
