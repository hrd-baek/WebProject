window.addEventListener('DOMContentLoaded', event => {

    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {

        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

function addDays(date, days) {
    const clone = new Date(date);
    clone.setDate(date.getDate() + days)
    return clone.toISOString().substring(0, 10);
}

function getToday(){
    let t = new Date();
    let year = t.getFullYear(); // 년도
    let month = t.getMonth() + 1;  // 월
    let date = t.getDate();  // 날짜
    let day = t.getDay();  // 요일

    let today = year + '-' + month + '-' + date

    return today;
}
