import { memo, Fragment, Suspense, useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import HeaderDefault from "../components/partials/HeaderDefault";
import HeaderMerchandise from "../components/merchandise/partials/HeaderDefault";
import FooterDefault from "../components/partials/FooterDefault";
import MerchandiseFooter from "../components/merchandise/partials/FooterDefault";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/auth/selectors";
const FrontendLayout = memo((props) => {
  const [animationClass, setAnimationClass] = useState("animate__fadeIn");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleScroll = () => {
    if (document.documentElement.scrollTop > 250) {
      setAnimationClass("animate__fadeIn");
    } else {
      setAnimationClass("animate__fadeOut");
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Fragment>
      {/* <Loader></Loader> */}
      <main className="main-content">
        {props.HeaderMega === "true" && <HeaderDefault></HeaderDefault>}
        {props.HeaderMerchandise === "true" && (
          <HeaderMerchandise></HeaderMerchandise>
        )}
        <Suspense fallback={<Loader></Loader>}>
          <Outlet></Outlet>
        </Suspense>
      </main>
      {/* Always show the global footer */}
      <FooterDefault />
      <div
        id="back-to-top"
        style={{ display: "none" }}
        className={`animate__animated ${animationClass}`}
        onClick={scrollToTop}
      >
        <Link
          className="p-0 btn bg-primary btn-sm position-fixed top border-0 rounded-circle"
          id="top"
          to="#top"
        >
          <i className="fa-solid fa-chevron-up"></i>
        </Link>
      </div>
    </Fragment>
  );
});

FrontendLayout.displayName = "FrontendLayout";
export default FrontendLayout;
