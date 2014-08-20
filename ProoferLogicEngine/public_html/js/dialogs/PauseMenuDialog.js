// TODO consider using something other than dialog, or figure out better way to size it
$(document).ready(function() {
    $("#PauseMenu").dialog({
        modal: true,
        autoOpen: false,
        draggable: false,
        resizable: false
    });
});

var PauseMenu = {
    p: false,
    isPaused: function() {
        return this.p;
    },
    togglePause: function() {
        this.p = !this.p;
    }
};

function openPauseMenu() {
    $("#PauseMenu").dialog("open");
}

function closePauseMenu() {
    $("#PauseMenu").dialog("close");
}