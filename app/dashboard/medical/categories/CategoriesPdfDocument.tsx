import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { TestCategory } from "../actions";

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

interface CategoriesPdfDocumentProps {
    categories: TestCategory[];
}

const CategoriesPdfDocument: React.FC<CategoriesPdfDocumentProps> = ({
    categories,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View fixed>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Categories</Text>
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `Page ${pageNumber} of ${totalPages}`
                        }
                    />
                </View>
                <Text style={styles.filterInfo}>Filtered by: None</Text>
            </View>

            <View style={styles.tableHeaderRow} fixed>
                {(
                    [
                        { key: "row", label: "Row #", width: "8%" },
                        { key: "name", label: "Name", width: "32%" },
                        { key: "description", label: "Description", width: "60%" },
                    ] as const
                ).map((col) => (
                    <View
                        key={col.key}
                        style={{ ...styles.tableCol, width: col.width }}
                    >
                        <Text style={styles.tableCellHeader}>{col.label}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.table}>
                {categories.map((cat, index) => (
                    <View key={cat.id} style={styles.tableRow}>
                        <View style={{ ...styles.tableCol, width: "8%" }}>
                            <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: "32%" }}>
                            <Text style={styles.tableCell}>{cat.name}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: "60%" }}>
                            <Text style={styles.tableCell}>
                                {cat.description || "-"}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.footer} fixed>
                <Text>
                    {categories.length} of {categories.length} Categories
                </Text>
            </View>
        </Page>
    </Document>
);

export default CategoriesPdfDocument;
