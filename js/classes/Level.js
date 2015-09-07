define(['Rule', 'Fact', 'Tutorial'], function(Rules, Fact, Tutorials) {
    /**
     * The Level class encapsulates data needed that is unique to each level such as 
     * which Rules are allowed or what needs to be shown.
     * 
     * @param {String} id A unique identifier for the level
     * @param {Rule[]} rules The Rules the player can use
     * @param {Fact[]} facts The premises for the argument
     * @param {Fact} conclusion The Fact that needs to be shown
     * @param {Number} par The max number of moves for a good score
     * @param {Tutorial} tutorial The Tutorial to precede the level starting. null if
     * not used.
     * @returns {Level} The resulting Level object
     */
    function Level(id, rules, facts, conclusion, par, tutorial) {
        this.id = id;
        this.rules = rules;
        this.facts = facts;
        this.conclusion = conclusion;
        this.par = par;
        this.tutorial = tutorial;
        this.startingFacts = facts.length;
    }

    Level.prototype.getHtml = function() {
        // Init
        var html = '';

        // Display the premises
        for (var i = 0; i < this.facts.length; i++) {
            html += String(i + 1) + '. ' + this.facts[i].toPrettyString() + '<br />';
        }

        // Display the conclusion
        html += '<span style="font-weight: bold;">Therefore:  </span>' + this.conclusion.toPrettyString();

        // Return
        return html;
    };


    return {
        currentIndex: 0,
        current: null,
        data: [function() {
                return new Level("LEVEL_ORIGINAL_00000",
                        [
                            Rules.MP
                        ],
                        [
                            Fact.getFactFromString("(r>s)"),
                            Fact.getFactFromString("r")
                        ],
                        Fact.getFactFromString("s"),
                        1,
                        Tutorials.INTRO);
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00001",
                        [
                            Rules.MP,
                            Rules.MT
                        ],
                        [
                            Fact.getFactFromString("(p>(r|t))"),
                            Fact.getFactFromString("~((r|t))")
                        ],
                        Fact.getFactFromString("~(p)"),
                        1,
                        Tutorials.MT_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00002",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS
                        ],
                        [
                            Fact.getFactFromString("(q|~((r>t)))"),
                            Fact.getFactFromString("~(q)")
                        ],
                        Fact.getFactFromString("~((r>t))"),
                        1,
                        Tutorials.DS_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00003",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS
                        ],
                        [
                            Fact.getFactFromString("(p>(r|s))"),
                            Fact.getFactFromString("((r|s)>q)")
                        ],
                        Fact.getFactFromString("(p>q)"),
                        1,
                        Tutorials.HS_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00004",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD
                        ],
                        [
                            Fact.getFactFromString("((p>q)&(s>~(r)))"),
                            Fact.getFactFromString("(p|s)")
                        ],
                        Fact.getFactFromString("(q|~(r))"),
                        1,
                        Tutorials.CD_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00005",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp
                        ],
                        [
                            Fact.getFactFromString("(p&q)"),
                            Fact.getFactFromString("(r&s)")
                        ],
                        Fact.getFactFromString("(p&r)"),
                        3,
                        Tutorials.Conj_Simp_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00006",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs
                        ],
                        [
                            Fact.getFactFromString("(p>(p&q))"),
                            Fact.getFactFromString("(r>s)")
                        ],
                        Fact.getFactFromString("((p>q)&(r>(r&s)))"),
                        1,
                        Tutorials.Abs_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00007",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("p")
                        ],
                        Fact.getFactFromString("(p|(r&~(s)))"),
                        1,
                        Tutorials.Add_INTRO
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00008",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("(r|q)"),
                            Fact.getFactFromString("((q|s)>p)"),
                            Fact.getFactFromString("~(r)")
                        ],
                        Fact.getFactFromString("p"),
                        3,
                        Tutorials.Inference_Set_1
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00009",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("(p>q)"),
                            Fact.getFactFromString("(q>r)"),
                            Fact.getFactFromString("(r>s)"),
                            Fact.getFactFromString("(s>t)"),
                            Fact.getFactFromString("(t>a)"),
                            Fact.getFactFromString("~(a)")
                        ],
                        Fact.getFactFromString("~(p)"),
                        5,
                        null
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00010",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("(s>t)"),
                            Fact.getFactFromString("(t>w)")
                        ],
                        Fact.getFactFromString("(s>(t&w))"),
                        2,
                        null
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00011",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("((p>q)&(t>w))"),
                            Fact.getFactFromString("p"),
                            Fact.getFactFromString("~(q)")
                        ],
                        Fact.getFactFromString("w"),
                        4,
                        null
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00012",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add
                        ],
                        [
                            Fact.getFactFromString("((p>q)&(r>s))"),
                            Fact.getFactFromString("((r>s)&(w>x))"),
                            Fact.getFactFromString("p")
                        ],
                        Fact.getFactFromString("((p&q)|(r&s))"),
                        4,
                        null
                        );
            },
            function() {
                return new Level("LEVEL_ORIGINAL_00013",
                        [
                            Rules.MP,
                            Rules.MT,
                            Rules.DS,
                            Rules.HS,
                            Rules.CD,
                            Rules.Conj,
                            Rules.Simp,
                            Rules.Abs,
                            Rules.Add,
                            Rules.DN
                        ],
                        [
                            Fact.getFactFromString("(p|(r>s))"),
                            Fact.getFactFromString("r"),
                            Fact.getFactFromString("~(p)")
                        ],
                        Fact.getFactFromString("(s|~(s))"),
                        3,
                        null
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
        },
        /**
         * 
         * @param {Number} index The index to go to
         */
        goToLevel: function(index) {
            this.reset();
            this.currentIndex = index;
        }
    };
});