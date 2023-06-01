import { Box, Button, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom";
import { isVerified, verify } from "../api";
import { useEffect, useMemo, useState } from "react";

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function Verify(props) {
    let navigate = useNavigate();
    let query = useQuery();
    let { user } = props;

    let hash = query.get("hash");
    let email = query.get("email");
    let [verified, setVerfied] = useState(false);
    let [error, setError] = useState();

    useEffect(() => {
        if (!user)
            navigate(`/login?next=/verify?${query}`)
        if (user)
            isVerified(user, email).then((res) => {
                if (res.status === 200)
                    setVerfied(true)
            })
    }, [email, user]);

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