/**
 * Configure the page to display the main menu.  This is the default state of 
 * the application.
 */
function toMainMenu() {
    // Clean up
    navigateAway();

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
		' rule-container" ruleId="' + rules[index] + '">'
                + rules[index].getHTML() +
                '</li>');
    }
    bindRuleEvents();

    // Facts
    var facts = level.facts;
    $('#Controls_Facts_Table').empty();
    for (var index in facts) {
	$('#Controls_Facts_Table').append(generateFactRow(Number(index), facts[index]));
            // TODO verify length of fact doesnt excede screen
    }
    bindFactEvents();
    
    // Conclusion
    $("#Controls_Display_Conclusion").html(level.conclusion.toString());
    
    // Load tutorial
    openTutorial(level.tutorial);
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
}

/**
 * Clear the result field of possible added classes and empty the HTML.
 */
function clearExecutorResult() {
    $('#Controls_Executor_Result').removeClass("glowing");
        $('#Controls_Executor_Result').html("");
}

/**
 * This function prepares the Level Cleared Dialog for display and then displays 
 * it.
 */
function displayLevelClearedDialog() {
    // Get info
    var level = Levels.getCurrentLevel();
    var par = level.par;
    var actual = level.facts.length;
    var metPar = (actual <= par);
    var conclusion = level.conclusion;
    
    // Prepare the dialog
    $("#Dialogs_LevelCleared_Conclusion").html(conclusion.toString());
    $("#Dialogs_LevelCleared_Par").html(par);
    $("#Dialogs_LevelCleared_Actual").html(actual);
    if (metPar) {
	$("#Dialogs_LevelCleared_Congrats").show();
    } else {
	$("#Dialogs_LevelCleared_DoBetter").show();
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

    // Remove location specific classes
    $('body').removeClass('menu-focused');
    $('body').removeClass('machine-focused');
}