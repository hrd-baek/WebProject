
var table = $('#production_list_table').DataTable({
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
    if ($.fn.DataTable.isDataTable('#production_list_table')) {
        obj.DataTable().destroy();
    }
    var table = $('#production_list_table').DataTable({
        columns: [
            { data: 'module_id', title: '모듈 번호' },
            { data: 'module_type_id', title: '모듈 이름' },
            { data: 'module_id', title: 'Cell 정보' },
            { data: 'defects', title: '용접 상태' },
            { data: 'voltage', title: '전압' },
            { data: 'start_time', title: '생산 시작 일시' },
            { data: 'finish_time', title: '생산 완료 일시' },
        ],
        columnDefs: [
            {
                targets: [1], render: function (data, type, row) {
                    return data == null ? '미분류' : data;
                }
            },
            {
                targets: [2], render: function (data, type, row) {
                    return `<span class="badge badge-sm bg-secondary" onclick="getCellData(this)" style="cursor :pointer">Click</span>`;
                }
            },
            {
                targets: [3], render: function (data, type, row) {
                    return data == 0 ? '양호' : '불량';
                }
            },
            {
                targets: [4], render: function (data, type, row) {

                    return data == null ? '미측정' : data + ' V';
                }
            }
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

    $.ajax({
        url: "/production/list",
        type: "POST",
        async: false,
        dataType: "json",
        data: data,
        success: function (res) {
            newTable($('#production_list_table'), res);
        },
        error: function (xhr) {
            alert(xhr);
        }
    });
}

