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
    $('#Controls_Executor_Rule, #Controls_Rules').droppable({
	tolerance: 'touch'
    });

    $(".rule").draggable({
	snap: ".rule-container",
	snapMode: "inner",
	revert: 'invalid'
    });
}

function bindFactEvents() {
    $('#Controls_Executor_Arg0, #Controls_Executor_Arg1, .fact-data-holder').droppable({
	tolerance: 'touch',
        drop: function(event) {
            // TODO grab the number put it in the box
        }
    });

    $(".fact").draggable({
	snap: ".rule-container",
	snapMode: "inner",
	revert: 'invalid',
        opacity: 0.7,
        helper: "clone"
    });
}