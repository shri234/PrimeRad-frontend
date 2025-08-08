import React, { memo, Fragment, useState } from "react";

//components
import SectionSlider from "../slider/SectionSlider";
import TopTenCard from "../../components/cards/TopTenCard";

//function
import { generateImgPath } from "../../StaticData/data";

// the hook
import { useTranslation } from "react-i18next";

const TopTenMoviesToWatch = memo(() => {
  const { t } = useTranslation();
  const [topTen] = useState([
    {
      image: generateImgPath("/assets/images/top-ten-number/01.jpg"),
      count: 1,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/02.jpg"),
      count: 2,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/03.jpg"),
      count: 3,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/04.jpg"),
      count: 4,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/05.jpg"),
      count: 5,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/01.jpg"),
      count: 6,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/02.jpg"),
      count: 7,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/04.jpg"),
      count: 8,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/06.jpg"),
      count: 9,
    },
    {
      image: generateImgPath("/assets/images/top-ten-number/10.webp"),
      count: 10,
    },
  ]);

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to top, lightgray, white)",
        padding: "10px",
      }}
    >
      <SectionSlider
        title={t("ott_home.top_ten_movies")}
        list={topTen}
        className="top-ten-block"
      >
        {(data) => (
          <TopTenCard
            imagePath={data.image}
            countValue={data.count}
            link="/lecture-detail"
          />
        )}
      </SectionSlider>
    </div>
  );
});

TopTenMoviesToWatch.displayName = "TopTenMoviesToWatch";
export default TopTenMoviesToWatch;
