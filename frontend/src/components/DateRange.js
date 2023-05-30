import { startOfMonth, addMonths, setDefaultOptions, format, addDays, getYear, getMonth } from 'date-fns';
import { sv } from 'date-fns/locale';
import ArrowBackIos from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos"


import { useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
setDefaultOptions({ locale: sv })

function DateRange(props) {
    let [thisMonth, setThisMonth] = useState(startOfMonth(new Date()));
    let [disabledDates, setDisabledDates] = useState(["20230506", "20230507", "20230510", "20230511", "20230512"])
    let [checkoutOnly, setcheckoutOnly] = useState(["20230509", "20230505"])

    let [checkIn, setCheckIn] = useState();
    let [checkOut, setCheckout] = useState();

    let days = () => {
        let d = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];
        return (<>
            {d.map((x, i) => <th style={{ width: "40px", height: "40px" }}>{x}</th>)}
        </>)
    }

    let getDay = (day) => {
        let isDisabled = disabledDates.indexOf(format(day, "yyyyMMdd")) !== -1;
        let isCheckoutOnly = checkoutOnly.indexOf(format(day, "yyyyMMdd")) !== -1 && !checkIn;
        let isCheckIn = checkIn && format(day, "yyyyMMdd") === format(checkIn, "yyyyMMdd");
        let isCheckOut = checkOut && format(day, "yyyyMMdd") === format(checkOut, "yyyyMMdd");


        if (isDisabled) {
            return (
                <td style={{ width: "40px", height: "40px" }}>
                    <div style={{ width: "40px", height: "40px" }} className='calendar-day'>
                        <IconButton disabled={true}>
                            <Typography style={{ width: "40px", height: "40px", textDecoration: "line-through" }}>
                                {day.getDate()}
                            </Typography>
                        </IconButton>
                    </div>
                </td>
            )
        }

        if (isCheckoutOnly) {
            return (
                <td style={{ width: "40px", height: "40px" }}>
                    <div style={{ width: "40px", height: "40px" }} className='calendar-day'>
                        <IconButton disableRipple>
                            <Typography style={{ width: "40px", height: "40px" }} color={'gray'}>
                                {day.getDate()}
                            </Typography>
                        </IconButton>
                    </div>
                </td>
            )
        }

        return (
            <td>
                <div className='calendar-day'>
                    <IconButton onClick={() => checkIn ? setCheckout(day) : setCheckIn(day)} style={{ background: isCheckIn ? "red" : "" }}>
                        <Typography style={{ width: "40px", height: "40px" }}>
                            {day.getDate()}
                        </Typography>
                    </IconButton>
                </div>
            </td >
        );
    }

    let getTable = (month) => {
        let startCounting = false;
        let curr = month;
        return (
            <div>
                <h3 className='table-month'>{format(month, "MMMM")} {getYear(month)}</h3>
                <table>
                    <thead>
                        {days()}
                    </thead>
                    <tbody>
                        {Array(6).fill(0).map((_, y) =>
                            <tr>
                                {Array(7).fill(0).map((_, x) => {
                                    if (startCounting)
                                        curr = addDays(curr, 1)
                                    if (curr.getDay() === x + 1)
                                        startCounting = true
                                    return startCounting && curr.getMonth() === month.getMonth() ? getDay(curr) : <td></td>;
                                })}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className='calendar-container'>
            <div className='calendar-buttons'>
                <div className='calendar-button-prev'>
                    <IconButton onClick={() => setThisMonth(startOfMonth(addMonths(thisMonth, -1)))}>
                        <ArrowBackIos />
                    </IconButton>
                </div>
                <div className='calendar-button-next'>
                    <IconButton onClick={() => setThisMonth(startOfMonth(addMonths(thisMonth, 1)))}>
                        <ArrowForwardIos />
                    </IconButton>
                </div>
            </div >
            <div className='calendar'>
                {getTable(thisMonth)}
                {getTable(addMonths(thisMonth, 1))}
            </div>
        </div >);
};

export default DateRange;