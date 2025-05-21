import React, { useState, useEffect } from "react";
import { Magnifier } from "react-image-magnifiers";
import ALink from "../alink";
import OwlCarousel from "../../owl-carousel/owl-carousel";
import ThumbOne from "..//thumb/ThumbOne";
import ThumbTwo from "..//thumb/ThumbTwo";
import MediaLightBox from "../lightBox/light-box";
import { mainSlider3, mainSlider2 } from "../../owl-carousel/data/carousel";

export default function MediaOne(props) {
  var { product } = props;
  const [index, setIndex] = useState(0);
  const [isOpen, setOpenState] = useState(false);
  const [mediaRef, setMediaRef] = useState("null");
  product = product[0];

  let lgImages = product.small_pictures;
  useEffect(() => {
    setIndex(0);
  }, [window.location.pathname]);

  useEffect(() => {
    if (mediaRef !== "null" && mediaRef.current !== "null" && index >= 0) {
      mediaRef.current.$car.to(index, 300, true);
    }
  }, [index]);

  const setIndexHandler = (mediaIndex) => {
    if (mediaIndex !== index) {
      setIndex(mediaIndex);
    }
  };

  const changeRefHandler = (carRef) => {
    if (carRef.current !== undefined) {
      setMediaRef(carRef);
    }
  };

  const changeOpenState = (openState) => {
    setOpenState(openState);
  };

  const openLightBox = () => {
    setOpenState(true);
  };

  let events = {
    onTranslate: function (e) {
      if (!e.target) return;
      if (document.querySelector(".product-thumbs")) {
        document
          .querySelector(".product-thumbs")
          .querySelector(".product-thumb.active")
          .classList.remove("active");
        document
          .querySelector(".product-thumbs")
          .querySelectorAll(".product-thumb")
          [e.item.index].classList.add("active");
      }
    },
  };

  return (
    <>
      <div
        className="product-gallery pg-vertical media-default"
        style={{ top: "88px" }}
      >
        <div className="product-label-group">
          {product.stock === 0 ? (
            <label className="product-label label-out">out</label>
          ) : (
            ""
          )}

          {product.is_top ? (
            <label className="product-label label-top">top</label>
          ) : (
            ""
          )}

          {product.is_new ? (
            <label className="product-label label-new">new</label>
          ) : (
            ""
          )}

          {product.discount ? (
            <label className="product-label label-sale">sale</label>
          ) : (
            ""
          )}
        </div>

        <OwlCarousel
          adClass="product-single-carousel owl-theme owl-nav-inner"
          options={mainSlider2}
          onChangeIndex={setIndexHandler}
          onChangeRef={changeRefHandler}
          events={events}
        >
          {lgImages.map((image, index) => (
            <div key={image + "-" + index}>
              <Magnifier
                imageSrc={`${image.url}`}
                // imageAlt={image.url}
                dragToMove={false}
                touchActivation="none"
                mouseActivation="none"
                cursorStyleActive="grab"
                cursorStyle="grabbing"
                className="product-image large-image"
              />
            </div>
          ))}
        </OwlCarousel>

        {/* <ALink href="#" className="product-image-full" onClick={openLightBox}>
          <i className="d-icon-zoom"></i>
        </ALink> */}

        {/* <ThumbOne
          product={product}
          index={index}
          onChangeIndex={setIndexHandler}
        /> */}

        {/* <ThumbTwo
          thumbs={lgImages}
          index={index}
          onChangeIndex={setIndexHandler}
        /> */}
      </div>

      <MediaLightBox
        images={lgImages}
        isOpen={isOpen}
        changeOpenState={changeOpenState}
        index={index}
        product={product}
      />
    </>
  );
}
