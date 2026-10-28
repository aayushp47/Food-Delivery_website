import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { createInventoryItem, getInventory, updateInventoryItem } from "../services/inventoryService"

const filterOptions = ["All", "Vegetables", "Dairy", "Spices", "Grains", "Herbs", "Proteins", "Pantry", "Beverages"]
const defaultForm = {
  item: "",
  category: "Vegetables",
  stock: 0,
  unit: "kg",
  reorderLevel: 0,
  supplier: "",
  status: "Healthy",
}

function formatStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-")
}

function AdminInventory() {
  const [inventory, setInventory] = useState([])
  const [activeFilter, setActiveFilter] = useState("All")
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let isActive = true

    getInventory()
      .then((items) => {
        if (isActive) setInventory(items)
      })
      .catch((loadError) => {
        if (isActive) setError(loadError.message)
      })
      .finally(() => {
        if (isActive) setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const visibleInventory = useMemo(() => {
    if (activeFilter === "All") return inventory
    return inventory.filter((item) => item.category === activeFilter)
  }, [activeFilter, inventory])

  const metrics = useMemo(() => {
    const totalItems = inventory.length
    const lowStock = inventory.filter((item) => item.stock <= item.reorderLevel).length
    const healthyItems = inventory.filter((item) => item.status === "Healthy").length
    const watchItems = inventory.filter((item) => item.status === "Watch").length

    return { totalItems, lowStock, healthyItems, watchItems }
  }, [inventory])

  function handleExport() {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(
      inventory.map((item) => ({
        Item: item.item,
        Category: item.category,
        Available: item.stock,
        Unit: item.unit,
        "Reorder Level": item.reorderLevel,
        Supplier: item.supplier,
        Updated: item.lastUpdated,
        Status: item.status,
      })),
      {
        header: ["Item", "Category", "Available", "Unit", "Reorder Level", "Supplier", "Updated", "Status"],
      }
    )

    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory")
    const workbookData = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([workbookData], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "foodhive-inventory.xlsx"
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function openAddModal() {
    setEditingItem(null)
    setFormData(defaultForm)
    setShowModal(true)
  }

  function openCustomizeModal(item) {
    setEditingItem(item.id)
    setFormData({
      item: item.item,
      category: item.category,
      stock: item.stock,
      unit: item.unit,
      reorderLevel: item.reorderLevel,
      supplier: item.supplier,
      status: item.status,
    })
    setShowModal(true)
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: name === "stock" || name === "reorderLevel" ? Number(value) : value,
    }))
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const nextEntry = {
      item: formData.item,
      category: formData.category,
      stock: Number(formData.stock),
      unit: formData.unit,
      reorderLevel: Number(formData.reorderLevel),
      supplier: formData.supplier,
      lastUpdated: "Just now",
      status: formData.status,
    }

    try {
      const savedItem = editingItem
        ? await updateInventoryItem(editingItem, nextEntry)
        : await createInventoryItem(nextEntry)

      setInventory((current) => editingItem
        ? current.map((item) => (item.id === editingItem ? savedItem : item))
        : [savedItem, ...current]
      )
      setShowModal(false)
      setEditingItem(null)
      setFormData(defaultForm)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-content inventory-page">
      {error && <p role="alert">{error}</p>}
      <section className="admin-page-intro inventory-topbar">
        <div>
          <p className="eyebrow">Inventory management</p>
          <h2>Ingredient stock overview</h2>
        </div>

        <div className="inventory-action-bar">
          <button type="button" className="inventory-action-button secondary" onClick={handleExport}>
            <span aria-hidden="true">↗</span>
            Export
          </button>
          <button type="button" className="inventory-action-button primary" onClick={openAddModal}>
            <span aria-hidden="true">＋</span>
            Add ingredient
          </button>
        </div>
      </section>

      <section className="inventory-summary-grid">
        <article className="inventory-metric-card">
          <span className="inventory-metric-label">Total items</span>
          <strong>{metrics.totalItems}</strong>
          <small>Across all categories</small>
        </article>
        <article className="inventory-metric-card accent-warning">
          <span className="inventory-metric-label">Low stock</span>
          <strong>{metrics.lowStock}</strong>
          <small>Need reorder soon</small>
        </article>
        <article className="inventory-metric-card accent-success">
          <span className="inventory-metric-label">Healthy stock</span>
          <strong>{metrics.healthyItems}</strong>
          <small>Within target range</small>
        </article>
        <article className="inventory-metric-card accent-blue">
          <span className="inventory-metric-label">Watch list</span>
          <strong>{metrics.watchItems}</strong>
          <small>Monitor closely</small>
        </article>
      </section>

      <section className="inventory-panel">
        <div className="inventory-panel-header">
          <div>
            <p className="eyebrow">Procurement</p>
            <h3>Inventory status</h3>
          </div>
          <div className="inventory-filter-bar" aria-label="Inventory filters">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={option === activeFilter ? "inventory-filter active" : "inventory-filter"}
                onClick={() => setActiveFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="inventory-table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Available</th>
                <th>Reorder level</th>
                <th>Supplier</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Customize</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="8">Loading inventory...</td></tr>
              )}
              {!loading && !error && inventory.length === 0 && (
                <tr><td colSpan="8">No inventory items found.</td></tr>
              )}
              {visibleInventory.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="inventory-item-cell">
                      <span className="inventory-icon">◉</span>
                      <div>
                        <strong>{item.item}</strong>
                        <small>{item.unit}</small>
                      </div>
                    </div>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <strong>{item.stock}</strong>
                    <small>{item.unit}</small>
                  </td>
                  <td>{item.reorderLevel} {item.unit}</td>
                  <td>{item.supplier}</td>
                  <td>{item.lastUpdated}</td>
                  <td>
                    <span className={`status-pill ${formatStatusClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td>
                    <button type="button" className="inventory-customize-button" onClick={() => openCustomizeModal(item)}>
                      Customize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="inventory-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="inventory-modal" onClick={(event) => event.stopPropagation()}>
            <div className="inventory-modal-header">
              <div>
                <p className="eyebrow">Inventory update</p>
                <h3>{editingItem ? "Customize ingredient" : "Add ingredient"}</h3>
              </div>
              <button type="button" className="inventory-close-button" onClick={() => setShowModal(false)} aria-label="Close">
                ×
              </button>
            </div>

            <form className="inventory-form" onSubmit={handleFormSubmit}>
              <div className="inventory-form-grid">
                <label>
                  Ingredient name
                  <input name="item" value={formData.item} onChange={handleFormChange} required />
                </label>

                <label>
                  Category
                  <select name="category" value={formData.category} onChange={handleFormChange}>
                    {filterOptions.filter((option) => option !== "All").map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Stock
                  <input type="number" name="stock" value={formData.stock} min="0" onChange={handleFormChange} required />
                </label>

                <label>
                  Unit
                  <input name="unit" value={formData.unit} onChange={handleFormChange} required />
                </label>

                <label>
                  Reorder level
                  <input type="number" name="reorderLevel" min="0" value={formData.reorderLevel} onChange={handleFormChange} required />
                </label>

                <label>
                  Supplier
                  <input name="supplier" value={formData.supplier} onChange={handleFormChange} required />
                </label>

                <label className="inventory-full-width">
                  Status
                  <select name="status" value={formData.status} onChange={handleFormChange}>
                    <option value="Healthy">Healthy</option>
                    <option value="Watch">Watch</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
              </div>

              <div className="inventory-modal-actions">
                <button type="button" className="inventory-action-button secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="inventory-action-button primary">
                  {saving ? "Saving..." : editingItem ? "Save changes" : "Save ingredient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminInventory
