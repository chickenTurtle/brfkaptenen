import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signUp } from "../api";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

function SignUp() {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState({});

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/")
    }
  });

  let onSignUp = (e) => {
    e.preventDefault();
    setLoading(true)
    signUp(name, email, password).then((res) => {
      if (res.status === 200)
        navigate("/");
      else {
        res.json().then((err) => {
          if (err.code?.match("email"))
            setError({ "email": err.message })
          else if (err.code?.match("password"))
            setError({ "password": err.message })
          else if (err.code?.match("name"))
            setError({ "name": err.message })
          else
            setError({ "general": err.message })
        })
      }
    }).catch(() => {
      setError({ "general": "Något gick fel" });
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <Box
      sx={{
        marginTop: 12,
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
        <Grid container spacing={2} width="400px">
          <Grid item xs={12} width={25}>
            <TextField
              autoFocus
              fullWidth
              required
              id="name"
              label="Namn"
              name="name"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              error={error['name'] || error['general'] ? true : false}
              helperText={error['name'] || error['name'] ? error['name'] || error['general'] : ""}
            />
          </Grid>
          <Grid item xs={12} width={25}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              error={error['email'] || error['general'] ? true : false}
              helperText={error['email'] || error['general'] ? error['email'] || error['general'] : ""}
            />
          </Grid>
          <Grid item xs={12} width={25}>
            <TextField
              required
              fullWidth
              name="password"
              label="Lösenord"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              error={error['password'] || error['general'] ? true : false}
              helperText={error['password'] || error['general'] ? error['password'] || error['general'] : ""}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
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
