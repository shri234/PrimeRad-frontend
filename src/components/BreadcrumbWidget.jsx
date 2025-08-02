import { Fragment, memo } from "react";
import { Breadcrumb, Container, Row, Col } from "react-bootstrap";
import { generateImgPath } from "../StaticData/data";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const imagePath = generateImgPath("/assets/images/design.jpg");

const BreadCrumbWidget = memo((props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Fragment>
      <div
        className="iq-breadcrumb"
        style={{
          position: "relative",
          backgroundImage: `url(${imagePath})`,
          opacity: "0.9",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container fluid style={{ position: "relative", zIndex: 2 }}>
          <Row className="align-items-center">
            <Col sm="12">
              <nav className="text-center" style={{}}>
                <h2
                  // className="title text-capitalize"
                  style={{
                    color: "darkslategrey",
                    fontWeight: "700",
                    // background: "lightgray",

                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {t(props.title)}
                </h2>

                <Breadcrumb
                  className="main-bg"
                  listProps={{
                    className: "text-center justify-content-center",
                  }}
                  style={{
                    color: "ghostwhite",
                    // textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  }}
                >
                  <Breadcrumb.Item
                    style={{ color: "darkslategrey" }}
                    onClick={() => navigate("/home")} // <--- CRITICAL CHANGE HERE
                  >
                    {t("header.home")}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active style={{ color: "black" }}>
                    {t(props.title)}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </nav>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
});

BreadCrumbWidget.displayName = "BreadCrumbWidget";
export default BreadCrumbWidget;
