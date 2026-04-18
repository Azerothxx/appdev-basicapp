import ExcelJS from "exceljs";
import { UOM } from "../actions";

export const downloadUomExcel = async (uoms: UOM[]) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Units of Measure");
    worksheet.columns = [
        { header: "Row #", key: "row", width: 8 },
        { header: "Name", key: "name", width: 25 },
        { header: "Description", key: "description", width: 35 },
    ];
    uoms.forEach((uom, index) => {
        worksheet.addRow({
            row: index + 1,
            name: uom.name,
            description: uom.description || "-",
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
    a.download = "UnitsOfMeasure.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
