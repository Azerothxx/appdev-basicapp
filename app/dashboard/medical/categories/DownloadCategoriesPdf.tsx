"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ConfirmModal from "@/components/ConfirmModal";
import { TestCategory } from "../actions";
import CategoriesPdfDocument from "./CategoriesPdfDocument";

interface DownloadCategoriesPdfProps {
    categories: TestCategory[];
}

const DownloadCategoriesPdf: React.FC<DownloadCategoriesPdfProps> = ({
    categories,
}) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        const confirmed = await ConfirmModal("Download Categories to PDF?", {
            okText: "Yes, Download",
            cancelText: "Cancel",
            okColor: "bg-purple-600 hover:bg-purple-700",
        });
        if (!confirmed) return;
        setIsGenerating(true);
        try {
            const blob = await pdf(
                <CategoriesPdfDocument categories={categories} />,
            ).toBlob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Categories.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="rounded-md bg-purple-600 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm whitespace-nowrap"
        >
            {isGenerating ? "Preparing PDF..." : "Download PDF"}
        </button>
    );
};

export default DownloadCategoriesPdf;
