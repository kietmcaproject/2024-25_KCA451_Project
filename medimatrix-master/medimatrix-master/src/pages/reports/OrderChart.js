// src/pages/reports/OrderChart.js

import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useOrders } from '../../contexts/OrderContext'; // Create a context for order management

const OrderChart = () => {
  const { orders } = useOrders(); // Assume you have order data

  // Simulate data for chart (customize this based on your actual order data)
  const data = [
    { name: 'Completed', value: orders.filter(order => order.status === 'completed').length },
    { name: 'Pending', value: orders.filter(order => order.status === 'pending').length },
    { name: 'Cancelled', value: orders.filter(order => order.status === 'cancelled').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" label outerRadius={80} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrderChart;
