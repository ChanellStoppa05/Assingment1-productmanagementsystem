
import { getRedisClient } from "@/lib/redis";

export type HomepageContent = {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    sectionTitle: string;
    sectionDescription: string;
};

export async function getHomepageContent(): Promise<HomepageContent> {

    const redis = await getRedisClient();
    const cachedContent = await redis.get("homepage:content");

    if (cachedContent) {
        return JSON.parse(cachedContent) as HomepageContent;
    }

    // Default content if Redis doesnt have it yet
    const homepageContent: HomepageContent = {
        title: "Welcome to Laptop Store",
        subtitle: "Find the right laptop for you",
        description: "Explore our collection of Dell, Lenovo and Acer laptops.",
        buttonText: "Browse Laptops",
        sectionTitle: "Laptops for Every Need",
        sectionDescription: "Whether you need a laptop for studying, work or gaming, we have options to suit you."
    };

    await redis.set("homepage:content", JSON.stringify(homepageContent));

    return homepageContent;
}
