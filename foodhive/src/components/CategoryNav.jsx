function CategoryNav({ selectedCategory, setSelectedCategory }) {

  const categories = [
    "Recommended",
    "Combos",
    "Starters",
    "Main Course",
    "Biryani",
    "Pizzas",
    "Desserts",
    "Beverages"
  ]

  return (
    <nav className="category-nav">

      {categories.map((category) => (

        <span
          key={category}
          className={
            selectedCategory === category
              ? "active"
              : ""
          }
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </span>

      ))}

    </nav>
  )
}

export default CategoryNav