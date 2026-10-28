function RestaurantBanner() {
  return (
    <section className="restaurant-banner">

      {/* Background image */}
      <img
        src="/images/images.jpeg"
        alt="Restaurant"
        className="banner-image"
      />
      
       {/* Restaurant information */}
      <div className="restaurant-info">

       {/* Restaurant logo */}
        <div className="restaurant-logo">
          🌿
          <strong>
            URBAN
            <br />
            BITES
          </strong>
        </div>

        {/* Details */}
        <div className="restaurant-details">

          <h1>Grand Palms</h1>

          <p>Experience the Royal Indian Taste</p>

          <div className="rating">
            ⭐ 4.4 (2.8k+ ratings)
          </div>

          <div className="cuisines">
            North Indian&nbsp; | &nbsp;
            Chinese&nbsp; | &nbsp;
            Italian&nbsp; | &nbsp;
            Continental
          </div>

          <div className="restaurant-meta">

            <span>🕐 25 – 35 min</span>

            <span>🚲 Free delivery above ₹299</span>

            <span>🌿 Pure Veg Options</span>

          </div>

        </div>

      </div>

        {/* Right side buttons */}
      <div className="banner-actions">
        <button>♡</button>
        <button>↗</button>
      </div>

    </section>
  )
}

export default RestaurantBanner
