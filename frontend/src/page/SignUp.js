import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUp() {
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState();

  let onSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error);
      });
  };

  return (
    <div className="app">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
    </div>
  );
}

export default SignUp;
