$(document).ready(function() {
    $("#Dialogs_Tutorial").dialog({
	modal: true,
	autoOpen: false,
	buttons: {
	    "Skip": function() {
		closeTutorial();
	    },
	    "Previous": function() {
		// TODO implement prev page
	    },
	    "Next": function() {
		// TODO implement next page
	    }
	},
	show: {
	    effect: "highlight",
	    duration: 1000
	},
	hide: {
	    effect: "highlight",
	    duration: 1000
	}
    });
});

function closeTutorial() {
    $("#Dialogs_Tutorial").empty();
    $("#Dialogs_Tutorial").dialog("close");
}

function openTutorial() {
    $("#Dialogs_Tutorial").dialog("open");
}