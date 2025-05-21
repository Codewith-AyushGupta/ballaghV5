import React from "react";

function Table(props) {
  let { data } = props;
  if (!data || data.length === 0) {
    return <p className="text-center text-muted">No data available</p>;
  }

  const headers = Object.keys(data[0]);

  const convertCamelCaseToTitleCase = (input) => {
    return input
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div style={{ padding: "10px" }}>
      <div id="table-container" style={{ overflowX: "auto", maxWidth:"100vw"}}>
        <table
          className="table table-bordered table-striped table-sm"
          style={{ border: "1px solid #dee2e6", width:"auto" }}
        >
          {/* Header */}
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  style={{
                    padding: "8px",
                    backgroundColor: "#f1f1f1",
                    fontWeight: "bold",
                    textAlign: "center",
                    minWidth:"14vw",
                    maxWidth:"14vw"
                  }}
                >
                  {convertCamelCaseToTitleCase(header)}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ pageBreakInside: "avoid" }}>
                {headers.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      pageBreakInside: "avoid",
                      wordBreak: "break-word",
                      alignContent:"flex-start"
                    }}
                  >
                    {/* Handle Image Columns */}
                    {header.toLowerCase().includes("image") && row[header] ? (
                      <img
                        src={row[header]}
                        alt="Item"
                        style={{
                          maxWidth: "60px",
                          maxHeight: "60px",
                          display: "block",
                          margin: "auto",
                        }}
                      />
                    ) : header.includes("Html") ? (
                      /* Handle Dangerous HTML */
                      <div dangerouslySetInnerHTML={{ __html: row[header] }} />
                    ) : (
                      <span>{row[header]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
