import { Box, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { differenceInDays } from "date-fns";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function BookingComplete(props) {
    let query = useQuery();
    let from = new Date(query.get("from"));
    let to = new Date(query.get("to"));
    let sum = differenceInDays(to, from) * process.env.REACT_APP_PRICE;

    return (
        <Box sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography component="h1" variant="h5">
                Bokningsbekräftelse
            </Typography>
            <Typography variant="subtitle1" marginBottom={2} textAlign="center">
                Glöm inte att betala in <b>{sum} kr</b> till BRF Kaptenens konto:
                <br />
                <b>{process.env.REACT_APP_ACCOUNT_NUMBER}</b>
            </Typography>
            <Box sx={{ mt: 5, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <TextField
                            label="Incheckning"
                            disabled={true}
                            color="primary"
                            value={from.toLocaleDateString("sv")}
                            InputProps={{
                                readOnly: true,
                                endAdornment: <InputAdornment position="end">12:00</InputAdornment>,
                            }}
                            sx={style}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField
                            label="Utcheckning"
                            disabled={true}
                            value={to.toLocaleDateString("sv")}
                            InputProps={{
                                readOnly: true,
                                endAdornment: <InputAdornment position="end">12:00</InputAdornment>,
                            }}
                            sx={style}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

const style = {
    Input: {
        "&.Mui-disabled": {
            color: "white",
            opacity: 1,
            WebkitTextFillColor: "white"
        },
    },
    Label: {
        "&.Mui-disabled": {
            color: "white",
            opacity: 1,
        }
    },
    P: {
        color: "white"
    }
}

export default BookingComplete;