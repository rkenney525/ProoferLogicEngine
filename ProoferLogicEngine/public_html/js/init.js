$(document).ready(function() {
    /* Give the body the appropriate size */
    $('body').innerWidth(window.innerWidth);
    $('body').innerHeight(window.innerHeight);

    /* Opening Graphic */
    // Draw some text
    var can = $("#OpeningGraphicCanvas").get(0);
    var ctx = can.getContext("2d");
    ctx.font = "40px Arial";
    ctx.fillText("Proofer - The Logic Engine", 20, 75);

    /* Add additional prototypes */
    String.prototype.insert = function(index, val) {
	if (index > 0)
	    return this.substring(0, index) + val + this.substring(index, this.length);
	else
	    return val + this;
    };
    $.prototype.disable = function() {
	this.attr("disabled", true)
		.addClass("ui-state-disabled");
    };
    $.prototype.enable = function() {
	this.attr("disabled", false)
		.removeClass("ui-state-disabled");
    };

    /* Create buttons  */
    $('#Dialogs_FactCreation_OpList_Clear').button();
    $('#Dialogs_FactCreation_OpList_Negate').button();
    $('#PickLevel_PageControls_Next').button();
    $('#PickLevel_PageControls_Prev').button();
    $('#PickLevel_PageControls_Back').button();
    $('#PickLevel_PageControls_Play').button();
    $('#PickLevel_PageControls_Play').disable();
    
    /* Initialize the AddTable */
    AddTable.loadData();
    AddTable.updateHtml();

    /* initialize the creation elements */
    updateCreationElements();

    /* Check for save data */
    getData("hasGame", function(value) {
	if (value !== "true") {
	    $('#MenuPlayGame').disable();
	}
    });
});

/* Resizing */
$('#Controls_Rules').width(window.innerWidth);

/* Pagination */
// TODO MAYBE fix the moving of the controls
var LevelSelectionPagination = new Pagination(Levels.data, 15);