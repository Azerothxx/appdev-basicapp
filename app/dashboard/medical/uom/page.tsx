// app/dashboard/medical/uom/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { showMessage } from "@/components/MessageModal";
import ConfirmModal from "@/components/ConfirmModal";
import { getUoms, addUom, updateUom, deleteUom, UOM } from "../actions";
import { downloadUomExcel } from "./DownloadUomExcel";
import DownloadUomPdf from "./DownloadUomPdf";

export default function UomPage() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    const [uoms, setUoms] = useState<UOM[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

    useEffect(() => {
        if (!isPending && !session) router.push("/");
    }, [session, isPending, router]);

    const fetchUoms = useCallback(async () => {
        setLoading(true);
        try {
            setUoms(await getUoms());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (session) fetchUoms();
    }, [session, fetchUoms]);

    const handleAdd = async () => {
        const name = prompt("Enter new Unit of Measure (e.g., mg/dL):");
        if (!name) return;
        const desc = prompt("Enter description (optional):") || null;
        try {
            await addUom(name, desc);
            await showMessage("UOM added successfully!");
            fetchUoms();
        } catch (e) {
            await showMessage("Failed to add UOM.");
        }
    };

    const handleEdit = async (uom: UOM) => {
        const name = prompt("Edit UOM name:", uom.name);
        if (!name) return;
        const desc = prompt("Edit description:", uom.description || "") || null;
        try {
            await updateUom(uom.id, name, desc);
            await showMessage("UOM updated successfully!");
            fetchUoms();
        } catch (e) {
            await showMessage("Failed to update UOM.");
        }
    };

    const handleDelete = async (uom: UOM) => {
        const confirmed = await ConfirmModal(`Delete unit "${uom.name}"?`, {
            okText: "Yes",
            cancelText: "No",
            okColor: "bg-red-600",
        });
        if (!confirmed) return;
        try {
            await deleteUom(uom.id);
            await showMessage("UOM deleted successfully!");
            fetchUoms();
        } catch (e) {
            await showMessage("Failed to delete UOM. It may be in use.");
        }
    };

    const handleDownloadExcel = async () => {
        const confirmed = await ConfirmModal("Download Units of Measure to Excel?", {
            okText: "Yes, Download",
            cancelText: "Cancel",
            okColor: "bg-green-600 hover:bg-green-700",
        });
        if (!confirmed) return;
        setIsDownloadingExcel(true);
        try {
            await downloadUomExcel(uoms);
        } finally {
            setIsDownloadingExcel(false);
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
                    className="font-medium text-gray-500 hover:text-blue-600 pb-2"
                >
                    Categories
                </Link>
                <Link
                    href="/dashboard/medical/uom"
                    className="font-bold text-blue-600 border-b-2 border-blue-600 pb-2 -mb-[9px]"
                >
                    Units of Measure
                </Link>
            </div>

            <div className="flex items-center justify-between gap-x-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900">
                    Units of Measure
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownloadExcel}
                        disabled={isDownloadingExcel}
                        className="rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition-colors shadow-sm whitespace-nowrap"
                    >
                        {isDownloadingExcel ? "Preparing..." : "Download Excel"}
                    </button>
                    <DownloadUomPdf uoms={uoms} />
                    <button
                        onClick={handleAdd}
                        className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Add UOM
                    </button>
                </div>
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
                        {uoms.map((uom) => (
                            <tr key={uom.id} className="hover:bg-blue-50/50">
                                <td className="px-4 py-2 text-sm font-medium">
                                    {uom.name}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-600">
                                    {uom.description || "-"}
                                </td>
                                <td className="px-6 py-2 text-sm space-x-4">
                                    <button
                                        onClick={() => handleEdit(uom)}
                                        className="rounded bg-amber-500 px-3 py-1 text-white hover:bg-amber-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(uom)}
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
