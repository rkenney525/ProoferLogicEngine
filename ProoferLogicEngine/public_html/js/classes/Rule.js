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
};

Rule.prototype.getHTML = function() {
    return '<div id="Rule_' + this.displayName + '" class="rule boxed"'
             + ' ruleid="' + this.displayName + '">' + this.displayName + 
            '</div>';
};

/* Create the list of Rules */
var Rules = {
    MP: new Rule("Modus Ponens", "MP", function(arg0, arg1){
	// Sanity check arg0
	if (arg0.op !== Operators.COND) {
	    return null;
	}
	
	/* For example:
	 *  arg0 = p>q
	 *  arg1 = p
	 * Then:
	 *  arg0.arg0 = p
	 * And since:
	 *  arg0.arg0 == arg1 (p == p)
	 * Return:
	 *  arg0.arg1 (q)
	 */
	if (arg0.arg0.equals(arg1)) {
	    return arg0.arg1;
	} else {
	    return null;
	}
    }),
    MT: new Rule("Modus Tollens", "MT", function(arg0, arg1) {
        // TODO: Implement MT Rule Logic
    })
};