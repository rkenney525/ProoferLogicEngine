$(document).ready(function() {
    $("#Dialogs_LevelCleared").dialog({
	modal: true,
	autoOpen: false,
	buttons: {
	    "Next Level": function() {
		$(this).dialog("close");
	    },
	    "Retry": function() {
		$(this).dialog("close");
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
	// TODO close function that clears the spans
    });
});