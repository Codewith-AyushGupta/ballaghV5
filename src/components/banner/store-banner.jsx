export default function StoreBanner(props) {
    const { store } = props;
    return (

        <div className="page-header" style={{ backgroundImage: `url(${store.storeBannerImageUrl}`, backgroundColor: `${store.storeBannerBackgroundColor}` }}>
            <img
                src={store.storeLogo}
                alt=""
                className="mb-2 image-remove-background image-grey-background"
                style={{ height: '80px', width: '80px', objectFit: 'contain' }}
            />
            {store.storeName && (
                <h3
                    className="page-subtitle"
                    style={{
                        color: store.storeNameColor,
                        WebkitTextFillColor: store.storeNameColor,
                        textShadow: store.storeNameColor,
                    }}
                >
                    {store.storeName}
                </h3>
            )}
            <p style={{color: store.storeThemeColor || 'black'}}>{store.storeMessage}</p>
            <hr className="container"
                style={{
                    backgroundColor: store.storeThemeColor || 'black',
                    height: '2px',
                    border: `1px solid ${store.storeThemeColor}`,
                }}
            />
        </div>
    )
}