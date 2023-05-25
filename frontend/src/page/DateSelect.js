import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { useEffect, useState } from "react";
import { sv } from "date-fns/locale";
import { book } from "../api";
import { Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import Loading from "../components/Loading";


const CAL_ID = process.env.REACT_APP_CAL_ID
const CAL_URL = `https://www.googleapis.com/calendar/v3/calendars/${CAL_ID}/events?calendarId=${CAL_ID}&singleEvents=true&timeZone=Europe%2FStockholm&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${new Date().toISOString()}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;

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

function DateSelect(props) {
  let today = new Date();
  today.setDate(today.getDate() + 1);
  const selectionRange = {
    startDate: today,
    endDate: today,
    key: "selection",
  };

  let [range, setRange] = useState(selectionRange);
  let [disabledDates, setDisabledDates] = useState([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState();


  let onBook = () => {
    setLoading(true);
    book(props.user, range.startDate, range.endDate)
      .then((res) => console.log(res))
      .catch((err) => {
        if (err.status === 500)
          setError(err.text)
        else
          setError("Något gick fel")
      })
      .finally(setLoading(false))
  }

  useEffect(() => {
    fetch(CAL_URL)
      .then((res) => res.json())
      .then((r) => {
        let t = [];
        for (var item of r.items) {
          let start = new Date(Date.parse(item.start.date));
          let end = new Date(Date.parse(item.end.date));
          for (var s = start; s < end; s.setDate(s.getDate() + 1)) {
            t.push(new Date(s));
          }
        }
        setDisabledDates(t);
      });
  }, []);

  let handleSelect = (ranges) => {
    setRange(ranges.selection);
  };

  return (
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
        minDate={today}
        disabledDates={disabledDates}
        ranges={[range]}
        onChange={handleSelect}
        locale={sv}
        months={2}
        direction={"horizontal"}
      />
      <Box sx={{ mt: 5, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <TextField
              label="Från"
              disabled={true}
              color="primary"
              value={range.startDate.toLocaleDateString("sv")}
              InputProps={{
                readOnly: true,
                endAdornment: <InputAdornment position="end">12:00</InputAdornment>,
              }}
              sx={style}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              label="Till"
              disabled={true}
              value={range.endDate.toLocaleDateString("sv")}
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
      <Button variant="contained" onClick={() => onBook()} disabled={loading}>
        Boka
      </Button>
    </Box >
  );
}

export default DateSelect;