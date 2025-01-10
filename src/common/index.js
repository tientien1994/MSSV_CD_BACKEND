export function removeVietnameseAccents(str) {
    return str
        .normalize('NFD') // Chuẩn hóa chuỗi về dạng tổ hợp
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ các dấu tổ hợp
        .replace(/đ/g, 'd') // Chuyển đổi 'đ' thành 'd'
        .replace(/Đ/g, 'D'); // Chuyển đổi 'Đ' thành 'D'
}