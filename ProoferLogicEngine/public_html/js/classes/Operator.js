function Operator(symbol) {
    this.symbol = symbol;
}

// Built in functions
Operator.prototype.equals = function(op) {
    return this.symbol === op.symbol;
};
Operator.prototype.getSymbol = function() {
    return this.symbol;
};

// All possible values.  Closest I can get to enumerated types
var Operators = {
    OR: new Operator("&or;"),
    AND: new Operator("&and;"),
    XOR: new Operator("&oplus;"),
    COND: new Operator("&rarr;"),
    BICOND: new Operator("&harr;"),
    NEG: new Operator("&tilde;")
};