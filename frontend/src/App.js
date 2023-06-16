import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./page/Home";
import Apartment from "./page/Apartment";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Logout from "./page/Logout";
import Loading from "./components/Loading";
import BookingComplete from "./page/BookingComplete";
import Verify from "./page/Verify";
import Dashboard from "./page/Dashboard";
import Laundry from "./page/Laundry";
import { AppBar, Box, Button, Toolbar, Typography, Link } from "@mui/material";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";


function NavBar(props) {
  let navigate = useNavigate();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link href="/" color="inherit" underline="hover">BRF Kaptenen</Link>
            </Typography>
            <Button color="inherit" element="a" href="https://google.se">Dokument</Button>
            <Button color="inherit" onClick={() => navigate("/logout")}>Logga ut</Button>
          </Toolbar>
        </AppBar>
      </Box>
      {props.children}
    </>
  )
}

function App() {
  const [user, setUser] = useState("not_checked");

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: "#282c34",
        paper: "#282c34",
      },
    },
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser();
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar>
        {user === "not_checked" ? <Loading /> :
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/complete" element={<BookingComplete />} />
            <Route path="/verify" element={<Verify user={user} />} />
            <Route path="/apartment" element={<Apartment user={user} />} />
            <Route path="/laundry" element={<Laundry user={user} />} />
            <Route path="/*" element={user ? <Dashboard /> : <Home />} />
          </Routes>
        }
      </NavBar>
    </ThemeProvider>
  );
}

export default App;

