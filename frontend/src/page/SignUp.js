import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signUp } from "../api";

function SignUp() {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [name, setName] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState();

  let onSignUp = () => {
    signUp(name, email, password).then(() => {
      navigate("/");
    }).catch((err) => {
      setError(err);
    })
  };

  return (
    <div className="app">
      <div>
        <label>Namn</label>
        <br />
        <input
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label>Email</label>
        <br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Lösenord</label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={() => onSignUp()}>Skapa konto</button>
        <br />
        {error ? error.message : ""}
      </div>
    </div >
  );
}

export default SignUp;
