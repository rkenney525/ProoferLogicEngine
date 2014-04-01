/**
 * Configure the page to display the main menu.  This is the default state of 
 * the application.
 */
function toMainMenu() {
    // Clean up
    navigateAway();
    Levels.reset();

    // Set up
    $('body').addClass('menu-focused');
    $('#MainMenu').show();
}

/**
 * Configure the page to display the game screen.  Even if you're already on the 
 * game screen, this function can be used after increasing the currentLevel.
 */
function toGameScreen() {
    // Clean up
    navigateAway();

    // Set up
    $('body').addClass('machine-focused');
    $('#GameScreen').show();

    // Load the level data
    var info = Levels.getCurrentLevel();
    populateGameScreen(info);
}

/**
 * Navigate away and switch to viewing all levels and their current stats.
 */
function toPickLevel() {
    // Clean up
    navigateAway();

    // Set up
    $('body').addClass('menu-focused');
    $('#PickLevel').show();

    // Populate the selection screen
    populateLevelSelectionScreen();
}

/**
 * Populate the LevelSelection Screen with each level and its respective html.
 */
function populateLevelSelectionScreen() {
    // Init
    var levels = Levels.data;
    $('#PickLevel_LevelContainer_List').empty();
    
    // Get each level
    for (var i = 0; i < levels.length; i++) {
        var level = levels[i]();
        // Style all of these classes
        $('#PickLevel_LevelContainer_List').append(
                '<li><div class="select-level level boxed"><span class="level-id">' + (i + 1) + 
                '</span><div class="level-details">' + level.getHtml() + '</div></div></li>');
    }
    // TODO some sort of pagination
    // TODO indicate completed
    // TODO indicate par or better
}

/**
 * Loads the Game screen with all assets per the level.
 * 
 * @param {Level} level The Level to load
 */
function populateGameScreen(level) {
    // Rules
    var rules = level.rules;
    $('#Controls_Rules_List').empty();
    for (var index = 0; index < rules.length; index++) {
	$('#Controls_Rules_List').append('<li class="' + ((index === (rules.length - 1)) ? 'last-item' : '') +
		' rule-container">'
		+ rules[index].getHTML() +
		'</li>');
    }
    bindRuleEvents();

    // Facts
    var facts = level.facts;
    $('#Controls_Facts_Table').empty();
    for (var index in facts) {
	$('#Controls_Facts_Table').append(generateFactRow(Number(index), facts[index].toPrettyString()));
    }
    bindFactEvents();

    // Conclusion
    $("#Controls_Display_Conclusion").html(level.conclusion.toPrettyString());

    // Load tutorial
    if (level.tutorial !== null) {
	openTutorial(level.tutorial);
    }
}

/**
 * Create the HTML for an entry in the Fact table.
 * 
 * @param {Number} index The index in the current level's array of Facts
 * @param {Fact} fact The Fact being displayed
 * @returns {String} The HTML for a row int he Fact table
 */
function generateFactRow(index, fact) {
    return '<tr>' +
	    '<td>' + '<div class="fact ovaled" factId="'
	    + index + '">' + (index + 1) + '</div>' + '</td>' +
	    '<td>' + fact + '</td>' +
	    '</tr>';
}

/**
 * Clear input fields of possible *-filled classes and empty the HTML.
 */
function clearExecutorInputs() {
    $('#Controls_Executor_Arg0, #Controls_Executor_Arg1, #Controls_Executor_Rule')
	    .removeClass("rule-filled fact-filled")
	    .html("");
    $('#Controls_Executor_Arg1').droppable("enable");
    $('#Controls_Executor_Arg1').unbind("click");
}

/**
 * Clear the result field of possible added classes and empty the HTML.
 */
function clearExecutorResult() {
    $('#Controls_Executor_Result').removeClass("glowing");
    $('#Controls_Executor_Result').html("");
}

function clearFactCreation() {
    $('#Dialogs_FactCreation_Error_NotEnoughGroups').hide();
    $('#Dialogs_FactCreation_Error_ElementNotEntered').hide();
    $('#Dialogs_FactCreation_Creation').empty();
}

function initializeFactCreation() {
    clearFactCreation();
    $('#Dialogs_FactCreation_Creation')
	    .append('<span class="creation-element selected">?</span>');
}

/**
 * This function prepares the Level Cleared Dialog for display and then displays 
 * it.
 */
function displayLevelClearedDialog() {
    // Get info
    var level = Levels.getCurrentLevel();
    var par = level.par;
    var starting = level.startingFacts;
    var actual = level.facts.length;
    var established = actual - starting;
    var metPar = (established <= par);
    var conclusion = level.conclusion;

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
}

/**
 * Hide all of the major view divs so the slate can be set clean. Also removes 
 * CSS properties from the body that are used to configure pages.  Call this 
 * function before a major navigation such as going to the main menu or the game 
 * screen.
 */
function navigateAway() {
    // Hide other divs
    $('#MainMenu').hide();
    $('#GameScreen').hide();
    $('#PickLevel').hide();

    // Remove location specific classes
    $('body').removeClass('menu-focused');
    $('body').removeClass('machine-focused');
}