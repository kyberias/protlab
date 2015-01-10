// JavaScript source code

function showTab(id) {
    $('.selectedtab').removeClass('selectedtab');
    $('.tab').hide();
    $('#' + id + '_tab').show();
    $('#' + id + '_ti').addClass('selectedtab');
}

$(document).ready(function () {
    showTab('solutions');

    $('#sdspage2d_ti').click(function () {
        showTab('sdspage2d');
    });

    $('#solutions_ti').click(function () {
        showTab('solutions');
    });

    $('#precipitation_ti').click(function () {
        showTab('precipitation');
    });
});
