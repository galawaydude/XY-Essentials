import React from 'react';
import './couponcard.css';

function CouponCard({ coupon }) {
  const { code, discountType, discountValue, expirationDate, minimumPurchaseAmount, maxDiscountAmount, usageLimit, isActive } = coupon;

  return (
    <div className="coupon-card-main-con">
      <div className="coupon-card-con">
        <div className="coupon-card-details-header">
          <h3>Coupon Code: {code}</h3>
          <div className="coupon-attribute">
            Discount:
            {discountType === 'percentage'
              ? `${discountValue}%`
              : `$${discountValue}`}
          </div>
          <div className="coupon-attribute">Expires On: {new Date(expirationDate).toLocaleDateString()}</div>
          <div className="coupon-attribute">Minimum Purchase: ${minimumPurchaseAmount}</div>
          {maxDiscountAmount && (
            <div className="coupon-attribute">Max Discount Amount: ${maxDiscountAmount}</div>
          )}
          <div className="coupon-attribute">Usage Limit: {usageLimit}</div>
          <div className="coupon-attribute">Status: {isActive ? 'Active' : 'Inactive'}</div>
        </div>
      </div>
    </div>
  );
}

export default CouponCard;