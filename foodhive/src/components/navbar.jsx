function Navbar({
  searchTerm,
  setSearchTerm,

  cart,
  setShowCart,
  showCart,

  favorites,
  setShowFavorites,
  showFavorites,

  setShowOffers,
  showOffers,

  setShowProfile,
  showProfile,

  location,
  setShowLocation,
  showLocation
  ,theme
  ,toggleTheme
}) {

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  )


  function handleCartClick() {

    setShowFavorites(false)
    setShowOffers(false)
    setShowProfile(false)
    setShowLocation(false)

    setShowCart(!showCart)
  }


  function handleFavoritesClick() {

    setShowCart(false)
    setShowOffers(false)
    setShowProfile(false)
    setShowLocation(false)

    setShowFavorites(!showFavorites)
  }


  function handleOffersClick() {

    setShowCart(false)
    setShowFavorites(false)
    setShowProfile(false)
    setShowLocation(false)

    setShowOffers(!showOffers)
  }


  function handleProfileClick() {

    setShowCart(false)
    setShowFavorites(false)
    setShowOffers(false)
    setShowLocation(false)

    setShowProfile(!showProfile)
  }


  function handleLocationClick() {

    setShowCart(false)
    setShowFavorites(false)
    setShowOffers(false)
    setShowProfile(false)

    setShowLocation(!showLocation)
  }


  return (
    <nav className="navbar">

      {/* Logo */}

      <div className="logo">
        🍴🌿 Food<span>Hive</span>
      </div>


      {/* Location */}

      <button
        type="button"
        className="location-button"
        onClick={handleLocationClick}
      >

        📍

        <span>
          {location}
        </span>

        <span className="location-arrow">
          {showLocation ? "⌃" : "⌄"}
        </span>

      </button>


      {/* Search */}

      <div className="search-box">

        🔍

        <input
          type="text"
          placeholder="Search for restaurants, cuisines or dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>


      {/* Right side */}

      <div className="nav-actions">

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "☾" : "☀"}
        </button>

        {/* Offers */}

        <button
          type="button"
          className="navbar-action"
          aria-label="Offers"
          onClick={handleOffersClick}
        >
          <span className="navbar-action-icon" aria-hidden="true">⚙</span>
          <span className="navbar-action-label">Offers</span>
        </button>


        {/* Favorites */}

        <button
          type="button"
          className="navbar-action"
          aria-label={`Favorites${favorites.length ? `, ${favorites.length} items` : ""}`}
          onClick={handleFavoritesClick}
        >
          <span className="navbar-action-icon" aria-hidden="true">♡</span>
          <span className="navbar-action-label">Favorites</span>

          {favorites.length > 0 && (

            <span className="favorites-count">
              {favorites.length}
            </span>

          )}

        </button>


        {/* Cart */}

        <button
          type="button"
          className="navbar-cart"
          onClick={handleCartClick}
        >

          🛒

          {cartCount > 0 && (

            <span className="cart-count">
              {cartCount}
            </span>

          )}

        </button>


        {/* Profile */}

        <button
          type="button"
          className="profile-button"
          onClick={handleProfileClick}
        >

          <span className="profile-circle">
            A
          </span>

          <span>
            Aayush
          </span>

          <span className="profile-arrow">
            {showProfile ? "⌃" : "⌄"}
          </span>

        </button>

      </div>

    </nav>
  )
}


export default Navbar