// chuyển từ năm-tháng-ngày sang định dạng ngày/tháng/năm
export function convertDateFormat(inputDate) {
    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const outputDate = `${day}/${month}/${year}`;
    return outputDate;
}
//  chuyển sang định dạng năm-tháng-ngày để hiện lên form sửa todo
export function convertDateToISOFormat(inputDate) {
    const dateParts = inputDate.split("/");
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const outputDate = `${year}-${month}-${day}`;
    return outputDate;
}
