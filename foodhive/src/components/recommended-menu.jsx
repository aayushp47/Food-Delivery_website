import FoodCard from './FoodCard'


function RecommendedMenu({
  dishes,
  cart,
  setCart,

  selectedCategory,

  searchTerm,

  favorites,
  setFavorites
}) {

  const filteredDishes = dishes.filter((dish) => {

    const matchesCategory =
      selectedCategory === "Recommended" ||
      dish.category === selectedCategory


    const matchesSearch =
      dish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())


    return matchesCategory && matchesSearch

  })


  return (
    <section className="recommended-menu">

      <h2>
        {selectedCategory === "Recommended"
          ? "Recommended for you"
          : selectedCategory
        }
      </h2>


      <p className="menu-subtitle">
        Most loved dishes from this restaurant
      </p>


      <div className="food-list">

        {filteredDishes.length > 0 ? (

          filteredDishes.map((dish) => (

            <FoodCard
              key={dish.id}

              dish={dish}

              cart={cart}
              setCart={setCart}

              favorites={favorites}
              setFavorites={setFavorites}
            />

          ))

        ) : (

          <div className="no-dishes">

            <p>
              No dishes found.
            </p>

          </div>

        )}

      </div>

    </section>
  )
}


export default RecommendedMenu