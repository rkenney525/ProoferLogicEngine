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
 * @param {Level} level The level to load
 * @returns {undefined}
 */
function populateGameScreen(level) {
    // Rules
    var rules = level.rules;
    for (var index = 0; index < rules.length; index++) {
        $('#Controls_Rules_List').append('<li class="' + ((index === (rules.length - 1)) ? 'last-item' : '') + 
		' rule-container" id="Controls_Rules_List_Item_' + rules[index].displayName + '">'
                + rules[index].getHTML() +
                '</li>');
    }
    bindRuleEvents();

    // Facts
    var facts = level.facts;
    for (var index in facts) {
	$('#Controls_Facts_Table').append('<tr>' +
		'<td>' + '<div class="fact boxed"><p>' + index + '</p></div>' + '</td>' +
		'<td>' + facts[index] + '</td>' +
	    '</tr>');
    }
    // TODO populate facts
}

function updateRulesList() {
    // Get the list
    var ruleslist = $('#Controls_Rules_List li');
    
    // Remove the li that once contained the div
    for (var index = 0; index < ruleslist.length; index++) {
	if (ruleslist[index].children.length === 0) {
	    ruleslist.remove('#' + ruleslist[index].id);
	}
    }
    
    // Remove the "last" class from any that might have it and add it to the last element
    ruleslist.removeClass("last-item");
    ruleslist.last().addClass("last-item");
}

function navigateAway() {
    // Hide other divs
    $('#MainMenu').hide();
    $('#GameScreen').hide();

    // Remove location specific classes
    $('body').removeClass('menu-focused');
    $('body').removeClass('machine-focused');
}