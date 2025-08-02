import { Fragment, memo } from "react";

//react-bootstrap
import { Container, Row, Col } from "react-bootstrap";
import CardStyle from "../components/cards/CardStyle";
import BreadCrumbWidget from "../components/BreadcrumbWidget";
import { generateImgPath } from "../StaticData/data";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { latestMovie } from "../StaticData/data";

const ViewAll = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const sectionTitle = location.state?.sectionTitle || t("ott_home.view_all");

  // For demo, use latestMovie for all sections. You can extend this logic for other sections.
  const viewAll = latestMovie;

  return (
    <Fragment>
      <BreadCrumbWidget title={sectionTitle} />
      <div className="section-padding">
        <Container fluid>
          <div className="card-style-grid">
            <Row className="row row-cols-xl-4 row-cols-md-2 row-cols-1">
              {viewAll.map((item, index) => (
                <Col key={index} className="mb-4">
                  <CardStyle
                    image={item.image}
                    title={item.title}
                    movieTime={item.movieTime}
                    watchlistLink="/playlist"
                    link="/movies-detail"
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
      <footer
        style={{
          background: "#fff",
          borderTop: "1px solid #e0e0e0",
          padding: "18px 0",
          textAlign: "center",
          fontSize: "1rem",
          color: "#888",
          marginTop: 32,
        }}
      >
        <div>
          © {new Date().getFullYear()}{" "}
          <span style={{ color: "#1976d2", fontWeight: 600 }}>VIDOCTO</span>.
          All rights reserved. | Privacy Policy
        </div>
      </footer>
    </Fragment>
  );
});

ViewAll.displayName = "ViewAll";
export default ViewAll;
