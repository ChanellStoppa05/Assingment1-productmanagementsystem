
import { NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redis";

export async function GET() {
    try {
        const redis = await getRedisClient();

        // Store a test message in Redis
        await redis.set("connection-test", "Redis connection successful!");

        // Retrieve the message from Redis
        const message = await redis.get("connection-test");

        return NextResponse.json({
            message: message
        });

    } catch (error) {
        console.error("Redis test failed:", error);

        return NextResponse.json(
            { message: "Could not connect to Redis" },
            { status: 500 }
        );
    }
}
