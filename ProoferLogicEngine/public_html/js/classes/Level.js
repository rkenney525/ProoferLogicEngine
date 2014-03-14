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
}
;

var Levels = {
    currentIndex: 0,
    finalIndex: 0,
    current: null,
    0: function() {
	return new Level([Rules.MP, Rules.MT, Rules.DS, Rules.CD, Rules.HS, Rules.Simp,
	    Rules.Conj, Rules.Abs],
		[
		    getFactFromString("(p>q)"),
		    getFactFromString("p"),
		    getFactFromString("~(q)"),
		    getFactFromString("(q|r)"),
		    getFactFromString("((q>x)&(r>y))"),
		    getFactFromString("(q>~(s))")
		],
		getFactFromString("q"),
		7);
    },
    getCurrentLevel: function() {
	// Check if the Level has been loaded
	if (this.current === null) {
	    // If not, load it
	    this.current = this[this.currentIndex]();
	}
	// Return the Level
	return this.current;
    },
    nextLevel: function() {
	// Reset status
	this.current = null;

	// Increment the level index
	this.currentIndex++;

	// Return the next Level
	return this.getCurrentLevel();
    },
    onLastLevel: function() {
	return this.currentIndex === this.finalIndex;
    },
    reset: function() {
	this.current = null;
    }
};