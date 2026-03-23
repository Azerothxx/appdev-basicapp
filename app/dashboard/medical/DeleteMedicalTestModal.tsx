// app/dashboard/medical/DeleteMedicalTestModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { X, GripHorizontal } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { MedicalTest } from "./actions";

interface DeleteMedicalTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: string) => Promise<void>;
    test: MedicalTest | null;
}

export default function DeleteMedicalTestModal({
    isOpen,
    onClose,
    onDelete,
    test,
}: DeleteMedicalTestModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const currentTranslate = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) setPosition({ x: 0, y: 0 });
    }, [isOpen]);

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStart.current = { x: e.clientX, y: e.clientY };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
            x: currentTranslate.current.x + dx,
            y: currentTranslate.current.y + dy,
        });
    };

    const onMouseUp = (e: MouseEvent) => {
        if (isDragging.current) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            currentTranslate.current = {
                x: currentTranslate.current.x + dx,
                y: currentTranslate.current.y + dy,
            };
            isDragging.current = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }
    };

    const handleDelete = async () => {
        if (!test) return;

        const confirmed = await ConfirmModal(
            `Are you sure you want to delete "${test.name}"?`,
            {
                okText: "Yes, Delete",
                cancelText: "Cancel",
                okColor: "bg-red-600 hover:bg-red-700",
            },
        );

        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await onDelete(test.id);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !test) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div
                ref={modalRef}
                className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
            >
                <div
                    className="bg-red-500 px-4 py-3 border-b flex items-center justify-between cursor-move select-none"
                    onMouseDown={onMouseDown}
                >
                    <div className="flex items-center gap-2 text-white font-semibold">
                        <GripHorizontal size={20} className="text-white/70" />
                        <span>Delete Medical Test</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors p-1 rounded hover:bg-red-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-700">
                        Are you sure you want to delete this test? This action
                        cannot be undone.
                    </p>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                        <div className="text-sm">
                            <span className="font-semibold text-gray-600">
                                Name:
                            </span>{" "}
                            {test.name}
                        </div>
                        <div className="text-sm">
                            <span className="font-semibold text-gray-600">
                                Category:
                            </span>{" "}
                            {test.category_name || "None"}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
