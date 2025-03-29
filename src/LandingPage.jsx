import React, { useEffect, useState } from 'react';

const LandingPage = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [groupedItems, setGroupedItems] = useState({});

  // Fetch data from the Django API
  useEffect(() => {
    fetch('/api/items/')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching items:', error));
  }, []);

  // Filter items based on search term and group them by category
  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );

    const grouped = filtered.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    setGroupedItems(grouped);
  }, [items, filter]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Items Dashboard</h1>
      <input
        type="text"
        placeholder="Filter by name..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />
      {Object.keys(groupedItems).map(category => (
        <div key={category} style={{ marginBottom: '30px' }}>
          <h2>{category}</h2>
          <table border="1" cellPadding="8" cellSpacing="0" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                {/* You can add action buttons here for Edit/Delete */}
              </tr>
            </thead>
            <tbody>
              {groupedItems[category].map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
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
