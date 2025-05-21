import React, { memo } from "react";

function GenerateInputFields(props) {
  const { formFields, marginBetweenFiled = 4 , handleVariantChange } = props;

  return (
    <div className="row mb-2">
      {formFields.map((field, index) => (
        <div className={`col-${field.area} mb-${marginBetweenFiled}`} key={field.id}>
          {field.type === 'text' || field.type === 'tel' || field.type === 'number' || field.type === 'email'  || field.type === 'date'? (
            <>
              {field.showLabel ? <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label> : null}
              <input
              onChange={handleVariantChange}
                className="form-control"
                name={field.name}
                id={field.id}
                type={field.type}
                required={field.isRequired}
                maxLength={field.maxLength}
                placeholder={`${field.showPlaceHolder ? field.placeholder : ''} ${field.isRequired && field.showPlaceHolder ? '*' : ''}`}
              />
            </>
          ) : field.type === 'pickList' ? (
            <>
              {field.showLabel ? <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label> : null}
              <select
              onChange={handleVariantChange}
                id={field.id}
                className='form-control'
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
              {field.showLabel ? <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label> : null}
              <textarea
                className="form-control"
                required={field.isRequired}
                id={field.id}
                name={field.name}
                placeholder={`${field.showPlaceHolder ? field.placeholder : ''} ${field.isRequired && field.showPlaceHolder ? '*' : ''}`}
              ></textarea>
            </>
          ) : field.type === 'checkbox' ? (
            <>
              {field.showLabel ? <label htmlFor={field.name}>{field.label} {field.isRequired ? "*" : null}</label> : null}
              <div className="form-checkbox">
              <input
                className="custom-checkbox"
                type="checkbox"
                id={field.id}
                name={field.name}
                value={field.value}
                required={field.isRequired}
              />
              <label className="form-check-label" htmlFor={field.id}>
                {field.label}
              </label>
              </div>
            </>
          ) : field.type === 'break'?<>
          <hr />
         <p className="text-align-center font-weight-bold">{field.label}</p>
         <hr />
          </>:null}
        </div>
      ))}
    </div>
  );
}

export default memo(GenerateInputFields);
