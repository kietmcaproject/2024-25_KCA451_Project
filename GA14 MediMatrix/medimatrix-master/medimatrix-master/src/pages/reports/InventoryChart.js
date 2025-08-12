// src/pages/reports/InventoryChart.js

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInventory } from '../../contexts/InventoryContext';

const InventoryChart = () => {
  const { inventory } = useInventory();

  // Simulate data for chart (you can customize this based on your actual inventory data)
  const data = inventory.map(item => ({
    name: item.name,
    stock: item.stock,
    sold: item.sold, // Assume you have a sold field in your inventory
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="stock" stroke="#82ca9d" />
        <Line type="monotone" dataKey="sold" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default InventoryChart;
