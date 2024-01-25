window.addEventListener('DOMContentLoaded', event => {

    var table = $('table').DataTable({
        lengthChange: false,
        searching: false,
        responsive: true,
        pageLength: 10,
        language: {
            "emptyTable": "데이터가 없어요.",
            "lengthMenu": "페이지당 _MENU_ 개씩 보기",
            "info": "현재 _START_ - _END_ / _TOTAL_건",
            "infoEmpty": "데이터 없음",
            "infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
            // "search": "검색: ",
            "search": "",
            "zeroRecords": "일치하는 데이터가 없어요.",
            "loadingRecords": "로딩중...",
            "processing": "잠시만 기다려 주세요...",
            "paginate": {
                "next": "다음",
                "previous": "이전"
            }
        },
        deferRender: true,
        rowId: "title",        
    });

    $('#select_date').daterangepicker({
        "locale": {
            "format": "YYYY-MM-DD",
            "separator": " ~ ",
            "applyLabel": "확인",
            "cancelLabel": "취소",
            "fromLabel": "From",
            "toLabel": "To",
            "customRangeLabel": "Custom",
            "weekLabel": "W",
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        },
        "startDate": new Date(),
        "endDate": new Date(),
        "drops": "auto"
    });

    const d = new Date();
    const yesterday = addDays(d, -2);
    const today = addDays(d, 0);
});


