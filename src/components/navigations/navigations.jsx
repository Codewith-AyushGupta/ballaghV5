import React from 'react';

function Navigation(params) {
    const { activePath } = params;
    return (
        <div className="step-by pr-4 pl-4">
            <h3 className={`title title-simple title-step ${activePath==='cart'?'active':''}`}>
                1. Shopping Cart
            </h3>
            <h3 className={`title title-simple title-step ${activePath==='checkout'?'active':''}`}>
                2. Checkout
            </h3>
            <h3 className={`title title-simple title-step ${activePath==='orderComplete'?'active':''}`}>
                3. Order Complete
            </h3>
        </div>
    );
}

export default Navigation;
