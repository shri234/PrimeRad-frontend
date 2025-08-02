import React, { memo, Fragment, useState } from "react";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FsLightbox from "fslightbox-react";
import { useTranslation } from "react-i18next";

const FsLightBox = memo((props) => {
  const { t } = useTranslation();
  const [toggler, setToggler] = useState(false);
  
  return (
    <Fragment>
      <Col
        md="3"
        className="trailor-video  col-12 mt-lg-0 mt-4 mb-md-0 mb-1 text-lg-right"
      >
        <Link
          to="#"
          className="video-open playbtn block-images position-relative playbtn_thumbnail"
        >
          <img
            src={props.image}
            className="attachment-medium-large size-medium-large wp-post-image"
            alt=""
            loading="lazy"
          />
          <span className="content btn btn-transparant iq-button">
            <i className="fa fa-play me-2 text-white" onClick={() => setToggler(!toggler)}></i>
            <span onClick={() => setToggler(!toggler)}>{t('detail_page.trailer_link')}</span>
          </span>
        </Link>
      </Col>
      <>
        <FsLightbox
          maxYoutubeVideoDimensions={{ width: 700, height: 400 }}
          exitFullscreenOnClose={true}
          toggler={toggler}
          sources={["https://www.youtube.com/watch?v=QCGq1epI9pQ"]}
        />
      </>
    </Fragment>
  );
});
FsLightBox.displayName = "FsLightBox";
export default FsLightBox;
