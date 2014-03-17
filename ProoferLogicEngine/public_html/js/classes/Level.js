/**
 * The Level class encapsulates data needed that is unique to each level such as 
 * which Rules are allowed or what needs to be shown.
 * 
 * @param {Rule[]} rules The Rules the player can use
 * @param {Fact[]} facts The premises for the argument
 * @param {Fact} conclusion The Fact that needs to be shown
 * @param {Number} par The max number of moves for a good score
 * @param {Tutorial} tutorial The Tutorial to precede the level starting. null if
 * not used.
 * @returns {Level} The resulting Level object
 */
function Level(rules, facts, conclusion, par, tutorial) {
    this.rules = rules;
    this.facts = facts;
    this.conclusion = conclusion;
    this.par = par;
    this.tutorial = tutorial;
    this.startingFacts = facts.length;
}


var Levels = {
    currentIndex: 0,
    current: null,
    data: [function() {
	    return new Level(
		    [
			Rules.MP
		    ],
		    [
			getFactFromString("(r>s)"),
			getFactFromString("r")
		    ],
		    getFactFromString("s"),
		    1,
		    Tutorials.INTRO);
	},
	function() {
	    return new Level(
		    [
			Rules.MP,
			Rules.MT
		    ],
		    [
			getFactFromString("(p>(r|t))"),
			getFactFromString("~((r|t))")
		    ],
		    getFactFromString("~(p)"),
		    1,
		    Tutorials.MT_INTRO
		    );
	},
	function() {
	    return new Level(
		    [
			Rules.MP,
			Rules.MT,
			Rules.DS
		    ],
		    [
			getFactFromString("(q|~((r>t)))"),
			getFactFromString("~(q)")
		    ],
		    getFactFromString("~((r>t))"),
		    1,
		    Tutorials.DS_INTRO
		    );
	},
	function() {
	    return new Level(
		    [
			Rules.MP,
			Rules.MT,
			Rules.DS,
			Rules.HS
		    ],
		    [
			getFactFromString("(p>(r|s))"),
			getFactFromString("((r|s)>q)")
		    ],
		    getFactFromString("(p>q)"),
		    1,
		    Tutorials.HS_INTRO
		    );
	},
		function() {
	    return new Level(
		    [
			Rules.MP,
			Rules.MT,
			Rules.DS,
			Rules.HS,
			Rules.CD
		    ],
		    [
			getFactFromString("((p>q)&(s>~(r)))"),
			getFactFromString("(p|s)")
		    ],
		    getFactFromString("(q|~(r))"),
		    1,
		    Tutorials.CD_INTRO
		    );
	}
    ],
    /**
     * Retrieve the current Level object if there is one in memory. If not, create 
     * a new one based on the Level index.
     * 
     * @returns {Level} The current Level
     */
    getCurrentLevel: function() {
	// Check if the Level has been loaded
	if (this.current === null) {
	    // If not, load it
	    this.current = this.data[this.currentIndex]();
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
	return this.currentIndex === (this.data.length - 1);
    },
    /**
     * Clears the working Level from memory
     */
    reset: function() {
	delete this.current;
	this.current = null;
    },
    /**
     * Clears the state by removing the current game from memory and removing the 
     * level index.
     */
    clearState: function() {
	// Remove current game from memory
	this.reset();

	// Reset the level index
	this.currentIndex = 0;
    }
};