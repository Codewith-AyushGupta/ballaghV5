import React, { memo, useEffect, useState } from "react";
function ProductVariantSearch(props) {
    const { product, setProductVariant, formId } = props;
    const [defaultProductVariant, setDefaultProductVariant] = useState(null);
    useEffect(() => {
        loadDefaultProductVariant();
        if (defaultProductVariant) {
            const formElement = document.getElementById(formId);
            if (formElement) {
                product.variantsOptionsSelectorForm.forEach((singleField) => {
                    const findValueById = (variantMatrix, id) => variantMatrix.find((item) => item.id === id)?.value || "";
                    const defaultValue = findValueById(defaultProductVariant.variantMatrix, singleField.id);
                    const fieldElement = formElement.elements[singleField.id];
                    if (fieldElement) {
                        fieldElement.value = defaultValue;
                    }
                });
            }
        }
    }, [])
    const loadDefaultProductVariant = () => {
        product.productVariants.map((singleVariant) => {
            if (singleVariant.isDefaultVariant) {
                setDefaultProductVariant({ ...singleVariant })
                setProductVariant({...singleVariant })
                // setProductVariant(singleVariant.slug,singleVariant)
            }
        })
    };
    const handleVariantSearchForm = (e) => {
        e.preventDefault();
        const formElement = document.getElementById(e.target.form.id);
        const variantMatrixToSearch = createVariantMatrixFromSelectorForm(formElement);
        let productVariant = getProductVariantBasedOnFilters(variantMatrixToSearch);
        if (productVariant) {
            setProductVariant({ ...productVariant });
        }
        else{
            setProductVariant(e);
        }
    };
    const createVariantMatrixFromSelectorForm = (formElement) => {
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
    const getProductVariantBasedOnFilters = (formFields) => {
        if (product) {
            let matchingVariant
            product.productVariants.find((singleVariant) => {
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
    return (
        <form className="" id={formId}>
            <div className="row">
                {product.variantsOptionsSelectorForm.map((field) => (
                    <div className={`col-${field.area} mb-1`} key={field.id}>
                        {field.type === "text" || field.type === "tel" || field.type === "number" || field.type === "email" || field.type === "date" ? (
                            <>
                                {field.showLabel ? (<label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>) : null}
                                <input
                                    className="form-control"
                                    name={field.name}
                                    id={field.id}
                                    type={field.type}
                                    required={field.isRequired}
                                    maxLength={field.maxLength}
                                    placeholder={`${field.showPlaceHolder ? field.placeholder : ""} ${field.isRequired && field.showPlaceHolder ? "*" : ""}`}
                                    onChange={handleVariantSearchForm}
                                />
                            </>
                        ) : field.type === "pickList" ? (
                            <>
                                {field.showLabel ? (<label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>) : null}
                                <select
                                    id={field.id}
                                    className="form-control"
                                    name={field.name}
                                    required={field.isRequired}
                                    onChange={handleVariantSearchForm}
                                >
                                    <option value="" disabled>{field.placeholder}</option>
                                    {field.options.map((entry, index) => (
                                        <option key={index} value={entry}>
                                            {entry}
                                        </option>
                                    ))}
                                </select>
                            </>
                        ) : field.type === "textarea" ? (
                            <>
                                {field.showLabel ? (
                                    <label htmlFor={field.name}>
                                        {field.label} {field.isRequired ? "*" : null}
                                    </label>
                                ) : null}
                                <textarea
                                    className="form-control"
                                    required={field.isRequired}
                                    id={field.id}
                                    name={field.name}
                                    placeholder={`${field.showPlaceHolder ? field.placeholder : ""} ${field.isRequired && field.showPlaceHolder ? "*" : ""
                                        }`}
                                    onChange={handleVariantSearchForm}
                                ></textarea>
                            </>
                        ) : field.type === "checkbox" ? (
                            <>
                                {field.showLabel ? (
                                    <label htmlFor={field.name}>
                                        {field.label} {field.isRequired ? "*" : null}
                                    </label>
                                ) : null}
                                <div className="form-checkbox">
                                    <input
                                        className="custom-checkbox"
                                        type="checkbox"
                                        id={field.id}
                                        name={field.name}
                                        required={field.isRequired}
                                        onChange={handleVariantSearchForm}
                                    />
                                    <label className="form-check-label" htmlFor={field.id}>
                                        {field.label}
                                    </label>
                                </div>
                            </>
                        ) : field.type === "break" ? (
                            <>
                                <hr />
                                <p className="text-align-center font-weight-bold">{field.label}</p>
                                <hr />
                            </>
                        ) : null}
                    </div>
                ))}
            </div>
        </form>
    );
}

export default memo(ProductVariantSearch);
