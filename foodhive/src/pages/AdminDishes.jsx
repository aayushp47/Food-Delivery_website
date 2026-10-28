import { useEffect, useState } from "react"

import {
  getDishes,
  createDish,
  updateDish,
  deleteDish
} from "../services/dishService"


function AdminDishes() {

  const emptyForm = {
    name: "",
    price: "",
    description: "",
    image: "",
    type: "veg",
    category: "Starters"
  }


  const [dishes, setDishes] = useState([])

  const [form, setForm] = useState(emptyForm)

  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(true)

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState("")

  // Search
  const [searchTerm, setSearchTerm] = useState("")

  // Category filter
  const [categoryFilter, setCategoryFilter] = useState("All")

  const [showForm, setShowForm] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 8


  // -------------------------
  // LOAD DISHES
  // -------------------------

  async function loadDishes() {

    try {

      setLoading(true)
      setError("")

      const data = await getDishes()

      setDishes(data)

    } catch (error) {

      console.error(error)

      setError("Failed to load dishes.")

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    loadDishes()

  }, [])


  // -------------------------
  // HANDLE INPUT
  // -------------------------

  function handleChange(event) {

    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })

  }


  // -------------------------
  // CREATE / UPDATE
  // -------------------------

  async function handleSubmit(event) {

    event.preventDefault()

    try {

      setSaving(true)
      setError("")


      const dishData = {

        name: form.name,

        price: Number(form.price),

        description: form.description,

        image: form.image,

        type: form.type,

        category: form.category

      }


      if (editingId) {

        await updateDish(
          editingId,
          dishData
        )

      } else {

        await createDish(dishData)

      }


      setForm(emptyForm)

      setEditingId(null)

      setShowForm(false)

      await loadDishes()

    } catch (error) {

      console.error(error)

      setError(
        editingId
          ? "Failed to update dish."
          : "Failed to create dish."
      )

    } finally {

      setSaving(false)

    }

  }


  // -------------------------
  // EDIT
  // -------------------------

  function handleEdit(dish) {

    setEditingId(dish.id)

    setShowForm(true)

    setForm({

      name: dish.name,

      price: dish.price,

      description: dish.description || "",

      image: dish.image || "",

      type: dish.type,

      category: dish.category

    })


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    })

  }


  // -------------------------
  // DELETE
  // -------------------------

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this dish?"
    )


    if (!confirmed) {
      return
    }


    try {

      setError("")

      await deleteDish(id)

      await loadDishes()

    } catch (error) {

      console.error(error)

      setError("Failed to delete dish.")

    }

  }


  // -------------------------
  // CANCEL EDIT
  // -------------------------

  function cancelEdit() {

    setEditingId(null)

    setForm(emptyForm)

    setShowForm(false)

  }


  // -------------------------
  // FILTER DISHES
  // -------------------------

  const filteredDishes = dishes.filter((dish) => {

    const matchesSearch =
      dish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())


    const matchesCategory =
      categoryFilter === "All" ||
      dish.category === categoryFilter


    return matchesSearch && matchesCategory

  })

  const totalPages = Math.max(1, Math.ceil(filteredDishes.length / pageSize))
  const visibleDishes = filteredDishes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])


  // -------------------------
  // RENDER
  // -------------------------

  return (

    <div className="admin-page admin-dishes-page">

      <section className="admin-dishes-toolbar">
        <div>
          <p className="eyebrow">Menu catalog</p>
          <h2>Dish management</h2>
          <p className="admin-muted">Keep your published menu fresh and easy to browse.</p>
        </div>
        <button type="button" className="admin-primary-button" onClick={() => {
          setEditingId(null)
          setForm(emptyForm)
          setShowForm(true)
        }}>
          + Add new dish
        </button>
      </section>


      {/* HEADER */}

      <div className="admin-header">

        <div>

          <h1>
            🍴🌿 FoodHive Admin
          </h1>

          <p>
            Manage dishes for Grand Palms
          </p>

        </div>


        <button

          type="button"

          className="admin-home-button"

          onClick={() => {
            window.location.href = "/"
          }}

        >

          ← Customer Menu

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="admin-error">

          ⚠️ {error}

        </div>

      )}


      {/* ADD / EDIT FORM */}

      {showForm && (
        <div className="admin-dish-modal-overlay" onClick={cancelEdit}>
          <section className="admin-form-card admin-dish-modal" onClick={(event) => event.stopPropagation()}>


        <div className="admin-section-title">

          <h2>

            {editingId
              ? "Edit Dish"
              : "Add New Dish"
            }

          </h2>


          {editingId && (

            <button

              type="button"

              className="cancel-edit-button"

              onClick={cancelEdit}

            >

              Cancel Edit

            </button>

          )}

        </div>


        <form onSubmit={handleSubmit}>


          <div className="admin-form-grid">


            {/* NAME */}

            <div className="admin-field">

              <label>
                Dish Name
              </label>

              <input

                type="text"

                name="name"

                value={form.name}

                onChange={handleChange}

                placeholder="Example: Paneer Tikka"

                required

              />

            </div>


            {/* PRICE */}

            <div className="admin-field">

              <label>
                Price
              </label>

              <input

                type="number"

                name="price"

                value={form.price}

                onChange={handleChange}

                placeholder="249"

                min="0"

                required

              />

            </div>


            {/* CATEGORY */}

            <div className="admin-field">

              <label>
                Category
              </label>

              <select

                name="category"

                value={form.category}

                onChange={handleChange}

              >

                <option value="Combos">
                  Combos
                </option>

                <option value="Starters">
                  Starters
                </option>

                <option value="Main Course">
                  Main Course
                </option>

                <option value="Biryani">
                  Biryani
                </option>

                <option value="Pizzas">
                  Pizzas
                </option>

                <option value="Desserts">
                  Desserts
                </option>

                <option value="Beverages">
                  Beverages
                </option>

              </select>

            </div>


            {/* TYPE */}

            <div className="admin-field">

              <label>
                Food Type
              </label>

              <select

                name="type"

                value={form.type}

                onChange={handleChange}

              >

                <option value="veg">
                  Vegetarian
                </option>

                <option value="nonveg">
                  Non-Vegetarian
                </option>

              </select>

            </div>


            {/* IMAGE */}

            <div className="admin-field admin-full">

              <label>
                Image Path
              </label>

              <input

                type="text"

                name="image"

                value={form.image}

                onChange={handleChange}

                placeholder="/images/paneer-tikka.jpeg"

              />

            </div>


            {/* DESCRIPTION */}

            <div className="admin-field admin-full">

              <label>
                Description
              </label>

              <textarea

                name="description"

                value={form.description}

                onChange={handleChange}

                placeholder="Describe the dish..."

                rows="3"

              />

            </div>

          </div>


          <button

            type="submit"

            className="admin-submit-button"

            disabled={saving}

          >

            {saving

              ? "Saving..."

              : editingId

                ? "Update Dish"

                : "Add Dish"

            }

          </button>

        </form>

          </section>
        </div>
      )}


      {/* DISH LIST */}

      <section className="admin-list-card">


        <div className="admin-section-title">

          <h2>
            All Dishes
          </h2>

          <span>
            {filteredDishes.length} of {dishes.length} dishes
          </span>

        </div>


        {/* SEARCH + FILTER */}

        <div className="admin-filters">


          <div className="admin-search">

            <span>
              🔍
            </span>

            <input

              type="text"

              placeholder="Search dishes..."

              value={searchTerm}

              onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1)
              }}

            />

          </div>


          <select

            className="admin-category-filter"

            value={categoryFilter}

            onChange={(event) => {
              setCategoryFilter(event.target.value)
              setCurrentPage(1)
            }}

          >

            <option value="All">
              All Categories
            </option>

            <option value="Combos">
              Combos
            </option>

            <option value="Starters">
              Starters
            </option>

            <option value="Main Course">
              Main Course
            </option>

            <option value="Biryani">
              Biryani
            </option>

            <option value="Pizzas">
              Pizzas
            </option>

            <option value="Desserts">
              Desserts
            </option>

            <option value="Beverages">
              Beverages
            </option>

          </select>


          {(searchTerm || categoryFilter !== "All") && (

            <button

              type="button"

              className="clear-filter-button"

              onClick={() => {

                setSearchTerm("")

                setCategoryFilter("All")

                setCurrentPage(1)

              }}

            >

              Clear

            </button>

          )}

        </div>


        {/* TABLE */}

        {loading ? (

          <div className="admin-loading">
            Loading dishes...
          </div>

        ) : filteredDishes.length === 0 ? (

          <div className="admin-empty">

            <div>
              🔍
            </div>

            <p>
              No dishes found
            </p>

            <span>
              Try a different search or category.
            </span>

          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Dish
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {visibleDishes.map((dish) => (

                  <tr key={dish.id}>


                    <td>
                      #{dish.id}
                    </td>


                    <td>

                      <div className="admin-dish-name">

                        {dish.image && (

                          <img

                            src={dish.image}

                            alt={dish.name}

                          />

                        )}


                        <div>

                          <strong>
                            {dish.name}
                          </strong>

                          <small>
                            {dish.description}
                          </small>

                        </div>

                      </div>

                    </td>


                    <td>
                      ₹{dish.price}
                    </td>


                    <td>
                      {dish.category}
                    </td>


                    <td>

                      <span

                        className={
                          dish.type === "veg"
                            ? "admin-veg"
                            : "admin-nonveg"
                        }

                      >

                        {dish.type === "veg"
                          ? "Veg"
                          : "Non-Veg"
                        }

                      </span>

                    </td>


                    <td>

                      <div className="admin-actions">

                        <button

                          type="button"

                          className="edit-button"

                          onClick={() =>
                            handleEdit(dish)
                          }

                        >

                          Edit

                        </button>


                        <button

                          type="button"

                          className="delete-button"

                          onClick={() =>
                            handleDelete(dish.id)
                          }

                        >

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

        {filteredDishes.length > 0 && (
          <div className="admin-table-pagination">
            <span>
              Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredDishes.length)} of {filteredDishes.length}
            </span>
            <div>
              <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                Previous
              </button>
              <strong>Page {currentPage} of {totalPages}</strong>
              <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                Next
              </button>
            </div>
          </div>
        )}

      </section>

    </div>

  )

}


export default AdminDishes