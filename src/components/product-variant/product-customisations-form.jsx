import React, { useEffect, useRef } from "react";
function ProductCustomisationForm(props) {
    const formRef = useRef(null);
    const { productVariant ,formId,formGroupName } = props;
    const inputRefs = useRef({});
    useEffect(() => {
        if (formRef.current) {
            formRef.current.reset();
        }
    }, [productVariant]);
    if (!productVariant) {
        return '';
    }
    return (
        <form className="" id={formId} ref={formRef} name={formGroupName}>
            <div className="row mb-1">
                {productVariant.customisationsForm?.map((field, index) => (
                    <div className={`col-${field.area} mb-1`} key={field.id}>
                        {field.type === 'text' || field.type === 'tel' || field.type === 'number' || field.type === 'email' || field.type === 'date' ? (
                            <>
                                {field.showLabel && <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>}
                                <input
                                    ref={(el) => (inputRefs.current[field.id] = el)}
                                    className={`form-control ${field.readOnly ? 'btn-disabled' : ''}`}
                                    name={field.name}
                                    id={field.id}
                                    defaultValue={field.defaultValue}
                                    type={field.type}
                                    required={field.isRequired}
                                    maxLength={field.maxLength}
                                    placeholder={`${field.showPlaceHolder ? field.placeholder : ''} ${field.isRequired && field.showPlaceHolder ? '*' : ''}`}
                                />
                            </>
                        ) : field.type === 'pickList' ? (
                            <>
                                {field.showLabel && <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>}
                                <select
                                    ref={(el) => (inputRefs.current[field.id] = el)}
                                    id={field.id}
                                    className={`form-control ${field.readOnly ? 'btn-disabled' : ''}`}
                                    name={field.name}
                                    defaultValue={field.value}
                                    required={field.isRequired}>
                                    <option value='' disabled>
                                        {field.placeholder}
                                    </option>
                                    {field.options.map((entry, index) => (
                                        <option key={index} value={entry}>
                                            {entry}
                                        </option>
                                    ))}
                                </select>

                            </>
                        ) : field.type === 'textarea' ? (
                            <>
                                {field.showLabel && <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>}
                                <textarea
                                    ref={(el) => (inputRefs.current[field.id] = el)}
                                    className={`form-control ${field.readOnly ? 'btn-disabled' : ''}`}
                                    required={field.isRequired}
                                    defaultValue={field.defaultValue}
                                    id={field.id}
                                    name={field.name}
                                    placeholder={`${field.showPlaceHolder ? field.placeholder : ''} ${field.isRequired && field.showPlaceHolder ? '*' : ''}`}
                                ></textarea>
                            </>
                        ) : field.type === 'checkbox' ? (
                            <>
                                {field.showLabel && <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label>}
                                <div className="form-checkbox">
                                    <input
                                        ref={(el) => (inputRefs.current[field.id] = el)}
                                        className="custom-checkbox"
                                        defaultValue={field.defaultValue}
                                        type="checkbox"
                                        id={field.id}
                                        name={field.name}
                                        required={field.isRequired}
                                    />
                                    <label className="form-check-label" htmlFor={field.id}>
                                        {field.label}
                                    </label>
                                </div>
                            </>
                        ) : field.type === 'break' ? (
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
export default ProductCustomisationForm
