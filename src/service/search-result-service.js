import alasql from "alasql";
export default class SearchResultService {
    constructor(productDatabase,storeDatabase) {
        this.storeDatabase = storeDatabase
        this.productDatabase = productDatabase
        this.todayDate = new Date().toISOString().split('T')[0];
    }
    getProductByMatchingKey = (key)=>{
        let keyLower = key.toLowerCase();
        let productResponse =[]        
        this.productDatabase.forEach((product) => {
            if (
                product?.name?.toLowerCase().includes(keyLower) ||
                product?.productSlug?.toLowerCase().includes(keyLower) ||
                product?.collectionTag?.toLowerCase().includes(keyLower) ||
                product?.vendorTag?.toLowerCase().includes(keyLower) ||
                product?.slug?.toLowerCase().includes(keyLower) ||
                (product.storeTag && product.storeTag.some(tag => tag.toLowerCase().includes(keyLower)))
            ) {
                let matchingTags = product.storeTag 
                    ? product.storeTag.filter(tag => tag.toLowerCase().includes(keyLower)) 
                    : [];
        
                matchingTags.forEach((singleStoreTag) => {
                    productResponse.push({ ...product, storeTag: singleStoreTag });
                });
        
                if (matchingTags.length === 0) {
                    productResponse.push({ ...product });
                }
            }
        });
        

        return productResponse;
    }
    getStoreByMatchingKey = (key)=>{
        let storeResponse = alasql("SELECT * FROM ? WHERE storeName LIKE ? OR storeMessage LIKE ? OR storeSlug LIKE ? AND storeOpenDate <= ? AND storeCloseDate >= ?", [this.storeDatabase, `%${key}%`, `%${key}%`, `%${key}%`, this.todayDate,this.todayDate]);
        return storeResponse;
    }
}
