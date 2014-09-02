define(function() {
    /**
     * Create an Operator from a String symbol.
     * 
     * @param {String} symbol The String representation of the Operator.
     * @param {String} id The String representation used for internal parsing.
     * @returns {Operator} The Operator
     */
    function Operator(symbol, id) {
        this.symbol = symbol;
        this.id = id;
    }

// Built in functions
    /**
     * Compares Operator op with the calling Operator for equality.
     * 
     * @param {type} op The Operator to compare with.
     * @returns {Boolean} True if the Operators are equal, false otherwise.
     */
    Operator.prototype.equals = function(op) {
        return this === op;
    };

    /**
     * get the String value for the Operator (its symbol).
     * 
     * @returns {String} The String value of the Operator.
     */
    Operator.prototype.toString = function() {
        return this.symbol;
    };

// All possible values.  Closest I can get to enumerated types
    return Operators = {
        OR: new Operator("&or;", "|"),
        AND: new Operator("&and;", "&"),
        XOR: new Operator("&oplus;", "#"),
        COND: new Operator("&rarr;", ">"),
        BICOND: new Operator("&harr;", "%"),
        NEG: new Operator("&tilde;", "~"),
        /**
         * Get an Operator by its String value.
         * 
         * @param {String} data The symbol data to check for
         * @returns {Operator} The Operator matching with an id matching data, or null 
         * if not found
         */
        getOperatorFromString: function(data) {
            // Find the operator
            for (var op in Operators) {
                // Compare the symbol to the String
                if (Operators[op].id === data) {
                    return Operators[op];
                }
            }

            // Otherwise return null
            return null;
        }
    };
});