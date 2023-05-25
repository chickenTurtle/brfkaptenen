import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { useEffect, useState } from "react";
import { sv } from "date-fns/locale";
import { book, getEvents } from "../api";
import { Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import Loading from "../components/Loading";

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
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();

  let updateDisabledDates = () => {
    return getEvents(props.user).then((res) => res.json().then((events) => {
      let t = [];
      for (var item of events) {
        let start = new Date(Date.parse(item.start.dateTime));
        let end = new Date(Date.parse(item.end.dateTime));
        for (var s = start; s <= end; s.setDate(s.getDate() + 1)) {
          t.push(new Date(s));
        }
      }
      setDisabledDates(t);
    }));
  }

  let onBook = () => {
    setLoading(true);
    book(props.user, range.startDate, range.endDate)
      .then((res) => {
        if (res.status === 200) {
          setRange(selectionRange);
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

  useEffect(() => {
    updateDisabledDates().then(() => setLoading(false))
  }, []);

  let handleSelect = (ranges) => {
    console.log(ranges)
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