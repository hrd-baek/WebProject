window.addEventListener('DOMContentLoaded', event => {

    let t = new Date();

    let year = t.getFullYear(); // 년도
    let month = t.getMonth() + 1;  // 월
    let date = t.getDate();  // 날짜
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
            // id ="fair_quality" id ="total" id ="defective_quality"
            console.log(res);
            let prodData = res[0];
            let defectsData = res[1];

            $('#fair_quality').text(prodData.length - (defectsData.length > 0 ? defectsData[0].distinct_module_count : 0));
            $('#defective_quality').text((defectsData.length > 0 ? defectsData[0].distinct_module_count : 0));
            $('#total').text(prodData.length);
            
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
                                                ${moment(defectsData[i].occur_time).format('YYYY-MM-DD hh:mm:ss')}                                   
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
                                                ${prodData[i].module_type_id}
                                            </p>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                                ${prodData[i].defectss == 0 ? '양호' : '불량'}
                                            </p>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <p class="font-weight-bold mb-0">
                                                ${prodData[i].voltage} 
                                            </p>
                                        </td>

                                        <td class="align-middle text-center">
                                            <p class="font-weight-bold mb-0">
                                                ${moment(prodData[i].finish_time).format('YYYY-MM-DD hh:mm:ss')}
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