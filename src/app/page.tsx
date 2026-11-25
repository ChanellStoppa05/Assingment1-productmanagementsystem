
import Link from "next/link";
import { getHomepageContent } from "@/lib/homepageContent";

export default async function Home() {

    // Retrieve homepage content from Redis
    const content = await getHomepageContent();

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">

            <div className="mx-auto max-w-5xl text-center">

                <h1 className="text-4xl font-bold text-gray-900">
                    {content.title}
                </h1>

                <h2 className="mt-4 text-2xl font-semibold text-blue-600">
                    {content.subtitle}
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                    {content.description}
                </p>

                <Link
                    href="/products"
                    className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    {content.buttonText}
                </Link>

                <section className="mt-20 rounded-xl bg-white p-10 shadow-sm">

                    <h2 className="text-2xl font-bold text-gray-900">
                        {content.sectionTitle}
                    </h2>

                    <p className="mt-4 text-gray-600">
                        {content.sectionDescription}
                    </p>

                </section>

            </div>

        </main>
    );
}
