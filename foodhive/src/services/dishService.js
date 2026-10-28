import { API_URL } from "./apiConfig"


// =================================
// GET ALL DISHES
// =================================

export async function getDishes() {

  const response = await fetch(
    `${API_URL}/dishes/`
  )


  if (!response.ok) {

    throw new Error(
      "Failed to fetch dishes"
    )

  }


  return await response.json()
}


// =================================
// GET ONE DISH
// =================================

export async function getDish(id) {

  const response = await fetch(
    `${API_URL}/dishes/${id}`
  )


  if (!response.ok) {

    throw new Error(
      "Failed to fetch dish"
    )

  }


  return await response.json()
}


// =================================
// CREATE DISH
// =================================

export async function createDish(dish) {

  const response = await fetch(
    `${API_URL}/dishes/`,
    {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(dish)
    }
  )


  if (!response.ok) {

    throw new Error(
      "Failed to create dish"
    )

  }


  return await response.json()
}


// =================================
// UPDATE DISH
// =================================

export async function updateDish(
  id,
  dish
) {

  const response = await fetch(
    `${API_URL}/dishes/${id}`,
    {
      method: "PUT",
      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(dish)
    }
  )


  if (!response.ok) {

    throw new Error(
      "Failed to update dish"
    )

  }


  return await response.json()
}


// =================================
// DELETE DISH
// =================================

export async function deleteDish(id) {

  const response = await fetch(
    `${API_URL}/dishes/${id}`,
    {
      method: "DELETE",
      credentials: "include"
    }
  )


  if (!response.ok) {

    throw new Error(
      "Failed to delete dish"
    )

  }


  return await response.json()
}