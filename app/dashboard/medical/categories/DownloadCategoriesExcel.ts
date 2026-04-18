import ExcelJS from "exceljs";
import { TestCategory } from "../actions";

export const downloadCategoriesExcel = async (categories: TestCategory[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Categories");
    worksheet.columns = [
        { header: "Row #", key: "row", width: 8 },
        { header: "Name", key: "name", width: 25 },
        { header: "Description", key: "description", width: 35 },
    ];
    categories.forEach((cat, index) => {
        worksheet.addRow({
            row: index + 1,
            name: cat.name,
            description: cat.description || "-",
        });
    });
    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Categories.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
