import React, {
  Fragment,
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom"; // <--- Corrected Link import for react-router-dom

import { useTranslation } from "react-i18next";
import axios from "axios"; // Ensure axios is installed: npm install axios

const THEME = {
  primary: "#1976d2", // blue
  secondary: "#00bfae", // teal
  background: "#f4f8fb", // light blue/gray (for form background)
  card: "#ffffff", // for the main review section card background
  accent: "#ffb300", // amber
  text: "#263238", // dark blue-gray (for general text)
  border: "#e0e0e0", // light gray border
  lightText: "#666666", // lighter gray text
  darkText: "#222222", // very dark text (for headings)
  mediumGray: "#A0AEC0", // medium gray for outline buttons/borders
  softBlue: "#e2f0fe", // very light blue
};

// Reusable Star Rating Input Component
// This component displays clickable stars for rating input and static stars for display.
const StarRatingInput = ({
  rating, // Current rating value
  setRating, // Function to update rating state (only for input mode)
  isAuthenticated, // Whether user is logged in
  disabled = false, // Whether the stars should be interactive
}) => {
  const stars = Array(5).fill(0); // Create an array of 5 elements for 5 stars

  return (
    <div style={{ display: "flex", gap: "5px" }}>
      {stars.map((_, index) => (
        <span
          key={index} // Unique key for each star
          style={{
            // Cursor changes based on isAuthenticated and disabled status
            cursor: isAuthenticated && !disabled ? "pointer" : "default",
            // Star color: gold if index is less than current rating, otherwise gray
            color: index < rating ? "#FFD700" : "#CCCCCC",
            fontSize: "24px", // Large star size
            transition: "color 0.2s", // Smooth color transition on hover/click
          }}
          // Only allow click if user is authenticated and stars are not disabled
          onClick={() => isAuthenticated && !disabled && setRating(index + 1)}
          // Visual feedback on hover for interactive stars
          onMouseEnter={(e) => {
            if (isAuthenticated && !disabled)
              e.currentTarget.style.color = "#FFCC00"; // Slightly brighter gold on hover
          }}
          onMouseLeave={(e) => {
            if (isAuthenticated && !disabled)
              e.currentTarget.style.color =
                index < rating ? "#FFD700" : "#CCCCCC"; // Revert to original color
          }}
        >
          ★ {/* Unicode star character */}
        </span>
      ))}
    </div>
  );
};

const ReviewComponent = memo(
  ({ itemId, isAuthenticated, currentUserId, itemTitle, itemType }) => {
    const { t } = useTranslation(); // Hook for internationalization

    // State variables for review data and UI management
    const [reviews, setReviews] = useState([]); // Array to store all reviews fetched for this item
    const [userReview, setUserReview] = useState(null); // Object to store the current authenticated user's review (if exists)
    const [rating, setRating] = useState(0); // Current rating selected by the user (0-5 stars)
    const [comment, setComment] = useState(""); // Current review comment text
    const [loading, setLoading] = useState(true); // True when reviews are being fetched
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formMode, setFormMode] = useState("create");
    const [userReviewFetched, setUserReviewFetched] = useState(false);
    const reviewFormRef = useRef(null);

    // --- API Calls (memoized with useCallback) ---

    // Fetches all reviews for the current itemId
    const fetchReviews = useCallback(async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/getReviewsForItem?itemId=${itemId}`
        );
        console.log(response.data.data);
        setReviews(response.data.data); // Update reviews list state
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews."); // Set user-friendly error message
      } finally {
        setLoading(false); // End loading
      }
    }, [itemId]); // Dependency: re-fetch if itemId changes

    // Fetches the authenticated user's specific review for the current itemId
    const fetchUserReview = useCallback(async () => {
      if (!isAuthenticated || !currentUserId || !itemId) {
        setUserReview(null);
        setRating(0);
        setComment("");
        setFormMode("create");
        setUserReviewFetched(true); // Mark as fetched even if not authenticated
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/get?userId=${localStorage.getItem(
            "userId"
          )}&itemId=${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Crucial: Check for response.data.data being a non-empty object
        if (
          response.data &&
          response.data.data &&
          Object.keys(response.data.data).length > 0
        ) {
          setUserReview(response.data.data);
          setRating(response.data.data.rating);
          setComment(response.data.data.comment);
          setFormMode("edit");
        } else {
          // No review found in response or data is empty/null/undefined
          setUserReview(null);
          setRating(0);
          setComment("");
          setFormMode("create");
        }
      } catch (err) {
        console.error("Error fetching user review:", err);
        // On ANY error, assume no user review and revert to create mode
        setUserReview(null);
        setRating(0);
        setComment("");
        setFormMode("create");
      } finally {
        setUserReviewFetched(true); // Always set to true after fetch attempt
      }
    }, [isAuthenticated, currentUserId, itemId]); // Dependencies: re-fetch if these change

    // --- Effects ---

    // Primary useEffect to trigger data fetching on component mount or prop changes
    useEffect(() => {
      if (itemId) {
        // Only fetch if itemId is available
        fetchReviews(); // Fetch all reviews
        fetchUserReview(); // Fetch user's specific review
      }
    }, [itemId, isAuthenticated, currentUserId, fetchReviews, fetchUserReview]); // Dependencies for this effect

    // --- Form Submission Handlers ---

    // Handles submitting a new review or updating an existing one
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      setSubmitting(true); // Start submitting state
      setError(null); // Clear previous errors

      // Client-side validation
      if (rating === 0) {
        setError(t("Please select rating")); // Use translation for errors
        setSubmitting(false);
        return;
      }
      if (comment?.trim() === "") {
        setError(t("Please add comment"));
        setSubmitting(false);
        return;
      }

      try {
        if (formMode === "create") {
          await axios.post(
            `http://localhost:5000/api/reviews/create?userId=${localStorage.getItem(
              "userId"
            )}`,
            { itemId, rating, comment },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth header
              },
            }
          );
          alert(t("Submitted successfully")); // Success message
        } else {
          // formMode === 'edit'
          // API call to update an existing review
          await axios.put(
            `http://localhost:5000/api/reviews/${userReview._id}`, // Use existing review's ID
            { rating, comment },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Auth header
              },
            }
          );
          alert(t("detail_page.review_updated_success")); // Success message
        }
        // After successful operation, re-fetch data to update the UI
        fetchReviews();
        fetchUserReview();

        // Clear form fields only after successful creation
        if (formMode === "create") {
          setRating(0);
          setComment("");
        }
        // Scroll to the review form or list for better UX after submission
        reviewFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (err) {
        console.error("Submission error:", err);
        // Display API error message or a generic one
        setError(
          err.response?.data?.message ||
            t("detail_page.failed_to_submit_review")
        );
      } finally {
        setSubmitting(false); // End submitting state
      }
    };

    // Handles deleting the user's existing review
    const handleDelete = async () => {
      // Confirmation dialog before deleting
      if (!window.confirm(t("detail_page.confirm_delete_review"))) return; // If user cancels, stop

      setSubmitting(true);
      setError(null);
      try {
        // API call to delete the review
        await axios.delete(
          `http://localhost:5000/api/reviews/${userReview._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert(t("detail_page.review_deleted_success")); // Success message
        fetchReviews(); // Re-fetch all reviews
        fetchUserReview(); // Re-fetch user's review (this will reset form to create mode)
      } catch (err) {
        console.error("Deletion error:", err);
        setError(
          err.response?.data?.message ||
            t("detail_page.failed_to_delete_review")
        );
      } finally {
        setSubmitting(false);
      }
    };

    // Handles canceling an edit operation, reverting form to user's current review data
    const handleCancelEdit = () => {
      setRating(userReview?.rating || 0); // Restore original rating
      setComment(userReview?.comment || ""); // Restore original comment
      setFormMode("edit"); // Keep form in edit mode if userReview still exists
      setError(null); // Clear any errors
    };

    // Calculate average rating and total count for display
    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1) // Format to one decimal place
        : "N/A"; // If no reviews, display N/A
    const totalReviewsCount = reviews.length;

    const formTitle =
      userReviewFetched && userReview
        ? t("Edit your Review")
        : t("Write your Review");

    return (
      <Fragment>
        <div
          className="streamit-reviews"
          style={{
            background: THEME.card,
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            padding: "30px",
          }}
        >
          {/* Overall Reviews Summary Section */}
          <div
            className="d-flex align-items-center mb-4"
            style={{
              borderBottom: `1px solid ${THEME.border}`, // Subtle separator
              paddingBottom: "20px",
            }}
          >
            <h3
              style={{
                color: THEME.darkText,
                margin: 0,
                fontSize: "1.8rem",
                fontWeight: 700,
              }}
            >
              Reviews
            </h3>
            <span
              style={{
                marginLeft: "15px",
                fontSize: "1.2rem",
                color: THEME.text,
              }}
            >
              ({totalReviewsCount}) {/* Uses new translation key */}
            </span>
            {totalReviewsCount > 0 && (
              <div
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  alignItems: "center",
                  color: THEME.accent, // Gold color for stars
                  fontSize: "1.2rem",
                }}
              >
                <span style={{ marginRight: "5px" }}>⭐</span> {/* Star icon */}
                <strong>{averageRating}</strong> / 5
              </div>
            )}
          </div>

          {/* Reviews List Section */}
          <div
            id="comments"
            className="comments-area"
            style={{ marginBottom: "30px" }}
          >
            {loading ? ( // Display loading state
              <p style={{ textAlign: "center", color: THEME.lightText }}>
                {t("loading_reviews")}
              </p>
            ) : reviews.length === 0 ? ( // Display "no reviews" state
              <>
                {" "}
                {/* Use React Fragment to return multiple top-level elements */}
                <p
                  className="masvideos-noreviews mt-3"
                  style={{ color: THEME.lightText, textAlign: "center" }}
                >
                  No Reviews Yet {/* Uses corrected translation key */}
                </p>
                <p
                  style={{
                    textAlign: "center",
                    color: THEME.lightText,
                    fontSize: "1.1rem",
                  }}
                >
                  {/* Uses translation key with interpolation for itemTitle */}
                  {t("Be the first to review", {
                    itemTitle: itemTitle,
                  })}
                </p>
              </>
            ) : (
              // Display actual list of reviews
              <ul className="list-unstyled">
                {reviews.map((review) => (
                  <li
                    key={review._id} // Unique key for each review item
                    className="comment-item mb-4 pb-4"
                    style={{
                      borderBottom: `1px dashed ${THEME.border}`, // Dashed separator between reviews
                    }}
                  >
                    <div className="d-flex align-items-start">
                      {/* User Avatar */}
                      <img
                        src={
                          review.userId?.profilePicture ||
                          "https://www.gravatar.com/avatar/?d=mp"
                        }
                        alt={review.userId?.username || "User"}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "15px",
                          border: `2px solid ${THEME.border}`, // Border around avatar
                        }}
                      />
                      <div className="comment-content flex-grow-1">
                        <h5
                          style={{
                            color: THEME.darkText,
                            marginBottom: "5px",
                            fontWeight: 600,
                          }}
                        >
                          {review.userId?.name || "Anonymous User"}{" "}
                          {/* Display username or fallback */}
                          {review.userId?._id === currentUserId && ( // Indicate if it's the current user's review
                            <span
                              style={{
                                marginLeft: "10px",
                                fontSize: "0.8em",
                                color: THEME.primary,
                                fontWeight: 500,
                              }}
                            >
                              (your review){" "}
                              {/* Uses specific label translation key */}
                            </span>
                          )}
                        </h5>
                        <div className="d-flex align-items-center mb-2">
                          <StarRatingInput
                            rating={review.rating}
                            disabled={true}
                          />{" "}
                          {/* Display static stars */}
                          <span
                            style={{
                              fontSize: "0.9em",
                              color: THEME.lightText,
                              marginLeft: "10px",
                            }}
                          >
                            {new Date(review.createdAt).toLocaleDateString(
                              // Format review creation date
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <p
                          style={{
                            color: THEME.text,
                            lineHeight: 1.6,
                            fontSize: "0.95rem",
                          }}
                        >
                          {review.comment} {/* Display review comment */}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Review Submission Form Section */}
          <div className="review_form" ref={reviewFormRef}>
            {" "}
            {/* Attach ref here */}
            <div className="comment-respond">
              {isAuthenticated ? ( // Show form if user is authenticated
                <Fragment>
                  <h3
                    className="fw-700 mb-3"
                    style={{ color: THEME.darkText, fontSize: "24px" }}
                  >
                    {formTitle} {/* Use the derived formTitle */}
                  </h3>
                  {error && ( // Display error message if present
                    <div
                      className="alert alert-danger"
                      style={{
                        background: "#f8d7da",
                        color: "#721c24",
                        borderColor: "#f5c6cb",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "15px",
                      }}
                    >
                      {error}
                    </div>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="12" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label
                            style={{ color: THEME.text, fontWeight: 600 }}
                          >
                            {t("detail_page.your_rating")}{" "}
                            {/* Label for rating input */}
                            <span className="text-danger"> *</span>
                          </Form.Label>
                          <StarRatingInput // Interactive star rating input
                            rating={rating}
                            setRating={setRating}
                            isAuthenticated={isAuthenticated}
                            disabled={submitting}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="12" className="mb-3">
                        <Form.Group className="form-group">
                          <Form.Label
                            style={{ color: THEME.text, fontWeight: 600 }}
                          >
                            {t("detail_page.your_review")}{" "}
                            {/* Label for comment textarea */}
                            <span className="text-danger"> *</span>
                          </Form.Label>
                          <textarea
                            className="form-control"
                            style={{
                              backgroundColor: THEME.background, // Input background color
                              border: `1px solid ${THEME.border}`,
                              color: THEME.text,
                              borderRadius: "8px",
                              padding: "12px",
                              minHeight: "120px",
                              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                            }}
                            name="comment"
                            cols="5"
                            rows="8"
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={submitting} // Disable during submission
                          ></textarea>
                        </Form.Group>
                      </Col>

                      <Col md="12">
                        <div className="form-submit mt-4 d-flex gap-3">
                          {/* Submit/Update Button */}
                          <Button
                            type="submit"
                            id="submit"
                            className="btn text-uppercase position-relative"
                            disabled={
                              submitting || // Disable if submitting
                              rating === 0 || // Disable if no rating selected
                              comment?.trim() === "" // Disable if comment is empty
                            }
                            style={{
                              background: `linear-gradient(135deg, ${THEME.primary} 0%, #1565c0 100%)`,
                              color: "white",
                              fontWeight: 700,
                              borderRadius: "10px",
                              padding: "12px 28px",
                              fontSize: "1rem",
                              boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                              border: "none",
                              transition: "all 0.3s ease",
                              opacity:
                                submitting ||
                                rating === 0 ||
                                comment?.trim() === ""
                                  ? 0.6
                                  : 1, // Visual feedback for disabled
                              cursor:
                                submitting ||
                                rating === 0 ||
                                comment?.trim() === ""
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <span className="button-text">
                              {submitting // Dynamic button text
                                ? formMode === "create"
                                  ? t("Submitting")
                                  : t("Updating")
                                : formMode === "create"
                                ? t("Submit")
                                : t("Update")}
                            </span>
                          </Button>
                          {/* Delete Button (only in edit mode) */}
                          {formMode === "edit" && (
                            <Button
                              type="button"
                              onClick={handleDelete}
                              disabled={submitting}
                              style={{
                                background: "#dc3545", // Red for delete
                                color: "white",
                                fontWeight: 700,
                                borderRadius: "10px",
                                padding: "12px 28px",
                                fontSize: "1rem",
                                boxShadow: "0 4px 15px rgba(220,53,69,0.2)",
                                border: "none",
                                transition: "all 0.3s ease",
                                opacity: submitting ? 0.6 : 1,
                                cursor: submitting ? "not-allowed" : "pointer",
                              }}
                            >
                              {submitting ? t("Deleting") : t("Delete Review")}
                            </Button>
                          )}
                          {/* Cancel Button (only in edit mode) */}
                          {formMode === "edit" && (
                            <Button
                              type="button"
                              onClick={handleCancelEdit}
                              variant="outline-secondary"
                              disabled={submitting}
                              style={{
                                borderRadius: "10px",
                                padding: "12px 28px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                borderColor: THEME.mediumGray,
                                color: THEME.mediumGray,
                                transition: "all 0.3s ease",
                              }}
                            >
                              {t("Cancel")}
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Fragment>
              ) : (
                // Display message if user is not authenticated
                <p
                  style={{
                    textAlign: "center",
                    color: THEME.lightText,
                    fontSize: "1.1rem",
                  }}
                >
                  {t("Login")}
                  <RouterLink
                    to="/login"
                    className="btn btn-link"
                    style={{
                      color: THEME.primary,
                      textDecoration: "underline",
                      marginLeft: "5px",
                    }}
                  >
                    {t("Login")}
                  </RouterLink>
                </p>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
);

export default ReviewComponent;
