<?php
include("dbconnect.php");

// Notify for fees due in 3 days
$sql_due = "SELECT id, name FROM students WHERE fees_due_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY) AND fees_status = 'pending'";
$result_due = $conn->query($sql_due);

while ($row = $result_due->fetch_assoc()) {
    $message = "Reminder: Student " . $row['name'] . " has fees due in 3 days.";
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'fee_due')");
    $stmt->bind_param("is", $row['id'], $message);
    $stmt->execute();
}

// Notify for overdue fees
$sql_overdue = "SELECT id, name FROM students WHERE fees_due_date < CURDATE() AND fees_status = 'pending'";
$result_overdue = $conn->query($sql_overdue);

while ($row = $result_overdue->fetch_assoc()) {
    $message = "Alert: Student " . $row['name'] . " has overdue fees.";
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message, type) VALUES (?, ?, 'fee_overdue')");
    $stmt->bind_param("is", $row['id'], $message);
    $stmt->execute();
}

echo "Notifications generated successfully.";
?>