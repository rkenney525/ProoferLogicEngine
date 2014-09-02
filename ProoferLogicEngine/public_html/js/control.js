define(['jquery', 'Level', 'cloud', 'Rule', 'Pagination',
    'TutorialDialog'],
        function($, Levels, cloud, Rules, Pagination,
                TutorialDialog) {
            return {
                /**
                 * Configure the page to display the main menu.  This is the default state of 
                 * the application.
                 */
                toMainMenu: function() {
                    // Clean up
                    this.navigateAway();
                    Levels.reset();

                    // Set up
                    $('body').addClass('menu-focused');
                    $('#MainMenu').show();
                },
                /**
                 * Configure the page to display the game screen.  Even if you're already on the 
                 * game screen, this function can be used after increasing the currentLevel.
                 */
                toGameScreen: function(bindFactEvents, bindRuleEvents) {
                    // Clean up
                    this.navigateAway();
                    var control = this;

                    cloud.getData("currentLevel", function(data) {
                        // Set up
                        $('body').addClass('machine-focused');
                        $('#GameScreen').show();

                        // Save the game
                        var level = Levels.getCurrentLevel();

                        // See if we have any saved data at all
                        if (data === undefined) {
                            data = {};
                        } else {
                            // Check for progress for this level
                            if (data.progress !== undefined &&
                                    data.index === Levels.currentIndex) {
                                level = cloud.loadLevelObj(data.progress);
                                Levels.current = level;
                            }
                        }

                        // Save the current level as the most recently played
                        data.index = Levels.currentIndex;
                        cloud.saveData("currentLevel", data);

                        control.populateGameScreen(level, bindFactEvents, bindRuleEvents);
                    });
                },
                /**
                 * Swap the screen to the rules of replacement view
                 * 
                 * @param {Fact} fact The Fact to populate the screen with
                 * @param {Function} generatedFactEventBinder Event function used 
                 * to bind events to the HTML for generated generated Fact HTML. 
                 * This is the part of the app where you select the part of the 
                 * Fact to apply the replacement rule.
                 * @returns {undefined}
                 */
                toReplacementScreen: function(fact, generatedFactEventBinder, bindRuleEvents) {
                    // Hide Executor
                    $('#Controls_Executor').hide();
                    $('#Controls_Executor').removeClass('executor-modifier-active');

                    // Show Modifier
                    $('#Controls_Modifier').show();
                    $('#Controls_Modifier').addClass('executor-modifier-active');

                    // Clear any existing data
                    this.clearModifierFields();

                    // Display the level's Rules of Replacement
                    var rules = Levels.getCurrentLevel().rules;
                    // TODO if rules is empty, display a message saying no rules of replacement are available
                    this.populateRules(this.getRulesByType(rules, Rules.RuleType.REPLACEMENT), bindRuleEvents);

                    // Clear Executor fields
                    this.clearExecutorInputs();
                    this.clearExecutorResult();

                    // Display Fact information
                    $('#Controls_Modifier_SelectionArea').empty();
                    $('#Controls_Modifier_SelectionArea').html(fact.toPrettyString());
                    this.generateFactHTML(fact, $('#Controls_Modifier_SelectionArea'), 'replacement', generatedFactEventBinder);
                },
                /**
                 * Swap the screen back to the rules of inference view. No need to reload page, 
                 * except for the Rules.
                 * 
                 * @returns {undefined}
                 */
                toExecutorScreen: function(bindRuleEvents) {
                    // Show Executor
                    $('#Controls_Executor').show();
                    $('#Controls_Executor').addClass('executor-modifier-active');

                    // Hide Modifier
                    $('#Controls_Modifier').hide();
                    $('#Controls_Modifier').removeClass('executor-modifier-active');

                    // Clear Modifier 
                    this.clearModifierFields();

                    // Clear the selected Fact
                    $(".fact-row-selected").removeClass("fact-row-selected");

                    // Display the level's Rules of Inference
                    var rules = Levels.getCurrentLevel().rules;
                    this.populateRules(this.getRulesByType(rules, Rules.RuleType.INFERENCE), bindRuleEvents);
                },
                /*
                 * Display all the Rules in the provided list of Rules.
                 * 
                 * @param {Rule[]} rules The Rules to display
                 * @param {Function} bindRuleEvents Function to bind Rule events
                 * @returns {undefined}
                 */
                populateRules: function(rules, bindRuleEvents) {
                    // Empty the existing Rules (if any)
                    $('#Controls_Rules_List').empty();

                    // Populate from the list
                    for (var index = 0; index < rules.length; index++) {
                        $('#Controls_Rules_List').append('<li class="' + ((index === (rules.length - 1)) ? 'last-item' : '') +
                                ' rule-container">'
                                + rules[index].getHTML() +
                                '</li>');
                    }

                    // Bind the events
                    bindRuleEvents();
                },
                /**
                 * Get Rules of a particular type from a provided list of Rules.
                 * 
                 * @param {Rule[]} ruleList The list of Rules
                 * @param {RuleType} type The RuleType to filter by
                 * @returns {Rule[]} Rules from ruleList of RuleType type
                 */
                getRulesByType: function(ruleList, type) {
                    // Init
                    var rules = [];

                    // Get the rules
                    for (var i = 0; i < ruleList.length; i++) {
                        if (ruleList[i].type === type) {
                            rules.push(ruleList[i]);
                        }
                    }

                    // Return the Rules
                    return rules;
                },
                /**
                 * Navigate away and switch to viewing all levels and their current stats.
                 */
                toPickLevel: function() {
                    // Clean up
                    this.navigateAway();

                    // Set up
                    $('body').addClass('menu-focused');
                    $('#PickLevel').show();

                    // Populate the selection screen
                    this.populateLevelSelectionScreen();
                },
                populateLevelDetails: function(id) {
                    var level = Levels.data[id]();
                    // Popualate
                    cloud.getData(level.id, function(data) {
                        // Get values
                        var best = (data !== undefined && data.best !== undefined) ?
                                data.best : "N/A";
                        var par = level.par;
                        var completed = best !== "N/A" ? "Yes" : "No";
                        var onPar = (best !== "N/A" && best <= par) ? "Yes" : "No";

                        // Display
                        $('#PickLevel_MoreInfo').hide();
                        $('#PickLevel_MoreInfo_Best').text(best);
                        $('#PickLevel_MoreInfo_Par').text(par);
                        $('#PickLevel_MoreInfo_Completed').text(completed);
                        $('#PickLevel_MoreInfo_OnPar').text(onPar);
                        $('#PickLevel_MoreInfo').show("slide", 500);
                    });
                },
                /**
                 * Populate the LevelSelection Screen with each level and its respective html.
                 */
                populateLevelSelectionScreen: function() {
                    // Init
                    var levels = Pagination.LevelSelectionPagination.getPage();
                    $('#PickLevel_LevelContainer_List').empty();
                    $('#PickLevel_MoreInfo').hide();

                    // Get each level
                    for (var i = 0; i < levels.length; i++) {
                        var level = levels[i]();
                        var id = levels[i].paginationId;
                        // Style all of these classes
                        $('#PickLevel_LevelContainer_List').append(
                                '<li><div class="select-level level boxed"><span class="level-id">' + id +
                                '</span><div class="level-details" style="display: none;">' + level.getHtml() + '</div></div></li>');
                    }

                    // Handle the buttons
                    this.checkPaginationButtons();

                    // Update the events
                    events.updateSelectLevelEvents();
                },
                /**
                 * Disable Next button if on the last page and disable the prev button if on the 
                 * first page.
                 * 
                 * @returns {undefined}
                 */
                checkPaginationButtons: function() {
                    if (Pagination.LevelSelectionPagination.onFirstPage()) {
                        $('#PickLevel_PageControls_Prev').disable();
                    } else {
                        $('#PickLevel_PageControls_Prev').enable();
                    }
                    if (Pagination.LevelSelectionPagination.onLastPage()) {
                        $('#PickLevel_PageControls_Next').disable();
                    } else {
                        $('#PickLevel_PageControls_Next').enable();
                    }
                },
                /**
                 * Loads the Game screen with all assets per the level.
                 * 
                 * @param {Level} level The Level to load
                 * @param {Function} bindFactEvents Function to bind Fact events
                 */
                populateGameScreen: function(level, bindFactEvents, bindRuleEvents) {
                    // Rules
                    var rules = this.getRulesByType(level.rules, Rules.RuleType.INFERENCE);
                    this.populateRules(rules, bindRuleEvents);

                    // Facts
                    var facts = level.facts;
                    $('#Controls_Facts_Table').empty();
                    for (var index in facts) {
                        $('#Controls_Facts_Table').append(this.generateFactRow(Number(index), facts[index].toPrettyString()));
                    }
                    bindFactEvents();

                    // Conclusion
                    $("#Controls_Display_Conclusion").html(level.conclusion.toPrettyString());

                    // Load tutorial
                    if (level.tutorial !== null) {
                        TutorialDialog.openTutorial(level.tutorial);
                    }

                },
                /**
                 * Create the HTML for an entry in the Fact table.
                 * 
                 * @param {Number} index The index in the current level's array of Facts
                 * @param {Fact} fact The Fact being displayed
                 * @returns {String} The HTML for a row int he Fact table
                 */
                generateFactRow: function(index, fact) {
                    return '<tr factid="' + index + '">' +
                            '<td>' + '<div class="fact ovaled" factId="'
                            + index + '">' + (index + 1) + '</div>' + '</td>' +
                            '<td class="fact-edit">' + fact + '</td>' +
                            '</tr>';
                },
                /**
                 * Clear all fields for the modifier
                 * 
                 * @returns {undefined}
                 */
                clearModifierFields: function() {
                    $("#Controls_Modifier_SelectionArea").empty();
                    $("#Controls_Modifier_Rule").empty();
                    $("#Controls_Modifier_Rule").removeClass("rule-filled");
                    $("#Controls_Modifier_Results_Container").hide();
                    $("#Controls_Modifier_Results_Container").empty();
                    $("#Controls_Modifier_AddIt").disable();
                },
                /**
                 * Clear input fields of possible *-filled classes and empty the HTML.
                 */
                clearExecutorInputs: function() {
                    $('#Controls_Executor_Arg0, #Controls_Executor_Arg1, #Controls_Executor_Rule')
                            .removeClass("rule-filled fact-filled")
                            .html("");
                    $('#Controls_Executor_Arg1').droppable("enable");
                    $('#Controls_Executor_Arg1').unbind("click");
                },
                /**
                 * Clear the result field of possible added classes and empty the HTML.
                 */
                clearExecutorResult: function() {
                    $('#Controls_Executor_Result').removeClass("glowing");
                    $('#Controls_Executor_Result').html("");
                },
                clearFactCreation: function() {
                    $('#Dialogs_FactCreation_Error_NotEnoughGroups').hide();
                    $('#Dialogs_FactCreation_Error_ElementNotEntered').hide();
                    $('#Dialogs_FactCreation_Creation').empty();
                },
                initializeFactCreation: function() {
                    this.clearFactCreation();
                    $('#Dialogs_FactCreation_Creation')
                            .append('<span class="creation-element selected">?</span>');
                },
                /**
                 * Hide all of the major view divs so the slate can be set clean. Also removes 
                 * CSS properties from the body that are used to configure pages.  Call this 
                 * function before a major navigation such as going to the main menu or the game 
                 * screen.
                 */
                navigateAway: function() {
                    // Hide other divs
                    $('#MainMenu').hide();
                    $('#GameScreen').hide();
                    $('#PickLevel').hide();

                    // Remove location specific classes
                    $('body').removeClass('menu-focused');
                    $('body').removeClass('machine-focused');
                },
                /**
                 * Generate HTML from the supplied Fact and place it in the supplied div.
                 * 
                 * @param {Fact} fact The Fact to genreate HTML from
                 * @param {JQuery} root The root element to generate the HTML to.
                 * @param {String} source The source of the call, either creation or replacement
                 * @param {Function} eventUpdate Function called to update any events.
                 * @returns {undefined}
                 */
                generateFactHTML: function(fact, root, source, eventUpdate) {
                    /**
                     * Populate the Fact Creation area with fact
                     * @param {jQuery Object} root The element to append fact to.
                     * @param {Fact} fact The Fact to apply
                     */
                    var populate = function(root, fact) {
                        if (fact.op === null) {
                            root.append('<span class="' + source + '-element ' + source + '-control">' + fact.arg0.toString() + '</span>');
                        } else if (fact.arg1 === null) {
                            root.append('<span class="' + source + '-negation ' + source + '-control"></span>');
                            var negation = root.children().last();
                            negation.append('<span class="negation ' + source + '-control">˜</span>');
                            populate(negation, fact.arg0);
                        } else {
                            root.append('<span class="group ' + source + '-control"></span>');
                            var group = root.children().last();
                            group.append('<span class="open-paren ' + source + '-control">(</span>');
                            populate(group, fact.arg0);
                            group.append('<span class="' + source + '-operator ' + source + '-control">' + fact.op.toString() + '</span>');
                            populate(group, fact.arg1);
                            group.append('<span class="close-paren ' + source + '-control">)</span>');
                        }
                    };
                    root.empty();
                    populate(root, fact);
                    eventUpdate();
                }
            };
        });