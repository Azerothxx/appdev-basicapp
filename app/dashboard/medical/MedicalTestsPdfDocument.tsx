import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { MedicalTest } from "./actions";

const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
        padding: 30,
        fontFamily: "Helvetica",
        fontSize: 10,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    pageNumber: {
        fontSize: 10,
        color: "#000000",
    },
    filterInfo: {
        fontSize: 10,
        marginBottom: 15,
    },
    table: {
        display: "flex",
        width: "auto",
        marginBottom: 20,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomColor: "#000000",
        borderBottomWidth: 0.5,
        minHeight: 20,
        alignItems: "center",
    },
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomColor: "#000000",
        borderBottomWidth: 1,
        paddingBottom: 2,
        marginBottom: 2,
    },
    tableCol: {
        paddingLeft: 4,
        paddingRight: 4,
    },
    tableCellHeader: {
        fontWeight: "bold",
        fontSize: 10,
    },
    tableCell: {
        fontSize: 10,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 30,
        right: 30,
        borderTopWidth: 1,
        borderTopColor: "#000000",
        paddingTop: 5,
    },
});

const colWidths = {
    row: "8%",
    name: "28%",
    category: "22%",
    uom: "18%",
    range: "24%",
};

interface MedicalTestsPdfDocumentProps {
    tests: MedicalTest[];
    totalCount: number;
    searchQuery: string;
}

const MedicalTestsPdfDocument: React.FC<MedicalTestsPdfDocumentProps> = ({
    tests,
    totalCount,
    searchQuery,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View fixed>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Medical Tests</Text>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `Page ${pageNumber} of ${totalPages}`
                        }
                    />
                </View>
                <Text style={styles.filterInfo}>
                    Filtered by: {searchQuery || "None"}
                </Text>
            </View>

            <View style={styles.tableHeaderRow} fixed>
                {(
                    [
                        { key: "row", label: "Row #" },
                        { key: "name", label: "Name" },
                        { key: "category", label: "Category" },
                        { key: "uom", label: "UOM" },
                        { key: "range", label: "Range" },
                    ] as const
                ).map((col) => (
                    <View
                        key={col.key}
                        style={{ ...styles.tableCol, width: colWidths[col.key] }}
                    >
                        <Text style={styles.tableCellHeader}>{col.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.table}>
                {tests.map((test, index) => {
                    const range =
                        test.normalmin !== null && test.normalmax !== null
                            ? `${test.normalmin} - ${test.normalmax}`
                            : "-";
                    return (
                        <View key={test.id} style={styles.tableRow}>
                            <View style={{ ...styles.tableCol, width: colWidths.row }}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                            </View>
                            <View style={{ ...styles.tableCol, width: colWidths.name }}>
                                <Text style={styles.tableCell}>{test.name}</Text>
                            </View>
                            <View
                                style={{ ...styles.tableCol, width: colWidths.category }}
                            >
                                <Text style={styles.tableCell}>
                                    {test.category_name || "-"}
                                </Text>
                            </View>
                            <View style={{ ...styles.tableCol, width: colWidths.uom }}>
                                <Text style={styles.tableCell}>
                                    {test.uom_name || "-"}
                                </Text>
                            </View>
                            <View style={{ ...styles.tableCol, width: colWidths.range }}>
                                <Text style={styles.tableCell}>{range}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={styles.footer} fixed>
                <Text>
                    {tests.length} of {totalCount} Tests
                </Text>
            </View>
        </Page>
    </Document>
);

export default MedicalTestsPdfDocument;
