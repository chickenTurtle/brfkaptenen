import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);

  let onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    sendPasswordResetEmail(auth, email).then(() => {
      navigate("/");
    });
  };

  return (
    <Box
      sx={{
        marginTop: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5" marginBottom={2}>
        Glömt ditt lösenord?
      </Typography>
      <Box component="form" noValidate onSubmit={onSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          disabled={loading}
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          Logga in
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
