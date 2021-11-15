import { useState, useEffect } from "react";

export const Header = (props) => {
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
    <header id='header'>
      <div className='col-md-12 intro'>
        <div className="col-sm-4 mint-box">
          <div className='col-md-6 counter-container'>
            <p className='counter-text'>Cars left in the bodyshop </p>
            <p className='counter-text'>{props.remainingNfts} / 4444</p>
            </div>
          <div className='col-md-6 pic-container'>
            <div className="pic-box">
                  <img src={images[currentImage]} className="img-responsive mint-pic" alt="" />{" "}
            </div>
          </div>
        </div>
        <img src="img/intro-bg2.png" className="main-logo" alt="" />
        
      </div>
    </header>
  )
}
