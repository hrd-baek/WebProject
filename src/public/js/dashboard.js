// 공정 진행 상태에 따른 색상 변경 코드
// $('.process-icon-3').css({

//     "background-color": "rgb(208 252 92)"

// });


let t = new Date();

let year = t.getFullYear(); // 년도
let month = t.getMonth() + 1;  // 월
let date = t.getDate();  // 날짜
let day = t.getDay();  // 요일

let today = (year + '년 ' + month + '월 ' + date + '일 ')
document.getElementById("today-section").innerHTML = today;

var client = new WebSocket('ws://localhost:9999');
var canvas = document.querySelector('canvas');
var player = new jsmpeg(client, {
    canvas: canvas
});

function openPopupCCTV() {
    var _width = Math.ceil((window.screen.width) * 4 / 5);
    var _height = Math.ceil((window.screen.height) * 4 / 5);

    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
    var _left = Math.ceil((window.screen.width - _width) / 2);
    var _top = Math.ceil((window.screen.height - _height) / 2);

    window.open('/production/cctv', '_blank', 'width = ' + _width + ', height = ' + _height + ', left=' + _left + ', top=' + _top + ',location=no, status=no');
}
