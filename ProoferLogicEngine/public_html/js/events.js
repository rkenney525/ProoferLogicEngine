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
        // Get the level
        var level = Levels[currentLevel];

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
        arg1 = level.facts[Number(arg1) - 1];

        // Get the result
        var result = (isUnaryRule(rule)) ?
                rule.applyRule(arg0) : rule.applyRule(arg0, arg1);

        // Handle the result appropriately
        if (result !== null) {
            $('#Controls_Executor_Result').html(result.toString());
            $('#Controls_Executor_Result').addClass("glowing");
            $('#Controls_Executor_Result').click(function() {
                // Get some basic info
                var level = Levels[currentLevel];
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
                    $('#Controls_Facts_Table').append(generateFactRow(index, result));
                    
                    // Make it draggable
                    bindFactEvents();
                }

                // Clear the results and input
                clearExecutorResult();
                clearExecutorInputs();

                // Remove the event, it's no longer valid
                $('#Controls_Executor_Result').unbind("click");
                
                // TODO sound effect like a pop or pow (think mario rpg pop)
		// TODO check if its the last fact.  if so, populate the dialog
            });
        } else {
            // TODO Do something on the UI to indicate the rule attempt failed
            // semantically
            return;
        }

    });
    
    // Base key event handler
    $('body').keypress(function(event) {
        var keycode = event.which;
        switch(keycode) {
            
        }
    });
});

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
                // TODO: check if dropped rule was Add.  If so, do something to 
                // arg1 box
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
}