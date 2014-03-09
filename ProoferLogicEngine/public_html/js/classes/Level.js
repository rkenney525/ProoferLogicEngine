/**
 * The Level class encapsulates data needed that is unique to each level such as 
 * which Rules are allowed or what needs to be shown.
 * 
 * @param {Rule[]} rules The Rules the player can use
 * @param {Fact[]} facts The premises for the argument
 * @param {Fact} conclusion The Fact that needs to be shown
 * @param {Number} par The max number of moves for a good score
 * @returns {Level} The resulting Level object
 */
function Level(rules, facts, conclusion, par) {
    this.rules = rules;
    this.facts = facts;
    this.conclusion = conclusion;
    this.par = par;
};
