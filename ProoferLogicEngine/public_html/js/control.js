function toMainMenu() {
    // Clean up
    navigateAway();

    // Set up
    $('body').addClass('menu-focused');
    $('#MainMenu').show();
}

function toGameScreen() {
    // Clean up
    navigateAway();

    // Set up
    $('body').addClass('machine-focused');
    $('#GameScreen').show();

    // Load the level data
    var info = Levels[currentLevel];
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
    for (var index = 0; index < rules.length; index++) {
        $('#Controls_Rules_List').append('<li class="' + ((index === (rules.length - 1)) ? 'last-item' : '') + 
		' rule-container" ruleId="' + rules[index] + '">'
                + rules[index].getHTML() +
                '</li>');
    }
    bindRuleEvents();

    // Facts
    var facts = level.facts;
    for (var index in facts) {
	$('#Controls_Facts_Table').append('<tr>' +
		'<td>' + '<div class="fact ovaled" factId="'
		+ index + '">' + (Number(index) + 1) + '</div>' + '</td>' +
		'<td>' + facts[index] + '</td>' +
	    '</tr>');
            // TODO verify length of fact doesnt excede screen
    }
    bindFactEvents();
}

function clearExecutorInputs() {
    $('#Controls_Executor_Arg0, #Controls_Executor_Arg1, #Controls_Executor_Rule')
            .removeClass("rule-filled fact-filled")
            .html("");
}

function navigateAway() {
    // Hide other divs
    $('#MainMenu').hide();
    $('#GameScreen').hide();

    // Remove location specific classes
    $('body').removeClass('menu-focused');
    $('body').removeClass('machine-focused');
}