import ExcelJS from "exceljs";
import { MedicalTest } from "./actions";

export const downloadMedicalTestsExcel = async (tests: MedicalTest[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Medical Tests");
    worksheet.columns = [
        { header: "Row #", key: "row", width: 8 },
        { header: "Name", key: "name", width: 25 },
        { header: "Category", key: "category", width: 20 },
        { header: "UOM", key: "uom", width: 15 },
        { header: "Range", key: "range", width: 15 },
    ];
    tests.forEach((test, index) => {
        const range =
            test.normalmin !== null && test.normalmax !== null
                ? `${test.normalmin} - ${test.normalmax}`
                : "-";
        worksheet.addRow({
            row: index + 1,
            name: test.name,
            category: test.category_name || "-",
            uom: test.uom_name || "-",
            range,
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
    a.download = "MedicalTests.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
