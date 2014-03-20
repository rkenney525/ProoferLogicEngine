$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                closeFactCreationDialog();
            },
	    "Cancel": function() {
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

function openFactCreationDialog(id, operation) {
    $("#Dialogs_FactCreation").dialog("open");

    // Set size
    //$("#Dialogs_FactCreation").parent().css("min-height", 350);
    $("#Dialogs_FactCreation").parent().css("min-width", 650);
}

function closeFactCreationDialog() {
    $("#Dialogs_FactCreation").dialog("close");
}