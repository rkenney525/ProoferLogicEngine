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
	return this.op.toString() + "" + this.arg0.toString() + "";
    } else {
	return "(" + this.arg0.toString() + this.op.toString() +
		this.arg1.toString() + ")";
    }
};

/**
 * Returns the String form of the Fact that can be parsed by getFactFromString()
 * 
 * @returns {String} The String form of the Fact that can be parsed by getFactFromString()
 */
Fact.prototype.toParsableString = function() {
    if (this.op === null) {
	return this.arg0.toString();
    } else if (this.arg1 === null) {
	return this.op.id + "(" + this.arg0.toParsableString() + ")";
    } else {
	return "(" + this.arg0.toParsableString() + this.op.id +
		this.arg1.toParsableString() + ")";
    }
};

/**
 * Create a Fact from a String.  The grammatical structure of a Fact can be seen 
 * below.
 * 
 * FACT = [a-z]  |  (FACT OP FACT)  |  ~(FACT)
 * OP   = &or; and | (disjunction)     |
 *	  &and; and & (conjunction)    |
 *        &oplus; and # (exclusive or) |
 *        &rarr; and > (implication)   |
 *        &harr; and % (biconditional)
 * 
 * @param {String} data The String form of the Fact
 * @returns {Fact} The resulting Fact
 */
function getFactFromString(data) {
    // Init
    var current = "";
    var subFactString;
    var index = 0;
    var endex = data.length - 1;

    // Get the next character
    current = data[index];

    // Case 1: [a-z]
    if (current.match(/[a-z]/i) !== null) {
	return new Fact(current, null, null);
    }
    // Case 2: (FACT OP FACT)
    else if (current === "(") {
	// Skip the paren
	index++;

	// Find the midpoint
	// The midpoint is the operator that splits arg0 from arg1
	// Since arg0 and arg1 are Facts, they may have Operators of their own, 
	// so we can't simply get the next Operator.
	var midpoint = index;
	var parenCount = 0;
	for (var search = index; search <= endex; search++) {
	    // Reset current
	    current = data[search];

	    // Check if current is a paren
	    var tryOp = getOperatorFromString(current);
	    if (current === "(") {
		parenCount++;
	    } else if (current === ")") {
		parenCount--;
	    } else if (parenCount === 0 &&
		    tryOp !== null &&
		    !tryOp.equals(Operators.NEG)) {
		midpoint = search;
		break;
	    }
	}

	// Get arg0
	var arg0;
	subFactString = data.substring(index, midpoint);
	arg0 = getFactFromString(subFactString);

	// Get the Operator
	var op = getOperatorFromString(data[midpoint]);

	// Get arg1
	var arg1;
	subFactString = data.substring(midpoint + 1, endex);
	arg1 = getFactFromString(subFactString);

	// Create the Fact
	return new Fact(arg0, arg1, op);
    }
    // Case 3: ~(FACT)
    else if (getOperatorFromString(current).equals(Operators.NEG) &&
	    data[index + 1] === "(") {
	// Move up a char
	index++;

	// Get the inner Fact
	subFactString = data.substring(index + 1, data.lastIndexOf(")"));

	// Negate the inner fact
	return new Fact(getFactFromString(subFactString), null, Operators.NEG);

    }

}