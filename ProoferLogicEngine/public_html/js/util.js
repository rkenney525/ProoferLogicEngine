define(['jquery'], function($) {
    return {
        /**
         * Close the browser window
         */
        closeWindow: function() {
            window.close();
        },
        /**
         * Add any custom prototypes to third party objects
         */
        addPrototypes: function() {
            String.prototype.insert = function(index, val) {
                if (index > 0)
                    return this.substring(0, index) + val + this.substring(index, this.length);
                else
                    return val + this;
            };
            $.prototype.disable = function() {
                this.attr("disabled", true)
                        .addClass("ui-state-disabled");
            };
            $.prototype.enable = function() {
                this.attr("disabled", false)
                        .removeClass("ui-state-disabled");
            };
        }
    };
});