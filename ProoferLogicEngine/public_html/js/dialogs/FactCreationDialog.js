$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                closeFactCreationDialog();
            }
        },
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
// TODO make this dialog

function openFactCreationDialog() {
    $("#Dialogs_FactCreation").dialog("open");

    // Set size
    $("#Dialogs_FactCreation").height(200);
    $("#Dialogs_FactCreation").width(600);
}

function closeFactCreationDialog() {
    $("#Dialogs_FactCreation").dialog("close");
}