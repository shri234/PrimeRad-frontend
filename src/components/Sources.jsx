import React, { Fragment, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Sources = memo(() => {
  const { t } = useTranslation();

  const sources = [
    {
      type: "Document Editable",
      language: t("detail_page.eng"),
      date: "2021-11-28",
      link: "/lecture-detail",
    },
    {
      type: "Google Drive",
      language: t("detail_page.eng"),
      date: "2021-11-25",
      link: "/lecture-detail",
    },
    {
      type: "PDF",
      language: t("detail_page.eng"),
      date: "2021-11-20",
      link: "/lecture-detail",
    },
  ];

  const styles = {
    container: {
      // backgroundColor: "#fff",
      borderRadius: "16px",
      // boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      // border: "1px solid #eee",
      padding: "20px",
      overflowX: "auto",
    },
    heading: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#222",
      marginBottom: "16px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      fontSize: "14px",
      fontWeight: "600",
      textTransform: "uppercase",
      color: "#555",
      borderBottom: "2px solid #f0f0f0",
      backgroundColor: "#fafafa",
    },
    td: {
      padding: "12px 16px",
      fontSize: "14px",
      color: "#333",
      borderBottom: "1px solid #f5f5f5",
    },
    row: {
      transition: "background-color 0.2s ease",
    },
    rowHover: {
      backgroundColor: "#f9f9f9",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      backgroundColor: "#f4f4f4",
      borderRadius: "8px",
      padding: "8px 14px",
      fontSize: "14px",
      fontWeight: "500",
      color: "#333",
      textDecoration: "none",
      transition: "background-color 0.2s ease, transform 0.1s ease",
    },
    buttonHover: {
      backgroundColor: "#e8e8e8",
      transform: "translateY(-1px)",
    },
  };

  return (
    <Fragment>
      <div style={styles.container}>
        <h2 style={styles.heading}>{t("Session Resources")}</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>{t("detail_page.links")}</th>
              <th style={styles.th}>{t("Type")}</th>
              <th style={styles.th}>{t("detail_page.language")}</th>
              <th style={styles.th}>{t("detail_page.date_added")}</th>
            </tr>
          </thead>

          <tbody>
            {sources.map((item, index) => (
              <tr
                key={index}
                style={styles.row}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={styles.td}>
                  <Link
                    to={item.link}
                    style={styles.button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e8e8e8";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#f4f4f4";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <span style={{ marginRight: "6px" }}>{t("Download")}</span>
                    <i
                      className="fa-solid fa-download"
                      style={{ color: "#666", fontSize: "13px" }}
                    ></i>
                  </Link>
                </td>

                <td style={styles.td}>{item.type}</td>
                <td style={styles.td}>{item.language}</td>
                <td style={styles.td}>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
});

export default Sources;
