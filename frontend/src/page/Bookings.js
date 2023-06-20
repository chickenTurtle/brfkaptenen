import { Box, Button, Typography } from "@mui/material";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings } from "../api";
import Loading from "../components/Loading";

function Bookings(props) {
    let navigate = useNavigate();
    let [bookings, setBookings] = useState([]);
    let [loading, setLoading] = useState(true);

    let updateBookings = () => {
        return getBookings(props.user).then((res) => res.json().then((events) => {
            setBookings(events);
            setLoading(false);
        }))
    }

    useEffect(() => {
        updateBookings();
    }, []);

    useEffect(() => {
        if (!props.user)
            navigate(`/`)
    }, [props.user]);

    return (
        <Box sx={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {loading ? <Loading overlay={true} /> : ""}
            <Typography component="h1" variant="h5">
                Mina bokningar
            </Typography>
            {bookings.length > 0 ?
                <>
                    <Typography variant="subtitle1" marginBottom={2} textAlign="center">
                        Övernattningslokalen
                    </Typography>
                    <ol>{bookings.toReversed().map((event) => {
                        return (
                            <li>
                                {format(new Date(event.start.dateTime), "yyyy-MM-dd")} - {format(new Date(event.end.dateTime), "yyyy-MM-dd")}
                            </li>
                        )
                    })}
                    </ol>
                </>
                :
                <>
                    <Typography variant="subtitle1" marginBottom={2} textAlign="center">
                        Inga bokningar
                    </Typography>
                    <Button variant="contained" onClick={() => navigate("/apartment")}>Boka här!</Button>
                </>
            }
        </Box>
    )
}

export default Bookings;