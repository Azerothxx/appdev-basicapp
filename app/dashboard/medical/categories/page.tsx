"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import ConfirmModal from "@/components/ConfirmModal";
import {
    getTestCategories,
    addTestCategory,
    updateTestCategory,
    deleteTestCategory,
    TestCategory,
} from "../actions";

export default function TestCategoriesPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            setCategories(await getTestCategories());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) fetchCategories();
    }, [session, fetchCategories]);

    const handleAdd = async () => {
        const name = prompt("Enter new category name (e.g., CBC, BCT):");
        if (!name) return;
        const desc = prompt("Enter description (optional):") || null;
        try {
            await addTestCategory(name, desc);
            await showMessage("Category added successfully!");
            fetchCategories();
        } catch (e) {
            await showMessage("Failed to add category.");
        }
    };

    const handleEdit = async (cat: TestCategory) => {
        const name = prompt("Edit category name:", cat.name);
        if (!name) return;
        const desc = prompt("Edit description:", cat.description || "") || null;
        try {
            await updateTestCategory(cat.id, name, desc);
            await showMessage("Category updated successfully!");
            fetchCategories();
        } catch (e) {
            await showMessage("Failed to update category.");
        }
    };

    const handleDelete = async (cat: TestCategory) => {
        const confirmed = await ConfirmModal(`Delete category "${cat.name}"?`, {
            okText: "Yes",
            cancelText: "No",
            okColor: "bg-red-600",
        });
        if (!confirmed) return;
        try {
            await deleteTestCategory(cat.id);
            await showMessage("Category deleted successfully!");
            fetchCategories();
        } catch (e) {
            await showMessage("Failed to delete category. It may be in use.");
        }
    };

    if (isPending || !session) return <div className="p-6">Loading...</div>;

    return (
        <div className="space-y-4">
            <div className="flex gap-6 border-b border-gray-200 pb-2 mb-4 px-2">
                <Link
                    href="/dashboard/medical"
                    className="font-medium text-gray-500 hover:text-blue-600 pb-2"
                >
                    Medical Tests
                </Link>
                <Link
                    href="/dashboard/medical/categories"
                    className="font-bold text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]"
                >
                    Categories
                </Link>
                <Link
                    href="/dashboard/medical/uom"
                    className="font-medium text-gray-500 hover:text-blue-600 pb-2"
                >
                    Units of Measure
                </Link>
            </div>

            <div className="flex items-center justify-between gap-x-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">
                    Test Categories
                </h1>
                <button
                    onClick={handleAdd}
                    className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    + Add Category
                </button>
            </div>

            <div className="max-h-[calc(100vh-260px)] overflow-auto rounded border bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Description
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-blue-50/50">
                                <td className="px-4 py-2 text-sm font-medium">
                                    {cat.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600">
                                    {cat.description || "-"}
                                </td>
                                <td className="px-6 py-2 text-sm space-x-4">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat)}
                                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
