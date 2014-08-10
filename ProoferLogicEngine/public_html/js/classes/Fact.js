/**
 * Creates a logical statement with the specified operands and operator. Note this
 * creates a shallow copy and should only be used when parsing. Use factory methods 
 * instead.
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
 * If the Fact is encased in parens (and not a negation), strip the parens and 
 * return that String.
 * 
 * @returns {String} A nicer looking String version of the Fact
 */
Fact.prototype.toPrettyString = function() {
    // Init
    var str = this.toString();
    var len = str.length;

    // Check for outer parens
    if (str[0] === '(' &&
	    str[len - 1] === ')') {
	return str.substring(1, len - 1);
    } else {
	return str;
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
 * Gets a copy of the invoking Fact, rather than a reference to it.
 * 
 * @returns {Fact} A copy of the invoking Fact
 */
Fact.prototype.getCopy = function() {
    return getFactFromString(this.toParsableString());
};

/**
 * Returns the negation of a positive Fact or, if already a negation, the Fact that
 * is being negated.
 * 
 * @returns {Fact} The inverse of the Fact
 */
Fact.prototype.getInverse = function() {
    if (this.op === Operators.NEG) {
	return this.arg0.getCopy();
    } else {
	return this.getNegation();
    }
};

/**
 * Returns the negated form of the Fact
 *   p yields ~p
 *  ~p yields ~~p
 * 
 * @returns {Fact} The negated Fact
 */
Fact.prototype.getNegation = function() {
    return createFactFromComponents(this, null, Operators.NEG);
};

/**
 * Factory method to create a new Fact from existing Fact. Entire Fact is new, no
 * references to the inputs within the new Fact.
 * 
 * @param {Fact} arg0 The first argument
 * @param {Fact} arg1 The second argument
 * @param {Operator} op The Operator to use
 * @returns {Fact} The new Fact
 */
function createFactFromComponents(arg0, arg1, op) {
    // Get a deep copy of arg0 and arg1 and create the Fact from that
    var newArg0 = (arg0 !== null) ? getFactFromString(arg0.toParsableString()) : null;
    var newArg1 = (arg1 !== null) ? getFactFromString(arg1.toParsableString()) : null;

    // Create the Fact
    return new Fact(newArg0, newArg1, op);
}

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

/**
 * Create a Fact from a Fact's HTML String. Useful for Fact creation or rules 
 * of replacement.
 * 
 * @param {String} displayString The HTML String to create a Fact from
 * @returns {Fact} The resulting Fact
 */
function getFactFromHTMLString(displayString) {
    // Possibly add parens
    if (displayString.length > 1) {
	displayString = '(' + displayString + ')';
    }
    
    // Replace the actual operators
    displayString = displayString.split('\u2192').join('>');
    displayString = displayString.split('\u2295').join('#');
    displayString = displayString.split('\u2194').join('%');
    displayString = displayString.split('\u2227').join('&');
    displayString = displayString.split('\u2228').join('|');
    displayString = displayString.split('\u02DC').join('~');

    // Handle the lazy way we display negations
    for (var i = 0; i < displayString.length; i++) {
	if (displayString[i] === '~') {
	    var parenCount = 0;
	    for (var j = i + 1; j < displayString.length; j++) {
		if (displayString[j] === '(') {
		    parenCount++;
		} else if (displayString[j] === ')') {
		    parenCount--;
		} else if (displayString[j] === '~') {
		    continue;
		}

		if (parenCount === 0) {
		    displayString = displayString.insert(j + 1, ')');
		    break;
		}
	    }
	    displayString = displayString.insert(i + 1, '(');
	}
    }
    
    // Return
    return getFactFromString(displayString);
}