import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "./Slide.css";
import { getAllSlide } from 'actions/services/SlideServices'
import DanhMucSp from "components/Header/DanhMucSp";
import Carousel from "Carousel/Carousel";

function PrevButton({ onClick }) {
  return (
    <button onClick={onClick} className="slick-prev">
      <i className="fas fa-chevron-left"></i>
    </button>
  );
}
function NextButton({ onClick }) {
  return (
    <button onClick={onClick} className="slick-next">
      <i className="fas fa-chevron-right"></i>
    </button>
  );
}
export default function Slide() {

  const [slides, setSlides] = useState([]);

  const getData = () => {
    getAllSlide()
      .then(res => setSlides(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getData();
  }, [])
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  // const settings = {
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   prevArrow: <PrevButton />,
  //   nextArrow: <NextButton />,
  // };

  return (
    <div>
      <div className="">
        {/* <div  className="col  c-2 mt-20" style={{marginTop:"150px"}}><DanhMucSp/></div> */}

        {slides.map((slide) => {
          return (
            <Slider {...settings}>
              <img
              style={{width: "100%", height: "700px"}}
                // style={{ marginLeft: "-352px", maxWidth: "none" }}
                className="silder_img"
                src={`${slide.image}`}
                alt=""
              />
            </Slider>
            // <section className="" key={slide.id} >

            // </section>
          );
        })}
      </div>
    </div>
  );
}
