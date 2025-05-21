import React, { useState, useEffect, useRef } from "react";
import { Magnifier } from "react-image-magnifiers";
import OwlCarousel from "../owl-carousel/owl-carousel";
import MediaLightBox from "../utils/lightBox/light-box";
import { mainSlider2 } from "../owl-carousel/data/carousel";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ProductVariantMediaViewer(props) {
    const { productVariant } = props;
    const [index, setIndex] = useState(0);
    const [isOpen, setOpenState] = useState(false);
    const mediaRef = useRef(null);

    useEffect(() => {
        setIndex(0);
    }, [window.location.pathname]);

    useEffect(() => {
        if (mediaRef.current && index >= 0) {
            mediaRef.current.$car.to(index, 300, true);
        }
    }, [index]);

    if (!productVariant) {
        return null;
    }

    const lgImages = productVariant.bundleItems ? productVariant.bundleDefaultImage.small_pictures : productVariant.small_pictures || [];

    const setIndexHandler = (mediaIndex) => {
        if (mediaIndex !== index) {
            setIndex(mediaIndex);
        }
    };

    const changeOpenState = (openState) => {
        setOpenState(openState);
    };

    const openLightBox = () => {
        setOpenState(true);
    };

    const events = {
        onTranslate: (e) => {
            if (!e?.target) return;

            const thumbsContainer = document.querySelector(".product-thumbs");
            if (thumbsContainer) {
                const activeThumb = thumbsContainer.querySelector(".product-thumb.active");
                if (activeThumb) activeThumb.classList.remove("active");

                const newActiveThumb = thumbsContainer.querySelectorAll(".product-thumb")[e.item.index];
                if (newActiveThumb) newActiveThumb.classList.add("active");
            }
        },
    };

    return (
        <>
            <div
                className="product-gallery pg-vertical media-default"
                style={{ top: "88px", minHeight: "52vh" }}
            >
                <div className="product-label-group">
                    {productVariant.stock === 0 && (
                        <label className="product-label label-out">out</label>
                    )}
                    {productVariant.is_top && (
                        <label className="product-label label-top">top</label>
                    )}
                    {productVariant.is_new && (
                        <label className="product-label label-new">new</label>
                    )}
                    {productVariant.discount && (
                        <label className="product-label label-sale">sale</label>
                    )}
                </div>

                <OwlCarousel
                    adClass="product-single-carousel owl-theme owl-nav-inner"
                    options={mainSlider2}
                    onChangeIndex={setIndexHandler}
                    ref={mediaRef}
                    events={events}
                >
                    {lgImages.map((image, index) => (
                        <div key={`${image.url}-${index}`} className="image-grey-background">
                            <LazyLoadImage
                                src={image.url}
                                alt="product-image"
                                effect="blur"
                                className="product-image large-image image-remove-background"
                            />
                        </div>
                    ))}
                </OwlCarousel>
            </div>

            <MediaLightBox
                images={lgImages}
                isOpen={isOpen}
                changeOpenState={changeOpenState}
                index={index}
                product={productVariant}
            />
        </>
    );
}
