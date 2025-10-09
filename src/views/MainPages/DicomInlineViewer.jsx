import React, { useEffect, useRef, useState } from "react";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";

export default function DicomViewer() {
  const viewerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const element = viewerRef.current;
      if (!isMounted || !element) return;

      // Link dependencies
      cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

      cornerstoneWADOImageLoader.webWorkerManager.initialize({
        maxWebWorkers: 0,
      });

      try {
        if (!cornerstone.getEnabledElement(element)) {
          cornerstone.enable(element);
        }
      } catch (err) {
        console.warn("Already enabled or invalid element", err);
        return;
      }

      const imageId =
        "wadouri:https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/examples/images/CTImage.dcm";

      try {
        const image = await cornerstone.loadAndCacheImage(imageId);
        if (isMounted) {
          cornerstone.displayImage(element, image);
        }
      } catch (err) {
        console.error("Error loading DICOM:", err);
      }
    };

    // Wait for DOM + Vite hydration
    const timer = setTimeout(init, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      const element = viewerRef.current;
      if (element) {
        try {
          cornerstone.disable(element);
        } catch {}
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const element = viewerRef.current;
    if (!element) return;

    // Link libraries
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

    cornerstoneWADOImageLoader.webWorkerManager.initialize({
      maxWebWorkers: 0,
    });

    try {
      // ✅ Check if element is already enabled
      if (!cornerstone.getEnabledElement(element)) {
        cornerstone.enable(element);
      }
    } catch (err) {
      console.warn("Cornerstone already enabled or mount issue:", err);
      return;
    }

    const imageId =
      "wadouri:https://raw.githubusercontent.com/cornerstonejs/cornerstoneWADOImageLoader/master/examples/images/CTImage.dcm";

    cornerstone
      .loadAndCacheImage(imageId)
      .then((image) => {
        cornerstone.displayImage(element, image);

        cornerstoneTools.init();
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.WwwcTool);

        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });
      })
      .catch((err) => {
        console.error("❌ Error loading DICOM image:", err);
      });

    return () => {
      try {
        cornerstone.disable(element);
      } catch (err) {
        console.warn("Cleanup skipped:", err);
      }
    };
  }, [isReady]);

  return (
    <div
      ref={viewerRef}
      id="dicom-viewer"
      style={{
        width: "100%",
        aspectRatio: "16/9",
        backgroundColor: "black",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {!isReady && (
        <p
          style={{
            color: "white",
            textAlign: "center",
            marginTop: "20%",
            fontSize: "1.1rem",
          }}
        >
          Initializing DICOM viewer...
        </p>
      )}
    </div>
  );
}
