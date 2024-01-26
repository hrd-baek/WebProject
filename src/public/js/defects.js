
function newTable(obj, data) {
    if ($.fn.DataTable.isDataTable('table')) {
        obj.DataTable().destroy();
    }
    var table = $('table').DataTable({
        columns: [
            { data: 'module_id', title: '모듈 번호' },
            { data: 'type', title: '불량 유형' },
            { data: 'occur_time', title: '발생 일시' },

        ],
        columnDefs: [
            {
                targets: [2], render: function (data, type, row) {
                    return moment(data).format('YYYY-MM-DD hh:mm:ss');
                }
            }
        ],
        lengthChange: false,
        searching: false,
        responsive: true,
        pageLength: 10,
        data: data,
        language: language,
        deferRender: true,
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
