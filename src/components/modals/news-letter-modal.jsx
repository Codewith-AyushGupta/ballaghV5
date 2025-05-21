import { useState, useEffect } from "react";
import Modal from "react-modal";
import Cookie from "js-cookie";
const modalStyles = {
    content: {
        position: "relative"
    },
    overlay: {
        background: 'rgba(0,0,0,.4)',
        overflowX: 'hidden',
        overflowY: 'auto',
        display: 'flex'
    }
};

export default function NewsletterModal(props) {
    const [modalState, setModalState] = useState(false);
    const [noMore, setNoMore] = useState(false);
    useEffect(() => {
        let timer;
        Cookie.get("hideNewsletter") || (timer = setTimeout(() => {
            setModalState(true);
        }, 2000));

        return () => {
            timer && clearTimeout(timer);
        };
    }, []);

    function closeModal() {
        document.querySelector(".ReactModal__Overlay.newsletter-modal-overlay").classList.add('removed');
        document.querySelector(".newsletter-popup.ReactModal__Content").classList.remove("ReactModal__Content--after-open");

        setTimeout(() => {
            setModalState(false);
            noMore && Cookie.set("hideNewsletter", 'true', { expires: 7, path: window.location.pathname });
        }, 250);
    }

    function handleChange(event) {
        setNoMore(event.target.checked);
    }
    return (
        <Modal
            isOpen={modalState}
            style={modalStyles}
            onRequestClose={closeModal}
            shouldReturnFocusAfterClose={false}
            overlayClassName="newsletter-modal-overlay"
            className="newsletter-popup bg-img"
        >
            <div className="newsletter-popup" id="newsletter-popup" style={{ backgroundImage: `url(${props.image.url})` }}>
                <div className="newsletter-content">
                    <h4 className="text-uppercase text-dark">{props.smallBoldHeading}</h4>
                    <h2 className="font-weight-semi-bold">{props.mainHeading.lightWeightFont}<span>{props.mainHeading.boldWeight}</span></h2>
                    <p className="text-grey">{props.belowHeadingParagraph}</p>
                    {
                        props.isInputFieldVisible ?
                            <form action="#" method="get" className="input-wrapper input-wrapper-inline input-wrapper-round">
                                <input type={props.formMetaData.inputFieldField.type} className="form-control email row" name={props.formMetaData.inputFieldField.name} id={props.formMetaData.inputFieldField.id} placeholder={props.formMetaData.inputFieldField.showPlaceHolder ? props.formMetaData.inputFieldField.placeholder : ''} required={props.formMetaData.inputFieldField.isRequired} aria-label="newsletter" />
                                <br /><button className="btn btn-dark" type={props.formMetaData.button.type}>{props.formMetaData.button.label}</button>
                            </form>
                            : null
                    }
                    <div className="form-checkbox justify-content-center">
                        <input type="checkbox" value={noMore} className="custom-checkbox" id="hide-newsletter-popup" onChange={handleChange} name="hide-newsletter-popup" required />
                        <label htmlFor="hide-newsletter-popup">{props.bottomRightSection.text}</label>
                    </div>
                </div>
                <button title="Close (Esc)" type="button" className="mfp-close" onClick={closeModal}><span>×</span></button>
            </div>
        </Modal>
    );
}
