window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki
    let options = {
        searchable: true,
        perPage: 15,
    };

    const datatablesSimple = document.getElementById('defects_list_table');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});


