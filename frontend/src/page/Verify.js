import { Box, Button, Typography } from "@mui/material"
import { useLocation } from "react-router-dom";
import { isVerified, verify } from "../api";
import { useEffect, useMemo, useState } from "react";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function Verify(props) {
    let { user } = props;
    let query = useQuery();
    let hash = query.get("hash");
    let email = query.get("email");
    let [verified, setVerfied] = useState(false);
    let [error, setError] = useState();

    useEffect(() => {
        isVerified(user, email).then((res) => {
            if (res.status === 200)
                setVerfied(true)
        })
    }, []);

    let onVerify = () => {
        verify(user, email, hash).then((res) => {
            if (res.status === 200)
                setVerfied(true)
            else
                setError("Något gick fel, kunde inte verifiera")
        })
    };

    return verified ? (
        <Box sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography component="h1" variant="h5">
                {email} är verifierad och kan nu logga in
            </Typography>
        </Box>
    ) : (
        <Box sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography component="h1" variant="h5">
                Vill du verifiera {email}?
            </Typography>
            <br />
            <Button onClick={onVerify} variant="contained">
                Verfiera
            </Button>
            <br />
            {error ? <Typography color="red">{error}</Typography> : ""}
        </Box>
    )
}

export default Verify;