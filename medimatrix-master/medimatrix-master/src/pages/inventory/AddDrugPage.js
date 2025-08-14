import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { firestore } from '../../firebase';
import { collection, addDoc } from "firebase/firestore";
import { Box, Container, Grid, TextField, Button, Typography, Card, CardHeader, CardContent } from "@mui/material";

export default function AddDrugPage() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [medicine, setMedicine] = useState({
    name: "",
    power: "",
    price: "",
    stock: "",
    expiryDate: "",
  });

  const medicinesCollectionRef = collection(firestore, "medicine_inventory");

  // Function to add new medicine to Firestore
  const handleAddMedicine = async () => {
    if (
      medicine.name &&
      medicine.power &&
      medicine.price &&
      medicine.stock &&
      medicine.expiryDate
    ) {
      setErrorMsg("");
      await addDoc(medicinesCollectionRef, {
        name: medicine.name,
        power: medicine.power,
        price: medicine.price,
        stock: medicine.stock,
        expiryDate: medicine.expiryDate,
      });
      setSuccessMsg("Medicine added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/inventory");
      }, 1000);
    } else {
      setErrorMsg("Please fill out all the required fields!");
    }
  };

  return (
    <Box display="flex" flexDirection="column" sx={{ padding: 2 }}>
      <Container>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Create Medicine</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                title="New Medicine Details"
                action={
                  <Link to="/inventory">
                    <Button variant="contained" color="error" size="small">
                      Go BACK
                    </Button>
                  </Link>
                }
              />
              <CardContent>
                {/* Medicine Name */}
                <TextField
                  fullWidth
                  label="Medicine Name"
                  variant="outlined"
                  value={medicine.name}
                  onChange={(event) =>
                    setMedicine((prev) => ({ ...prev, name: event.target.value }))
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* Medicine Power */}
                <TextField
                  fullWidth
                  label="Medicine Power"
                  variant="outlined"
                  value={medicine.power}
                  onChange={(event) =>
                    setMedicine((prev) => ({ ...prev, power: event.target.value }))
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* Medicine Price */}
                <TextField
                  fullWidth
                  label="Medicine Price (in ₹.)"
                  variant="outlined"
                  value={medicine.price}
                  onChange={(event) =>
                    setMedicine((prev) => ({ ...prev, price: event.target.value }))
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* Medicine Stock */}
                <TextField
                  fullWidth
                  label="Medicine Stock"
                  variant="outlined"
                  value={medicine.stock}
                  onChange={(event) =>
                    setMedicine((prev) => ({ ...prev, stock: event.target.value }))
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* Expiry Date */}
                <TextField
                  fullWidth
                  type="date"
                  label="Expiry Date"
                  variant="outlined"
                  value={medicine.expiryDate}
                  onChange={(event) =>
                    setMedicine((prev) => ({ ...prev, expiryDate: event.target.value }))
                  }
                  sx={{ marginBottom: 2 }}
                />
              </CardContent>

              {/* Success/Error Messages */}
              <Box textAlign="center" sx={{ padding: 2 }}>
                {errorMsg && <Typography color="error">{errorMsg}</Typography>}
                {successMsg && <Typography color="success.main">{successMsg}</Typography>}
                <Button variant="contained" color="primary" onClick={handleAddMedicine}>
                  Add Medicine
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
