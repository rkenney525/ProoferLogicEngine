requirejs(['jquery', 'jqueryui', 'blockUI', 'util', 'Operator', 'Fact', 'Rule',
    'Tutorial', 'Level', 'AddTable', 'LevelClearedDialog', 'TutorialDialog',
    'FactCreationDialog', 'PauseMenuDialog', 'canvas', 'control', 'events',
    'cloud', 'globals'], function() {
    $(document).ready(function() {
        /* Add additional prototypes */
        addPrototypes();

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
        updateCreationElements();

        /* Set the current level */
        getData("currentLevel", function(value) {
            if (value !== undefined) {
                if (value.index !== undefined) {
                    Levels.currentIndex = value.index;
                }
                if (value.progress !== undefined) {
                    Levels.current = value.progress;
                }
            }
        });
    });

    /* Resizing */
    $('#Controls_Rules').width(window.innerWidth);

    /* Pagination */
    // TODO fix the moving of the controls
    LevelSelectionPagination = new Pagination(Levels.data, 15);
});