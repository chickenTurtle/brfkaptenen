import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';

function Home() {
  const navigate = useNavigate();

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
        BRF Kaptenen bokningssida
      </Typography>
      <Stack direction="column" spacing={2}>
        <Button variant="contained" onClick={() => navigate("/login")}>Logga in</Button >
        <Button variant="contained" onClick={() => navigate("/signup")}>Skapa konto</Button>
      </Stack>
    </Box >
  );
}

export default Home;
