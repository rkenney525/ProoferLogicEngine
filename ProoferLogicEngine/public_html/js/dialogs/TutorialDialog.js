$(document).ready(function() {
    $("#Dialogs_Tutorial").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            "Skip": function() {
                closeTutorial();
            },
            "Previous": function() {
                // Init
                var index = $("#Dialogs_Tutorial")[0].index;
                var tutorial = $("#Dialogs_Tutorial")[0].tutorial;

                // Change the index
                $("#Dialogs_Tutorial")[0].index = --index;

                // Append the HTML
                $("#Dialogs_Tutorial").html(tutorial.pages[index].content);

                // TODO Modify the subtitle

                // Modify the buttons if necessary
                checkTutorialButtons();
            },
            "Next": function() {
                // Init
                var index = $("#Dialogs_Tutorial")[0].index;
                var tutorial = $("#Dialogs_Tutorial")[0].tutorial;

                if (index < (tutorial.pages.length - 1)) {
                    // Change the index
                    $("#Dialogs_Tutorial")[0].index = ++index;

                    // Append the HTML
                    $("#Dialogs_Tutorial").html(tutorial.pages[index].content);

                    // TODO Modify the subtitle

                    // Modify the buttons if necessary
                    checkTutorialButtons();
                } else {
                    closeTutorial();
                }
            }
        },
        show: {
            effect: "highlight",
            duration: 1000
        },
        hide: {
            effect: "highlight",
            duration: 1000
        }
    });
});

function checkTutorialButtons() {
    // Init
    var index = $("#Dialogs_Tutorial")[0].index;
    var tutorial = $("#Dialogs_Tutorial")[0].tutorial;

    // The previous button should be disabled on the first page
    if (index === 0) {
        $(".ui-dialog-buttonpane button:contains('Previous')")
                .attr("disabled", true)
                .addClass("ui-state-disabled");
    } else {
        $(".ui-dialog-buttonpane button:contains('Previous')")
                .attr("disabled", false)
                .removeClass("ui-state-disabled");
    }

    // The Next button should say Close on the last page
    if (index === (tutorial.pages.length - 1)) {
        $(".ui-dialog-buttonpane button:contains('Next') span")
                .filter(function(index) { return $(this).text() === "Next"; }).html("Close");
    } else {
        $(".ui-dialog-buttonpane button:contains('Close') span")
                .filter(function(index) { return $(this).text() === "Close"; }).html("Next");
    }
}

function closeTutorial() {
    // Clear all data related to state
    $("#Dialogs_Tutorial")[0].tutorial = null;
    $("#Dialogs_Tutorial")[0].index = 0;
    $("#Dialogs_Tutorial").empty();
    $("#Dialogs_Tutorial").dialog("close");
}

function openTutorial(tutorial) {
    // Set attributes to maintain state
    $("#Dialogs_Tutorial")[0].tutorial = tutorial;
    $("#Dialogs_Tutorial")[0].index = 0;

    // Append the HTML
    $("#Dialogs_Tutorial").html(tutorial.pages[0].content);

    // TODO Modify the title

    // Modify the buttons
    checkTutorialButtons();

    // Open the dialog
    $("#Dialogs_Tutorial").dialog("open");
}