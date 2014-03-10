$(document).ready(function() {
    $('#MenuPlayGame').click(function() {
	// TODO Implement starting sequence, level management, etc
	toGameScreen();
    });
});

function bindRuleEvents() {
    $('#Controls_Executor_Rule').droppable({
	tolerance: 'touch'
    });

    $('#Controls_Rules').droppable({
	tolerance: 'touch'
    });

    $(".rule").draggable({
	snap: ".rule-container",
	snapMode: "inner",
	revert: 'invalid'
    });
}