define(['jquery', 'jqueryui', 'Level', 'control', 'cloud'],
        function($, jqueryui, Levels, control, cloud) {
            return {
                init: function(bindFactEvents, bindRuleEvents) {
                    var LevelClearedDialog = this;
                    $("#Dialogs_LevelCleared").dialog({
                        modal: true,
                        autoOpen: false,
                        buttons: {
                            "Next Level": function() {
                                if (Levels.onLastLevel()) {
                                    control.toMainMenu();
                                    LevelClearedDialog.closeLevelClearedDialog();
                                } else {
                                    Levels.nextLevel();
                                    control.toGameScreen(bindFactEvents, bindRuleEvents);
                                    LevelClearedDialog.closeLevelClearedDialog();
                                }
                            },
                            "Retry": function() {
                                Levels.reset();
                                control.toGameScreen(bindFactEvents, bindRuleEvents);
                                LevelClearedDialog.closeLevelClearedDialog();
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
                },
                /**
                 * This function prepares the Level Cleared Dialog for display and then displays 
                 * it.
                 */
                displayLevelClearedDialog: function() {
                    // Get info
                    var level = Levels.getCurrentLevel();
                    var par = level.par;
                    var starting = level.startingFacts;
                    var actual = level.facts.length;
                    var established = actual - starting;
                    var metPar = (established <= par);
                    var conclusion = level.conclusion;

                    // Save the score
                    cloud.getData(level.id, function(data) {
                        // If this is the first time, then this is the best
                        if (data === undefined) {
                            data = {};
                            data.best = established;
                            cloud.saveData(level.id, data);
                        } else {
                            // Otherwise, check and see if this is the best
                            var best = data.best;
                            if (established < best) {
                                data.best = established;
                                cloud.saveData(level.id, data);
                            }
                        }
                    });

                    // Prepare the dialog
                    $("#Dialogs_LevelCleared_Conclusion").html(conclusion.toPrettyString());
                    $("#Dialogs_LevelCleared_Par").html(par);
                    $("#Dialogs_LevelCleared_Actual").html(actual);
                    $("#Dialogs_LevelCleared_Starting").html(starting);
                    $("#Dialogs_LevelCleared_Established").html(established);
                    if (metPar) {
                        $("#Dialogs_LevelCleared_Congrats").show();
                    } else {
                        $("#Dialogs_LevelCleared_DoBetter").show();
                    }
                    if (Levels.onLastLevel()) {
                        $(".ui-dialog-buttonpane button:contains('Next Level') span")
                                .filter(function(index) {
                                    return $(this).text() === "Next Level";
                                }).html("Main Menu");
                    } else {
                        $(".ui-dialog-buttonpane button:contains('Main Menu') span")
                                .filter(function(index) {
                                    return $(this).text() === "Main Menu";
                                }).html("Next Level");
                    }

                    // Display the dialog
                    $("#Dialogs_LevelCleared").dialog("open");
                },
                closeLevelClearedDialog: function() {
                    $("#Dialogs_LevelCleared").dialog("close");
                    $("#Dialogs_LevelCleared_Conclusion").html("");
                    $("#Dialogs_LevelCleared_Par").html("");
                    $("#Dialogs_LevelCleared_Actual").html("");
                    $("#Dialogs_LevelCleared_Congrats").hide();
                    $("#Dialogs_LevelCleared_DoBetter").hide();
                }
            }
        });