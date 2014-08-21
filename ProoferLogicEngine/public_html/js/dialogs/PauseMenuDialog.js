var PauseMenu = {
    p: false,
    isPaused: function() {
        return this.p;
    },
    togglePause: function() {
        // Functionally pause or unpause
        if (this.isPaused()) {
            $("body").removeClass("grayed");
            $("#PauseMenu").hide();
        } else {
            $("body").addClass("grayed");
            $("#PauseMenu").show();
        }

        // Change the indicator
        this.p = !this.p;
    }
};