$(document).ready(function() {
    $('#MenuPlayGame').click(function() {
        // TODO Implement starting sequence, level management, etc
        toGameScreen();
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
            // TODO possibly store this elsewhere, but for now just display the
            // rule in the box
            $('#Controls_Executor_Result').html(result.toString());
            $('#Controls_Executor_Result').addClass("glowing");
            // TODO add click event to $('#Controls_Executor_Result')
        } else {
            // TODO Do something on the UI to indicate the rule attempt failed
            // semantically
            return;
        }

    });
});

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
        helper: "clone"
    });
}

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
                    self.text(numBeingDropped);
                } else {
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
        helper: "clone"
    });
}