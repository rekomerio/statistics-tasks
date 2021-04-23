import { differenceInDays, differenceInYears, differenceInMonths } from "date-fns";

// Date-fns has a built-in function of same type, but it is not included in the version 1.30.1
export function niceDateFormat(date1, date2) {
    const days = differenceInDays(date1, date2);

    if (days <= 31) {
        return days.toString() + " päivää sitten";
    }

    if (days > 365) {
        return differenceInYears(date1, date2).toString() + " vuotta sitten";
    }

    return differenceInMonths(date1, date2).toString() + " kuukautta sitten";
}
