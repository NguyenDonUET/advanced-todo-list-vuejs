export const checkIsExpiredDate = (deadline) => {
    const dateString = deadline;
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    let dateParts = dateString.split("/");
    let day = parseInt(dateParts[0], 10);
    let month = parseInt(dateParts[1], 10) - 1; // Giảm đi 1 vì tháng trong JavaScript bắt đầu từ 0
    let year = parseInt(dateParts[2], 10);
    let inputDate = new Date(year, month, day);

    // Lấy ngày hiện tại
    let currentDate = new Date();

    // Nếu đã hết hạn
    if (currentDate >= inputDate) {
        return true;
    }
    return false;
};
