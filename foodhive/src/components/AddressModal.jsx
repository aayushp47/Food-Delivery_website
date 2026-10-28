import { useState } from "react"

function AddressModal({
  addresses,
  setAddresses,
  selectedAddress,
  setSelectedAddress,
  setShowAddressModal,
  onAddressSelected,
  onCreateAddress,
  onUpdateAddress,
  onDeleteAddress
}) {

  const emptyAddress = {
    type: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  }

  const [form, setForm] = useState(emptyAddress)

  const [editingAddressId, setEditingAddressId] =
    useState(null)

  function handleChange(event) {

    const { name, value } = event.target

    setForm({
      ...form,
      [name]: value
    })
  }


  async function handleSubmit(event) {

    event.preventDefault()

    const trimmedName = form.name.trim()
    const trimmedPhone = form.phone.trim()
    const trimmedAddress = form.address.trim()
    const trimmedCity = form.city.trim()
    const trimmedPincode = form.pincode.trim()


    if (!/^[0-9]{10}$/.test(trimmedPhone)) {

      alert("Please enter a valid 10-digit phone number.")

      return
    }


    if (!/^[0-9]{6}$/.test(trimmedPincode)) {

      alert("Please enter a valid 6-digit pincode.")

      return
    }


    const addressData = {
      type: form.type,
      name: trimmedName,
      phone: trimmedPhone,
      address: trimmedAddress,
      city: trimmedCity,
      pincode: trimmedPincode
    }

    try {
      const savedAddress = editingAddressId
        ? await onUpdateAddress(editingAddressId, addressData)
        : await onCreateAddress(addressData)

      setAddresses(currentAddresses => editingAddressId
        ? currentAddresses.map(address =>
            address.id === savedAddress.id
              ? savedAddress
              : address
          )
        : [...currentAddresses, savedAddress]
      )
      setSelectedAddress(savedAddress)
      setForm(emptyAddress)
      setEditingAddressId(null)
      setShowAddressModal(false)
      onAddressSelected?.(savedAddress)
    } catch (error) {
      alert(error.message)
    }
  }


  function selectAddress(address) {

    setSelectedAddress(address)
  }


  function editAddress(address) {

    setEditingAddressId(address.id)
    setForm({
      type: address.type,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      pincode: address.pincode
    })
  }


  async function deleteAddress(id) {

    try {
      await onDeleteAddress(id)
    } catch (error) {
      alert(error.message)
      return
    }

    const updatedAddresses =
      addresses.filter(
        address => address.id !== id
      )


    setAddresses(updatedAddresses)


    if (selectedAddress?.id === id) {

      setSelectedAddress(
        updatedAddresses.length > 0
          ? updatedAddresses[0]
          : null
      )
    }
  }


  return (

    <div
      className="address-modal-overlay"
      onClick={() =>
        setShowAddressModal(false)
      }
    >

      <div
        className="address-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="address-modal-header">

          <div>

            <h2>
              Delivery Address
            </h2>

            <p>
              Choose where you want your food delivered
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              setShowAddressModal(false)
            }
          >
            ×
          </button>

        </div>


        {/* =================================================
            SAVED ADDRESSES
            ================================================= */}

        {addresses.length > 0 && (

          <div className="saved-addresses">

            <h3>
              Saved Addresses
            </h3>


            {addresses.map((address) => (

              <div
                className={
                  selectedAddress?.id === address.id
                    ? "address-card selected"
                    : "address-card"
                }

                key={address.id}

                onClick={() =>
                  selectAddress(address)
                }
              >

                <div className="address-card-top">

                  <div className="address-type">

                    <span>

                      {address.type === "Home"
                        ? "🏠"
                        : address.type === "Work"
                          ? "🏢"
                          : "📍"
                      }

                    </span>


                    <strong>
                      {address.type}
                    </strong>

                  </div>


                  {selectedAddress?.id === address.id && (

                    <span className="address-selected">
                      ✓
                    </span>

                  )}

                </div>


                <strong>
                  {address.name}
                </strong>


                <p>
                  {address.address}
                </p>


                <p>
                  {address.city} - {address.pincode}
                </p>


                <p>
                  📞 {address.phone}
                </p>


                <button
                  type="button"
                  className="delete-address"

                  onClick={(event) => {

                    event.stopPropagation()

                    deleteAddress(address.id)

                  }}
                >
                  Delete
                </button>

                <button
                  type="button"
                  className="edit-address"
                  onClick={(event) => {
                    event.stopPropagation()
                    editAddress(address)
                  }}
                >
                  Edit
                </button>

              </div>

            ))}

            <button
              type="button"
              className="save-address-button"
              onClick={() => {
                setShowAddressModal(false)
                onAddressSelected?.(selectedAddress)
              }}
              disabled={!selectedAddress}
            >
              Continue to Payment
            </button>

          </div>

        )}


        {/* =================================================
            ADD ADDRESS
            ================================================= */}

        <div className="add-address-section">

          <h3>
              {editingAddressId ? "Edit Address" : "Add New Address"}
          </h3>


          {/* ADDRESS TYPE */}

          <div className="address-type-buttons">

            {[
              "Home",
              "Work",
              "Other"
            ].map((type) => (

              <button
                type="button"
                key={type}

                className={
                  form.type === type
                    ? "address-type-button active"
                    : "address-type-button"
                }

                onClick={() =>
                  setForm({
                    ...form,
                    type
                  })
                }
              >

                {type === "Home"
                  ? "🏠"
                  : type === "Work"
                    ? "🏢"
                    : "📍"
                }

                {" "}

                {type}

              </button>

            ))}

          </div>


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="address-form-grid">


              {/* NAME */}

              <div className="address-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* PHONE */}

              <div className="address-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  inputMode="numeric"
                  required
                />

              </div>


              {/* ADDRESS */}

              <div className="address-field address-full">

                <label>
                  Complete Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Building / Street"
                  rows="3"
                  required
                />

              </div>


              {/* CITY */}

              <div className="address-field">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

              </div>


              {/* PINCODE */}

              <div className="address-field">

                <label>
                  Pincode
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  inputMode="numeric"
                  required
                />

              </div>

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="save-address-button"
            >
              {editingAddressId ? "Update Address" : "Save Address"}
            </button>

          </form>

        </div>

      </div>

    </div>
  )
}

export default AddressModal