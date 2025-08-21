import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./i18n";
// import("videojs-youtube/dist/Youtube.min.js");
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/free-mode";
import "./assets/scss/streamit.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/rtl.scss";
import "animate.css/animate.css";
import "choices.js/public/assets/styles/choices.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { store } from "./store/index";
import { Provider } from "react-redux";
import { IndexRouters } from "./router/index";
import { FilterProvider } from "./context/FilterContext.jsx";
import { loginSuccess } from "./store/auth/actions.js";
import { Buffer } from "buffer";
import ScrollToTop from "./scrolltotop.jsx";
window.Buffer = Buffer;

AOS.init();

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (user && token) {
  store.dispatch(loginSuccess(user, token));
}

const router = createBrowserRouter([...IndexRouters], {
  basename: import.meta.env.VITE_URL,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <FilterProvider>
        {/* <App> */}
        <RouterProvider router={router} /> {/* ✅ main router */}
        {/* </App> */}
        {/* <ScrollToTop /> */}
      </FilterProvider>
    </Provider>
  </React.StrictMode>
);
