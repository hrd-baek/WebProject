
var table = $('#defects_list_table').DataTable({
    lengthChange: false,
    searching: false,
    responsive: true,
    pageLength: 15,
    language: language,
    deferRender: true,
    destroy: true,
    rowId: "title",
});

function newTable(obj, data) {
    if ($.fn.DataTable.isDataTable('#defects_list_table')) {
        obj.DataTable().destroy();
    }
    var table = $('#defects_list_table').DataTable({
        columns: [
            { data: 'module_id', title: '모듈 번호' },
            { data: 'module_type_id', title: '모듈 이름' },
            { data: 'type', title: '불량 유형' },
            { data: 'start_time', title: '생산 시작 일시' },
            { data: 'occur_time', title: '불량 발생 일시' }
        ],
        columnDefs: [
        ],
        lengthChange: false,
        searching: false,
        responsive: true,
        pageLength: 15,
        data: data,
        language: language,
        deferRender: true,
        destroy: true,
        rowId: "title",
    });
}

function tableSearch() {
    let startDate = $('#select_date').data('daterangepicker').startDate.format('YYYY-MM-DD');
    let endDate = $('#select_date').data('daterangepicker').endDate.format('YYYY-MM-DD')
    let option = $("#search-select option:selected").val();
    let input = $("#search-input").val();
    // if
    let data = {
        startDate: startDate,
        endDate: endDate,
        option: option,
        input: input
    }

    console.log(data);
    $.ajax({
        url: "/production/defects",
        type: "POST",
        async: false,
        dataType: "json",
        data: data,
        success: function (res) {
            newTable($('#defects_list_table'), res);
        },
        error: function (xhr) {
            alert(xhr);
        }
    });
}
