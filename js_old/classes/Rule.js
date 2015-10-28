define(["Operator", "Fact"], function(Operators, Fact) {
    /**
     * A Rule encapsulates a Rule of logical inference or logical replacement.
     * 
     * @param {String} ruleName The full name of the rule
     * @param {String} displayName The abbreviation of the rule
     * @param {RuleType} ruleType The RuleType 
     * @param {function} ruleFunction The logic for the rule.  The function parameters will
     * be 1-2 Facts, depending on the Rule. Specs:
     * 
     * Fact applyRule(Fact, Fact); return the resulting Fact or null if the rule cannot be applied.
     * 
     * @returns {Rule} The newly created Rule
     */
    function Rule(ruleName, displayName, ruleType, ruleFunction) {
        this.name = ruleName;
        this.displayName = displayName;
        this.type = ruleType;
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
    var RuleType = Object.freeze({REPLACEMENT: "Replacement", INFERENCE: "Inference"})
    return {
        RuleType: RuleType,
        MP: new Rule("Modus Ponens", "MP", RuleType.INFERENCE, function(arg0, arg1) {
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
                return arg0.arg1.getCopy();
            } else {
                return null;
            }
        }),
        MT: new Rule("Modus Tollens", "MT", RuleType.INFERENCE, function(arg0, arg1) {
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
            var negQ = arg0.arg1.getNegation();
            if (negQ.equals(arg1)) {
                return arg0.arg0.getNegation();
            } else {
                return null;
            }
        }),
        DS: new Rule("Disjunctive Syllogism", "DS", RuleType.INFERENCE, function(arg0, arg1) {
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
            var negP = arg0.arg0.getNegation();
            if (negP.equals(arg1)) {
                return arg0.arg1.getCopy();
            } else {
                return null;
            }
        }),
        CD: new Rule("Constructive Dilemma", "CD", RuleType.INFERENCE, function(arg0, arg1) {
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
                return Fact.createFactFromComponents(arg0.arg0.arg1, arg0.arg1.arg1, Operators.OR);
            } else {
                return null;
            }
        }),
        HS: new Rule("Hypothetical Syllogism", "HS", RuleType.INFERENCE, function(arg0, arg1) {
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
                return Fact.createFactFromComponents(arg0.arg0, arg1.arg1, Operators.COND);
            } else {
                return null;
            }
        }),
        Simp: new Rule("Simplification", "Simp", RuleType.INFERENCE, function(arg0) {
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
            return arg0.arg0.getCopy();
        }),
        Conj: new Rule("Conjunction", "Conj", RuleType.INFERENCE, function(arg0, arg1) {
            /* For example:
             *  arg0 = p
             *  arg1 = q
             * So return:
             *  (arg0 & arg1) (p&q)
             */
            return Fact.createFactFromComponents(arg0, arg1, Operators.AND);
        }),
        Abs: new Rule("Absorption", "Abs", RuleType.INFERENCE, function(arg0) {
            // TODO this is ambiguous - modify to be ambiguous
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
                    return Fact.createFactFromComponents(arg0.arg0, arg0.arg1.arg1, Operators.COND);
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
                var conj = Fact.createFactFromComponents(arg0.arg0, arg0.arg1, Operators.AND);
                return Fact.createFactFromComponents(arg0.arg0, conj, Operators.COND);
            } else {
                return null;
            }
        }),
        Add: new Rule("Addition", "Add", RuleType.INFERENCE, function(arg0, arg1) {
            /* For example:
             *  arg0 = p
             *  arg1 = [Something from the user] (q)
             * So return:
             *  (arg0 | arg1) (p | q)
             */
            return Fact.createFactFromComponents(arg0, arg1, Operators.OR);
        }),
        DeM: new Rule("DeMorgan's Law", "DeM", RuleType.REPLACEMENT, function(arg0) {
            // Init
            var op = arg0.op;
            var otherOp;
            var result = null;
            function getOtherOp(op) {
                if (op === Operators.AND) {
                    return Operators.OR;
                } else if (op === Operators.OR) {
                    return Operators.AND;
                } else {
                    return null;
                }
            }

            // Sanity check
            if (op === Operators.NEG) {
                /* For example:
                 *  arg0 = ~(p op q)
                 * Return:
                 *  (~p otherOp ~q)
                 */
                if (arg0.arg0.op === Operators.AND ||
                        arg0.arg0.op === Operators.OR) {
                    result = Fact.createFactFromComponents(
                            arg0.arg0.arg0.getNegation(),
                            arg0.arg0.arg1.getNegation(),
                            getOtherOp(arg0.arg0.op));
                }
            } else if (op === Operators.AND ||
                    op === Operators.OR) {
                /* For example:
                 *  arg0 = ~p op ~q
                 * Return:
                 *  ~(p otherOp q)
                 */
                if (arg0.arg0.op === Operators.NEG &&
                        arg0.arg1.op === Operators.NEG) {
                    result = (Fact.createFactFromComponents(arg0.arg0.arg0, arg0.arg1.arg0, getOtherOp(op))).getNegation();
                }
            }

            // Return the result
            return result;
        }),
        Com: new Rule("Commutation", "Com", RuleType.REPLACEMENT, function(arg0) {
            /* For example (same logic for &)
             *  arg0 = (p | q)
             * Then
             *  arg0.arg0 = p
             *  arg0.arg1 = q
             * So return
             *  (arg0.arg1 | arg0.arg0) (q | p)
             */
            if (arg0.op === Operators.AND ||
                    arg0.op === Operators.OR) {
                return Fact.createFactFromComponents(arg0.arg1, arg0.arg0, arg0.op);
            } else {
                return null;
            }
        }),
        Assoc: new Rule("Association", "Assoc", RuleType.REPLACEMENT, function(arg0) {
            // Init
            var results = [];
            var op = arg0.op;

            // Sanity check
            if (op !== Operators.OR &&
                    op !== Operators.AND) {
                return results;
            }

            /* In the interest of space, I'm going to avoid my verbose comment style
             * Association can be ambiguous, so first here's an unambiguous case
             *  p|(q|r) -> returns (p|q)|r
             * Note this applies only to & and | and the op has to be the op in all 
             * parties. Now the ambiguous case
             *  (p|q)|(r|s) -> returns p|(q|(r|s)) AND ((p|q)|r)|s
             * So we return both. We accomplish this by checking operator of arg0 
             * and arg1 independently, and if they match then add the result
             */
            // Check arg0.arg0
            if (op === arg0.arg0.op) {
                results.push(Fact.createFactFromComponents(arg0.arg0.arg0,
                        Fact.createFactFromComponents(arg0.arg0.arg1, arg0.arg1, op), op));
            }

            // Check arg0.arg1
            if (op === arg0.arg1.op) {
                results.push(Fact.createFactFromComponents(
                        Fact.createFactFromComponents(arg0.arg0, arg0.arg1.arg0, op),
                        arg0.arg1.arg1,
                        op));
            }

            // Return the result
            return results;

        }),
        Dist: new Rule("Distribution", "Dist", RuleType.REPLACEMENT, function(arg0) {
            var results = [];
            var o1 = arg0.op;
            var o2;

            // Sanity check
            if (arg0.op !== Operators.OR &&
                    arg0.op !== Operators.AND) {
                return results;
            }

            /* Case 1
             *  o1, o2 = | or & but both cant be the same
             *  arg0 = (p o1 (q o2 r))
             * Return
             *  ((p o1 q) o2 (p o1 r))
             */
            // Make sure o2 is a valid operator and that it isnt the same as o1
            if (arg0.op !== arg0.arg1.op &&
                    (arg0.arg1.op === Operators.OR ||
                            arg0.arg1.op === Operators.AND)) {
                o2 = arg0.arg1.op;
                results.push(Fact.createFactFromComponents(
                        Fact.createFactFromComponents(arg0.arg0, arg0.arg1.arg0, o1),
                        Fact.createFactFromComponents(arg0.arg0, arg0.arg1.arg1, o1),
                        o2
                        ));
            }
            /* Case 2
             *  o1, o2 = | or & but both cant be the same
             *  arg0 = ((p o2 q) o1 (p o2 r))
             * Return
             *  (p o2 (q o1 r))
             */
            // Make sure o2 is a valid operator, it isnt the same as o1, both 
            // arg0.arg0 AND arg0.arg1 are using o2, and that the first arg is the 
            // same for arg0.arg0 and arg0.arg1
            if (arg0.op !== arg0.arg0.op &&
                    (arg0.arg0.op === Operators.OR ||
                            arg0.arg0.op === Operators.AND) &&
                    arg0.arg0.op === arg0.arg1.op &&
                    arg0.arg0.arg0.equals(arg0.arg1.arg0)) {
                o2 = arg0.arg0.op;
                results.push(Fact.createFactFromComponents(
                        arg0.arg0.arg0,
                        Fact.createFactFromComponents(arg0.arg0.arg1, arg0.arg1.arg1, o1),
                        o2
                        ));
            }

            // Return the results
            return results;
        }),
        DN: new Rule("Double Negation", "DN", RuleType.REPLACEMENT, function(arg0) {
            var results = [];
            /* For example type #1:
             *  arg0 = ~(~p)
             * Then:
             *  arg0.arg0.arg0 = p
             * So return:
             *  arg0.argo.arg0 (p)
             */
            if (arg0.op === Operators.NEG &&
                    arg0.arg0.op === Operators.NEG) {
                results.push(arg0.arg0.arg0.getCopy());
            }
            /* For example type #2:
             *  arg0 = p
             * Then:
             *  neg(neg(arg0)) = ~(~(p))
             * So return:
             *  neg(neg(arg0)) ( ~(~(p)) )
             */
            // Always do this one
            results.push(arg0.getNegation().getNegation());

            // Return the results
            return results;
        }),
        Trans: new Rule("Transposition", "Trans", RuleType.REPLACEMENT, function(arg0) {
            // Sanity check
            if (arg0.op !== Operators.COND) {
                return null;
            }

            /**
             * The rule:
             *  p -> q  <-> ~q -> ~p
             *  ~p -> q <-> ~q -> p
             */
            return Fact.createFactFromComponents(arg0.arg1.getInverse(), arg0.arg0.getInverse(), Operators.COND);
        }),
        Impl: new Rule("Material Implication", "Impl", RuleType.REPLACEMENT, function(arg0) {
            // Init
            var result = null;

            if (arg0.op === Operators.COND) {
                /*
                 * (p>q) <-> (~p|q)
                 * (~p>q) <-> (p|q)
                 */
                result = Fact.createFactFromComponents(arg0.arg0.getInverse(), arg0.arg1, Operators.OR);
            } else if (arg0.op === Operators.OR) {
                /*
                 * (p|q) <-> (~p>q)
                 * (~p|q) <-> (p>q)
                 */
                result = Fact.createFactFromComponents(arg0.arg0.getInverse(), arg0.arg1, Operators.COND);
            }

            // Return
            return result;
        }),
        Equiv: new Rule("Material Equivalence", "Equiv", RuleType.REPLACEMENT, function(arg0) {
            // Init
            var op = arg0.op;
            var results = [];

            if (op === Operators.BICOND) {
                /*
                 * Form of p%q
                 */
                var part1, part2;

                // First result is ( (p>q) & (q>p) )
                part1 = Fact.createFactFromComponents(arg0.arg0, arg0.arg1, Operators.COND);
                part2 = Fact.createFactFromComponents(arg0.arg1, arg0.arg0, Operators.COND);
                results.push(Fact.createFactFromComponents(part1, part2, Operators.AND));

                // Second result is ( (p&q) | (~p&~q))
                part1 = Fact.createFactFromComponents(arg0.arg0, arg0.arg1, Operators.AND);
                part2 = Fact.createFactFromComponents(arg0.arg0.getNegation(), arg0.arg1.getNegation(), Operators.AND);
                results.push(Fact.createFactFromComponents(part1, part2, Operators.OR));
            } else if (op === Operators.AND) {
                /*
                 * Form of ( (p>q) & (q>p) )
                 */
                // Check inner args
                if (arg0.arg0.op === Operators.COND &&
                        arg0.arg1.op === Operators.COND) {
                    if (arg0.arg0.arg0.equals(arg0.arg1.arg1) &&
                            arg0.arg0.arg1.equals(arg0.arg1.arg0)) {
                        // Create (p%q)
                        results.push(Fact.createFactFromComponents(arg0.arg0.arg0, arg0.arg0.arg1, Operators.BICOND));
                    }
                }
            } else if (op === Operators.OR) {
                /*
                 * Form of ( (p&q) | (~p&~q))
                 */
                // Check inner args
                if (arg0.arg0.op === Operators.AND &&
                        arg0.arg1.op === Operators.AND) {
                    if (arg0.arg0.arg0.getNegation().equals(arg0.arg1.arg0) &&
                            arg0.arg0.arg1.getNegation().equals(arg0.arg1.arg1)) {
                        // Create (p%q)
                        results.push(Fact.createFactFromComponents(arg0.arg0.arg0, arg0.arg0.arg1, Operators.BICOND));
                    }
                }
            }

            // Return
            return results;
        }),
        Exp: new Rule("Exportation", "Exp", RuleType.REPLACEMENT, function(arg0) {
            // Init
            var results = [];

            if (arg0.op === Operators.COND) {
                /*
                 * Form of ( (p & q) > r )
                 */
                if (arg0.arg0.op === Operators.AND) {
                    var newCond = Fact.createFactFromComponents(arg0.arg0.arg1, arg0.arg1, Operators.COND);
                    results.push(Fact.createFactFromComponents(arg0.arg0.arg0, newCond, Operators.COND));
                }
                /*
                 * Form of ( p > (q > r) )
                 */
                if (arg0.arg1.op === Operators.COND) {
                    var newConj = Fact.createFactFromComponents(arg0.arg0, arg0.arg1.arg0, Operators.AND);
                    results.push(Fact.createFactFromComponents(newConj, arg0.arg1.arg1, Operators.COND));
                }
            }

            // Return
            return results;
        }),
        Taut: new Rule("Tautology", "Taut", RuleType.REPLACEMENT, function(arg0) {
            var results = [];
            /* Rule:
             *  (p|p) <-> p
             */
            // If you can do the shortening version, do it
            if (arg0.op === Operators.OR &&
                    arg0.arg0.equals(arg0.arg1)) {
                results.push(arg0.arg0.getCopy());
            }
            // This version can always be applied, but isn't always useful
            results.push(Fact.createFactFromComponents(arg0, arg0, Operators.OR));

            // Returnt he results
            return results;
        }),
        POE: new Rule("Process of Elimination", "POE", RuleType.INFERENCE, function(arg0, arg1) {
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
                var negp = arg0.arg0.getNegation();
                if (negp.equals(arg1)) {
                    return arg0.arg1.getCopy();
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
                    return arg0.arg1.getNegation();
                } else {
                    return null;
                }
            }
        }),
        /**
         * Check if rule is unary.
         * 
         * @param {Rule} rule The Rule to check
         * @returns {boolean} True if rule takes only one operand, false otherwise
         */
        isUnaryRule: function(rule) {
            return (rule === this.Simp) ||
                    (rule === this.Abs) ||
                    (rule === this.DeM) ||
                    (rule === this.Com) ||
                    (rule === this.Assoc) ||
                    (rule === this.Dist) ||
                    (rule === this.DN) ||
                    (rule === this.Trans) ||
                    (rule === this.Impl) ||
                    (rule === this.Equiv) ||
                    (rule === this.Exp) ||
                    (rule === this.Taut);
        },
        /**
         * Check if a Rule has multiple possible applications, in which case the rule 
         * should return an array of all possible results (typically 2)
         * 
         * @param {Rule} rule The Rule to check
         * @returns {boolean} True if the Rule can return more than one result, false otherwise
         */
        isAmbiguousRule: function(rule) {
            return (rule === this.Assoc ||
                    rule === this.Dist ||
                    rule === this.DN ||
                    rule === this.Equiv ||
                    rule === this.Exp ||
                    rule === this.Taut);
        }
    };
});