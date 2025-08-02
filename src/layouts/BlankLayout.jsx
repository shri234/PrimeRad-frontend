import { Suspense } from "react";

// reacr-router
import { Outlet } from "react-router-dom";

import Loader from "../components/Loader";

const BlankLayout = () => {
  return (
    <Suspense fallback={<Loader></Loader>}>
      <Outlet></Outlet>
    </Suspense>
  );
};
export default BlankLayout;
