import React, { Fragment, memo } from "react";

//react-router-dom
import { Link } from "react-router-dom";

// the hook
import { useTranslation } from "react-i18next";

const Sources = memo(() => {
  const { t } = useTranslation();
  return (
    <Fragment>
      <div className="source-list-content table-responsive">
        <table className="table custom-table">
          <thead>
            <tr>
              <th>{t("detail_page.links")}</th>
              <th>{t("Type")}</th>
              <th>{t("detail_page.language")}</th>
              <th>{t("detail_page.date_added")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="iq-button">
                  <Link
                    to="/lecture-detail"
                    className="btn text-uppercase position-relative"
                  >
                    <span className="button-text">
                      {" "}
                      {t("Download")}
                    </span>
                    {/* <i className="fa-solid fa-play"></i> */}
                  </Link>
                </div>
              </td>
              <td>Document Editable</td>
              <td>{t("detail_page.eng")}</td>
              {/* <td>{t("detail_page.musicbee")}</td> */}
              <td>2021-11-28</td>
            </tr>
            <tr>
              <td>
                <div className="iq-button">
                  <Link
                    to="/lecture-detail"
                    className="btn text-uppercase position-relative"
                  >
                    <span className="button-text">
                      {t("Download")}
                    </span>
                    {/* <i className="fa-solid fa-play"></i> */}
                  </Link>
                </div>
              </td>
              <td>Google Drive</td>
              <td>{t("detail_page.eng")}</td>
              {/* <td>{t("detail_page.k_player")}</td> */}
              <td>2021-11-25</td>
            </tr>
            <tr>
              <td>
                <div className="iq-button">
                  <Link
                    to="/lecture-detail"
                    className="btn text-uppercase position-relative"
                  >
                    <span className="button-text">
                      {" "}
                      {t("Download")}
                    </span>
                    {/* <i className="fa-solid fa-play"></i> */}
                  </Link>
                </div>
              </td>
              <td>Pdf</td>
              <td>{t("detail_page.eng")}</td>
              {/* <td>{t("detail_page.mediamonkey")}</td> */}
              <td>2021-11-20</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
});

export default Sources;
