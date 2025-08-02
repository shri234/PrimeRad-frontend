import { Fragment, memo } from "react";
import "./newloader.css";

const Loader = memo(() => {
  return (
    <Fragment>
      <div className="loader simple-loader animate__animated">
        <div className="loader-body">
          <div className="new-loader"></div>
        </div>
      </div>
    </Fragment>
  );
});

Loader.displayName = "Loader";
export default Loader;
