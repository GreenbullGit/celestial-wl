import { useState, useEffect } from "react";

export const About = (props) => {

  const [images,setImages] = useState([
    "img/8.png",
    "img/12.png",
    "img/20.png",
  ]);
  const [currentImage,setCurrentImage] = useState(0);
  var intervalId;

  const switchImage = () => {
    if (currentImage < images.length - 1) {
      setCurrentImage(currentImage + 1);
    } else {
      setCurrentImage(0);
      }
    return currentImage;
  }

  useEffect(() => {
      window.setTimeout(switchImage, 2000)
  },[currentImage]);


  return (
    <div id="about" className="padding-top100">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-6 about-mid">
            <div className="about-text">
              <h2>About Us</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3>Why Choose Us?</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12 about-mid">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-md-6">
            {" "}
            <div className="pic-box">
              <img src={images[currentImage]} className="img-responsive mint-pic" alt="" />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
