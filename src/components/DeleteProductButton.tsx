
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
};

export default function DeleteProductButton({ id }: Props) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this laptop?"
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                throw new Error("Could not delete product");
            }

            router.push("/products");
            router.refresh();

        } catch (error) {
            alert("Could not delete this laptop. Please try again.");
            setDeleting(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
            {deleting ? "Deleting..." : "Delete Laptop"}
        </button>
    );
}
