$(document).ready(function() {
    $("#Dialogs_LevelCleared").dialog({
	modal: true,
	autoOpen: false,
	buttons: {
	    "Next Level": function() {
		// TODO handle last level
		populateGameScreen(Levels.nextLevel());
		closeLevelClearedDialog();
	    },
	    "Retry": function() {
		Levels.reset();
		populateGameScreen(Levels.getCurrentLevel());
		closeLevelClearedDialog();
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

function closeLevelClearedDialog() {
    $("#Dialogs_LevelCleared").dialog("close");
    $("#Dialogs_LevelCleared_Conclusion").html("");
    $("#Dialogs_LevelCleared_Par").html("");
    $("#Dialogs_LevelCleared_Actual").html("");
    $("#Dialogs_LevelCleared_Congrats").hide();
    $("#Dialogs_LevelCleared_DoBetter").hide();
}