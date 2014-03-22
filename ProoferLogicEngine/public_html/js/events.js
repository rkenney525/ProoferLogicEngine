$(document).ready(function() {
    $('#MenuPlayGame').click(function() {
	toGameScreen();
    });

    $('#Controls_Executor_ClearResults').click(function() {
	clearExecutorResult();
    });

    $('#Controls_Executor_ClearInput').click(function() {
	clearExecutorInputs();
    });

    $('#Controls_Executor_Evaluate').click(function() {
	// TODO total rule attempt count??
	// Get the level
	var level = Levels.getCurrentLevel();

	// Get the rule
	var rule = null;
	for (var index = 0; index < level.rules.length; index++) {
	    if (level.rules[index].displayName === $('#Controls_Executor_Rule').text()) {
		rule = level.rules[index];
		break;
	    }
	}
	if (rule === null) {
	    // TODO The Rule wasn't valid, find a good way to show it in the UI
	    // NOTE this isnt possible through the games mechanics, but it should be
	    // handled anyway, preferably with vulgarity
	    return;
	}

	// Get the args
	// arg0 is required
	var arg0 = $('#Controls_Executor_Arg0').text();
	if (arg0 === "") {
	    // Every rule requires at least the first argument
	    // TODO notify the UI
	    return;
	}
	arg0 = level.facts[Number(arg0) - 1];
	// arg1 isn't always required
	var arg1 = $('#Controls_Executor_Arg1').text();
	if (!isUnaryRule(rule) &&
		(arg1 === "")) {
	    // This is a binary rule so it needs the second arg
	    // TODO notify the UI
	    return;
	}
	if (rule === Rules.Add) {
	    arg1 = AddTable[arg1];
	} else {
	    arg1 = level.facts[Number(arg1) - 1];
	}

	// Get the result
	var result = (isUnaryRule(rule)) ?
		rule.applyRule(arg0) : rule.applyRule(arg0, arg1);

	// Handle the result appropriately
	if (result !== null) {
	    // TODO successful rule attempt count??
	    // TODO check result length and then do something if its too long
	    $('#Controls_Executor_Result').html(result.toPrettyString());
	    $('#Controls_Executor_Result').addClass("glowing");
	    $('#Controls_Executor_Result').click(function() {
		// Get some basic info
		var level = Levels.getCurrentLevel();
		var facts = level.facts;

		// Check if the proposed Fact exists
		var factExists = false;
		for (var index = 0; index < facts.length; index++) {
		    if (result.equals(facts[index])) {
			factExists = true;
			break;
		    }
		}

		// If the fact doesnt exist, add it to the list and table
		if (!factExists) {
		    // The new index will always be the current length of the array
		    var index = facts.length;

		    // Add the fact
		    facts.push(result);

		    // Update the table
		    $('#Controls_Facts_Table').append(generateFactRow(index, result.toPrettyString()));

		    // Make it draggable
		    bindFactEvents();
		}

		// Clear the results and input
		clearExecutorResult();
		clearExecutorInputs();

		// Remove the event, it's no longer valid
		$('#Controls_Executor_Result').unbind("click");

		// TODO sound effect like a pop or pow (think mario rpg pop)
		if (result.equals(level.conclusion)) {
		    displayLevelClearedDialog();
		}
	    });
	} else {
	    // TODO Do something on the UI to indicate the rule attempt failed
	    // semantically
	    return;
	}

    });

    /**
     * Called when the plus sign in the Add Table is clicked.
     */
    $('.add-fact').click(function() {
	var idToReplace = $(this).parent()[0].id;
	openFactCreationDialog(idToReplace, "add");
    });

    /**
     * Open the Fact editor with the current Fact loaded
     */
    $('.edit-fact').click(function() {
	var idToReplace; // TODO get the id
	openFactCreationDialog(idToReplace, "edit");
    });

    /**
     * Close the AddTable when the banner is clicked
     */
    $('#Controls_AddTable_Banner').click(function() {
	$('#Controls_AddTable').hide(500);
    });

    /**
     * Clear the Fact Creator
     */
    $('#Dialogs_FactCreation_OpList_Clear').click(function() {
	clearFactCreation();
	$('#Dialogs_FactCreation_Creation')
	    .append('<span class="creation-element selected">?</span>');
    });
    
    /**
     * 
     */
    $('#Dialogs_FactCreation_OpList_Negate').click(function() {
	// Get the selected element
	var selected = $('.selected');
	var negation = 
		'<span class="creation-negation"><span class="negation">&tilde;</span></span>';
	
	// Handle operator and creation-fact
	if (selected.hasClass('creation-operator')) {
	    var parent = selected.parent();
	} else if (selected.hasClass('creation-element')) {
	    $(negation).insertBefore(selected).append(selected);
	}
    });

    /**
     * Bind the events to make Operators in the AddTable draggable
     */
    $('.operator').draggable({
	revert: 'invalid',
	opacity: 0.7,
	helper: "clone"
    });

    /**
     * Bind the events to make Tools in the AddTable draggable
     */
    $('.tool').draggable({
	revert: 'invalid',
	opacity: 0.7,
	helper: "clone"
    });
});

function bindKeyPressEvents() {
    // Base key event handler
    $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.' +
	    'ui-dialog-buttons.ui-draggable.ui-resizable').keypress(function(event) {
	var keycode = event.which;
	if ((keycode >= 65 && keycode <= 90) ||
		(keycode >= 97 && keycode <= 122)) {
	    // Add the span
	    var target = $('#Dialogs_FactCreation_Creation span')
		    .filter('.selected');
	    if (target.hasClass('creation-element')) {
		target.text(String.fromCharCode(keycode));
	    }

	    // Update creation elements
	    updateCreationElements();
	} else if (keycode === 32) {
	    // Get the target
	    var target = $('.creation-element').filter('.selected').parent();
	    var close = target.children('span.close-paren');

	    // Add the tags
	    var inGroup = close.length !== 0;
	    if (inGroup) {
		$('<span class="creation-operator">?</span>')
			.insertBefore(close);
		$('<span class="creation-element">?</span>')
			.insertBefore(close);
	    } else {
		target.append('<span class="creation-operator">?</span>');
		target.append('<span class="creation-element">?</span>');
	    }

	    // Update creation elements
	    updateCreationElements();
	}
    });
}

function updateCreationElements() {
    $('.creation-element, .creation-operator').click(function(event) {
	// Deselct the old selected
	$('.selected').removeClass("selected");

	// Select this one
	$(this).addClass("selected");
    });

    $('.creation-operator').droppable({
	tolerance: 'touch',
	drop: function(event) {
	    // Get the op
	    var dropped = event.toElement;
	    var op = dropped.innerHTML;
	    var item = $(dropped).attr("data");

	    // Make sure we're holding an operator or group
	    switch (item) {
		case "operator":
		    // Place the op
		    $(this).html(op);

		    // Prevent propogation
		    event.stopPropagation();
		    break;
		case "group":
		    // Get the elements for the new group
		    var op = $(this);
		    var arg0 = op.prev();
		    var arg1 = op.next();
		    
		    // Prevent redundancy
		    if (op.next().next().hasClass('close-paren') &&
			    op.prev().prev().hasClass('open-paren')) {
			break;
		    }

		    // Create the group
		    var group =
			    $('<span class="group"><span class="open-paren">(</span></span>')
			    .insertBefore(arg0);

		    // Populate the group
		    group.append(arg0);
		    group.append(op);
		    group.append(arg1);
		    group.append('<span class="close-paren">)</span>');

		    // Prevent propogation
		    event.stopPropagation();
		    break;
	    }
	}
    });
}

function displayNewFactSelector(event) {
    // Get position
    var top = event.pageY;
    var left = event.pageX;

    // Display the popup
    $('#Controls_AddTable').css("top", top);
    $('#Controls_AddTable').css("left", left);
    $('#Controls_AddTable').show(500);
}

/**
 * Grab every Rule and make it draggable. Also add the droppable event to the Rule
 * box.
 */
function bindRuleEvents() {
    $('#Controls_Executor_Rule').droppable({
	tolerance: 'touch',
	drop: function(event) {
	    var target = $('#' + event.target.id);
	    // Remove the class that gives the glow
	    target.removeClass("hover-glowing");
	    var droppedItem = event.toElement;

	    // Make sure it's the right droppable
	    if (droppedItem.getAttribute('ruleId') !== null) {
		target.text(droppedItem.getAttribute('ruleId'));
		target.addClass("rule-filled");
		if (isUnaryRule(Rules[droppedItem.getAttribute('ruleId')])) {
		    $('#Controls_Executor_Arg1').droppable("disable");
		    $('#Controls_Executor_Arg1').html('<img src="img/no.png" />');
		} else if (Rules[droppedItem.getAttribute('ruleId')] === Rules.Add) {
		    $('#Controls_Executor_Arg1').html('<img src="img/ellipse.png" />');
		    $('#Controls_Executor_Arg1').droppable("disable");
		    $('#Controls_Executor_Arg1').click(displayNewFactSelector);
		} else {
		    $('#Controls_Executor_Arg1').droppable("enable");
		    $('#Controls_Executor_Arg1').unbind("click");
		    if ($('#Controls_Executor_Arg1').children() > 0) {
			$('#Controls_Executor_Arg1').html("");
		    }
		}
	    }
	},
	over: function(event) {
	    var target = $('#' + event.target.id);
	    var droppedItem = event.toElement;
	    // Make sure it's the right droppable
	    if (droppedItem.getAttribute('ruleId') !== null) {
		target.addClass("hover-glowing");
	    }
	},
	out: function(event) {
	    var target = $('#' + event.target.id);
	    target.removeClass("hover-glowing");
	}
    });

    $(".rule").draggable({
	revert: 'invalid',
	opacity: 0.7,
	helper: "clone",
	appendTo: 'body'
    });

    $(".rule").mouseover(function() {
	$(this).addClass("lifted");
    });

    $(".rule").mouseout(function() {
	$(this).removeClass("lifted");
    });
}

/**
 * Bind Fact related events: Make the numbers draggable and the Arg boxes 
 * droppable.  When a new Fact is added, this method should be called.
 */
function bindFactEvents() {
    $('#Controls_Executor_Arg0, #Controls_Executor_Arg1').droppable({
	tolerance: 'touch',
	drop: function(event) {
	    var target = $('#' + event.target.id);
	    // Remove the class that gives the glow
	    target.removeClass("hover-glowing");
	    var droppedItem = event.toElement;

	    // Make sure it's the right droppable
	    if (droppedItem.getAttribute('factId') !== null) {
		// You can't apply any rule with two identical operands. So 
		// if someone tries to reapply a rule, swap values with the 
		// other operand.
		var numBeingDropped = Number(droppedItem.getAttribute('factId')) + 1;
		var self = (target[0] === $('#Controls_Executor_Arg0')[0]) ?
			$('#Controls_Executor_Arg0') : $('#Controls_Executor_Arg1');
		var other = (self[0] === $('#Controls_Executor_Arg0')[0]) ?
			$('#Controls_Executor_Arg1') : $('#Controls_Executor_Arg0');

		if (other.text() === String(numBeingDropped)) {
		    other.text(self.text());
		    if (self.text() === "") {
			other.removeClass("fact-filled");
		    }
		    self.text(numBeingDropped);
		    self.addClass("fact-filled");
		} else {
		    target.addClass("fact-filled");
		    target.text(numBeingDropped);
		}
	    }
	},
	over: function(event) {
	    var target = $('#' + event.target.id);
	    var droppedItem = event.toElement;
	    // Make sure it's the right droppable
	    if (droppedItem.getAttribute('factId') !== null) {
		target.addClass("hover-glowing");
	    }
	},
	out: function(event) {
	    var target = $('#' + event.target.id);
	    target.removeClass("hover-glowing");
	}
    });

    $(".fact").draggable({
	revert: 'invalid',
	opacity: 0.7,
	helper: "clone",
	appendTo: 'body'
    });

    $(".fact").mouseover(function() {
	$(this).addClass("lifted");
    });

    $(".fact").mouseout(function() {
	$(this).removeClass("lifted");
    });
}