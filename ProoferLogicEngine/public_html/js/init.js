requirejs(['jquery', 'jqueryui', 'blockUI', 'util', 'Level',
    'AddTable', 'LevelClearedDialog', 'TutorialDialog',
    'FactCreationDialog', 'Pagination', 'events',
    'cloud'], function($, jqueryui, blockUI, util, Levels,
        AddTable, LevelClearedDialog, TutorialDialog,
        FactCreationDialog, Pagination, events,
        cloud) {

    /* Add additional prototypes */
    util.addPrototypes();

    /* Init greenworks */
    //cloud.greenworks.initAPI();

    /* Create buttons  */
    $('#Dialogs_FactCreation_OpList_Clear').button();
    $('#Dialogs_FactCreation_OpList_Negate').button();
    $('#PickLevel_PageControls_Next').button();
    $('#PickLevel_PageControls_Prev').button();
    $('#PickLevel_PageControls_Back').button();
    $('#PickLevel_PageControls_Play').button();
    $('#PickLevel_PageControls_Play').disable();
    $('#MainMenuOptions li input').button();

    /* Initialize the AddTable */
    AddTable.loadData();

    /* initialize the creation elements */
    events.updateCreationElements();

    /* Set the current level */
    cloud.getData("currentLevel", function(value) {
        if (value !== undefined) {
            if (value.index !== undefined) {
                Levels.currentIndex = value.index;
            }
            if (value.progress !== undefined) {
                Levels.current = value.progress;
            }
        }
    });

    /* Resizing */
    $('#Controls_Rules').width(window.innerWidth);

    /* Initial events */
    events.init();

    /* Dialogs */
    FactCreationDialog.init();
    LevelClearedDialog.init(events.bindFactEvents, events.bindRuleEvents);
    TutorialDialog.init();

    /* Pagination */
    // TODO fix the moving of the controls
    Pagination.LevelSelectionPagination = Pagination.getPagination(Levels.data, 15);
});