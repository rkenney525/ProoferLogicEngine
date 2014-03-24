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

    /* Add prototypes to String */
    String.prototype.insert = function(index, val) {
	if (index > 0)
	    return this.substring(0, index) + val + this.substring(index, this.length);
	else
	    return val + this;
    };

    /* Create buttons for the Fact Creator */
    $('#Dialogs_FactCreation_OpList_Clear').button();
    $('#Dialogs_FactCreation_OpList_Negate').button();

    /* Initialize the AddTable */
    AddTable.loadData();
    AddTable.updateHtml();

    /* initialize the creation elements */
    updateCreationElements();
});

/* Resizing */
$('#Controls_Rules').width(window.innerWidth);