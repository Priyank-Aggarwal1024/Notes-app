export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
export const getInitials = (name) => {
    if (!name) {
        return "";
    }
    let str = name.split(" ").map((item) => {
        if (item != "") {
            return item[0].toUpperCase();
        }
    }).join("");
    return str;
}