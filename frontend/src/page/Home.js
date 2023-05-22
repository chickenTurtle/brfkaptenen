import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="app">
      BRF Kaptenen bokningssida
      <button onClick={() => navigate("/login")}>Logga in</button>
      <button onClick={() => navigate("/signup")}>Skapa konto</button>
    </div>
  );
}

export default Home;
