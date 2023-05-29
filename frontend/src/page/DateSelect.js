import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { addDays, format } from 'date-fns';
import { useEffect, useState } from "react";
import { sv } from "date-fns/locale";
import { book, getEvents } from "../api";
import { Box, Button, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import Loading from "../components/Loading";



function DateSelect(props) {
  let [range, setRange] = useState({
    //startDate: null,
    //endDate: null,
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 1),
    key: "selection",
    showDateDisplay: false
  });
  let [disabledDates, setDisabledDates] = useState([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState();
  let [events, setEvents] = useState([]);

  let customDayContent = (day, events) => {
    let isCheckoutOnly = false;
    for (let event of events) {
      if (format(day, "yyyyMMdd") === format(event, "yyyyMMdd")) {
        isCheckoutOnly = true;
      }
    }

    return (
      <div>
        <span style={isCheckoutOnly ? { backgroundColor: "gray" } : {}}>{format(day, "d")}</span>
      </div>
    )
  }

  let disabledDay = (day) => {
    for (let t of events) {
      if (format(t, "yyyyMMdd") === format(day, "yyyyMMdd")) {
        return true
      }
    }

    return false
  }

  let updateDisabledDates = () => {
    return getEvents(props.user).then((res) => res.json().then((events) => {
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
      setEvents(onlyCheckoutDays);
      setDisabledDates(disabledDays);
    }));
  }

  let onBook = () => {
    if (range.startDate.getTime() === range.endDate.getTime()) {
      setError("Du måste boka minst 1 natt")
    } else {
      setLoading(true);
      book(props.user, range.startDate, range.endDate)
        .then((res) => {
          if (res.status === 200) {
            //setRange();
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

  let handleSelect = (ranges) => {
    setError("");
    if (format(ranges.selection.startDate, "yyyyMMdd") <= format(ranges.selection.endDate, "yyyyMMdd")) {
      console.log(ranges);
      setRange(ranges.selection);
    }
  };

  let clearDates = () => {
    setRange({
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 1),
      key: "selection",
      showDateDisplay: false
    })
  }

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
        minDate={addDays(new Date(), 1)}
        disabledDates={disabledDates}
        ranges={[range]}
        onChange={handleSelect}
        locale={sv}
        months={2}
        direction={"horizontal"}
        preventSnapRefocus
        dayContentRenderer={(day) => customDayContent(day, events)}
        disabledDay={disabledDay}
      />
      <Box sx={{ mt: 5, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <TextField
              label="Incheckning"
              disabled={true}
              color="primary"
              value={range.startDate ? range.startDate.toLocaleDateString("sv") : "-"}
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
              value={range.endDate ? range.endDate.toLocaleDateString("sv") : "-"}
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
      <Button variant="contained" onClick={() => clearDates()} disabled={loading}>
        Rensa datum
      </Button>
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