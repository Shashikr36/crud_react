import React, { useEffect, useState } from "react";
import ItemForm from "./ItemForm"; // Import the ItemForm component
import "./LandingPage.css";

const LandingPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [groupedItems, setGroupedItems] = useState({});
  const [editingItem, setEditingItem] = useState(null); // State to hold the item being edited

  const [showForm, setShowForm] = useState(false); // State to toggle the ItemForm
  const [initialData, setInitialData] = useState({}); // State to hold initial data for the form

  const handleAddNewItem = () => {
    setInitialData({}); // Clear initial data for a new item
    setEditingItem(null); // Clear editing state
    setShowForm(true); // Show the form
  };
  const handleCancelForm = () => {
    setEditingItem(null); // Clear editing state
    setShowForm(false); // Hide the form
  };

  // Fetch data from the Django API
  useEffect(() => {
    fetch("https://crud-django-pya4.onrender.com/api/items/")
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  // Filter items based on search term and group them by category
  useEffect(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    const grouped = filtered.reduce((acc, item) => {
      const category = item.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    setGroupedItems(grouped);
  }, [items, filter]);

  // Handle delete functionality
  const handleDelete = async (id) => {
    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const response = await fetch(`https://crud-django-pya4.onrender.com/api/items/${id}/`, {
        method: "DELETE",
        headers: {
          "X-CSRFToken": csrfToken, // Include CSRF token in the headers
        },
      });

      if (response.ok) {
        // Remove the deleted item from the state
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit functionality
  const handleEdit = (item) => {
    setEditingItem(item); // Set the item to be edited
    setInitialData(item); // Set the initial data for the form
    setShowForm(true); // Show the form
  };

  // Handle form submission success
  const handleFormSuccess = (updatedItem) => {
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        // Update the existing item
        prevItems[index] = updatedItem;
        return [...prevItems];
      } else {
        // Add the new item
        return [...prevItems, updatedItem];
      }
    });
    setEditingItem(null); // Clear the editing state
    setShowForm(false); // Hide the form
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Items Dashboard</h1>
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />
      {/* Button to add a new item */}
      <button onClick={handleAddNewItem} style={{ marginBottom: "20px" }}>
        Add New Item
      </button>
      {showForm && (
        <ItemForm
          initialData={initialData}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      )}
      {/* Render the ItemForm for editing */}
      {editingItem && (
        <div style={{ marginBottom: "20px" }}>
          <h2>Edit Item</h2>
          <ItemForm initialData={editingItem} onSuccess={handleFormSuccess} />
        </div>
      )}

      {Object.keys(groupedItems).map((category) => (
        <div key={category} style={{ marginBottom: "30px" }}>
          <h2>{category}</h2>
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[category].map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
