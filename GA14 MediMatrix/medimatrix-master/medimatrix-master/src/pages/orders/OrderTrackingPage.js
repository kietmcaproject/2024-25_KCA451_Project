import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useOrders } from '../../contexts/OrderContext';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { getOrderById } = useOrders();
  const order = getOrderById(id);

  if (!order) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4">Order Tracking</Typography>
      <Typography variant="h6">Order ID: {order.id}</Typography>
      <Typography>Status: {order.status}</Typography>
      {/* Additional tracking details */}
    </Container>
  );
}
