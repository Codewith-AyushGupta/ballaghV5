import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Helvetica",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    flexWrap: "wrap", 
  },
  tableCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    padding: 5,
    fontSize: 10,
    textAlign: "left",
    minWidth: 60, 
    maxWidth: 200, 
    flex: 1, 
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  tableCellHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    minWidth: 60,
    maxWidth: 200,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    padding: 5,
  },
});

const PlatformPDFTemplate = ({ dataArray = [], headerData,rowPerPage }) => {
  const pages = [];
  for (let i = 0; i < dataArray.length; i += rowPerPage) {
    pages.push(dataArray.slice(i, i + rowPerPage));
  }

  const headers = dataArray.length > 0 ? Object.keys(dataArray[0]) : []; 

  return (
    <Document>
      {pages.map((pageOrders, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <Text
            key={headerData.reportName}
            style={{textAlign:"center",fontSize:"15"}}
          >
            {headerData.reportName}
          </Text>
          <Text
            key={headerData.greaterThanOrEqualToDate}
            style={{textAlign:"center",fontSize:"10", marginBottom:5}}
          >
            {headerData.greaterThanOrEqualToDate} - {headerData.lessThanOrEqualToDate}
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {headers.map((header, idx) => (
                <Text
                  key={idx}
                  style={[styles.tableCell, styles.tableCellHeader]}
                >
                  {header}
                </Text>
              ))}
            </View>
            {pageOrders.map((order, orderIdx) => (
              <View key={orderIdx} style={styles.tableRow}>
                {headers.map((header, idx) => (
                  <React.Fragment key={idx}>
                    {header.includes("Image") && order[header] ? (
                      <Image
                        src={order[header]}
                        style={[styles.tableCell]}
                        onError={() =>
                          console.log("Failed to load image:", order[header])
                        }
                      />
                    ) : (
                      <Text style={styles.tableCell}>{order[header]}</Text>
                    )}
                  </React.Fragment>
                ))}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PlatformPDFTemplate;
