/**
 * Creates a logical statement with the specified operands and operator.
 * 
 * @param {Fact|String} arg0 The first operand.  Either a Fact or a String.
 * @param {Fact|String} arg1 The second operand.  Either a Fact or a String.
 * @param {Operator} op The operator
 * @returns {Fact} A fact with the specified operands and operator.
 */
function Fact(arg0, arg1, op) {
    this.arg0 = arg0;
    this.arg1 = arg1;
    this.op = op;
}

/**
 * Creates a Fact with the provided operand.  Use the neg flag to set whether 
 * the Fact should be negated.
 * 
 * @param {Fact|String} arg0 The single operand
 * @param {boolean} neg True if the Fact should be negated, false otherwise.
 * @returns {Fact} A fact with the specified operand.
 */
function Fact(arg0, neg) {
    this.arg0 = arg0;
    this.arg1 = null;
    this.op = (neg) ? Operators.NEG : null;
}

// Built in functions
/**
 * Test otherFact for equality against the calling Fact.
 * 
 * @param {Fact} otherFact The Fact to check
 * @returns {Boolean} True if the Facts are identical, false otherwise
 */
Fact.prototype.equals = function(otherFact) {
    return this.toString() === otherFact.toString();
};

/**
 * The String form of the Fact.
 * 
 * @returns {String} The String form of the Fact
 */
Fact.prototype.toString = function() {
    if (this.op === null) {
	return this.arg0.toString();
    } else if (this.arg1 === null) {
	return this.op.toString() + "(" + this.arg0.toString() + ")";
    } else {
	return "(" + this.arg0.toString() + this.op.toString() +
		this.arg1.toString() + ")";
    }
};

Fact.prototype.fromString = function(data) {
    // TODO implement Fact.fromString()
};