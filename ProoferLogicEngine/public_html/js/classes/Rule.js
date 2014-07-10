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

/**
 * Generate HTML for this Rule.
 * 
 * @returns {String} HTML representing a Rule
 */
Rule.prototype.getHTML = function() {
    return '<div id="Rule_' + this.displayName + '" class="rule boxed"'
	    + ' ruleid="' + this.displayName + '">' 
            + '<div class="center rule-text" ruleid="' + this.displayName + '">' 
            + this.displayName + '</div>' +
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
	    return getFactFromString(arg0.arg1.toParsableString());
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
	    return new Fact(getFactFromString(arg0.arg0.toParsableString()), null, Operators.NEG);
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
	    return getFactFromString(arg0.arg1.toParsableString());
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
	    var firstDisjunctArg1 = getFactFromString(arg0.arg0.arg1.toParsableString());
	    var secondDisjunctArg1 = getFactFromString(arg0.arg1.arg1.toParsableString());
	    return new Fact(firstDisjunctArg1, secondDisjunctArg1, Operators.OR);
	}
    }),
    HS: new Rule("Hypothetical Syllogism", "HS", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.COND) {
	    return null;
	}

	// Sanity check arg1
	if (arg1.op !== Operators.COND) {
	    return null;
	}

	/* For example:
	 *  arg0 = (p>q)
	 *  arg1 = (q>r)
	 * Then:
	 *  arg0.arg0 = p
	 *  arg0.arg1 = q
	 *  arg1.arg0 = q
	 *  arg1.arg1 = r
	 * And since:
	 *  arg0.arg1 == arg1.arg0 (q == q)
	 * Return:
	 *  (arg0.arg0 > arg1.arg1)
	 */
	if (arg0.arg1.equals(arg1.arg0)) {
	    var antecedent = getFactFromString(arg0.arg0.toParsableString());
	    var consequent = getFactFromString(arg1.arg1.toParsableString());
	    return new Fact(antecedent, consequent, Operators.COND);
	}
    }),
    Simp: new Rule("Simplification", "Simp", function(arg0) {
	// Sanity check arg0
	if (arg0.op !== Operators.AND) {
	    return null;
	}

	/* For example:
	 *  arg0 = (p&q)
	 * Then:
	 *  arg0.arg0 = p
	 * So return:
	 *  arg0.arg0 (p)
	 */
	return getFactFromString(arg0.arg0.toParsableString());
    }),
    Conj: new Rule("Conjunction", "Conj", function(arg0, arg1) {
	/* For example:
	 *  arg0 = p
	 *  arg1 = q
	 * So return:
	 *  (arg0 & arg1) (p&q)
	 */
	var p = getFactFromString(arg0.toParsableString());
	var q = getFactFromString(arg1.toParsableString());
	return new Fact(p, q, Operators.AND);
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
		return new Fact(getFactFromString(arg0.arg0.toParsableString()),
			getFactFromString(arg0.arg1.arg1.toParsableString()), Operators.COND);
	    }
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
	    var conj = new Fact(getFactFromString(arg0.arg0.toParsableString()),
		    getFactFromString(arg0.arg1.toParsableString()), Operators.AND);
	    return new Fact(getFactFromString(arg0.arg0.toParsableString()), conj, Operators.COND);
	} else {
	    return null;
	}
    }),
    Add: new Rule("Addition", "Add", function(arg0, arg1) {
	/* For example:
	 *  arg0 = p
	 *  arg1 = [Something from the user] (q)
	 * So return:
	 *  (arg0 | arg1) (p | q)
	 */
	var p = getFactFromString(arg0.toParsableString());
	var q = getFactFromString(arg1.toParsableString());
	return new Fact(p, q, Operators.OR);
    }),
    Neg: new Rule("Negation", "Neg", function(arg0) {
        /* For example type #1:
         *  arg0 = ~(~p)
         * Then:
         *  arg0.arg0.arg0 = p
         * So return:
         *  arg0.argo.arg0 (p)
         */
        if (arg0.op === Operators.NEG &&
                arg0.arg0.op === Operators.NEG) {
            return getFactFromString(arg0.arg0.arg0.toParsableString());
        }
        /* For example type #2:
         *  arg0 = p
         * Then:
         *  neg(neg(arg0)) = ~(~(p))
         * So return:
         *  neg(neg(arg0)) ( ~(~(p)) )
         */
        else {
            return getFactFromString("~(~(" + arg0.toParsableString() + "))");
        }
    }),
    DeM: new Rule("De Morgan's Law", "DeM", function(arg0) {
        /* For example type #1
         *  arg0 = p | (q & r)
         * Then:
         *  arg0.arg0 = p
         *  arg0.arg1.arg0 = q
         *  arg0.arg1.arg1 = r
         * And since:
         *  arg0.op = OR
         *  arg0.arg1.op = AND
         * So return:
         *  ((arg0.arg0 OR arg0.arg1.arg0) AND (arg0.arg0 OR arg0.arg1.arg1)) 
         *  ((p | q) & (p | r))
         */
        if (arg0.op === Operators.OR &&
                arg0.arg1.op === Operators.AND) {
            return getFactFromString(new Fact(
                    new Fact(arg0.arg0, arg0.arg1.arg0, Operators.OR),
                    new Fact(arg0.arg0, arg0.arg1.arg1, Operators.OR),
                    Operators.AND).toParsableString());
        }
        
        /* For example type #2
         *  arg0 = p & (q | r)
         * Then:
         *  arg0.arg0 = p
         *  arg0.arg1.arg0 = q
         *  arg0.arg1.arg1 = r
         * And since:
         *  arg0.op = AND
         *  arg0.arg1.op = OR
         * So return:
         *  ((arg0.arg0 AND arg0.arg1.arg0) OR (arg0.arg0 AND arg0.arg1.arg1)) 
         *  ((p & q) | (p & r))
         */
        else if (arg0.op === Operators.AND &&
                arg0.arg1.op === Operators.OR) {
            return getFactFromString(new Fact(
                    new Fact(arg0.arg0, arg0.arg1.arg0, Operators.AND),
                    new Fact(arg0.arg0, arg0.arg1.arg1, Operators.AND),
                    Operators.OR).toParsableString());
        
        // The rule cannot be applied
        } else {
            return null;
        }
    }),
    POE: new Rule("Process of Elimination", "POE", function(arg0, arg1) {
	// Sanity check arg0
	if (arg0.op !== Operators.XOR) {
	    return null;
	}

	/* For example type #1:
	 *  arg0 = (p # q)
	 *  arg1 = ~(p)
	 * Then:
	 *  arg0.arg0 = p
	 *  arg0.arg1 = q
	 *  neg(arg0.arg0) = ~(p)
	 * And since:
	 *  neg(arg0.arg0) == arg1 (~(p) == ~(p))
	 * Return:
	 *  arg0.arg1 (q)
	 */
	if (arg1.op === Operators.NEG) {
	    var negp = new Fact(arg0.arg0, null, Operators.NEG);
	    if (negp.equals(arg1)) {
		return getFactFromString(arg0.arg1.toParsableString());
	    } else {
		return null;
	    }
	} else {
	    /* For example type #2:
	     *  arg0 = (p # q)
	     *  arg1 = p
	     * Then:
	     *  arg0.arg0 = p
	     *  arg0.arg1 = q
	     *  neg(arg0.arg1) = ~(q)
	     * And since:
	     *  arg0.arg0 == arg1 (p == p)
	     * Return:
	     *  neg(arg0.arg1) (~(q))
	     */
	    if (arg0.arg0.equals(arg1)) {
		var negq = getFactFromString(arg0.arg1.toParsableString());
		return new Fact(negq, null, Operators.NEG);
	    } else {
		return null;
	    }
	}
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
	    (rule === Rules.Abs);
}