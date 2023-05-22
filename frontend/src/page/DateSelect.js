import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { useEffect, useState } from "react";
import { sv } from "date-fns/locale";

const CAL_ID =
  "910cce1be635e15700f974986eaf7ac1db791759223766b1c8192673d786def8@group.calendar.google.com";
const CAL_URL = `https://www.googleapis.com/calendar/v3/calendars/${CAL_ID}/events?calendarId=${CAL_ID}&singleEvents=true&timeZone=Europe%2FStockholm&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${new Date().toISOString()}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;

let book = (startDate, endDate) => {
  const url = "http://127.0.0.1:5001/brfkaptenen-8d5d3/us-central1/helloWorld";

  fetch(url).then((res) => {
    res.text().then((r) => console.log(r, startDate, endDate));
  });
};

function DateSelect() {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    const selectionRange = {
      startDate: today,
      endDate: today,
      key: "selection",
    };
  
    let [range, setRange] = useState(selectionRange);
    let [disabledDates, setDisabledDates] = useState([]);
  
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
  
    let endDate = new Date(range.endDate);
    endDate.setDate(endDate.getDate() + 1);
  
    return (
      <div className="app">
        BRF Kaptenen bokningssida
        <DateRange
          minDate={today}
          disabledDates={disabledDates}
          ranges={[range]}
          onChange={handleSelect}
          locale={sv}
          months={2}
          direction={"horizontal"}
        />
        Boka från {range.startDate.toLocaleDateString("sv")} kl 12.00 till{" "}
        {endDate.toLocaleDateString("sv")} kl 12.00
        <button onClick={() => book(range.startDate, range.endDate)}>Boka</button>
      </div>
    );
  }
  
  export default DateSelect;