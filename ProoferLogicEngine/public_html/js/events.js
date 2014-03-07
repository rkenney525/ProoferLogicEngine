$(document).ready(function() {
    $('#MenuPlayGame').click(function() {
	// TODO Implement starting sequence, level management, etc
	toGameScreen();
    });
    /*$('#Controls_Executor_Rule')
	    .bind("dragover", function(event) {
		var id = idBeingDragged;
		var obj = $('#' + id);
		var targetLocation = $('#' + event.target.id);
		if (obj.hasClass("rule") && targetLocation.children().length === 0
			&& !targetLocation.hasClass("rule")) {
		    event.preventDefault();
		}
	    })
	    .bind("drop", function(event) {
		var id = idBeingDragged;
		var obj = $('#' + id);
		if (obj.hasClass("rule")) {
		    event.target.appendChild(obj.get(0));
		}
		updateRulesList();
	    });
    $('#Controls_Rules')
	    .bind("dragover", function(event) {
		var id = idBeingDragged;
		var obj = $('#' + id);
		var targetLocation = $('#' + event.target.id);
		if (obj.hasClass("rule") && !targetLocation.hasClass("rule")) {
		    event.preventDefault();
		}
	    })
	    .bind("drop", function(event) {
		var id = idBeingDragged;
		var obj = $('#' + id);
		if (obj.hasClass("rule")) {
		    // TODO figure out how to get this to do what I want it to do
		    event.target.appendChild('<li id="Controls_Rules_List_Item_"' + 
			    obj.get(0).ruleid +'>' + obj.get(0) + '</li>');
		}
		updateRulesList();
	    });*/
});

function bindRuleEvents() {
    $(".rule").draggable({
        snap: ".rule-container",
        snapMode: "inner"
    });
    /*var rules = $('.rule');
    rules.bind("dragstart", function(event) {
	// set the tracker
	//idBeingDragged = event.target.id;

	// Update the rules list
	updateRulesList();
    });*/
}