import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Logout() {
  const navigate = useNavigate();
  signOut(auth)
    .then(() => {
      navigate("/");
    })
    .catch(() => {
      navigate("/");
    });

  return <div className="app"></div>;
}

export default Logout;
