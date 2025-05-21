import alasql from "alasql";
export default class DocGenerationService {
    static getCollectionListFromRawData = (rawData) => {
        const data = Object.values(rawData).flatMap(item => item.lineItems);
        const result = alasql(`
            SELECT DISTINCT collectionName
            FROM ?
            WHERE collectionName != "Delivery"
        `, [data]);
        return result.map(row => row.collectionName);
    };
    static getStructuredDataForSupplierReportForSpecificCollection = (rawData, collectionName) => {
        // let suppliseReportPDFFormat = [
        //     {
        //         collectionName: '',
        //         productName: '',
        //         imageUrl: '',
        //         customisation: []
        //     }
        // ]
        const result = [];
        const productMap = new Map();
        if (rawData) {

            Object.entries(rawData).map(([key, singleOrder]) => {
                singleOrder.lineItems.map((orderLineItem) => {
                    if (orderLineItem.isBundledProduct && Array.isArray(orderLineItem.bundleProductItems)) {
                        orderLineItem.bundleProductItems.forEach(bundleOrderLineItem => {
                            this.addOrUpdateProduct(bundleOrderLineItem, productMap);
                        });
                    } else {
                        this.addOrUpdateProduct(orderLineItem, productMap);
                    }
                });
            })
            productMap.forEach((singleProduct, productName) => {
                const product = singleProduct[0];
                if (product.collectionName === collectionName) {
                    result.push({
                        collectionName: product.collectionName,
                        productName: productName,
                        imageUrl: String(product.product_image),
                        customisation: singleProduct.map(c => c.customisations).flat(),
                    });
                }
            });
        }
        return result;
    };
    static getStructuredDataForOrderReport = (rawData) => {
        let orderArray = [];
        Object.entries(rawData).map(([key, singleOrder]) => {
            if (singleOrder.checkoutSession) {
                let order = {
                    orderId: singleOrder.checkoutSession.payment_intent,
                    status: singleOrder.checkoutSession.status,
                    createdDate: singleOrder.checkoutSession.created,
                    email: singleOrder.checkoutSession.customer_details.email,
                    total: singleOrder.checkoutSession.amount_total,
                    lineItems: singleOrder.lineItems
                }
                orderArray.push(order);
            }
        })
        return orderArray;

    }
    static getStructuredDataForDPDReport = (rawData) => {
        let PDPJson=[];
        Object.entries(rawData).map(([key, singleOrder]) => {
            let PDPEntry = {}
            PDPEntry.orderID = singleOrder.checkoutSession.payment_intent;
            PDPEntry.colB = '';
            singleOrder.lineItems.map((orderLineItem) => {
              if (orderLineItem.productId === 'Delivery') {
                PDPEntry.name = singleOrder.checkoutSession.customer_details.name
                PDPEntry.addressLine1 = orderLineItem.customisations.find(item => item.key === "Address Line 1")?.value[0];
                PDPEntry.colE = '';
                PDPEntry.addressLine2 = orderLineItem.customisations.find(item => item.key === "Address Line 2")?.value;
                PDPEntry.city = orderLineItem.customisations.find(item => item.key === "City")?.value;
                PDPEntry.zipCode = orderLineItem.customisations.find(item => item.key === "Zip Code")?.value;
                PDPEntry.colI = 372;
                PDPEntry.colJ = 1;
                PDPEntry.colK = 1;
                PDPEntry.colL = "N";
                PDPEntry.colM = "O";
                PDPEntry.colN = "";
                PDPEntry.colO = "";
                PDPEntry.colP = "";
                PDPEntry.colQ = "";
                PDPEntry.colR = "";
                PDPEntry.colS = "";
                PDPEntry.colT = "";
                PDPEntry.colU = "";
                PDPEntry.colV = "";
                PDPEntry.colW = "";
                PDPEntry.fullName = singleOrder.checkoutSession.customer_details.name
                PDPEntry.phone = singleOrder.checkoutSession.customer_details.Phone;
                PDPEntry.colZ = "";
                PDPEntry.colAA = "";
                PDPEntry.colAB = "";
                PDPEntry.colAC = "7518L3";
                PDPEntry.email = singleOrder.checkoutSession.customer_details.email;
                PDPEntry.colAE = "Y";
                PDPEntry.colAF = "Y";
                PDPEntry.phoneAG = singleOrder.checkoutSession.customer_details.Phone;
                PDPJson.push(PDPEntry);
              }
            })
          })
          return PDPJson;
    }
    static getStructuredDataAddressStickers = (rawData) => {
        let formattedAddress = [];
        Object.entries(rawData).map(([key, singleOrder]) => {
            if (singleOrder.lineItems) {
                singleOrder.lineItems.map((singleLineItems)=>{
                    if(singleLineItems.productId === 'Delivery'){
                        formattedAddress.push(singleLineItems.customisations);
                    }
                })
            }
        })
        return formattedAddress;

    }
    static addOrUpdateProduct(item, productMap) {
        const productName = item.productName;
        if (!productMap.has(productName)) {
            productMap.set(productName, []);
        }
        productMap.get(productName).push(item);
    }
}
