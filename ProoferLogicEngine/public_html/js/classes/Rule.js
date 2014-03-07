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
        // TODO: Implement MP Rule Logic
    }),
    MT: new Rule("Modus Tollens", "MT", function(arg0, arg1) {
        // TODO: Implement MT Rule Logic
    })
};