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
    /**
     * Retrieve the current Level object if there is one in memory. If not, create 
     * a new one based on the Level index.
     * @returns {Level} The current Level
     */
    getCurrentLevel: function() {
	// Check if the Level has been loaded
	if (this.current === null) {
	    // If not, load it
	    this.current = this[this.currentIndex]();
	}
	// Return the Level
	return this.current;
    },
    /**
     * Advance to the next Level
     * 
     * @returns {Level} The next Level
     */
    nextLevel: function() {
	// Reset status
	this.reset();

	// Increment the level index
	this.currentIndex++;

	// Return the next Level
	return this.getCurrentLevel();
    },
    /**
     * Check if the player is on the last Level.
     * 
     * @returns {Boolean} True if on the last Level, false otherwise
     */
    onLastLevel: function() {
	return this.currentIndex === this.finalIndex;
    },
    /**
     * Clears the working Level from memory
     */
    reset: function() {
	delete this.current;
	this.current = null;
    }
};