$(document).ready(function() {
    $("#Dialogs_FactCreation").dialog({
        modal: true,
        autoOpen: false,
        buttons: {
            "OK": function() {
                // Hide error messages
                $('#Dialogs_FactCreation_Error_NotEnoughGroups').hide();
                $('#Dialogs_FactCreation_Error_ElementNotEntered').hide();

                // Get the fact String and make it parsable
                var factStr = $('#Dialogs_FactCreation_Creation').text();

                // Look for a few obvious errors
                // Find any unentered data fields (?s)
                var possiblities = $('.creation-operator, .creation-element');
                for (var i = 0; i < possiblities.length; i++) {
                    if ($(possiblities[i]).text() === "?") {
                        $('.selected').removeClass('selected');
                        $(possiblities[i]).addClass('selected');
                        $('#Dialogs_FactCreation_Error_ElementNotEntered').show(500);
                        return;
                    }
                }

                // Find ambiguous statements
                var possiblities = $('.creation-operator');
                for (var i = 0; i < possiblities.length; i++) {
                    if ($(possiblities[i]).next().next().hasClass('close-paren') &&
                            $(possiblities[i]).prev().prev().hasClass('open-paren')) {
                        continue;
                    } else {
                        if ($(possiblities[i]).parent().attr("id") === 'Dialogs_FactCreation_Creation') {
                            // The highest order operator doesnt need parens
                            // However, if we want to parse it then it needs them
                            factStr = '(' + factStr + ')';
                            continue;
                        }
                        $('.selected').removeClass('selected');
                        $(possiblities[i]).addClass('selected');
                        $('#Dialogs_FactCreation_Error_NotEnoughGroups').show(500);
                        return;
                    }
                }

                // Replace the actual operators
                factStr = factStr.split('\u2192').join('>');
                factStr = factStr.split('\u2295').join('#');
                factStr = factStr.split('\u2194').join('%');
                factStr = factStr.split('\u2227').join('&');
                factStr = factStr.split('\u2228').join('|');
                factStr = factStr.split('\u02DC').join('~');

                // Handle the lazy way we displayed negations
                for (var i = 0; i < factStr.length; i++) {
                    if (factStr[i] === '~') {
                        var parenCount = 0;
                        for (var j = i + 1; j < factStr.length; j++) {
                            if (factStr[j] === '(') {
                                parenCount++;
                            } else if (factStr[j] === ')') {
                                parenCount--;
                            } else if (factStr[j] === '~') {
                                continue;
                            }

                            if (parenCount === 0) {
                                factStr = factStr.insert(j + 1, ')');
                                break;
                            }
                        }
                        factStr = factStr.insert(i + 1, '(');
                    }
                }

                // Get the fact
                var fact = getFactFromString(factStr);

                // Exit and return
                if (fact !== null) {
                    AddTable.addEntry(fact, function() {
                        AddTable.updateHtml();
                        closeFactCreationDialog();
                    });
                } else {
                    // TODO error message
                }
            },
            "Cancel": function() {
                closeFactCreationDialog();
            }
        },
        show: {
            effect: "highlight",
            duration: 1000
        },
        hide: {
            effect: "highlight",
            duration: 200
        }
    });
});

/**
 * Opens the Fact Creation Dialog.
 * 
 * @param {String} id The ID of the AddTable fact being created
 * @param {String} operation The operation to perform (add, edit)
 */
function openFactCreationDialog(id, operation) {
    // Bind keypress events
    bindKeyPressEvents();

    // open the dialog
    $("#Dialogs_FactCreation").dialog("open");

    // Check if we have data to load
    clearFactCreation();
    switch (operation) {
        case "add":
            initializeFactCreation();
            break;
        case "edit":
            var fact = AddTable[id];
            populateFactCreationAreaFromFact(fact);
            break;
    }

    // Deselect the buttons
    $('.ui-dialog-buttonset button').blur();

    // Set size
    $("#Dialogs_FactCreation").parent().css("min-width", 650);
}

function closeFactCreationDialog() {
    $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog' +
            '-buttons.ui-draggable.ui-resizable').unbind("keypress");

    // Hide error messages
    $('#Dialogs_FactCreation_Error_NotEnoughGroups').hide();
    $('#Dialogs_FactCreation_Error_ElementNotEntered').hide();

    // Close
    $("#Dialogs_FactCreation").dialog("close");
}

/**
 * Populate the Fact Creation area with the specified Fact.
 * 
 * @param {Fact} fact The Fact to populate.
 */
function populateFactCreationAreaFromFact(fact) {
    /**
     * Populate the Fact Creation area with fact
     * @param {jQuery Object} root The element to append fact to.
     * @param {Fact} fact The Fact to apply
     */
    var populate = function(root, fact) {
        if (fact.op === null) {
            root.append('<span class="creation-element">' + fact.arg0.toString() + '</span>');
        } else if (fact.arg1 === null) {
            root.append('<span class="creation-negation"></span>');
            var negation = root.children().last();
            negation.append('<span class="negation">˜</span>');
            populate(negation, fact.arg0);
        } else {
            root.append('<span class="group"></span>');
            var group = root.children().last();
            group.append('<span class="open-paren">(</span>');
            populate(group, fact.arg0);
            group.append('<span class="creation-operator">' + fact.op.toString() + '</span>');
            populate(group, fact.arg1);
            group.append('<span class="close-paren">)</span>');
        }
    };
    var root = $('#Dialogs_FactCreation_Creation');
    root.empty();
    populate(root, fact);
    updateCreationElements();
}