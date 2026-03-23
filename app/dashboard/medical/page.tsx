"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import {
    getMedicalTests,
    addMedicalTest,
    updateMedicalTest,
    deleteMedicalTest,
    getTestCategories,
    getUoms,
    MedicalTest,
    TestCategory,
    UOM,
} from "./actions";
import AddMedicalTestModal from "./AddMedicalTestModal";
import EditMedicalTestModal from "./EditMedicalTestModal";
import DeleteMedicalTestModal from "./DeleteMedicalTestModal";

export default function MedicalTestsPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [tests, setTests] = useState<MedicalTest[]>([]);
    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [uoms, setUoms] = useState<UOM[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState<MedicalTest | null>(null);
    const [testToEdit, setTestToEdit] = useState<MedicalTest | null>(null);

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [fetchedTests, fetchedCategories, fetchedUoms] =
                await Promise.all([
                    getMedicalTests(),
                    getTestCategories(),
                    getUoms(),
                ]);
            setTests(fetchedTests);
            setCategories(fetchedCategories);
            setUoms(fetchedUoms);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) fetchData();
    }, [session, fetchData]);

    const handleAdd = async (
        name: string,
        desc: string | null,
        iduom: string | null,
        idcat: string | null,
        min: number | null,
        max: number | null,
    ) => {
        try {
            await addMedicalTest(name, desc, iduom, idcat, min, max);
            await showMessage("Added successfully!");
            fetchData();
        } catch (error) {
            await showMessage("Failed to add.");
        }
    };

    const handleEdit = async (
        id: string,
        name: string,
        desc: string | null,
        iduom: string | null,
        idcat: string | null,
        min: number | null,
        max: number | null,
    ) => {
        try {
            await updateMedicalTest(id, name, desc, iduom, idcat, min, max);
            await showMessage("Updated successfully!");
            fetchData();
        } catch (error) {
            await showMessage("Failed to update.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMedicalTest(id);
            await showMessage("Deleted successfully!");
            fetchData();
        } catch (error) {
            await showMessage("Failed to delete.");
        }
    };

    if (isPending || !session) return <div className="p-6">Loading...</div>;

    const filteredTests = tests.filter(
        (test) =>
            test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (test.category_name &&
                test.category_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (test.uom_name &&
                test.uom_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())),
    );

    return (
        <div className="space-y-4">
            <div className="flex gap-6 border-b border-gray-200 pb-2 mb-4 px-2">
                <Link
                    href="/dashboard/medical"
                    className="font-bold text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]"
                >
                    Medical Tests
                </Link>
                <Link
                    href="/dashboard/medical/categories"
                    className="font-medium text-gray-500 hover:text-blue-600 pb-2"
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
                <h1 className="text-xl font-bold text-gray-900 whitespace-nowrap">
                    Medical Tests
                </h1>
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search tests..."
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Add Test
                    </button>
                </div>
            </div>

            <AddMedicalTestModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAdd}
                categories={categories}
                uoms={uoms}
            />
            <DeleteMedicalTestModal
                isOpen={!!testToDelete}
                onClose={() => setTestToDelete(null)}
                onDelete={handleDelete}
                test={testToDelete}
            />
            <EditMedicalTestModal
                isOpen={!!testToEdit}
                onClose={() => setTestToEdit(null)}
                onEdit={handleEdit}
                test={testToEdit}
                categories={categories}
                uoms={uoms}
            />

            <div className="max-h-[calc(100vh-260px)] overflow-auto rounded border bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-200 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                UOM
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Range
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTests.map((test) => (
                            <tr key={test.id} className="hover:bg-blue-50/50">
                                <td className="px-4 py-2 text-sm font-medium">
                                    {test.name}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {test.category_name || "-"}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {test.uom_name || "-"}
                                </td>
                                <td className="px-4 py-2 text-sm">
                                    {test.normalmin !== null &&
                                    test.normalmax !== null
                                        ? `${test.normalmin} - ${test.normalmax}`
                                        : "-"}
                                </td>
                                <td className="px-6 py-2 text-sm space-x-4">
                                    <button
                                        onClick={() => setTestToEdit(test)}
                                        className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setTestToDelete(test)}
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
