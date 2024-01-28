window.addEventListener('DOMContentLoaded', event => {

    let t = new Date();

    let year = t.getFullYear(); // 년도
    let month = ('0' + (t.getMonth() + 1)).slice(-2); // 월
    let date = ('0' + t.getDate()).slice(-2); // 날짜
    let day = t.getDay();  // 요일
    let today = (year + '년 ' + month + '월 ' + date + '일 ')
    document.getElementById("today-section").innerHTML = today;

    var client = new WebSocket('ws://192.168.0.94:9999');
    var canvas = document.querySelector('canvas');
    var player = new jsmpeg(client, {
        canvas: canvas
    });
});

function openPopupCCTV() {
    var _width = Math.ceil((window.screen.width) * 4 / 5);
    var _height = Math.ceil((window.screen.height) * 4 / 5);

    // 팝업을 가운데 위치시키기 위해 아래와 같이 값 구하기
    var _left = Math.ceil((window.screen.width - _width) / 2);
    var _top = Math.ceil((window.screen.height - _height) / 2);

    window.open('/production/cctv', '_blank', 'width = ' + _width + ', height = ' + _height + ', left=' + _left + ', top=' + _top + ',location=no, status=no');
}

function refreshPage() {
    $.ajax({
        url: "/",
        type: "POST",
        async: false,
        dataType: "json",
        success: function (res) {
            console.log(res);
            let prodData = res.prodData;
            let defectsData = res.defectsData;
            let prodChange = res.prodChange;
            let defectsChange = res.defectsChange;
            let totalChange = res.totalChange;
            let fair = prodData.length - (defectsData.length > 0 ? defectsData[0].distinct_module_count : 0);
            let def = (defectsData.length > 0 ? defectsData[0].distinct_module_count : 0);
            let tot = prodData.length;
            let fairId = 'fair_percent';
            let defId = 'def_percent';
            let totId = 'total_percent';

            $('#fair_quality').html(`${fair} <span id="fair_percent"> </span>`);
            $('#defective_quality').html(`${def} <span id="def_percent"> </span>`);
            $('#total').html(`${tot} <span id="total_percent"> </span>`);
            refreshPercentage($('#' + fairId), prodChange);
            refreshPercentage($('#' + defId), defectsChange);
            refreshPercentage($('#' + totId), totalChange);

            var newDefectTable = "";
            if (defectsData.length != 0) {
                for (var i = 0; i < (defectsData.length >= 5 ? 5 : defectsData.length); i++) {
                    newDefectTable += `<tr>
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                                <div class="d-flex flex-column justify-content-center">
                                                    <p class=" text-secondary mb-0">
                                                        ${defectsData[i].module_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                                ${defectsData[i].type}
                                            </p>
                                        </td>
                                        <td class="align-middle text-center">
                                            <p class="font-weight-bold mb-0">
                                                ${defectsData[i].occur_time}                                   
                                            </p>
                                        </td>
                                    </tr>`
                }
            } else {
                newDefectTable += `<tr>
                    <td colspan="5" style="text-align: center;">내역이 없습니다.</td>
                </tr>`
            }

            $('#dashboard_defects_table tbody').html(newDefectTable);
            var newProdTable = "";
            if (prodData.length != 0) {
                for (var i = 0; i < (prodData.length >= 3 ? 3 : prodData.length); i++) {
                    newProdTable += `<tr>
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                                <div class="d-flex flex-column justify-content-center">
                                                    <p class=" text-secondary mb-0">
                                                       ${prodData[i].module_id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                            ${prodData[i].module_type_id == null ? '미분류' : prodData[i].module_type_id} 
                                            </p>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                                ${prodData[i].defects == 0 ? '양호' : '불량'}
                                            </p>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                                ${prodData[i].voltage == null ? '미측정' : prodData[i].voltage} 
                                            </p>
                                        </td>

                                        <td class="align-middle text-center">
                                            <p class="font-weight-bold mb-0">
                                                ${prodData[i].finish_time}
                                            </p>
                                        </td>
                                    </tr>`
                }
            } else {
                newProdTable += `<tr>
                    <td colspan="5" style="text-align: center;">내역이 없습니다.</td>
                </tr>`
            }
            $('#dashboard_prod_table tbody').html(newProdTable);

        },
        error: function (xhr) {
            alert(xhr);
        }
    });
}

function refreshPercentage(obj, change) {
    let str = "";
    console.log(change)
    if (change > 0) {
        str = `<span class="text-success text-sm font-weight-bolder">+${change}% </span>`
    } else if (change < 0) {
        str = `<span class="text-danger text-sm font-weight-bolder"> ${change}% </span>`
    } else if (change == 0) {
        str = `<span class="text-secondary text-sm font-weight-bolder"> - </span>`
    } else {
        str = `<span class="text-light text-sm font-weight-bolder"> NaN </span>`
    }
    console.log(str);
    console.log(obj)
    obj.html(str);
}
