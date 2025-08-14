import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from '../../firebase';
import * as XLSX from 'xlsx';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function InventoryOverview() {
  const [medicines, setMedicines] = useState([]);
  const medicinesCollectionRef = collection(firestore, "medicine_inventory");
  let counter = 1;

  const navigate = useNavigate();

  // Fetch medicine data from Firestore
  const getTypes = useCallback(async () => {
    const data = await getDocs(medicinesCollectionRef);
    setMedicines(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [medicinesCollectionRef]);

  // Handle deletion of medicine
  const handleDeleteButton = async (id) => {
    const medDoc = doc(firestore, "medicine_inventory", id);
    await deleteDoc(medDoc);
    getTypes(); // Refresh the data after deletion
  };

  // Fetch medicines on component mount
  useEffect(() => {
    getTypes();
  }, [getTypes]);

  // Handle edit action by storing the selected medicine in local storage
  const handleEditButton = (medicine) => {
    localStorage.setItem("medicine_obj", JSON.stringify(medicine));
    navigate("/inventory/edit"); // Navigate to the update page
  };

  // Export inventory data to Excel
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      medicines.map((medicine) => ({
        Name: medicine.name,
        Power: medicine.power,
        Price: medicine.price,
        Stock: medicine.stock,
        "Expiry Date": medicine.expiryDate,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medicine Inventory");

    // Generate an Excel file and download it
    XLSX.writeFile(workbook, "Medicine_Inventory.xlsx");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#3f51b5' }}>
          Medicine Inventory
        </Typography>
        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <Typography variant="h6" component="div" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Inventory List
              </Typography>
              <Box>
                <Button
                  component={Link}
                  to="/inventory/add"
                  variant="contained"
                  color="primary"
                  sx={{ marginLeft: 2 }}
                >
                  Add New Medicine
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: 2 }}
                  onClick={handleExportToExcel}
                >
                  Export to Excel
                </Button>
              </Box>
            </Box>
            <TableContainer sx={{ boxShadow: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Medicine Name<sup>Power</sup></TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Medicine Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell>{counter++}</TableCell>
                      <TableCell>{medicine.name} <sup>{medicine.power}</sup></TableCell>
                      <TableCell>₹{medicine.price}</TableCell>
                      <TableCell>{medicine.stock}</TableCell>
                      <TableCell>{medicine.expiryDate}</TableCell>
                      <TableCell>
                        <IconButton
                          color="success"
                          onClick={() => handleEditButton(medicine)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteButton(medicine.id)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
