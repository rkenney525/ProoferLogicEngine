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
    
    /* Create buttons for the AddTable */
    $('.add-fact, .edit-fact').button();
    
    /* initialize the creation elements */
    updateCreationElements()
});

/* Resizing */
$('#Controls_Rules').width(window.innerWidth);