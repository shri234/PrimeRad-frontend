import { memo, Fragment } from "react";
import "./OTTPage.css";

const randomImages = [
  "/assets/images/rotator-cuff.jpg",
  "/assets/images/arthritis.webp",
  "/assets/images/dislocation.png",
  "/assets/images/sprain.jpg",
  "/assets/images/tear-rasions.jpg",
  "/assets/images/faculty1.jpg",
  "/assets/images/faculty2.jpg",
  "/assets/images/pricing.jpg",
  "/assets/images/subscribe.webp",
];

function getRandomImage() {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

const Section = ({ title, items }) => (
  <div className="ott-section">
    <h2 className="ott-section-title">{title}</h2>
    <div className="ott-card-row">
      {items.map((item, idx) => (
        <div className="ott-card" key={idx}>
          <img
            src={item.thumbnail || getRandomImage()}
            alt={item.title}
            className="ott-card-thumb"
          />
          <div className="ott-card-content">
            <div className="ott-card-title">{item.title}</div>
            <div className="ott-card-desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const sampleLectures = [
  {
    title: "ACL Basics",
    description: "Intro to ACL anatomy.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Meniscus Repair",
    description: "Meniscus repair techniques.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Rotator Cuff Anatomy",
    description: "Rotator cuff muscles.",
    thumbnail: getRandomImage(),
  },
];
const sampleCases = [
  {
    title: "ACL Case 1",
    description: "ACL tear in a young athlete.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Meniscus Case 1",
    description: "Meniscus repair case.",
    thumbnail: getRandomImage(),
  },
];
const sampleLive = [
  {
    title: "ACL Live Q&A",
    description: "Live Q&A on ACL.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Meniscus Live Webinar",
    description: "Webinar on meniscus injuries.",
    thumbnail: getRandomImage(),
  },
];
const sampleTrending = [
  {
    title: "Trending: Rotator Cuff",
    description: "Popular now.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Trending: Meniscus",
    description: "Popular now.",
    thumbnail: getRandomImage(),
  },
];
const sampleRecentLectures = [
  {
    title: "Recent: ACL Imaging",
    description: "Latest lecture.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Recent: Meniscus",
    description: "Latest lecture.",
    thumbnail: getRandomImage(),
  },
];
const sampleContinueWatching = [
  {
    title: "Continue: ACL Basics",
    description: "Resume watching.",
    thumbnail: getRandomImage(),
  },
  {
    title: "Continue: Meniscus Repair",
    description: "Resume watching.",
    thumbnail: getRandomImage(),
  },
];

const OTTPage = memo(() => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div
        style={{
          width: "250px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* NavCategories can stay if needed */}
      </div>
      <div
        style={{
          flex: 1,
          overflowX: "hidden",
          backgroundColor: "#f5f6fa",
          padding: 24,
        }}
      >
        <Section title="Continue Watching" items={sampleContinueWatching} />
        <Section title="Recommended Lectures" items={sampleLectures} />
        <Section title="Recommended Cases" items={sampleCases} />
        <Section title="Recommended Live Programs" items={sampleLive} />
        <Section title="Trending Now" items={sampleTrending} />
        <Section
          title="Recently Uploaded Lectures"
          items={sampleRecentLectures}
        />
      </div>
    </div>
  );
});

OTTPage.displayName = "OTTPage";
export default OTTPage;
