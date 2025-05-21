import alasql from "alasql";
export default class ProductDatabaseService {
  constructor(productDatabase) {
    this.productDatabase = productDatabase
  }
  getProductByProductSlug = (productSlug) => {
    const today = new Date().toISOString().split('T')[0];
    const query = `SELECT * FROM ? WHERE LOWER(slug) LIKE LOWER('%' + ? + '%')
    AND startDate <= ? 
    AND endDate >= ?`;
    let matchProduct = alasql(query, [this.productDatabase, productSlug,today,today]);
    return matchProduct[0];
  };
  getDefaultProductVariant = (productSlug) => {
    let matchProduct = this.getProductByProductSlug(productSlug)
    let defaultVariant;
    if (matchProduct && !matchProduct.bundleItems) {
      matchProduct.productVariants.map((singleVariant) => {
        if (singleVariant.isDefaultVariant) {
          defaultVariant = { ...singleVariant };
        }
      })
      return defaultVariant;
    }
    return matchProduct;
  };
  getProductVariantBasedOnFilters = (productSlug, formFields) => {
    let matchProduct = this.getProductByProductSlug(productSlug)
    if (matchProduct) {
      let matchingVariant
      matchProduct.productVariants.find((singleVariant) => {
        let isVariantMatch = true;
        if (singleVariant.isDefaultVariant) {
          matchingVariant = { ...singleVariant }
        }
        if (JSON.stringify(singleVariant.variantMatrix) === JSON.stringify(formFields)) {
          matchingVariant = { ...singleVariant };
        }
      });
      if (matchingVariant) {
        return matchingVariant;
      }
    }
    return null;
  }
  createVariantMatrixFromSelectorForm = (formElement) => {
    const formdata = new FormData(formElement);
    const formEntries = Object.fromEntries(formdata.entries())
    let variantMatrix = []
    Object.entries(formEntries).map(([key, value]) => {
      variantMatrix.push({
        value: value,
        id: key
      })
    })
    return variantMatrix
  }
  getProductsByStoreSlug = (storeSlug) => {
    const today = new Date().toISOString().split('T')[0];
    const filteredProducts = this.productDatabase.filter(product =>
      product.storeTag.includes(storeSlug) &&
      product.startDate <= today &&
      product.endDate >= today
    );
    const sortedProducts = alasql(`SELECT * FROM ? ORDER BY \`productOrder\` ASC`, [filteredProducts]);
    return sortedProducts;
  };

  getDefaultProductsVariantArrayByStoreSlug = (storeSlug) => {

    let productsArray = this.getProductsByStoreSlug(storeSlug);
    let defaultProductArray = [];
    if (productsArray) {
      productsArray.map((singleProduct) => {
        let response = this.getDefaultProductVariant(singleProduct.slug);
        if (response) {
          defaultProductArray.push(response)
        }
      })
    }
    return defaultProductArray;
  };
  static getProductsByCollectionSlug = (collectionSlug, productDatabase) => {
    const queryString = `SELECT * FROM ? WHERE collectionSlug = '${collectionSlug}'`;
    const alasqlResponse = alasql(queryString, [productDatabase, collectionSlug]);
    return alasqlResponse[0].products;
  };
  static getCollectionBannerImage = (collectionSlug, productDatabase) => {
    const queryString = `SELECT CollectionBannerImage FROM ? WHERE collectionSlug = '${collectionSlug}'`;
    const alasqlResponse = alasql(queryString, [productDatabase, collectionSlug]);
    return alasqlResponse[0].CollectionBannerImage;
  };
  static getFlatCollectionDatabase = (collectionDatabase) => {
    const flattenedData = collectionDatabase.flatMap((collection) =>
      collection.products
        ? collection.products.map((product) => ({
          ...product,
          collectionName: collection.collectionName,
          collectionSlug: collection.collectionSlug,
          bannerImage: collection.bannerImage,
        }))
        : []
    );
    return flattenedData;
  };
  static getDeliveryOptions = (cartList, productDatabase) => {
    const collectionSlugs = alasql('SELECT DISTINCT collection->collectionSlug AS slug FROM ?', [cartList]).map(item => item.slug);
    if (collectionSlugs.length > 0) {
      const inClause = collectionSlugs.map(slug => `'${slug}'`).join(', ');
      const result = alasql(`SELECT deliveryOptions FROM ? WHERE collectionSlug IN (${inClause})`, [productDatabase]);
      const combinedDeliveryOptions = result.flatMap(item => item.deliveryOption);
      return combinedDeliveryOptions.length > 0 ? combinedDeliveryOptions : [];
    }
    return [];
  }
}
