$(document).ready(function() {
    $("#Dialogs_LevelCleared").dialog({
	modal: true,
	autoOpen: false,
	buttons: {
	    "Next Level": function() {
		currentLevel++;
		// TODO handle last level
		populateGameScreen(Levels[currentLevel]);
		closeLevelClearedDialog();
	    },
	    "Retry": function() {
		populateGameScreen(Levels[currentLevel]);
		closeLevelClearedDialog();
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

function closeLevelClearedDialog() {
    $("#Dialogs_LevelCleared").dialog("close");
    $("#Dialogs_LevelCleared_Conclusion").html("");
    $("#Dialogs_LevelCleared_Par").html("");
    $("#Dialogs_LevelCleared_Actual").html("");
    $("#Dialogs_LevelCleared_Congrats").hide();
    $("#Dialogs_LevelCleared_DoBetter").hide();

}