import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard(props) {
    let navigate = useNavigate();

    return (<Box sx={{
        marginTop: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <Typography component="h1" variant="h5" marginBottom={2}>
            BRF Kaptenen
        </Typography>
        <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => navigate("/apartment")}>Övernattningslokalen</Button >
            <Button variant="contained" onClick={() => navigate("/laundry")}>Tvättstuga</Button>
        </Stack>
    </Box>
    )

}

export default Dashboard;