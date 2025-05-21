import ALink from "../utils/alink";
export default function ShopBanner( props ) {
    const { subTitle = '', title = "", current = ""  , bannerImageUrl='' ,backgroundColor='' } = props;
    return (
        <div className="page-header" style={ { backgroundImage: `url(${bannerImageUrl}`, backgroundColor: `${backgroundColor}` } }>
            {
                subTitle ? <h3 className="page-subtitle text-dark">{ subTitle }</h3> : ''
            }
            {
                title ? <h1 className="page-title text-light">{ title }</h1> : ''
            }
        </div>
    )
}