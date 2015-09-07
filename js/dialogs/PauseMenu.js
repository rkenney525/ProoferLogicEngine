define(['jquery'], function($) {
    return {
        p: false,
        isPaused: function() {
            return this.p;
        },
        togglePause: function() {
            // Functionally pause or unpause
            // TODO figure out how to get the filter working properly
            if (this.isPaused()) {
                $("#FilterLayer").hide();
                $("#PauseMenu").hide();
            } else {
                $("#FilterLayer").show();
                $("#PauseMenu").show();
            }

            // Change the indicator
            this.p = !this.p;
        }
    };
});