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
    
    // Check if we have data to load
    clearFactCreation();
    switch (operation) {
	case "add":
	    $('#Dialogs_FactCreation_Creation')
	    .append('<span class="creation-element selected">?</span>');
	    break;
	case "edit":
	    // TODO load current fact
	    break;
    }
    
    // Deselect the buttons
    // TODO deselect the buttons

    // Set size
    $("#Dialogs_FactCreation").parent().css("min-width", 650);
}

function closeFactCreationDialog() {
    $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog' +
	    '-buttons.ui-draggable.ui-resizable').unbind("keypress");
    $("#Dialogs_FactCreation").dialog("close");
}