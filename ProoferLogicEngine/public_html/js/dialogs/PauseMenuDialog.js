$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
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


function openFactCreationDialog() {
    $("#PauseMenu").dialog("open");
}

function closeFactCreationDialog() {
    $("#PauseMenu").dialog("close");
}