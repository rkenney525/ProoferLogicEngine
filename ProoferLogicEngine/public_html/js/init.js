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
});

/* Resizing */
$('#Controls_Rules').width(window.innerWidth);

/* Create the list of Levels */
var currentLevel = 0;
var Levels = [
    new Level([Rules.MP, Rules.MT],
            [
                getFactFromString("(p>q)"),
                getFactFromString("p"),
                getFactFromString("~(q)")
            ],
            getFactFromString("q"),
            1)
];