$(document).ready(function() {
    $("#PauseMenu").dialog({
        modal: true,
        autoOpen: false,
        show: {
            effect: "highlight",
            duration: 1000
        },
        hide: {
            effect: "highlight",
            duration: 200
        }
    });
});


function openPauseMenu() {
    $("#PauseMenu").dialog("open");
}

function closePauseMenu() {
    $("#PauseMenu").dialog("close");
}