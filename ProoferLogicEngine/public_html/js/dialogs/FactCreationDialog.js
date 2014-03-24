$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
		// Get the fact String and make it parsable
		var factStr = $('#Dialogs_FactCreation_Creation').text();
                
                // Look for a few obvious errors
                if (factStr.indexOf("?") >= 0) {
                    // TODO display error that says unspecified variable
                    return;
                } else if (factStr.match(/\(/g) !== null
                        && factStr.match(/\(/g).length !== 
                        $('.creation-operator').length) {
                    // TODO display error that says not enough groups
                    return;
                }
		
		// Replace the actual operators
		factStr = factStr.split('\u2192').join('>');
		factStr = factStr.split('\u2295').join('#');
		factStr = factStr.split('\u2194').join('%');
		factStr = factStr.split('\u2227').join('&');
		factStr = factStr.split('\u2228').join('|');
		factStr = factStr.split('\u02DC').join('~');
		
		// Handle the lazy way we displayed negations
		for (var i = 0; i < factStr.length; i++) {
		    if (factStr[i] === '~') {
			var parenCount = 0;
			for (var j = i + 1; j < factStr.length; j++) {
			    if (factStr[j] === '(') {
				parenCount++;
			    } else if (factStr[j] === ')') {
				parenCount--;
			    }  else if (factStr[j] === '~') {
				continue;
			    } 
			    
			    if (parenCount === 0) {
				factStr = factStr.insert(j + 1, ')');
				break;
			    }
			}
			factStr = factStr.insert(i + 1, '(');
		    }
		}
		
		// Close the dialog
                //TODO closeFactCreationDialog();
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