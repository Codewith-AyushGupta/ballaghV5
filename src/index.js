import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './components/store';
import Spinner from './components/utils/spinner/full-page-spinner';
////////////////  Import CSS  ///////////////////////////////////////
import './index.css';
import './public/sass/style.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-image-lightbox/style.css';
import './public/vendor/riode-fonts/riode-fonts.css';
/////////////////////////////////////////////////////////////////////

////////////////  Import Components  ///////////////////////////////
import Layout from './components/layout';
import Home from './components/home/home';
import ProductHome from './components/product-view/product-home';
import ProductVariantView from './components/product-variant/product-variant-view';
import Cart from './components/cart/cart';
import Error404 from './pages/Error404';
import Checkout from './components/checkout/checkout';
import ContactUs from './components/contact-us/contact-us';
import Order from './components/order/order';
import { ApiDataProvider } from './service/api-data-provider';
import CollectionAll from './components/collection-view/collection-all'
import StoreAll from './components/store-view/store-all';
import ProductGridView from './components/product-view/product-grid-view';
import ProductViewForCollectionOrStore from './components/product-view/product-view';
import DynamicPageGenerator from './pages/dynamic-page-generator';
import ClassicBlog from './components/blogs/classic';
import BlogPost from './components/blogs/single-post/blog-post';
import ComingSoon from './pages/coming-soon';
import DocUploader from './pages/doc-uploader';
import StoreDetailView from './components/store-view/store-product-card-detail-view';
import ProductEntryPage from './components/smart-product/product-entry-page';
import AdminAfterGettingPreSignedURL from './components/admin/admin-after-getting-presignedURL';
import GetMagicLinkForReport from './components/admin/get-magic-link-for-reports';
import Admin from './components/admin/admin';
import GetMagicLinkForStore from './components/admin/get-magic-link-for-store';
import GetMagicLinkForProduct from './components/admin/get-magic-link-for-product';
import UploadStoreData from './components/admin/upload-store-data';
import UploadProductData from './components/admin/upload-product-data';
import SearchResultHome from './components/search/search-result-home';
import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
// Component mapping
const componentMap = {
  Home,
  DynamicPageGenerator,
  Checkout,
  Cart,
  ContactUs,
  Order,
  Error404,
  ProductViewForCollectionOrStore,
  ProductEntryPage,
  CollectionAll,
  StoreAll,
  ClassicBlog,
  BlogPost,
  ComingSoon,
  DocUploader,
  GetMagicLinkForReport,
  GetMagicLinkForStore,
  GetMagicLinkForProduct,
  UploadStoreData,
  UploadProductData,
  Admin,
  AdminAfterGettingPreSignedURL,
  SearchResultHome
};

const App = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_S3_BUCKET}/routes-metadata.json`)
      .then((response) => response.json())
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching routes:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div>Error loading routes!</div>;

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Provider store={store}>
        <ApiDataProvider>
          {/* <HashRouter> */}
          <BrowserRouter>
            {/* <Router> */}
              <Routes>
                <Route path='/' element={<Layout children={<Home />} />} />
                {routes.map(({ path, component }, index) => {
                  const Component = componentMap[component] || Error404;
                  return <Route key={index} path={path} element={<Layout children={<Component />} />} />;
                })}
              </Routes>
            {/* </Router> */}
          </BrowserRouter>
          {/* </HashRouter> */}
        </ApiDataProvider>
      </Provider>
    </QueryClientProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

reportWebVitals();
