import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';

export default function AlertDetailPage() {
  const { id } = useParams();
  const { getNotificationById } = useNotifications();
  const notification = getNotificationById(id);

  if (!notification) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4">{notification.title}</Typography>
        <Typography>{notification.message}</Typography>
        <Typography>Date: {notification.date}</Typography>
        <Typography>Severity: {notification.severity}</Typography>
      </Paper>
    </Container>
  );
}
