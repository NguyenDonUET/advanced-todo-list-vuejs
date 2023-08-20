export function convertDateFormat(inputDate) {
    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const outputDate = `${day}-${month}-${year}`;
    return outputDate;
}
