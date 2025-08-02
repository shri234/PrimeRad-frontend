import React, { Fragment, memo } from "react";
import { Row, Col, Container, Nav, Tab } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import ReviewComponent from "../../components/ReviewComponent";
import Sources from "../../components/Sources";
// import MoviesRecommendedForYou from "../../components/sections/MoviesRecommendedForYou";
import RatingStar from "../../components/rating-star";
import { generateImgPath } from "../../StaticData/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useTranslation } from "react-i18next";

const THEME = {
  primary: "#1976d2",
  secondary: "#00bfae",
  background: "#f4f8fb",
  card: "#fff",
  accent: "#ffb300",
  text: "#263238",
  border: "#e0e0e0",
};

const ZOOM_URL =
  "https://us05web.zoom.us/j/5387499339?pwd=n2hGRVEnYTLVvvmABwhFpWxff5j8sv.1";

const LivePage = memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    title = "Live Session",
    description = "No description available.",
    faculty = "Dr. Smith",
    module = "Orthopedics",
    submodule = "Knee Injuries",
  } = location.state || {};

  const shows = {
    id: 1,
    slug: "live-session",
    thumbnail: generateImgPath("/assets/images/genre/01.webp"),
    title: "Live Session",
    detail: "Live Zoom session.",
    season_type: "1 Session",
    certificate: "Live",
    rating: 5.0,
    likes: 12,
    rating_from: "Users",
    geners: ["home.action", "home.adventure", "ott_home.drama"],
    tags: ["ott_home.live", "ott_home.session", "ott_home.zoom"],
    video_link: ZOOM_URL,
    video_type: "zoom",
    is_restricted: false,
    cast: [
      {
        title: "detail_page.james_chinlund",
        thumbnail: generateImgPath("/assets/images/faculty1.jpg"),
        as: "detail_page.as_james",
      },
      {
        title: "detail_page.james_earl",
        thumbnail: generateImgPath("/assets/images/faculty2.jpg"),
        as: "detail_page.as_jones",
      },
    ],
    crew: [
      {
        title: "detail_page.jeff_nathanson",
        thumbnail: generateImgPath("/assets/images/genre/g3.webp"),
        as: "detail_page.writing",
      },
      {
        title: "detail_page.irene_mecchi",
        thumbnail: generateImgPath("/assets/images/genre/g5.webp"),
        as: "detail_page.writing",
      },
      {
        title: "detail_page.karan_gilchrist",
        thumbnail: generateImgPath("/assets/images/genre/g4.webp"),
        as: "detail_page.production",
      },
    ],
    created_by_username: "Admin",
    created_at: "Feb 2024",
    ranking: "#1 in Live Sessions Today ",
    date: "Feb 2024",
  };

  return (
    <Fragment>
      <div style={{ backgroundColor: THEME.background }}>
        <div className="iq-main-slider site-video" style={{ marginTop: 70 }}>
          {isAuthenticated ? (
            <Container fluid>
              <Row>
                <Col lg="12">
                  <div className="pt-0">
                    <div
                      style={{ padding: "45.25% 0 0 0", position: "relative" }}
                    >
                      <iframe
                        src={ZOOM_URL}
                        title="Zoom Meeting"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: 0,
                          borderRadius: 16,
                        }}
                        allow="camera; microphone; fullscreen"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              <div className="text-center">
                <h2>Login to join the live session</h2>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="details-part">
          <Container fluid>
            <Row>
              <Col lg="12">
                <div className="trending-info mt-4 pt-0 pb-4">
                  <Row>
                    <Col md="9" className="mb-auto">
                      <div
                        className="d-flex align-items-center mb-3"
                        style={{
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: 12,
                        }}
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{ gap: 18 }}
                        >
                          <h2 className="fw-bold text-uppercase my-0 text-darkslategrey">
                            {t(title)}
                          </h2>
                          <div className="d-flex align-items-center ms-lg-3 ms-0">
                            <RatingStar
                              count="5"
                              count1="0"
                              starColor="text-warning"
                            />
                            <span className="text-gray ms-2">
                              {shows.rating} (Users)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap align-items-center text-gray text-detail mb-3">
                        <span className="me-4">
                          <strong>{t("Duration")}:</strong> 1hr : 00mins
                        </span>
                        <span>
                          <strong>{t("Posted On")}:</strong> {shows.created_at}
                        </span>
                      </div>
                      <div className="d-flex flex-wrap align-items-center text-gray text-detail mb-4">
                        <span className="me-4">
                          <strong>{t("Module")}:</strong> {t(module)}
                        </span>
                        <span>
                          <strong>{t("Submodule")}:</strong> {t(submodule)}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="content-details trending-info">
                  <Tab.Container defaultActiveKey="first">
                    <Nav
                      style={{ backgroundColor: THEME.text, color: "white" }}
                      className="iq-custom-tab tab-bg-gredient-center d-flex nav nav-pills align-items-center text-center mb-5 justify-content-center list-inline"
                    >
                      <Nav.Item>
                        <Nav.Link
                          eventKey="first"
                          variant="d-flex align-items-center"
                          id="nav-description-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-description"
                          type="button"
                          role="tab"
                          aria-controls="nav-description"
                          aria-selected="true"
                        >
                          {t("detail_page.description")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="second"
                          variant=""
                          id="nav-review-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-review"
                          type="button"
                          role="tab"
                          aria-controls="nav-review"
                          aria-selected="false"
                        >
                          {t("Resources")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link
                          eventKey="third"
                          variant=""
                          id="nav-sources-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-sources"
                          type="button"
                          role="tab"
                          aria-controls="nav-sources"
                          aria-selected="false"
                        >
                          {t("detail_page.rate")} & {t("detail_page.review")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane
                        className=" fade show"
                        eventKey="first"
                        id="nav-description"
                        role="tabpanel"
                        aria-labelledby="nav-description-tab"
                      >
                        <p>{description}</p>
                      </Tab.Pane>
                      <Tab.Pane
                        className=" fade"
                        id="nav-review"
                        eventKey="second"
                        role="tabpanel"
                        aria-labelledby="nav-review-tab"
                      >
                        <Sources />
                      </Tab.Pane>
                      <Tab.Pane
                        className=" fade"
                        id="nav-sources"
                        eventKey="third"
                        role="tabpanel"
                        aria-labelledby="nav-sources-tab"
                      >
                        <ReviewComponent />
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="cast-tabs">
          <Container fluid>
            <div className="content-details trending-info g-border iq-rtl-direction">
              <Tab.Container defaultActiveKey="first">
                <Nav
                  className="iq-custom-tab tab-bg-fill d-flex nav nav-pills mb-5 "
                  style={{ backgroundColor: THEME.text }}
                >
                  <Nav.Item>
                    <Nav.Link
                      eventKey="first"
                      variant=" d-flex align-items-center"
                      id="nav-cast-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-cast"
                      type="button"
                      role="tab"
                      aria-controls="nav-cast"
                      aria-selected="true"
                    >
                      {t("Faculty")}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  <Tab.Pane
                    className=" fade show"
                    eventKey="first"
                    id="nav-cast"
                    role="tabpanel"
                    aria-labelledby="nav-cast-tab"
                  >
                    <Swiper
                      slidesPerView={5}
                      loop={false}
                      modules={[Navigation]}
                      tag="ul"
                      className="position-relative swiper-card list-inline"
                      breakpoints={{
                        0: { slidesPerView: 1, spaceBetween: 0 },
                        576: { slidesPerView: 2, spaceBetween: 0 },
                        768: { slidesPerView: 3, spaceBetween: 0 },
                        1025: { slidesPerView: 5, spaceBetween: 0 },
                        1500: { slidesPerView: 5, spaceBetween: 0 },
                      }}
                    >
                      {shows.cast.map((item, index) => {
                        return (
                          <SwiperSlide key={index} as="li">
                            <Row className="cast-images m-0 align-items-center position-relative">
                              <Col className="col-4 img-box p-0">
                                <img
                                  src={item.thumbnail}
                                  alt="cast-1"
                                  className="img-fluid"
                                  loading="lazy"
                                />
                              </Col>
                              <Col className="col-8 block-description">
                                <h6 className="iq-title">
                                  <Link to="/cast-detail">{t(faculty)}</Link>
                                </h6>
                                <div className="video-time d-flex align-items-center my-2">
                                  <small className="text-white">
                                    {t(faculty)}
                                  </small>
                                </div>
                              </Col>
                            </Row>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Container>
        </div>
        {/* <MoviesRecommendedForYou /> */}
      </div>
    </Fragment>
  );
});

LivePage.displayName = "LivePage";
export default LivePage;
