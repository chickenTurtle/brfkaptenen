import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";

function Login() {
  const navigate = useNavigate();
  const s = useLocation();

  let [email, setEmail] = useState("");
  let [loading, setLoading] = useState(false);
  let [password, setPassword] = useState("");
  let [error, setError] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/");
    }
  });

  let onLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        let next = s.search.split("?next=")[1];
        if (next) navigate(next);
        else navigate("/");
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
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
        Logga in
      </Typography>
      <Box component="form" noValidate onSubmit={onLogin}>
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
          disabled={loading}
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
          disabled={loading}
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
        <Grid container>
          <Grid item xs>
            <Button
              type="link"
              variant="body2"
              onClick={() => navigate("/forgot")}
            >
              Glömt lösenord
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="link"
              variant="body2"
              onClick={() => navigate("/signup")}
            >
              Skapa konto
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
