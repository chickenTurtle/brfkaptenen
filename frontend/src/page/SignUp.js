import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signUp } from "../api";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function SignUp() {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/")
    }
  });

  let onSignUp = (e) => {
    e.preventDefault();
    signUp(name, email, password).then(() => {
      navigate("/");
    }).catch((error) => {
      setError(error);
    })
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }
      }
    >
      <Typography component="h1" variant="h5">
        Skapa konto
      </Typography>
      <Box component="form" noValidate onSubmit={onSignUp} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              required
              fullWidth
              id="name"
              label="Namn"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={error ? true : false}
              helperText={error ? "Något gick fel" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error ? true : false}
              helperText={error ? "Något gick fel" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Lösenord"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error ? true : false}
              helperText={error ? "Något gick fel" : ""}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Skapa konto
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button type="link" variant="body2" onClick={() => navigate("/login")}>
              Har du redan ett konto? Logga in
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box >
  );
}

export default SignUp;
