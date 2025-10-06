import React, {
  Fragment,
  memo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const THEME = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#fafafa",
  card: "#ffffff",
  accent: "#f59e0b",
  text: "#374151",
  border: "#e5e7eb",
  lightText: "#9ca3af",
  darkText: "#111827",
  success: "#10b981",
  danger: "#ef4444",
};

// Reusable Star Rating Component
const StarRatingInput = ({
  rating,
  setRating,
  isAuthenticated,
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const stars = Array(5).fill(0);

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {stars.map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverRating || rating);

        return (
          <span
            key={index}
            style={{
              cursor: isAuthenticated && !disabled ? "pointer" : "default",
              color: isActive ? "#fbbf24" : "#e5e7eb",
              fontSize: "28px",
              transition: "all 0.2s ease",
              transform: isActive && !disabled ? "scale(1.1)" : "scale(1)",
            }}
            onClick={() => isAuthenticated && !disabled && setRating(starValue)}
            onMouseEnter={() =>
              isAuthenticated && !disabled && setHoverRating(starValue)
            }
            onMouseLeave={() =>
              isAuthenticated && !disabled && setHoverRating(0)
            }
          >
            {isActive ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
};

const ReviewComponent = memo(
  ({ itemId, isAuthenticated, currentUserId, itemTitle, itemType }) => {
    const { t } = useTranslation();

    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formMode, setFormMode] = useState("create");
    const [userReviewFetched, setUserReviewFetched] = useState(false);
    const reviewFormRef = useRef(null);

    const fetchReviews = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/getReviewsForItem?itemId=${itemId}`
        );
        setReviews(response.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    }, [itemId]);

    const fetchUserReview = useCallback(async () => {
      if (!isAuthenticated || !currentUserId || !itemId) {
        setUserReview(null);
        setRating(0);
        setComment("");
        setFormMode("create");
        setUserReviewFetched(true);
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
          setUserReview(null);
          setRating(0);
          setComment("");
          setFormMode("create");
        }
      } catch (err) {
        console.error("Error fetching user review:", err);
        setUserReview(null);
        setRating(0);
        setComment("");
        setFormMode("create");
      } finally {
        setUserReviewFetched(true);
      }
    }, [isAuthenticated, currentUserId, itemId]);

    useEffect(() => {
      if (itemId) {
        fetchReviews();
        fetchUserReview();
      }
    }, [itemId, isAuthenticated, currentUserId, fetchReviews, fetchUserReview]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      if (rating === 0) {
        setError(t("Please select rating"));
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
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert(t("Submitted successfully"));
        } else {
          await axios.put(
            `http://localhost:5000/api/reviews/${userReview._id}`,
            { rating, comment },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          alert(t("detail_page.review_updated_success"));
        }
        fetchReviews();
        fetchUserReview();

        if (formMode === "create") {
          setRating(0);
          setComment("");
        }
        reviewFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } catch (err) {
        console.error("Submission error:", err);
        setError(
          err.response?.data?.message ||
            t("detail_page.failed_to_submit_review")
        );
      } finally {
        setSubmitting(false);
      }
    };

    const handleDelete = async () => {
      if (!window.confirm(t("detail_page.confirm_delete_review"))) return;

      setSubmitting(true);
      setError(null);
      try {
        await axios.delete(
          `http://localhost:5000/api/reviews/${userReview._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        alert(t("detail_page.review_deleted_success"));
        fetchReviews();
        fetchUserReview();
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

    const handleCancelEdit = () => {
      setRating(userReview?.rating || 0);
      setComment(userReview?.comment || "");
      setFormMode("edit");
      setError(null);
    };

    const averageRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : "N/A";
    const totalReviewsCount = reviews.length;

    const formTitle =
      userReviewFetched && userReview
        ? t("Edit your Review")
        : t("Write your Review");

    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 0" }}>
        {/* Header Section */}
        <div
          style={{
            backgroundColor: "lightblue",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            color: "white",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700 }}>
              Reviews
            </h2>
            <div
              style={{
                background: "lightgray",
                backdropFilter: "blur(10px)",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "16px",
                color: "navy",
                fontWeight: 600,
              }}
            >
              {totalReviewsCount}{" "}
              {totalReviewsCount === 1 ? "Review" : "Reviews"}
            </div>
            {totalReviewsCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginLeft: "auto",
                }}
              >
                <span style={{ fontSize: "32px", fontWeight: 700 }}>
                  {averageRating}
                </span>
                <div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>out of 5</div>
                  <StarRatingInput
                    rating={Math.round(averageRating)}
                    disabled={true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Review Form Section */}
        {isAuthenticated ? (
          <div
            ref={reviewFormRef}
            style={{
              background: THEME.card,
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "24px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              border: `1px solid ${THEME.border}`,
            }}
          >
            <h3
              style={{
                color: THEME.darkText,
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              {formTitle}
            </h3>

            {error && (
              <div
                style={{
                  background: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    color: THEME.text,
                    fontWeight: 600,
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  Your Rating <span style={{ color: THEME.danger }}>*</span>
                </Form.Label>
                <StarRatingInput
                  rating={rating}
                  setRating={setRating}
                  isAuthenticated={isAuthenticated}
                  disabled={submitting}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label
                  style={{
                    color: THEME.text,
                    fontWeight: 600,
                    marginBottom: "12px",
                    display: "block",
                  }}
                >
                  Your Review <span style={{ color: THEME.danger }}>*</span>
                </Form.Label>
                <textarea
                  className="form-control"
                  style={{
                    backgroundColor: THEME.background,
                    border: `2px solid ${THEME.border}`,
                    color: THEME.text,
                    borderRadius: "12px",
                    padding: "14px",
                    minHeight: "140px",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    transition: "all 0.2s ease",
                  }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={submitting}
                  placeholder="Share your thoughts about this item..."
                  onFocus={(e) => (e.target.style.borderColor = THEME.primary)}
                  onBlur={(e) => (e.target.style.borderColor = THEME.border)}
                />
              </Form.Group>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Button
                  type="submit"
                  disabled={
                    submitting || rating === 0 || comment?.trim() === ""
                  }
                  style={{
                    background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "10px",
                    padding: "12px 32px",
                    fontSize: "15px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                    transition: "all 0.3s ease",
                    opacity:
                      submitting || rating === 0 || comment?.trim() === ""
                        ? 0.5
                        : 1,
                  }}
                >
                  {submitting
                    ? formMode === "create"
                      ? t("Submitting")
                      : t("Updating")
                    : formMode === "create"
                    ? t("Submit")
                    : t("Update")}
                </Button>

                {formMode === "edit" && (
                  <>
                    <Button
                      type="button"
                      onClick={handleDelete}
                      disabled={submitting}
                      style={{
                        background: THEME.danger,
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "10px",
                        padding: "12px 32px",
                        fontSize: "15px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                        transition: "all 0.3s ease",
                        opacity: submitting ? 0.5 : 1,
                      }}
                    >
                      {submitting ? t("Deleting") : t("Delete Review")}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={submitting}
                      style={{
                        background: "transparent",
                        color: THEME.text,
                        fontWeight: 600,
                        borderRadius: "10px",
                        padding: "12px 32px",
                        fontSize: "15px",
                        border: `2px solid ${THEME.border}`,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                  </>
                )}
              </div>
            </Form>
          </div>
        ) : (
          <div
            style={{
              background: THEME.card,
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
              border: `2px dashed ${THEME.border}`,
            }}
          >
            <p
              style={{
                color: THEME.text,
                fontSize: "16px",
                marginBottom: "16px",
              }}
            >
              Please log in to write a review
            </p>
            <RouterLink
              to="/login"
              style={{
                color: "white",
                background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                padding: "10px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-block",
              }}
            >
              {t("Login")}
            </RouterLink>
          </div>
        )}

        {/* Reviews List */}
        <div>
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: THEME.lightText,
              }}
            >
              {t("loading_reviews")}
            </div>
          ) : reviews.length === 0 ? (
            <div
              style={{
                background: THEME.card,
                borderRadius: "16px",
                padding: "48px 32px",
                textAlign: "center",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${THEME.border}`,
              }}
            >
              <div
                style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}
              >
                📝
              </div>
              <h4
                style={{
                  color: THEME.darkText,
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                No Reviews Yet
              </h4>
              <p style={{ color: THEME.lightText, fontSize: "15px" }}>
                {t("Be the first to review", { itemTitle: itemTitle })}
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {reviews.map((review) => (
                <div
                  key={review._id}
                  style={{
                    background: THEME.card,
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: `1px solid ${THEME.border}`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "12px",
                    }}
                  >
                    <img
                      src={
                        review.userId?.profilePicture ||
                        "https://www.gravatar.com/avatar/?d=mp"
                      }
                      alt={review.userId?.username || "User"}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `3px solid ${THEME.border}`,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h5
                          style={{
                            color: THEME.darkText,
                            margin: 0,
                            fontWeight: 600,
                            fontSize: "16px",
                          }}
                        >
                          {review.userId?.name || "Anonymous User"}
                        </h5>
                        {review.userId?._id === currentUserId && (
                          <span
                            style={{
                              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                              color: "white",
                              padding: "2px 10px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 600,
                            }}
                          >
                            You
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <StarRatingInput
                          rating={review.rating}
                          disabled={true}
                        />
                        <span
                          style={{ fontSize: "13px", color: THEME.lightText }}
                        >
                          {new Date(review.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      color: THEME.text,
                      lineHeight: 1.7,
                      fontSize: "15px",
                      margin: 0,
                    }}
                  >
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default ReviewComponent;
