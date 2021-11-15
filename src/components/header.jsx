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
        <div className="col-sm-4 minter-container">
          <div className='col-md-6'>
            <p className='counter-text'>Cars left in the bodyshop </p>
            <p className='counter-text'><span>{props.remainingNfts} / 4444</span></p>
            </div>
          <div className='col-md-6'>
            <div className="pic-box">
                  <img src={images[currentImage]} className="img-responsive mint-pic" alt="" />{" "}
            </div>
          </div>
        </div>
        
      </div>
    </header>
  )
}
