import { Button, Checkbox } from '@mui/material';
import { startOfMonth, addMonths, setDefaultOptions, format, addDays, getYear, isBefore, isEqual, closestIndexTo, isSameDay, isAfter, subDays, addHours, getDaysInMonth } from 'date-fns';
import { sv } from 'date-fns/locale';

setDefaultOptions({ locale: sv })


function TimeRange(props) {
    let today = new Date();
    let last = addDays(today, 60);
    let days = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"];

    let times = () => {
        let t = ["", "", "8-11", "11-14", "14-17", "17-20", "20-23"];
        return (<>
            {t.map((x, i) => <th key={x} style={{ width: "100px", height: "40px" }} >{x}</th>)}
        </>)
    }

    let getTable = (month) => {
        return (
            <div>
                {format(month, "MMMM").charAt(0).toUpperCase() + format(month, "MMMM").slice(1)}
                <table>
                    <thead>
                        <tr>
                            {times()}
                        </tr>
                    </thead>
                    <tbody>
                        {Array(getDaysInMonth(month) - month.getDate() + 1).fill(0).map((_, x) => {
                            let day = addDays(month, x);
                            return <tr key={format(day, "yyyyMMdd")}>
                                <td>{format(day, "yyyy-MM-dd")}</td>
                                <td>{days[day.getDay()]}dag</td>
                                <td><Button>Boka</Button></td>
                                <td><Button>Boka</Button></td>
                                <td><Button>Boka</Button></td>
                                <td><Button>Boka</Button></td>
                                <td><Button>Boka</Button></td>
                            </tr>
                        }
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <div className='time-container'>
            <div className='time-calendar'>
                {getTable(today)}
                {getTable(startOfMonth(addMonths(today, 1)))}
            </div>
        </div>)
}

export default TimeRange;