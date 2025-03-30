import React, { useState } from "react";
import "./ItemForm.css";

const ItemForm = ({ initialData = {}, onSuccess, onCancel }) => {
  const [name, setName] = useState(initialData.name || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, category, description, price };

    try {
      const csrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="))
        ?.split("=")[1];

      const method = initialData.id ? "PUT" : "POST";
      const url = initialData.id
        ? `https://crud-django-pya4.onrender.com/api/items/${initialData.id}/`
        : "https://crud-django-pya4.onrender.com/api/items/";
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        console.error("Error submitting form");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h2>{initialData.id ? "Edit Item" : "Add New Item"}</h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="submit-button">
          {initialData.id ? "Update" : "Create"}
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
