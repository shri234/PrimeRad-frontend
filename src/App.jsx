import "./app.css";
import FooterDefault from "./components/partials/FooterDefault";

function App({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
      <FooterDefault />
    </div>
  );
}

export default App;
