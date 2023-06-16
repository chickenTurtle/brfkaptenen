import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TimeRange from "../components/TimeRange";

function Laundry() {
    let navigate = useNavigate();

    return (
        <Box sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography component="h1" variant="h5">
                BRF Kaptenen bokningssida
            </Typography>
            <Typography variant="subtitle1" marginBottom={2}>
                Tvättstuga
            </Typography>
            <TimeRange />
        </Box>
    )

}

export default Laundry;