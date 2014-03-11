$(document).ready(function() {
    $('#MenuPlayGame').click(function() {
	// TODO Implement starting sequence, level management, etc
	toGameScreen();
    });

    $('#Controls_Executor_Evaluate').click(function() {
	// TODO Calculate resulting fact and place in box
    });
});

function bindRuleEvents() {
    $('#Controls_Executor_Rule').droppable({
	tolerance: 'touch',
	drop: function(event) {
	    var target = $('#' + event.target.id);
	    var droppedItem = event.toElement;
	    // Make sure it's the right droppable
	    if (droppedItem.getAttribute('ruleId') !== null) {
		target.text(droppedItem.getAttribute('ruleId'));
	    }
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
	}
    });

    $(".fact").draggable({
	revert: 'invalid',
	opacity: 0.7,
	helper: "clone"
    });
}