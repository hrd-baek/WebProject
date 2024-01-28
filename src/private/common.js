
function getDate(num) {
    let t = new Date();
    let sel_day = num;
    t.setDate(t.getDate() + sel_day);
    let year = t.getFullYear(); // 년도
    let month = t.getMonth() + 1;  // 월
    let date = t.getDate();  // 날짜
    let day = t.getDay();  // 요일

    let today = year + '-' + month + '-' + date
    return today;
}

module.exports = { getDate};
