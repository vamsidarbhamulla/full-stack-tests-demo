export function nDaysFromNowInEpoch(days = 2) {
    const addedDays = new Date(
        new Date().getTime() + days * 24 * 60 * 60 * 1000,
    );
    return addedDays.getTime() - addedDays.getMilliseconds();
}

export function epochDate() {
    return new Date().getTime();
}

export function getTimestampInSeconds() {
    return Math.floor(epochDate() / 1000);
}

export function currentDateInUtc() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1; // add 1 because getUTCMonth returns 0-based index
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    const formattedDateTime = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}Z`;
    return formattedDateTime;
}

export function dateInUtc() {
    const offsetInMinutes = 2 * 60; // Romanian
    const todaysDate = new Date(
        new Date().getTime() + offsetInMinutes * 60000,
    ).toISOString();
    return todaysDate.split(".")[0] + " UTC";
}

export function calcDates() {
    const firstDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
    );
    const { todayDateTime, today } = calcTodayDateTime();
    const { yesterdayDateTime, yesterday } = calcYesterdayDateTime();
    const lastDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0,
    );
    const endDate = new Date(lastDayOfMonth).toISOString().split("T")[0];
    const tomorrowDateTime = new Date(
        new Date().setDate(new Date().getDate() + 1),
    )
        .toISOString()
        .split(".")[0];
    const tomorrow = tomorrowDateTime.split("T")[0];
    const currentDateInUtcVal = currentDateInUtc();
    return {
        firstDayOfMonth,
        lastDayOfMonth,
        todayDateTime,
        yesterdayDateTime,
        tomorrowDateTime,
        today,
        yesterday,
        tomorrow,
        endDate,
        currentDateInUtc: currentDateInUtcVal,
        nDaysFromNowInEpoch,
    };
}

export function calcTodayDateTime() {
    const todayDateTime = new Date().toISOString().split(".")[0];
    const today = todayDateTime.split("T")[0];
    return {
        todayDateTime,
        today,
    };
}

export function calcYesterdayDateTime() {
    const yesterdayDateTime = new Date(
        new Date().setDate(new Date().getDate() - 1),
    )
        .toISOString()
        .split(".")[0];
    const yesterday = yesterdayDateTime.split("T")[0];
    return {
        yesterdayDateTime,
        yesterday,
    };
}

export function calcDayDateTime({ offset } = { offset: -2 }) {
    const dayDateTime = new Date(
        new Date().setDate(new Date().getDate() + offset),
    )
        .toISOString()
        .split(".")[0];
    const dayDate = dayDateTime.split("T")[0];
    return {
        dayDateTime,
        dayDate,
    };
}
