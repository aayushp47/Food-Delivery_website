import { useState } from "react"

function Cart({ cart, setCart, setShowCart, onCheckout }) {

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState("")

  const itemTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  )

  const deliveryFee = itemTotal >= 299 ? 0 : 40

  const platformFee = 15

  const discount = appliedCoupon?.discount(itemTotal, deliveryFee) || 0

  const total =
    itemTotal +
    deliveryFee +
    platformFee -
    discount


  function applyCoupon(event) {

    event.preventDefault()

    const code = couponCode.trim().toUpperCase()

    const coupons = {
      FOOD100: {
        label: "FOOD100",
        discount: (amount) => amount >= 499 ? 100 : 0,
        minimum: "Minimum order value is ₹499"
      },
      SAVE10: {
        label: "SAVE10",
        discount: (amount) => amount >= 299 ? Math.round(amount * 0.1) : 0,
        minimum: "Minimum order value is ₹299"
      },
      FREESHIP: {
        label: "FREESHIP",
        discount: (_amount, fee) => fee,
        minimum: ""
      }
    }

    const coupon = coupons[code]

    if (!coupon) {
      setAppliedCoupon(null)
      setCouponMessage("Invalid coupon code")
      return
    }

    if (coupon.discount(itemTotal, deliveryFee) === 0 && coupon.minimum) {
      setCouponMessage(coupon.minimum)
      return
    }

    setAppliedCoupon(coupon)
    setCouponMessage(`${coupon.label} applied successfully`)
  }


  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponMessage("")
  }


  function increaseQuantity(id) {

    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    )
  }


  function decreaseQuantity(id) {

    setCart(currentCart =>
      currentCart
      .map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
      .filter(item => item.quantity > 0)
    )
  }


  function clearCart() {
    setCart(() => [])
  }


  return (
    <>

      {/* Dark background */}

      <div
        className="cart-overlay"
        onClick={() => setShowCart(false)}
      ></div>


      {/* Cart Panel */}

      <aside className="cart">

        {/* Cart Header */}

        <div className="cart-header">

          <h2>
            Your Cart
          </h2>


          <button
            className="close-cart"
            onClick={() => setShowCart(false)}
          >
            ×
          </button>

        </div>


        {/* Empty Cart */}

        {cart.length === 0 ? (

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <p>
              Your cart is empty
            </p>

            <span>
              Add something delicious!
            </span>

          </div>

        ) : (

          <>

            {/* Cart Items */}

            <div className="cart-items">

              {cart.map(item => (

                <div
                  className="cart-item"
                  key={item.id}
                >

                  <div className="cart-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      ₹{item.price}
                    </p>

                  </div>


                  {/* Quantity */}

                  <div className="quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      -
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

              ))}

            </div>


            {/* Coupon */}

            <form className="coupon" onSubmit={applyCoupon}>

              <span>🏷️</span>

              <input
                type="text"
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Enter coupon code"
                aria-label="Coupon code"
                disabled={Boolean(appliedCoupon)}
              />

              {appliedCoupon ? (
                <button type="button" onClick={removeCoupon}>
                  Remove
                </button>
              ) : (
                <button type="submit">
                  Apply
                </button>
              )}

            </form>

            {couponMessage && (
              <p className={appliedCoupon ? "coupon-message success" : "coupon-message"}>
                {couponMessage}
              </p>
            )}


            {/* Bill */}

            <div className="bill">

              <h3>
                Bill Details
              </h3>


              <div className="bill-row">

                <span>
                  Item Total
                </span>

                <span>
                  ₹{itemTotal}
                </span>

              </div>

              {discount > 0 && (
                <div className="bill-row coupon-discount">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}


              <div className="bill-row">

                <span>
                  Delivery Fee
                </span>

                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`
                  }
                </span>

              </div>


              <div className="bill-row">

                <span>
                  Platform Fee
                </span>

                <span>
                  ₹{platformFee}
                </span>

              </div>


              <div className="bill-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹{total}
                </strong>

              </div>

            </div>


            {/* Clear Cart */}

            <button
              className="clear-cart-button"
              onClick={clearCart}
            >
              Clear Cart
            </button>


            {/* Checkout */}

            <button
              type="button"
              className="checkout-button"
              onClick={() => onCheckout({ total, discount })}
            >
              Proceed to Checkout →
            </button>

          </>

        )}

      </aside>

    </>
  )
}

export default Cart