//var requirejs = require('js/libs/require.js/require.js');

requirejs.config({
    baseUrl: '.',
    paths: {
        'jquery': 'js/libs/jquery-1.9.0/jquery.min',
        'jqueryui': "js/libs/jqueryui-1.10.0/jquery-ui.min",
        'blockUI': "js/libs/jquery-blockui/jquery.blockUI",
        'util': "js/util",
        'Operator': "js/classes/Operator",
        'Fact': "js/classes/Fact",
        'Rule': "js/classes/Rule",
        'Tutorial': "js/classes/Tutorial",
        'Level': "js/classes/Level",
        'AddTable': "js/classes/AddTable",
        'Pagination': 'js/classes/Pagination',
        'LevelClearedDialog': "js/dialogs/LevelClearedDialog",
        'TutorialDialog': "js/dialogs/TutorialDialog",
        'FactCreationDialog': "js/dialogs/FactCreationDialog",
        'PauseMenu': "js/dialogs/PauseMenu",
        'canvas': "js/canvas",
        'control': "js/control",
        'events': "js/events",
        'cloud': "js/cloud"
    }
});