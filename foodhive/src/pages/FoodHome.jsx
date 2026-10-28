import { useEffect, useState } from "react"

import Navbar from "../components/navbar"

import RestaurantBanner from "../components/restaurant-banner"

import CategoryNav from "../components/CategoryNav"

import RecommendedMenu from "../components/recommended-menu"

import Cart from "../components/cart"

import AddressModal from "../components/AddressModal"

import { getDishes } from "../services/dishService"
import {
  createAddress,
  createOrder,
  deleteAddress,
  getOrders,
  getAddresses,
  updateAddress
} from "../services/checkoutService"


function FoodHome({ theme, toggleTheme }) {

  // =====================================================
  // DISHES
  // =====================================================

  const [dishes, setDishes] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const [cart, setCart] = useState([])


  // =====================================================
  // CATEGORY
  // =====================================================

  const [selectedCategory, setSelectedCategory] =
    useState("Recommended")


  // =====================================================
  // SEARCH
  // =====================================================

  const [searchTerm, setSearchTerm] =
    useState("")


  // =====================================================
  // CART PANEL
  // =====================================================

  const [showCart, setShowCart] =
    useState(false)


  // =====================================================
  // FAVORITES
  // =====================================================

  const [favorites, setFavorites] =
    useState([])

  const [showFavorites, setShowFavorites] =
    useState(false)


  // =====================================================
  // OFFERS
  // =====================================================

  const [showOffers, setShowOffers] =
    useState(false)


  // =====================================================
  // PROFILE
  // =====================================================

  const [showProfile, setShowProfile] =
    useState(false)

  const [showOrders, setShowOrders] =
    useState(false)

  const [orders, setOrders] =
    useState([])

  const [ordersLoading, setOrdersLoading] =
    useState(false)

  const [ordersError, setOrdersError] =
    useState("")


  // =====================================================
  // LOCATION
  // =====================================================

  const [location, setLocation] =
    useState("Pune")

  const [showLocation, setShowLocation] =
    useState(false)


  // =====================================================
  // ADDRESSES
  // =====================================================

  const [addresses, setAddresses] =
    useState([])

  const [selectedAddress, setSelectedAddress] =
    useState(null)

  const [showAddressModal, setShowAddressModal] =
    useState(false)

  const [continueToPayment, setContinueToPayment] =
    useState(false)

  const [showPayment, setShowPayment] =
    useState(false)

  const [selectedPayment, setSelectedPayment] =
    useState("UPI")

  const [checkoutTotal, setCheckoutTotal] =
    useState(0)

  const [checkoutDiscount, setCheckoutDiscount] =
    useState(0)

  const [orderError, setOrderError] =
    useState("")

  const [deliveryInstructions, setDeliveryInstructions] =
    useState("")

  const [scheduledDelivery, setScheduledDelivery] =
    useState("")


  // =====================================================
  // LOAD DISHES FROM FASTAPI
  // =====================================================

  useEffect(() => {

    async function loadDishes() {

      try {

        setLoading(true)

        setError("")


        const data = await getDishes()


        setDishes(data)

      }

      catch (error) {

        console.error(error)


        setError(
          "Unable to load dishes. Please make sure the FoodHive backend is running."
        )

      }

      finally {

        setLoading(false)

      }

    }


    loadDishes()

  }, [])

  async function openOrders() {
    setShowProfile(false)
    setShowOrders(true)
    setOrdersLoading(true)
    setOrdersError("")

    try {
      setOrders(await getOrders())
    } catch (error) {
      setOrdersError(error.message || "Unable to load orders.")
    } finally {
      setOrdersLoading(false)
    }
  }


  useEffect(() => {

    getAddresses()
      .then((loadedAddresses) => {
        setAddresses(loadedAddresses)
        setSelectedAddress(loadedAddresses[0] || null)
      })
      .catch((addressError) => {
        console.error(addressError)
      })

  }, [])


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="app">


      {/* =================================================
          NAVBAR
          ================================================= */}

      <Navbar

        searchTerm={searchTerm}

        setSearchTerm={setSearchTerm}

        cart={cart}

        setShowCart={setShowCart}

        showCart={showCart}

        favorites={favorites}

        setShowFavorites={setShowFavorites}

        showFavorites={showFavorites}

        setShowOffers={setShowOffers}

        showOffers={showOffers}

        setShowProfile={setShowProfile}

        showProfile={showProfile}

        location={location}

        setShowLocation={setShowLocation}

        showLocation={showLocation}

        theme={theme}

        toggleTheme={toggleTheme}

      />


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="main-content">


        {/* RESTAURANT */}

        <RestaurantBanner />


        {/* CATEGORY NAVIGATION */}

        <CategoryNav

          selectedCategory={selectedCategory}

          setSelectedCategory={setSelectedCategory}

        />


        {/* LOADING */}

        {loading && (

          <div className="loading">

            <div className="loading-spinner"></div>

            <p>
              Loading delicious food...
            </p>

          </div>

        )}


        {/* API ERROR */}

        {!loading && error && (

          <div className="api-error">

            <div className="api-error-icon">
              ⚠️
            </div>


            <h3>
              Unable to load menu
            </h3>


            <p>
              {error}
            </p>

          </div>

        )}


        {/* MENU */}

        {!loading && !error && (

          <RecommendedMenu

            dishes={dishes}

            cart={cart}

            setCart={setCart}

            selectedCategory={selectedCategory}

            searchTerm={searchTerm}

            favorites={favorites}

            setFavorites={setFavorites}

          />

        )}

      </main>


      {/* =================================================
          CART
          ================================================= */}

{showCart && (
  <Cart
    cart={cart}
    setCart={setCart}
    setShowCart={setShowCart}
    onCheckout={({ total, discount }) => {
      setShowCart(false)
      setCheckoutTotal(total)
      setCheckoutDiscount(discount)
      setContinueToPayment(true)
      setShowAddressModal(true)
    }}
  />
)}

      {/* =================================================
          FAVORITES
          ================================================= */}

      {showFavorites && (

        <div className="side-panel favorites-panel">


          <div className="panel-header">

            <div>
              <h2>
                Favorites
              </h2>

              <span className="panel-subtitle">
                Your saved dishes in one place
              </span>
            </div>


            <button

              type="button"

              onClick={() =>
                setShowFavorites(false)
              }

            >
              ×
            </button>

          </div>


          {favorites.length === 0 ? (

            <div className="empty-panel">

              <div>
                ♡
              </div>


              <p>
                No favorites yet
              </p>



              <span>
                Tap the heart on a dish to save it here.
              </span>

            </div>

          ) : (

            <div className="favorite-list">

              {favorites.map((dish) => (

                <div

                  className="favorite-item"

                  key={dish.id}

                >

                  <img

                    src={dish.image}

                    alt={dish.name}

                  />


                  <div>

                    <h3>
                      {dish.name}
                    </h3>


                    <p>
                      ₹{dish.price}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      )}


      {/* =================================================
          OFFERS
          ================================================= */}

      {showOffers && (

        <div className="side-panel offers-panel">


          <div className="panel-header">

            <div>
              <h2>
                Offers
              </h2>

              <span className="panel-subtitle">
                Save more on your next order
              </span>
            </div>


            <button

              type="button"

              onClick={() =>
                setShowOffers(false)
              }

            >
              ×
            </button>

          </div>


          {/* OFFER 1 */}

          <div className="offer-card">

            <div className="offer-icon">
              🎁
            </div>


            <div>

              <h3>
                FLAT ₹100 OFF
              </h3>


              <p>
                Use code FOOD100 on orders above ₹499
              </p>



              <strong className="offer-code">
                FOOD100
              </strong>

              <span className="offer-action">
                Apply at checkout
              </span>

            </div>

          </div>


          {/* OFFER 2 */}

          <div className="offer-card">

            <div className="offer-icon">
              🚲
            </div>


            <div>

              <h3>
                FREE DELIVERY
              </h3>


              <p>
                Get free delivery on orders above ₹299
              </p>

              <strong className="offer-code">
                FREESHIP
              </strong>

              <span className="offer-action">
                Applied automatically
              </span>

            </div>

          </div>


          {/* OFFER 3 */}

          <div className="offer-card">

            <div className="offer-icon">
              🏷️
            </div>


            <div>

              <h3>
                10% OFF
              </h3>


              <p>
                Get 10% off on your next order
              </p>

              <strong className="offer-code">
                SAVE10
              </strong>

              <span className="offer-action">
                Apply at checkout
              </span>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          PROFILE
          ================================================= */}

      {showProfile && (

        <div className="profile-dropdown">


          <div className="profile-header">

            <div className="profile-circle">
              A
            </div>


            <div>

              <strong>
                Aayush
              </strong>


              <span>
                FoodHive User
              </span>

            </div>

          </div>


          <button type="button">
            👤 My Profile
          </button>


          <button type="button" onClick={openOrders}>
            📦 My Orders
          </button>


          <button
            type="button"
            onClick={() => {
              setShowProfile(false)
              setContinueToPayment(false)
              setShowAddressModal(true)
            }}
          >
            📍 Addresses
          </button>

          <button
            type="button"
            onClick={() => {
              setShowProfile(false)
              window.location.href = "/admin"
            }}
          >
            🧾 Admin Console
          </button>


          <button type="button">
            ⚙️ Settings
          </button>


          <button type="button">
            🚪 Logout
          </button>

        </div>

      )}

      {/* =================================================
          LOCATION DROPDOWN
          ================================================= */}

      {showLocation && (

        <div className="location-dropdown">


          <h3>
            Delivery Location
          </h3>


          {/* ADDRESS MANAGER */}

          <button

            type="button"

            className="address-manager-button"

            onClick={() => {

              setShowLocation(false)

              setContinueToPayment(false)
              setShowAddressModal(true)

            }}

          >

            📍 Manage Delivery Addresses

          </button>


          <div className="location-divider">
            Or choose a city
          </div>


          {/* CITY OPTIONS */}

          {[
            "Pune",
            "Mumbai",
            "Nashik",
            "Bengaluru"
          ].map((city) => (

            <button

              type="button"

              key={city}

              className={
                location === city
                  ? "selected-location"
                  : ""
              }


              onClick={() => {

                setLocation(city)

                setShowLocation(false)

              }}

            >

              📍 {city}

            </button>

          ))}

        </div>

      )}

      {showOrders && (
        <div className="side-panel orders-panel">
          <div className="panel-header">
            <div>
              <h2>My Orders</h2>
              <span className="panel-subtitle">Track your recent FoodHive orders</span>
            </div>
            <button type="button" onClick={() => setShowOrders(false)}>×</button>
          </div>

          {ordersLoading && <div className="empty-panel"><p>Loading your orders...</p></div>}
          {!ordersLoading && ordersError && <div className="empty-panel"><p>{ordersError}</p></div>}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="empty-panel">
              <div>📦</div>
              <p>No orders yet</p>
              <span>Your completed orders will appear here.</span>
            </div>
          )}
          {!ordersLoading && !ordersError && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="customer-order-card" key={order.id}>
                  <div className="customer-order-heading">
                    <strong>Order #{order.id}</strong>
                    <span className={`order-status ${order.status}`}>{order.status}</span>
                  </div>
                  <p>{order.items?.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</p>
                  <div className="customer-order-footer">
                    <span>{new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                    <strong>₹{Math.round(order.total).toLocaleString("en-IN")}</strong>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      


      {/* =================================================
          ADDRESS MODAL
          ================================================= */}

      {showAddressModal && (

        <AddressModal

          addresses={addresses}

          setAddresses={setAddresses}

          selectedAddress={selectedAddress}

          setSelectedAddress={setSelectedAddress}

          setShowAddressModal={setShowAddressModal}

          onCreateAddress={createAddress}

          onUpdateAddress={updateAddress}

          onDeleteAddress={async (addressId) => {
            await deleteAddress(addressId)
            setAddresses(currentAddresses =>
              currentAddresses.filter(
                address => address.id !== addressId
              )
            )
          }}

          onAddressSelected={() => {
            if (continueToPayment) {
              setContinueToPayment(false)
              setShowPayment(true)
            }
          }}

        />

      )}
{/* =================================================
    PAYMENT MODAL
    ================================================= */}

{showPayment && (
  <div
    className="payment-modal-overlay"
    onClick={() => setShowPayment(false)}
  >
    <div
      className="payment-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* HEADER */}

      <div className="payment-modal-header">

        <div>
          <h2>Choose Payment Method</h2>

          <p>
            Select how you want to pay
          </p>
        </div>

        <button
          type="button"
          className="payment-close-button"
          onClick={() => setShowPayment(false)}
        >
          ✕
        </button>

      </div>


      {/* PAYMENT METHODS */}

      <div className="payment-methods">

        {/* UPI */}

        <button
          type="button"
          className={`payment-method ${
            selectedPayment === "UPI"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedPayment("UPI")
          }
        >

          <span className="payment-icon">
            📱
          </span>

          <span className="payment-method-info">

            <strong>
              UPI
            </strong>

            <small>
              Google Pay, PhonePe, Paytm & more
            </small>

          </span>

          <span className="payment-radio">
            {selectedPayment === "UPI"
              ? "●"
              : "○"}
          </span>

        </button>


        {/* CARD */}

        <button
          type="button"
          className={`payment-method ${
            selectedPayment === "CARD"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedPayment("CARD")
          }
        >

          <span className="payment-icon">
            💳
          </span>

          <span className="payment-method-info">

            <strong>
              Credit / Debit Card
            </strong>

            <small>
              Visa, Mastercard, RuPay & more
            </small>

          </span>

          <span className="payment-radio">
            {selectedPayment === "CARD"
              ? "●"
              : "○"}
          </span>

        </button>


        {/* CASH ON DELIVERY */}

        <button
          type="button"
          className={`payment-method ${
            selectedPayment === "COD"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setSelectedPayment("COD")
          }
        >

          <span className="payment-icon">
            💵
          </span>

          <span className="payment-method-info">

            <strong>
              Cash on Delivery
            </strong>

            <small>
              Pay when your order arrives
            </small>

          </span>

          <span className="payment-radio">
            {selectedPayment === "COD"
              ? "●"
              : "○"}
          </span>

        </button>

      </div>


      {/* PAYMENT SUMMARY */}

      <div className="delivery-options">

        <label htmlFor="scheduled-delivery">
          Schedule delivery (optional)
        </label>

        <input
          id="scheduled-delivery"
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          value={scheduledDelivery}
          onChange={(event) => setScheduledDelivery(event.target.value)}
        />

        <label htmlFor="delivery-instructions">
          Delivery instructions (optional)
        </label>

        <textarea
          id="delivery-instructions"
          rows="2"
          maxLength="500"
          placeholder="For example: Leave at the door"
          value={deliveryInstructions}
          onChange={(event) => setDeliveryInstructions(event.target.value)}
        />

      </div>

      <div className="payment-summary">

        <div>

          <span>
            Payment Method
          </span>

          <strong>
            {selectedPayment === "UPI"
              ? "UPI"
              : selectedPayment === "CARD"
                ? "Credit / Debit Card"
                : "Cash on Delivery"}
          </strong>

        </div>


        <div>

          <span>
            Amount to Pay
          </span>

          <strong>
            ₹{checkoutTotal}
          </strong>

        </div>

      </div>


      {/* PLACE ORDER */}

      <button
        type="button"
        className="place-order-button"
        onClick={async () => {

          setOrderError("")

          try {
            await createOrder({
              address_id: selectedAddress.id,
              payment_method: selectedPayment,
              discount: checkoutDiscount,
              delivery_instructions: deliveryInstructions.trim() || null,
              scheduled_delivery: scheduledDelivery
                ? new Date(scheduledDelivery).toISOString()
                : null,
              items: cart.map(item => ({
                dish_id: item.id,
                quantity: item.quantity
              }))
            })

            alert(
              `Order placed successfully using ${selectedPayment}!`
            )

            setShowPayment(false)
            setCart([])
            setDeliveryInstructions("")
            setScheduledDelivery("")
          } catch (error) {
            setOrderError(error.message)
          }
        }}
      >
        Place Order
      </button>

      {orderError && (
        <p className="coupon-message">
          {orderError}
        </p>
      )}

    </div>
  </div>
)}      

    </div>

  )

}


export default FoodHome