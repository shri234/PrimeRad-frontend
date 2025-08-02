import { lazy } from "react";
import { Navigate } from "react-router-dom";
// layout
import FrontendLayout from "../layouts/FrontendLayout";
import BlankLayout from "../layouts/BlankLayout";
import PrivateRoute from "./PrivateRoute";
import TrendingViewAll from "../views/TrendingViewAll";
import RecentItemsViewAll from "../views/RecentItemsViewAll";
import RecommendedCasesViewAll from "../views/RecommendedCasesViewAll";
import UpcomingLiveProgramsViewAll from "../views/UpcomingLiveProgramsViewAll";
import RecommendedLecturesViewAll from "../views/RecommendedLecturesViewAll";

// pages
const OTTPage = lazy(() => import("../views/MainPages/OTTPage"));

// tv-shows pages
const AtlasView = lazy(() => import("../views/ListViews/AtlasView"));
const MySpacePage = lazy(() => import("../views/MainPages/MySpacePage"));
const SubmoduleView = lazy(() =>
  import("../views/ListViews/SubModules/SubModules")
);
const ScoreBoardView = lazy(() => import("../views/MainPages/ScoreBoard"));

const MovieDetail = lazy(() => import("../views/Movies/DetailPage"));
const AssessmentDetail = lazy(() => import("../views/Movies/Assessment"));
const AssessmentPage = lazy(() => import("../views/Assessment/AssessmentPage"));

// cast pages
const CastList = lazy(() => import("../views/Cast/ListPage"));
const DetailPage = lazy(() => import("../views/Cast/DetailPage"));

// extra pages
const AboutPage = lazy(() => import("../views/ExtraPages/AboutPage"));
const ContactPage = lazy(() => import("../views/ExtraPages/ContactPage"));
const FAQPage = lazy(() => import("../views/ExtraPages/FAQPage"));
const PrivacyPolicy = lazy(() => import("../views/ExtraPages/PrivacyPolicy"));
const TermsofUse = lazy(() => import("../views/ExtraPages/TermsofUse"));
const PricingPage = lazy(() => import("../views/PricingPage"));
const ErrorPage1 = lazy(() => import("../views/ExtraPages/ErrorPage1"));
const ErrorPage2 = lazy(() => import("../views/ExtraPages/ErrorPage2"));

//login pages
const LoginPage = lazy(() => import("../views/AuthPages/LoginPage"));
const SignUpPage = lazy(() => import("../views/AuthPages/SignupPage"));
const LostPassword = lazy(() => import("../views/AuthPages/LostPassword"));

// merchandise pages
const IndexPage = lazy(() => import("../views/MerchandisePages/IndexPage"));
const CartPage = lazy(() => import("../views/MerchandisePages/CartPage"));
const CheckOutPage = lazy(() =>
  import("../views/MerchandisePages/CheckoutPage")
);

const MyAccount = lazy(() => import("../views/MerchandisePages/my-account"));
const PaymentPage = lazy(() => import("../views/MerchandisePages/PaymentPage"));

// view all page
const ViewAll = lazy(() => import("../views/ViewAll"));
const CommingSoonPage = lazy(() =>
  import("../views/ExtraPages/CommingSoonPage")
);
const HomePage = lazy(() => import("../views/MainPages/IndexPage"));
const MainPage = lazy(() => import("../views/MainPages/MainPage"));
const RestrictedPage = lazy(() => import("../views/Movies/RestictedPage"));
const CaseViewerPage = lazy(() => import("../views/MainPages/CaseViewerPage"));
const LivePage = lazy(() => import("../views/MainPages/LivePage"));

export const LandingpageRouter = [
  {
    path: "/",
    element: <FrontendLayout HeaderMega="true" FooterCompact="true" />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" replace />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/main-page",
        element: <MainPage />,
      },
      {
        path: "/movies-detail",
        element: (
          // <PrivateRoute>
          <MovieDetail />
          // </PrivateRoute>
        ),
      },
      {
        path: "/scoreboard",
        element: <ScoreBoardView />,
      },
      {
        path: "/assessment",
        element: <AssessmentDetail />,
      },
      {
        path: "/assessment/:moduleName",
        element: <AssessmentPage />,
      },
      {
        path: "/assessment/:moduleName/practice",
        element: <AssessmentPage />,
      },
      {
        path: "/restricted-content",
        element: <RestrictedPage />,
      },
      {
        path: "/faculty",
        element: <CastList />,
      },
      {
        path: "/faculty-detail",
        element: <DetailPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/about-us",
        element: <AboutPage />,
      },
      {
        path: "/contact-us",
        element: <ContactPage />,
      },
      {
        path: "/PrivacyPolicy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-of-use",
        element: <TermsofUse />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/view-all",
        element: <ViewAll />,
      },
      {
        path: "/trending-view-all",
        element: <TrendingViewAll />,
      },
      {
        path: "/recent-items-view-all",
        element: <RecentItemsViewAll />,
      },
      {
        path: "/recommended-cases-view-all",
        element: <RecommendedCasesViewAll />,
      },
      {
        path: "/upcoming-live-programs-view-all",
        element: <UpcomingLiveProgramsViewAll />,
      },
      {
        path: "/recommended-lectures-view-all",
        element: <RecommendedLecturesViewAll />,
      },

      {
        path: "/atlas",
        element: <AtlasView />,
      },
      // {
      //   path: "/atlas/submodule-view",
      //   element: <SubmoduleView />,
      // },
      {
        path: "/myspace",
        element: <MySpacePage />,
      },
      {
        path: "/atlas/:moduleName",
        element: <SubmoduleView />,
      },
      {
        path: "/case/:caseId",
        element: <CaseViewerPage />,
      },
      {
        path: "/payment",
        element: <PaymentPage />,
      },
      {
        path: "/live/:caseId",
        element: <LivePage />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <FrontendLayout HeaderMerchandise="true" FooterMerchandise="true" />
    ),
    children: [
      {
        path: "/merchandise-store",
        element: <IndexPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: <CheckOutPage />,
      },
      {
        path: "/account",
        element: <MyAccount />,
      },
    ],
  },
  {
    path: "/cart",
    element: <BlankLayout />,
    children: [{ path: "", element: <CartPage /> }],
  },
  {
    path: "/payment",
    element: <BlankLayout />,
    children: [{ path: "", element: <PaymentPage /> }],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        path: "/coming-soon",
        element: <CommingSoonPage />,
      },
      {
        path: "/error-page-one",
        element: <ErrorPage1 />,
      },
      {
        path: "/error-page-two",
        element: <ErrorPage2 />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <SignUpPage />,
      },
      {
        path: "/lost-password",
        element: <LostPassword />,
      },
    ],
  },
];
