import { Fragment, memo, useState, useEffect } from "react"; // Add useState, useEffect
import { Container, Row, Col } from "react-bootstrap";
import CardStyle from "../components/cards/CardStyle";
import BreadCrumbWidget from "../components/BreadcrumbWidget";
import axios from "axios"; // Make sure axios is imported
import { FixedBackButton } from "../utilities/BackButton";
const RecommendedCasesViewAll = memo(() => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRatedCases = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/sessions/getTopRatedCases?limit=All"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCases(response.data.data);
        } else {
          setCases([]);
          setError("Received unexpected data format from API.");
        }
      } catch (err) {
        console.error("Error fetching top rated cases:", err);
        setError("Failed to load recommended cases. Please try again later.");
      } finally {
        setLoading(false); // Set loading to false after fetching (success or error)
      }
    };

    fetchTopRatedCases();
  }, []); // Empty dependency array means this runs once on component mount

  // Define your base URL for images. This should ideally come from an environment variable.
  const IMAGE_BASE_URL = "http://localhost:5000";

  return (
    <Fragment>
      <FixedBackButton customPath="/home"></FixedBackButton>
      <div className="section-padding">
        <Container fluid>
          <div className="card-style-grid">
            {loading ? (
              <Row>
                <Col className="text-center py-5">
                  <p>Loading recommended cases...</p>
                </Col>
              </Row>
            ) : error ? (
              <Row>
                <Col className="text-center py-5">
                  <p style={{ color: "red" }}>Error: {error}</p>
                </Col>
              </Row>
            ) : cases.length === 0 ? (
              <Row>
                <Col className="text-center py-5">
                  <p>No recommended cases found at the moment.</p>
                </Col>
              </Row>
            ) : (
              <Row className="row row-cols-xl-4 row-cols-md-2 row-cols-1">
                {cases.map((item) => {
                  const imageUrl =
                    item.imageUrl_522x760 || item.imageUrl_1920x1080;
                  // Construct the full image URL
                  const fullImageUrl = imageUrl
                    ? `${IMAGE_BASE_URL}${imageUrl}`
                    : "path/to/default/placeholder.jpg";
                  const caseInfo = item.moduleName || item.difficulty;

                  return (
                    <Col key={item._id} className="mb-4">
                      <CardStyle
                        image={fullImageUrl}
                        title={item.title}
                        movieTime={caseInfo} // Using moduleName or difficulty as a placeholder for 'movieTime'
                        watchlistLink={`/playlist?caseId=${item._id}`} // Example: pass case ID to watchlist
                        link={`/cases-detail/${item._id}`} // Example: dynamic link to case detail page
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        </Container>
      </div>
    </Fragment>
  );
});

RecommendedCasesViewAll.displayName = "RecommendedCasesViewAll";
export default RecommendedCasesViewAll;
