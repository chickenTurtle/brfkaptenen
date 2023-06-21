import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { format, differenceInDays, day } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings } from "../api";
import Loading from "../components/Loading";

function Bookings(props) {
    let navigate = useNavigate();
    let [bookings, setBookings] = useState([]);
    let [loading, setLoading] = useState(true);
    let days = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"];

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
            flexWrap: 'wrap',
            flexDirection: 'column',
            alignItems: 'center'
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
                    {bookings.toReversed().map((event) => {
                        let start = new Date(event.start.dateTime);
                        let end = new Date(event.end.dateTime);
                        let length = differenceInDays(end, start);
                        let price = length * process.env.REACT_APP_PRICE;
                        return (
                            <Card sx={{ maxWidth: 300, m: 1 }} raised={!(new Date() > end)}>
                                <CardContent>
                                    <Typography variant="text" fontWeight={600}>
                                        {format(start, "yyyy-MM-dd")} 	→ {format(end, "yyyy-MM-dd")}
                                    </Typography>
                                    <br />
                                    <Typography variant="text">
                                        {days[start.getDay()]}dag - {days[end.getDay()]}dag
                                    </Typography>
                                    <br />
                                    <Typography variant="text" color="grey.400">
                                        {price} kr - {length} {length > 1 ? "nätter" : "natt"}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    })}
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