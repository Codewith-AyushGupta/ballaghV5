import alasql from "alasql";
export default class StoreDatabaseService {
    constructor(storeDatabase) {
        this.storeDatabase = storeDatabase
    }
    getStoreByStoreSlug = (storeSlug) => {
        const today = new Date().toISOString().split('T')[0];
        const query = `
        SELECT * FROM ? 
        WHERE LOWER(storeSlug) LIKE LOWER('%' + ? + '%') 
        AND storeOpenDate <= ? 
        AND storeCloseDate >= ?
    `;
        let matchStore = alasql(query, [this.storeDatabase, storeSlug, today, today]);
        return matchStore.length > 0 ? matchStore[0] : [];

    };
    getOpenStore = () => {
        const today = new Date().toISOString().split('T')[0];
        const query = `
        SELECT * FROM ? 
        WHERE storeOpenDate <= ? 
        AND storeCloseDate >= ?
    `;
        let matchStore = alasql(query, [this.storeDatabase, today, today]);
        return matchStore.length > 0 ? matchStore : [];
    };
    getDefaultDeliveryOptionsVariant = (storeSlug) => {
        let openStores = this.getOpenStore();
        if (openStores) {
            let matchingStore = openStores.find(store => store.storeSlug === storeSlug);
            if (matchingStore) {
                const { deliveryOption } = matchingStore;
                if (deliveryOption && deliveryOption.productVariants) {
                    return deliveryOption.productVariants.find(variant => variant.isDefaultVariant) || {};
                }
            }
        }
        return {};
    };
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
    getParticularStoreVariantBasedOnMatrix = (storeSlug, variantMatrixArray) => {

        let openStores = this.getOpenStore();
        if (openStores) {
            let matchingStore = openStores.find(store => store.storeSlug === storeSlug);
            if (matchingStore) {
                const { deliveryOption } = matchingStore;
                if (deliveryOption && deliveryOption.productVariants) {
                    return deliveryOption.productVariants.find(variant =>
                        variantMatrixArray.every(inputMatrix =>
                            variant.variantMatrix.some(matrix =>
                                matrix.id === inputMatrix.id && matrix.value === inputMatrix.value
                            )
                        )
                    ) || {};
                }
            }
        }
        return {};
    };
    removeDuplicatesFromStoreDeliveryOptions = (storeList) => {

        let deliveryOptions = [];
        if (storeList.length > 0) {
            storeList.forEach((singleStore) => {
                const StoreDeliveryOptions = singleStore.deliveryOption.variantsOptionsSelectorForm[0].options;
                deliveryOptions = deliveryOptions.concat(StoreDeliveryOptions);
            });
        }
        deliveryOptions = [...new Set(deliveryOptions)];
        storeList[0].deliveryOption.variantsOptionsSelectorForm[0].options = deliveryOptions;
        return { ...storeList[0] };
    }
    getStoreSlugByDeliveryOptionsArray = (storeList) => {
        let storeSlugByDeliveryOptions = {};
        if (storeList.length > 0) {
            storeList.map((singleStore) => {
                storeSlugByDeliveryOptions[singleStore.storeSlug] = singleStore.deliveryOption.variantsOptionsSelectorForm[0].options
            })
        }
        return storeSlugByDeliveryOptions;
    }
    getStoreSlugFromDeliveryOption = (selectedDeliveryOption,storeSlugByDeliveryOptionsArray) => {
        for (const [key, value] of Object.entries(storeSlugByDeliveryOptionsArray)) {
            if (value.includes(selectedDeliveryOption)) {
                return key;
            }
        }
        return '';
    };
    searchStoreBySearchKey = (searchKey) => {
        const result = alasql('SELECT * FROM ? WHERE storeName LIKE ?', [this.storeDatabase, `%${searchKey}%`]);
        return result||[]
    }
}
