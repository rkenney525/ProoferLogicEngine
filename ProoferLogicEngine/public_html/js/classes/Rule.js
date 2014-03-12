/**
 * A Rule encapsulates a Rule of logical inference or logical replacement.
 * 
 * @param {String} ruleName The full name of the rule
 * @param {String} displayName The abbreviation of the rule
 * @param {function} ruleFunction The logic for the rule.  The function parameters will
 * be 1-2 Facts, depending on the Rule. Specs:
 * 
 * Fact applyRule(Fact, Fact); return the resulting Fact or null if the rule cannot be applied.
 * 
 * @returns {Rule} The newly created Rule
 */
function Rule(ruleName, displayName, ruleFunction) {
    this.name = ruleName;
    this.displayName = displayName;
    this.applyRule = ruleFunction;
}
;

Rule.prototype.getHTML = function() {
    return '<div id="Rule_' + this.displayName + '" class="rule boxed"'
	    + ' ruleid="' + this.displayName + '">' + this.displayName +
	    '</div>';
};

/* Create the list of Rules */
var Rules = {
    MP: new Rule("Modus Ponens", "MP", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.COND) {
	    return null;
	}

	/* For example:
	 *  arg0 = (p>q)
	 *  arg1 = p
	 * Then:
	 *  arg0.arg0 = p
	 * And since:
	 *  arg0.arg0 == arg1 (p == p)
	 * Return:
	 *  arg0.arg1 (q)
	 */
	if (arg0.arg0.equals(arg1)) {
	    return getFactFromString(arg0.arg1.toString());
	} else {
	    return null;
	}
    }),
    MT: new Rule("Modus Tollens", "MT", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.COND) {
	    return null;
	}

	// Sanity check arg1
	if (arg1.op !== Operators.NEG) {
	    return null;
	}

	/* For example:
	 *  arg0 = (p>q)
	 *  arg1 = ~(q)
	 * Then:
	 *  arg0.arg1 = q
	 *  neg(arg0.arg0) = ~(q)
	 * And since:
	 *  neg(arg0.arg1) == arg1 (~(q) == ~(q))
	 * Return:
	 *  arg0.arg1 ~(p)
	 */
	var negQ = new Fact(arg0.arg1, null, Operators.NEG);
	if (negQ.equals(arg1)) {
	    return new Fact(getFactFromString(arg0.arg0.toString()), null, Operators.NEG);
	} else {
	    return null;
	}
    }),
    DS: new Rule("Disjunctive Syllogism", "DS", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.OR) {
	    return null;
	}

	// Sanity check arg1
	if (arg1.op !== Operators.NEG) {
	    return null;
	}

	/* For example:
	 *  arg0 = (p|q)
	 *  arg1 = ~(p)
	 * Then:
	 *  neg(arg0.arg0) = ~(p)
	 * And since:
	 *  neg(arg0.arg0) == arg1 (~(p) == ~(p))
	 * Return:
	 *  arg0.arg1
	 */
	var negP = new Fact(arg0.arg0, null, Operators.NEG);
	if (negP.equals(arg1)) {
	    return getFactFromString(arg0.arg1.toString());
	} else {
	    return null;
	}
    }),
    CD: new Rule("Constructive Dilemma", "CD", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.AND ||
		arg0.arg0.op !== Operators.COND ||
		arg0.arg1.op !== Operators.COND) {
	    return null;
	}
	
	// Sanity check arg1
	if (arg1.op !== Operators.OR) {
	    return null;
	}
	
	/* For example: 
	 *  arg0 = ((p>q)&(r>s))
	 *  arg1 = (p|r)
	 * Then:
	 *  arg0.arg0 = (p>q)
	 *  arg0.arg0.arg0 = p
	 *  arg0.arg0.arg1 = q
	 *  arg0.arg1 = (r>s)
	 *  arg0.arg1.arg0 = r
	 *  arg0.arg1.arg1 = s
	 *  arg1.arg0 = p
	 *  arg1.arg1 = r
	 * And since:
	 *  arg0.arg0.arg0 == arg1.arg0 (p == p)
	 *  arg0.arg1.arg0 == arg1.arg1 (r == r)
	 * Return:
	 *  (arg0.arg0.arg1 | arg0.arg1.arg1) (q|s)
	 */
	if (arg0.arg0.arg0.equals(arg1.arg0) &&
		arg0.arg1.arg0.equals(arg1.arg1)) {
	    var firstDisjunctArg1 = getFactFromString(arg0.arg0.arg1.toString());
	    var secondDisjunctArg1 = getFactFromString(arg0.arg1.arg1.toString());
	    return new Fact(firstDisjunctArg1, secondDisjunctArg1, Operators.OR);
	}
    }),
    HS: new Rule("Hypothetical Syllogism", "HS", function(arg0, arg1) {

    }),
    Simp: new Rule("Simplification", "Simp", function(arg0) {

    }),
    Conj: new Rule("Conjunction", "Conj", function(arg0, arg1) {

    }),
    Abs: new Rule("Absorption", "Abs", function(arg0) {
	// arg0 must be a conditional.  If it is, then the rule can be either 
	// applied or reversed, both will be shown.
	if (arg0.op === Operators.COND) {
	    /* For example (application):
	     *  arg0 = (p>(p&q))
	     * Then:
	     *  arg0.arg0 = p
	     *  arg0.arg1.arg0 = p
	     * And since:
	     *  arg0.arg0 == arg0.arg1.arg0 (p == p)
	     * Return:
	     *  (arg0.arg0 > arg0.arg1.arg1)
	     */
	    if (arg0.arg0.equals(arg0.arg1.arg0)) {
		return new Fact(getFactFromString(arg0.arg0.toString()), 
		getFactFromString(arg0.arg1.arg1.toString()), Operators.COND);
	    } else {
		/* For example (reverse application):
		 *  arg0 = (p>q)
		 * Then:
		 *  arg0.arg0 = p
		 *  arg0.arg1 = q
		 * And we want:
		 *  (p>(p&q))
		 * So return:
		 *  (arg0.arg0 > (arg0.arg0 & arg0.arg1))
		 */
		var conj = new Fact(getFactFromString(arg0.arg0.toString()), 
		getFactFromString(arg0.arg1.toString()), Operators.AND);
		return new Fact(getFactFromString(arg0.arg0.toString()), conj, Operators.COND);
	    }
	} else {
	    return null;
	}
    }),
    Add: new Rule("Addition", "Add", function(arg0) {
	// TODO there is going to need to be an interface for this
    })
};

/**
 * Check if rule is unary, which is to say it takes only one operand.
 * 
 * @param {Rule} rule The Rule to check
 * @returns {boolean} True if rule takes only one operand, false otherwise
 */
function isUnaryRule(rule) {
    // TODO probably have to add rules of replacement
    return (rule === Rules.Simp) ||
	    (rule === Rules.Abs) ||
	    (rule === Rules.Add);
}