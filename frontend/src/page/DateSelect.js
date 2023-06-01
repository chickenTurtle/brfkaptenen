import { differenceInDays, isSameDay, format } from 'date-fns';
import { useEffect, useState } from "react";
import { book, getEvents } from "../api";
import { Box, Button, Grid, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Loading from "../components/Loading";
import DateRange from "../components/DateRange";
import { useNavigate } from 'react-router-dom';

function DateSelect(props) {
  const navigate = useNavigate();
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [isVerified, setIsVerified] = useState(true);


  let [disabledDates, setDisabledDates] = useState([]);
  let [checkoutOnly, setCheckoutOnly] = useState([]);
  let [checkIn, setCheckIn] = useState();
  let [checkOut, setCheckout] = useState();

  let updateDisabledDates = () => {
    return getEvents(props.user).then((res) => {
      if (res.status === 200) {
        setIsVerified(true);
        res.json().then((events) => {
          let e = [];
          let onlyCheckoutDays = [];
          let disabledDays = [];
          for (var item of events) {
            let start = new Date(Date.parse(item.start.dateTime));
            let end = new Date(Date.parse(item.end.dateTime));
            e.push(start, end)
          }
          for (var i = 0; i <= e.length - 2; i = i + 2) {
            onlyCheckoutDays.push(e[i])
            for (var s = new Date(e[i]); s <= e[i + 1]; s.setDate(s.getDate() + 1)) {
              if (s.getTime() === e[i].getTime() && e[i - 1]?.getTime() !== e[i]?.getTime()) {
                continue
              }
              if (s.getTime() === e[i + 1].getTime() && e[i + 1]?.getTime() !== e[i + 2]?.getTime()) {
                continue
              }
              disabledDays.push(new Date(s));
            }
          }
          onlyCheckoutDays = onlyCheckoutDays.filter((d, i) => differenceInDays(onlyCheckoutDays[i - 1], onlyCheckoutDays[i]) !== -1);
          onlyCheckoutDays = onlyCheckoutDays.filter((d, i) => !disabledDays.find((x) => isSameDay(x, d)));
          setCheckoutOnly(onlyCheckoutDays);
          setDisabledDates(disabledDays);
        });
      }
      else
        setIsVerified(false);
    });
  }

  let onBook = () => {
    if (checkIn.getTime() === checkOut.getTime()) {
      setError("Du måste boka minst 1 natt")
    } else {
      setLoading(true);
      book(props.user, checkIn, checkOut)
        .then((res) => {
          if (res.status === 200) {
            navigate(`/complete?from=${format(checkIn, "yyyy-MM-dd")}&to=${format(checkOut, "yyyy-MM-dd")}`)
          }
          else if (res.status === 500) {
            res.json().then((err) => {
              setError(err.message);
            })
          }
          else
            setError("Något gick fel")
        })
        .catch(() => {
          setError("Något gick fel")
        })
        .finally(() => {
          updateDisabledDates().then(() => setLoading(false));
        })
    }
  }

  useEffect(() => {
    updateDisabledDates().then(() => setLoading(false))
  }, []);

  let clearDates = () => {
    setCheckIn();
    setCheckout();
  }

  return isVerified ? (
    <Box sx={{
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {loading ? <Loading overlay={true} /> : ""}
      <Typography component="h1" variant="h5">
        BRF Kaptenen bokningssida
      </Typography>
      <Typography variant="subtitle1" marginBottom={2}>
        Övernattningslokalen
      </Typography>
      <DateRange
        checkIn={checkIn}
        checkOut={checkOut}
        setCheckIn={setCheckIn}
        setCheckout={setCheckout}
        disabledDates={disabledDates}
        checkoutOnly={checkoutOnly}
        maxDays={process.env.REACT_APP_MAX_BOOKING_DAYS}
      />
      <Box sx={{ mt: 5, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <TextField
              label="Incheckning"
              disabled={true}
              color="primary"
              value={checkIn ? checkIn.toLocaleDateString("sv") : "-"}
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
              value={checkOut ? checkOut.toLocaleDateString("sv") : "-"}
              InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">12:00</InputAdornment>,
              }}
              sx={style}
            />
          </Grid>
        </Grid>
      </Box>
      <Typography mb={2} color="error">
        {error ? error : ""}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => clearDates()} disabled={loading}>
          Rensa datum
        </Button>
        <Button variant="contained" onClick={() => onBook()} disabled={loading}>
          Boka
        </Button>
      </Stack>
    </Box >
  ) : (
    <Box sx={{
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {loading ? <Loading overlay={true} /> : ""}
      <Typography component="h1" variant="h5">
        Ditt konto är inte verifierat
      </Typography>
      <Typography variant="subtitle1" marginBottom={2}>
        Styrelsen verifierar det snarast
      </Typography>
    </Box>
  );
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

export default DateSelect;