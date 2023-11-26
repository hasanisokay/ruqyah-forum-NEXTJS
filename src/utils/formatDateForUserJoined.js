export default function formatDateForUserJoined(date) {
    const options = { month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    // Add suffix to the day
    const day = date.getDate();
    const dayWithSuffix = addSuffixToNumber(day);

    return `${dayWithSuffix} ${formattedDate}`;
}

function addSuffixToNumber(number) {
    if (number >= 11 && number <= 13) {
        return `${number}th`;
    }

    switch (number % 10) {
        case 1:
            return `${number}st`;
        case 2:
            return `${number}nd`;
        case 3:
            return `${number}rd`;
        default:
            return `${number}th`;
    }
}
