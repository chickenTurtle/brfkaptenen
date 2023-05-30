import { startOfMonth, addMonths, setDefaultOptions, format, addDays, getYear, isBefore, isEqual, closestIndexTo, isSameDay, isAfter, subDays } from 'date-fns';
import { sv } from 'date-fns/locale';
import ArrowBackIos from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos"
import { useEffect, useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
setDefaultOptions({ locale: sv })

function DateRange(props) {
    let [thisMonth, setThisMonth] = useState(startOfMonth(new Date()));
    let [lastCheckoutDay, setLastCheckoutDay] = useState();

    let { checkIn, setCheckIn, checkOut, setCheckout, disabledDates, checkoutOnly, maxDays } = props;

    let days = () => {
        let d = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];
        return (<>
            {d.map((x, i) => <th key={x} style={{ width: "40px", height: "40px" }}>{x}</th>)}
        </>)
    }

    let onCheckIn = (day) => {
        setCheckIn(day)
        let lastDay = null;
        for (var d of checkoutOnly) {
            if (isBefore(d, day))
                continue
            if (lastDay === null) {
                lastDay = d
                continue
            }
            if (isBefore(d, lastDay))
                lastDay = d
        }
        setLastCheckoutDay(lastDay)
    }

    useEffect(() => {
        if (!checkOut)
            setLastCheckoutDay();
    }, [checkOut])

    let isDayDisabled = (day) => {
        return isSameDay(disabledDates[closestIndexTo(day, disabledDates)], day) || isBefore(day, checkIn) || isAfter(day, lastCheckoutDay) || isAfter(subDays(day, maxDays), checkIn);
    }

    let getDay = (day) => {
        let isDisabled = isDayDisabled(day);
        let isCheckoutOnly = isSameDay(checkoutOnly[closestIndexTo(day, checkoutOnly)], day) && !checkIn;
        let isCheckIn = checkIn && isEqual(day, checkIn);
        let isCheckOut = checkOut && isEqual(day, checkOut);
        let isSelected = checkIn && checkOut && (isAfter(day, addDays(checkIn, -1)) && isBefore(day, addDays(checkOut, +1)));

        let inner = <IconButton onClick={() => checkIn ? setCheckout(day) : onCheckIn(day)} className='day'>
            <Typography>
                {day.getDate()}
            </Typography>
        </IconButton>;

        if (isDisabled)
            inner =
                <IconButton disabled={true} className='day day-disabled'>
                    <Typography>
                        {day.getDate()}
                    </Typography>
                </IconButton>

        if (isCheckoutOnly)
            inner =
                <Tooltip title="Endast utcheckning">
                    <IconButton className='day day-check-out-only'>
                        <Typography>
                            {day.getDate()}
                        </Typography>
                    </IconButton>
                </Tooltip>

        if (isCheckIn)
            inner =
                <IconButton style={{ background: "black" }} className='day day-check-in'>
                    <Typography>
                        {day.getDate()}
                    </Typography>
                </IconButton>

        if (isCheckOut)
            inner =
                <IconButton style={{ background: "black" }} className='day day-check-out'>
                    <Typography>
                        {day.getDate()}
                    </Typography>
                </IconButton>

        return (
            <td className={isSelected ? ('selected' + ((isCheckOut ? " last" : "") || (isCheckIn ? " first" : ""))) : ""} key={format(day, "yyyyMMdd")}>
                <div className='calendar-day'>
                    {inner}
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
                        <tr>
                            {days()}
                        </tr>
                    </thead>
                    <tbody>
                        {Array(6).fill(0).map((_, y) =>
                            <tr key={y}>
                                {Array(7).fill(0).map((_, x) => {
                                    if (startCounting)
                                        curr = addDays(curr, 1)
                                    if (curr.getDay() === x + 1)
                                        startCounting = true
                                    return startCounting && curr.getMonth() === month.getMonth() ? getDay(curr) : <td key={x}></td>;
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