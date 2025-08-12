import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import AdminHeader from "../../components/AdminHeader";  // Adjust the path based on your project structure
// import AdminSidebar from "../../components/AdminSidebar"; // Adjust the path based on your project structure
import { firestore } from '../../firebase';
import { collection, doc, updateDoc } from "firebase/firestore";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function EditDrugPage() {
  const navigate = useNavigate();
  const medicinesCollectionRef = collection(firestore, "medicine_inventory");
  const [medicine, setMedicine] = useState(JSON.parse(localStorage.getItem("medicine_obj")));
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdateMedicine = async () => {
    if (medicine.name && medicine.power && medicine.price && medicine.stock && medicine.expiryDate) {
      const medDoc = doc(medicinesCollectionRef, medicine.id);
      await updateDoc(medDoc, medicine);
      setErrorMsg("");
      setSuccessMsg("Medicine updated Successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/inventory");
      }, 1000);
    } else {
      setErrorMsg("Please fill out all the required fields!");
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* <AdminSidebar /> */}
      <Container sx={{ flexGrow: 1, padding: 4 }}>
        {/* <AdminHeader /> */}
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Change Medicine</Typography>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit Medicine Details
            <Link to="/inventory" style={{ float: 'right' }}>
              <Button variant="contained" color="error" size="small">Go BACK</Button>
            </Link>
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Medicine Name"
                variant="outlined"
                fullWidth
                value={medicine.name}
                onChange={(event) => setMedicine((prev) => ({ ...prev, name: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medicine Power"
                variant="outlined"
                fullWidth
                value={medicine.power}
                onChange={(event) => setMedicine((prev) => ({ ...prev, power: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Expiry Date"
                variant="outlined"
                type="date"
                fullWidth
                value={medicine.expiryDate}
                onChange={(event) => setMedicine((prev) => ({ ...prev, expiryDate: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medicine Price (in ₹)"
                variant="outlined"
                fullWidth
                value={medicine.price}
                onChange={(event) => setMedicine((prev) => ({ ...prev, price: event.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Medicine Stock"
                variant="outlined"
                fullWidth
                value={medicine.stock}
                onChange={(event) => setMedicine((prev) => ({ ...prev, stock: event.target.value }))}
              />
            </Grid>
          </Grid>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Typography color="error">{errorMsg}</Typography>
            <Typography color="success">{successMsg}</Typography>
            <Button variant="contained" color="success" onClick={handleUpdateMedicine}>
              Update Medicine
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
