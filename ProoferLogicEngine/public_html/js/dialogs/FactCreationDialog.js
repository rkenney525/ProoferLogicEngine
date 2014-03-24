$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
	modal: true,
	autoOpen: false,
	buttons: {
	    "OK": function() {
		// Get the fact String and make it parsable
		var factStr = $('#Dialogs_FactCreation_Creation').text();

		// Look for a few obvious errors
		var noOps = $('.creation-operator').length === 0;
		var noParens = factStr.match(/\(/g) === null;
		var equalParensAndOps = (noParens) ? true : factStr.match(/\(/g).length ===
			$('.creation-operator').length;
		if (factStr.indexOf("?") >= 0) {
		    // TODO display error that says unspecified variable
		    return;
		} else if (!noOps && (noParens || !equalParensAndOps)) {
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
			    } else if (factStr[j] === '~') {
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

		// Get the fact
		var fact = getFactFromString(factStr);

		// Exit and return
		if (fact !== null) {
		    var id = $("#Dialogs_FactCreation").id;
		    AddTable[id] = fact;
		    AddTable.updateHtml();
		    closeFactCreationDialog()
		} else {
		    // TODO error message
		}
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
	    initializeFactCreation();
	    break;
	case "edit":
	    var fact = AddTable[id];
	    populateFactCreationAreaFromFact(fact);
	    break;
    }
    $("#Dialogs_FactCreation").id = id;

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

/**
 * Populate the Fact Creation area with the specified Fact.
 * 
 * @param {Fact} fact The Fact to populate.
 */
function populateFactCreationAreaFromFact(fact) {
    /**
     * Populate the Fact Creation area with fact
     * @param {jQuery Object} root The element to append fact to.
     * @param {Fact} fact The Fact to apply
     */
    var populate = function(root, fact) {
	if (fact.op === null) {
	    root.append('<span class="creation-element">' + fact.arg0.toString() + '</span>');
	} else if (fact.arg1 === null) {
	    var negation = root.append('<span class="creation-negation"></span>');
	    negation.append('<span class="negation">˜</span>');
	    populate(negation, fact.arg0);
	} else {
	    var group = root.append('<span class="group"></span>');
	    group.append('<span class="open-paren">(</span>');
	    populate(group, fact.arg0);
	    group.append('<span class="creation-operator ui-droppable">' + fact.op.toString() + '</span>');
	    populate(group, fact.arg1);
	    group.append('<span class="close-paren">)</span>');
	}
    };
    var root = $('#Dialogs_FactCreation_Creation');
    root.empty();
    populate(root, fact);
    updateCreationElements();
}