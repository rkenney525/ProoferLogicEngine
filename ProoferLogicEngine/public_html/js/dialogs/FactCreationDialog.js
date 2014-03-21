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
    // Bind keypress events
    bindKeyPressEvents();
    
    // open the dialog
    $("#Dialogs_FactCreation").dialog("open");

    // Set size
    //$("#Dialogs_FactCreation").parent().css("min-height", 350);
    $("#Dialogs_FactCreation").parent().css("min-width", 650);
}

function closeFactCreationDialog() {
    $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog' +
	    '-buttons.ui-draggable.ui-resizable').unbind("keypress");
    $("#Dialogs_FactCreation").dialog("close");
}