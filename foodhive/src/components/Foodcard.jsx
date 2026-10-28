function FoodCard({
  dish,
  cart,
  setCart,

  favorites,
  setFavorites
}) {

  // Check cart
  const cartItem = cart.find(
    item => item.id === dish.id
  )


  const quantity = cartItem
    ? cartItem.quantity
    : 0


  // Check favorite
  const isFavorite = favorites.some(
    item => item.id === dish.id
  )


  // Add to cart
  function addToCart() {

    const existingItem = cart.find(
      item => item.id === dish.id
    )


    if (existingItem) {

      setCart(
        cart.map(item =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      )

    } else {

      setCart([
        ...cart,
        {
          ...dish,
          quantity: 1
        }
      ])

    }
  }


  // Increase
  function increaseQuantity() {

    setCart(
      cart.map(item =>
        item.id === dish.id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    )
  }


  // Decrease
  function decreaseQuantity() {

    setCart(
      cart
        .map(item =>
          item.id === dish.id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }


  // Toggle favorite
  function toggleFavorite() {

    if (isFavorite) {

      setFavorites(
        favorites.filter(
          item => item.id !== dish.id
        )
      )

    } else {

      setFavorites([
        ...favorites,
        dish
      ])

    }
  }


  return (
    <div className="food-card">

      {/* Image */}

      <div className="food-image-wrapper">

        <img
          src={dish.image}
          alt={dish.name}
          className="food-image"
        />


        {/* Favorite */}

        <button
          type="button"
          className={
            isFavorite
              ? "favorite-button active"
              : "favorite-button"
          }
          onClick={toggleFavorite}
        >
          {isFavorite ? "♥" : "♡"}
        </button>

      </div>


      {/* Information */}

      <div className="food-info">

        <h3>

          <span
            className={`food-type ${dish.type}`}
          ></span>

          {dish.name}

        </h3>


        <p>
          {dish.description}
        </p>


        <strong>
          ₹{dish.price}
        </strong>

      </div>


      {/* Cart controls */}

      {quantity === 0 ? (

        <button
          type="button"
          className="add-button"
          onClick={addToCart}
        >
          Add
          <span>+</span>
        </button>

      ) : (

        <div className="food-quantity">

          <button
            type="button"
            onClick={decreaseQuantity}
          >
            −
          </button>


          <span>
            {quantity}
          </span>


          <button
            type="button"
            onClick={increaseQuantity}
          >
            +
          </button>

        </div>

      )}

    </div>
  )
}


export default FoodCard