define(['jquery', 'jqueryui', 'control', 'Fact', 'AddTable'],
        function($, jqueryui, control, Fact, AddTable) {
            return {
                init: function(updateAddTableEvents) {
                    var FactCreationDialog = this;
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
                                            // So we add it in the call to Fact.getFactFromHTMLString
                                            continue;
                                        }
                                        $('.selected').removeClass('selected');
                                        $(possiblities[i]).addClass('selected');
                                        $('#Dialogs_FactCreation_Error_NotEnoughGroups').show(500);
                                        return;
                                    }
                                }

                                // Get the fact
                                var fact = Fact.getFactFromHTMLString(factStr, true);

                                // Exit and return
                                if (fact !== null) {
                                    AddTable.addEntry(fact, function() {
                                        AddTable.updateHtml(updateAddTableEvents);
                                        FactCreationDialog.closeFactCreationDialog();
                                    });
                                } else {
                                    // TODO error message
                                }
                            },
                            "Cancel": function() {
                                FactCreationDialog.closeFactCreationDialog();
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
                },
                /**
                 * Opens the Fact Creation Dialog.
                 * 
                 * @param {String} id The ID of the AddTable fact being created
                 * @param {String} operation The operation to perform (add, edit)
                 */
                openFactCreationDialog: function(id, operation, updateCreationElements, bindKeyPressEvents) {
                    // Bind keypress events
                    bindKeyPressEvents();

                    // open the dialog
                    $("#Dialogs_FactCreation").dialog("open");

                    // Check if we have data to load
                    control.clearFactCreation();
                    switch (operation) {
                        case "add":
                            control.initializeFactCreation();
                            break;
                        case "edit":
                            var fact = AddTable[id];
                            this.populateFactCreationAreaFromFact(fact, updateCreationElements);
                            break;
                    }

                    // Deselect the buttons
                    $('.ui-dialog-buttonset button').blur();

                    // Set size
                    $("#Dialogs_FactCreation").parent().css("min-width", 650);
                },
                closeFactCreationDialog: function() {
                    $('div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog' +
                            '-buttons.ui-draggable.ui-resizable').unbind("keypress");

                    // Hide error messages
                    $('#Dialogs_FactCreation_Error_NotEnoughGroups').hide();
                    $('#Dialogs_FactCreation_Error_ElementNotEntered').hide();

                    // Close
                    $("#Dialogs_FactCreation").dialog("close");
                },
                /**
                 * Populate the Fact Creation area with the specified Fact.
                 * 
                 * @param {Fact} fact The Fact to populate.
                 */
                populateFactCreationAreaFromFact: function(fact, updateCreationElements) {
                    control.generateFactHTML(fact, $('#Dialogs_FactCreation_Creation'), 'creation', updateCreationElements);
                }
            };
        });