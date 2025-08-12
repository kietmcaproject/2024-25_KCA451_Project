import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';

export default function NotificationsListPage() {
  const { notifications } = useNotifications();

  return (
    <Container>
      <Typography variant="h4">Notifications</Typography>
      <List>
        {notifications.map((notification) => (
          <Paper key={notification.id} elevation={3}>
            <ListItem>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  );
}
