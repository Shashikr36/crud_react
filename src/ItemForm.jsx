import React, { useState } from 'react';

const ItemForm = ({ initialData = {}, onSuccess }) => {
  const [name, setName] = useState(initialData.name || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [price, setPrice] = useState(initialData.price || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, category, description, price };

    try {
      // If there's an id, update; otherwise, create
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id ? `/api/items/${initialData.id}/` : '/api/items/';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        console.error('Error submitting form');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Category:</label>
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} required />
      </div>
      <div>
        <label>Description:</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div>
        <label>Price:</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} step="0.01" />
      </div>
      <button type="submit">{initialData.id ? 'Update' : 'Create'}</button>
    </form>
  );
};

export default ItemForm;
