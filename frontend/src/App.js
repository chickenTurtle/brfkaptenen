import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./page/Home";
import DateSelect from "./page/DateSelect";
import SignUp from "./page/SignUp";
import Login from "./page/Login";
import Logout from "./page/Logout";
import Loading from "./components/Loading";
import DateRange from "./components/DateRange";

function App() {
  const [user, setUser] = useState("not_checked");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
    } else {
      setUser();
    }
  });

  return user === "not_checked" ? (
    <Loading />
  ) : (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/*" element={user ? <DateSelect user={user} /> : <Home />} />
    </Routes>
  );
}

export default App;
