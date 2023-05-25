import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/")
    }
  });

  let onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <Box
      sx={{
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5" marginBottom={2}>
        Logga in
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={onLogin}>
        <TextField
          margin="normal"
          error={error ? true : false}
          helperText={error ? "Fel email eller lösenord" : ""}
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          error={error ? true : false}
          helperText={error ? "Fel email eller lösenord" : ""}
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Lösenord"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Logga in
        </Button>
        <Grid container>
          <Grid item xs>
            <Button type="link" variant="body2" onClick={() => navigate("/forgot")}>
              Glömt lösenord
            </Button>
          </Grid>
          <Grid item>
            <Button type="link" variant="body2" onClick={() => navigate("/signup")}>
              Skapa konto
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box >
  );
}

export default Login;
