import { Fragment, memo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CardStyle from "../components/cards/CardStyle";
import BreadCrumbWidget from "../components/BreadcrumbWidget";
import { latestMovie } from "../StaticData/data";

const UpcomingLiveProgramsViewAll = memo(() => {
  const viewAll = latestMovie;
  return (
    <Fragment>
      <div className="section-padding">
        <Container fluid>
          <div className="card-style-grid">
            <Row className="row row-cols-xl-4 row-cols-md-2 row-cols-1">
              {viewAll.map((item, index) => (
                <Col key={index} className="mb-4">
                  <CardStyle
                    image={fullImageUrl}
                    title={item.title}
                    movieTime={caseInfo}
                    category={item.moduleName}
                    sectionType={item.sessionType}
                    watchlistLink={`/playlist?caseId=${item._id}`}
                    link={`/lecture-detail`}
                  />
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
});
UpcomingLiveProgramsViewAll.displayName = "UpcomingLiveProgramsViewAll";
export default UpcomingLiveProgramsViewAll;
