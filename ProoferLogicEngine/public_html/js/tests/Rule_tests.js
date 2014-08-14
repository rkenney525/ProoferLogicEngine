/**
 * Test a rule for a given output with given inputs.
 * 
 * @param {Rule} rule The Rule to test
 * @param {String} arg0String String to create arg0
 * @param {String} arg1String String to create arg1
 * @param {String} expectedString String to create the expectation
 * @param {Object} assert Reference to assertion library
 * @returns {undefined}
 */
function testRule(rule, arg0String, arg1String, expectedString, assert) {
    // Init
    var arg0 = (arg0String !== null) ? getFactFromString(arg0String) : null;
    var arg1 = (arg1String !== null) ? getFactFromString(arg1String) : null;
    var expected = (expectedString !== null) ? getFactFromString(expectedString) : null;
    var result;
    var arg0Display, arg1Display, expectedDisplay;

    // Apply
    result = rule.applyRule(arg0, arg1);

    // Verify
    arg0Display = (arg0 !== null) ? arg0.toParsableString() : "null";
    arg1Display = (arg1 !== null) ? arg1.toParsableString() : "null";
    expectedDisplay = (expected !== null) ? expected.toParsableString() : "null";
    assert.deepEqual(result, expected,
            rule.name + " should yield " + expectedDisplay + " when given " + 
                    arg0Display + " and " + arg1Display);
}

function testMultiReturnRule(rule, arg0String, arg1String, expectedArrayOfStrings, assert) {
    // Init
    var arg0 = (arg0String !== null) ? getFactFromString(arg0String) : null;
    var arg1 = (arg1String !== null) ? getFactFromString(arg1String) : null;
    var expected = [];
    var result;
    for (var i = 0; i < expectedArrayOfStrings.length; i++) {
        expected.push(getFactFromString(expectedArrayOfStrings[i]));
    }
    var arg0Display, arg1Display, expectedDisplay;

    // Apply
    result = rule.applyRule(arg0, arg1);

    // Get display Strings for arg0 and arg1
    arg0Display = (arg0 !== null) ? arg0.toParsableString() : "null";
    arg1Display = (arg1 !== null) ? arg1.toParsableString() : "null";
    
    // Verify the number of results
    assert.strictEqual(expected.length, result.length, rule.name + " with " + arg0Display + 
            " and " + arg1Display + " should have " + expected.length + " results.");
    
    // Verify the results individually
    for (var i = 0; i < expected.length; i++) {
        var inResults = false;
        expectedDisplay = expected[i].toParsableString();
        
        // Check this particular expected value against all the results for a match
        for (var j = 0; j < result.length; j++) {
            if (result[j].equals(expected[i])) {
                inResults = true;
                break;
            }
        }
        
        // If we found a match, all is well
        assert.ok(inResults, expectedDisplay + " should be a result.");
    }
}

/*
 * Tests for Modus Ponens
 */
QUnit.test("Rules - MP", function(assert) {
    testRule(Rules.MP, "(p>q)", "p", "q", assert);
    testRule(Rules.MP, "(p>q)", "q", null, assert);
    testRule(Rules.MP, "(p|q)", "~(q)", null, assert);
    testRule(Rules.MP, "(p>(q|r))", "p", "(q|r)", assert);
    testRule(Rules.MP, "((a&c)>q)", "(a&c)", "q", assert);
    testRule(Rules.MP, "((a>b)>(c>d))", "(a>b)", "(c>d)", assert);
    testRule(Rules.MP, "(~(p)>q)", "~(p)", "q", assert);
    testRule(Rules.MP, "(~(p)>(q|s))", "~(p)", "(q|s)", assert);
    testRule(Rules.MP, "((~(p)&~(s))>q)", "(~(p)&~(s))", "q", assert);
    testRule(Rules.MP, "((~(p)|~(~(p)))>~((s|~(d))))", "(~(p)|~(~(p)))", "~((s|~(d)))", assert);
});

/*
 * Tests for Modus Tollens
 */
QUnit.test("Rules - MT", function(assert) {
    testRule(Rules.MT, "(p>q)", "~(q)", "~(p)", assert);
    testRule(Rules.MT, "(p>~(q))", "q", null, assert);
    testRule(Rules.MT, "(p>~(q))", "~(~(q))", "~(p)", assert);
    testRule(Rules.MT, "(p%~(q))", "~(~(q))", null, assert);
    testRule(Rules.MT, "(p>(q|~(r)))", "~((q|~(r)))", "~(p)", assert);
    testRule(Rules.MT, "((p|~(s))>~(q))", "~(~(q))", "~((p|~(s)))", assert);
    testRule(Rules.MT, "(~((p|~(s)))>~(q))", "~(~(q))", "~(~((p|~(s))))", assert);
});

/*
 * Tests for Disjunctive Syllogism
 */
QUnit.test("Rules - DS", function(assert) {
    testRule(Rules.DS, "(p|q)", "~(p)", "q", assert);
    testRule(Rules.DS, "(p|q)", "~(q)", null, assert);
    testRule(Rules.DS, "((p&q)|r)", "~(p)", null, assert);
    testRule(Rules.DS, "((p&q)|r)", "~((p&q))", "r", assert);
    testRule(Rules.DS, "((p&q)|~((s&p)))", "~((p&q))", "~((s&p))", assert);
    testRule(Rules.DS, "(~((p&q))|r)", "(p&q)", null, assert);
    testRule(Rules.DS, "(~((p&q))|r)", "~(~((p&q)))", "r", assert);
});

/*
 * Tests for Constructive Dilemma
 */
QUnit.test("Rules - CD", function(assert) {
    testRule(Rules.CD, "((p>r)&(q>s))", "(p|q)", "(r|s)", assert);
    testRule(Rules.CD, "((p>~(r))&(q>s))", "(p|q)", "(~(r)|s)", assert);
    testRule(Rules.CD, "((p>~(r))|(q>s))", "(p|q)", null, assert);
    testRule(Rules.CD, "((p>~(r))&(q>s))", "(p&q)", null, assert);
    testRule(Rules.CD, "(((a#c)>~(r))&(q>s))", "((a#c)|q)", "(~(r)|s)", assert);
    testRule(Rules.CD, "(((a#c)>~(r))&(~((a&~(c)))>s))", "((a#c)|~((a&~(c))))", "(~(r)|s)", assert);
    testRule(Rules.CD, "((p>r)&(q>s))", "(p|r)", null, assert);
});

/*
 * Tests for Hypothetical Syllogism
 */
QUnit.test("Rules - HS", function(assert) {
    testRule(Rules.HS, "(p>q)", "(q>r)", "(p>r)", assert);
    testRule(Rules.HS, "((p|~(c))>q)", "(q>r)", "((p|~(c))>r)", assert);
    testRule(Rules.HS, "((p|~(c))>r)", "(q>r)", null, assert);
    testRule(Rules.HS, "((p|~(c))|q)", "(q>r)", null, assert);
    testRule(Rules.HS, "((p|~(c))>q)", "(q|r)", null, assert);
});

/*
 * Tests for Simplification
 */
QUnit.test("Rules - Simp", function(assert) {
    testRule(Rules.Simp, "(a&b)", null, "a", assert);
    testRule(Rules.Simp, "(a&b)", "(l|(o|l))", "a", assert);
    testRule(Rules.Simp, "(a|b)", null, null, assert);
    testRule(Rules.Simp, "((p#~(q))&b)", null, "(p#~(q))", assert);
    testRule(Rules.Simp, "((p>~(q))&(l|(o|l)))", null, "(p>~(q))", assert);
});

/*
 * Tests for Conjunction
 */
QUnit.test("Rules - Conj", function(assert) {
    testRule(Rules.Conj, "p", "q", "(p&q)", assert);
    testRule(Rules.Conj, "(a#c)", "q", "((a#c)&q)", assert);
    testRule(Rules.Conj, "p", "~((a>~(~((c|d)))))", "(p&~((a>~(~((c|d))))))", assert);
    testRule(Rules.Conj, "(b|~(c))", "(p&~(q))", "((b|~(c))&(p&~(q)))", assert);
});

/*
 * Tests for Absorption
 */
QUnit.test("Rules - Abs", function(assert) {
    testRule(Rules.Abs, "(p>q)", null, "(p>(p&q))", assert);
    testRule(Rules.Abs, "(p>(p&q))", null, "(p>q)", assert);
    testRule(Rules.Abs, "(p&(p&q))", null, null, assert);
    testRule(Rules.Abs, "(p>(r&s))", null, "(p>(p&(r&s)))", assert);
    testRule(Rules.Abs, "((a|b)>(r&s))", null, "((a|b)>((a|b)&(r&s)))", assert);
    testRule(Rules.Abs, "(~((a|b))>(r&s))", null, "(~((a|b))>(~((a|b))&(r&s)))", assert);
});

/*
 * Tests for Addition
 */
QUnit.test("Rules - Add", function(assert) {
    testRule(Rules.Add, "p", "q", "(p|q)", assert);
    testRule(Rules.Add, "p", "~((q|r))", "(p|~((q|r)))", assert);
    testRule(Rules.Add, "(p&~((s|d)))", "q", "((p&~((s|d)))|q)", assert);
    testRule(Rules.Add, "(h|(e&(l#(l%o))))", "(t|(h>(e%(r&e))))", "((h|(e&(l#(l%o))))|(t|(h>(e%(r&e)))))", assert);
});

/*
 * Tests for DeMorgans Law
 */
//QUnit.test("Rules - DeM", function(assert) {
//    testRule(Rules.DeM, "~((p|q))", null, "(~(p)&~(q))", assert);
//    testRule(Rules.DeM, "~((p&q))", null, "(~(p)|~(q))", assert);
//    testRule(Rules.DeM, "(~(p)&~(q))", null, "~((p|q))", assert);
//    testRule(Rules.DeM, "(~(p)|~(q))", null, "~((p&q))", assert);
//    testRule(Rules.DeM, "(~(p)>~(q))", null, null, assert);
//    testRule(Rules.DeM, "~((p#q))", null, null, assert);
//});

/*
 * Tests for Commutation
 */
QUnit.test("Rules - Com", function(assert) {
    testRule(Rules.Com, "(p|q)", null, "(q|p)", assert);
    testRule(Rules.Com, "(p&q)", null, "(q&p)", assert);
    testRule(Rules.Com, "(p#q)", null, null, assert);
    testRule(Rules.Com, "(p&~((q|s)))", null, "(~((q|s))&p)", assert);
    testRule(Rules.Com, "((p>(q>r))&~((q|s)))", null, "(~((q|s))&(p>(q>r)))", assert);
});

/*
 * Tests for Association
 */
QUnit.test("Rules - Assoc", function(assert) {
    testMultiReturnRule(Rules.Assoc, "(p|(q|r))", null, ["((p|q)|r)"], assert);
    testMultiReturnRule(Rules.Assoc, "((p|q)|r)", null, ["(p|(q|r))"], assert);
    testMultiReturnRule(Rules.Assoc, "((p|q)|(r|s))", null, ["(((p|q)|r)|s)", "(p|(q|(r|s)))"], assert);
    testMultiReturnRule(Rules.Assoc, "(p&(q&r))", null, ["((p&q)&r)"], assert);
    testMultiReturnRule(Rules.Assoc, "((p&q)&r)", null, ["(p&(q&r))"], assert);
    testMultiReturnRule(Rules.Assoc, "((p&q)&(r&s))", null, ["(((p&q)&r)&s)", "(p&(q&(r&s)))"], assert);
    testMultiReturnRule(Rules.Assoc, "(p>(q|r))", null, [], assert);
    testMultiReturnRule(Rules.Assoc, "((p#q)&r)", null, [], assert);
    testMultiReturnRule(Rules.Assoc, "((p|q)%(r|s))", null, [], assert);
});

//QUnit.test("Rules - Dist", function(assert) {
//    testRule(Rules.Dist, "", null, "", assert);
//});

//QUnit.test("Rules - DN", function(assert) {
//    testRule(Rules.DN, "", null, "", assert);
//});

//QUnit.test("Rules - Trans", function(assert) {
//    testRule(Rules.Trans, "", null, "", assert);
//});

//QUnit.test("Rules - Impl", function(assert) {
//    testRule(Rules.Impl, "", null, "", assert);
//});

//QUnit.test("Rules - Equiv", function(assert) {
//    testRule(Rules.Equiv, "", null, "", assert);
//});

//QUnit.test("Rules - Exp", function(assert) {
//    testRule(Rules.Exp, "", null, "", assert);
//});

QUnit.test("Rules - Taut", function(assert) {
    testMultiReturnRule(Rules.Taut, "(p|p)", null, ["p", "((p|p)|(p|p))"], assert);
    testMultiReturnRule(Rules.Taut, "~((p|q))", null, ["(~((p|q))|~((p|q)))"], assert);
    testMultiReturnRule(Rules.Taut, "p", null, ["(p|p)"], assert);
    testMultiReturnRule(Rules.Taut, "~((p>q))", null, ["(~((p>q))|~((p>q)))"], assert);
    testMultiReturnRule(Rules.Taut, "((p|p)|(p|p))", null, ["(p|p)", "(((p|p)|(p|p))|((p|p)|(p|p)))"], assert);
});

/*
 * Tests for Process of Elimination
 */
QUnit.test("Rules - POE", function(assert) {
    testRule(Rules.POE, "(p#q)", "p", "~(q)", assert);
    testRule(Rules.POE, "(p#q)", "~(p)", "q", assert);
    testRule(Rules.POE, "((p|z)#q)", "~(p)", null, assert);
    testRule(Rules.POE, "(p|q)", "~(p)", null, assert);
    testRule(Rules.POE, "(p#q)", "r", null, assert);
    testRule(Rules.POE, "((p|z)#q)", "~((p|z))", "q", assert);
    testRule(Rules.POE, "((p|z)#q)", "(p|z)", "~(q)", assert);
});

/*
 * Exhaustively test isAmbiguousRule
 */
QUnit.test("isAmbiguousRule", function(assert) {
    assert.ok(!isAmbiguousRule(Rules.Abs), "Absorption is not ambiguous"); // ehhh
    assert.ok(!isAmbiguousRule(Rules.Add), "Addition is not ambiguous");
    assert.ok(isAmbiguousRule(Rules.Assoc), "Association is ambiguous");
    assert.ok(!isAmbiguousRule(Rules.CD), "Constructive Dilemma is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.Com), "Commutation is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.Conj), "Conjunction is not ambiguous");
    assert.ok(isAmbiguousRule(Rules.DN), "Double Negation is ambiguous");
    assert.ok(!isAmbiguousRule(Rules.DS), "Disjunctive Syllogism is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.DeM), "DeMorgans is not ambiguous");
    assert.ok(isAmbiguousRule(Rules.Dist), "Distribution is ambiguous");
    assert.ok(isAmbiguousRule(Rules.Equiv), "Material Equivalence is ambiguous");
    assert.ok(isAmbiguousRule(Rules.Exp), "Exportation is ambiguous");
    assert.ok(!isAmbiguousRule(Rules.HS), "Hypothetical Syllogism is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.Impl), "Material Implication is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.MP), "Modus Ponens is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.MT), "Modus Tollens is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.POE), "Process of Elimination is not ambiguous");
    assert.ok(!isAmbiguousRule(Rules.Simp), "Simplification is not ambiguous");
    assert.ok(isAmbiguousRule(Rules.Taut), "Tautology is ambiguous");
    assert.ok(!isAmbiguousRule(Rules.Trans), "Transposition is not ambiguous");
});

/*
 * Exhaustively test isUnaryRule
 */
QUnit.test("isUnaryRule", function(assert) {
    assert.ok(isUnaryRule(Rules.Abs), "Absorption is unary");
    assert.ok(!isUnaryRule(Rules.Add), "Addition is not unary");
    assert.ok(isUnaryRule(Rules.Assoc), "Association is unary");
    assert.ok(!isUnaryRule(Rules.CD), "Constructive Dilemma is not unary");
    assert.ok(isUnaryRule(Rules.Com), "Commutation is unary");
    assert.ok(!isUnaryRule(Rules.Conj), "Conjunction is not unary");
    assert.ok(isUnaryRule(Rules.DN), "Double Negation is unary");
    assert.ok(!isUnaryRule(Rules.DS), "Disjunctive Syllogism is not unary");
    assert.ok(isUnaryRule(Rules.DeM), "DeMorgans is unary");
    assert.ok(isUnaryRule(Rules.Dist), "Distribution is unary");
    assert.ok(isUnaryRule(Rules.Equiv), "Material Equivalence is unary");
    assert.ok(isUnaryRule(Rules.Exp), "Exportation is unary");
    assert.ok(!isUnaryRule(Rules.HS), "Hypothetical Syllogism is not unary");
    assert.ok(isUnaryRule(Rules.Impl), "Material Implication is unary");
    assert.ok(!isUnaryRule(Rules.MP), "Modus Ponens is not unary");
    assert.ok(!isUnaryRule(Rules.MT), "Modus Tollens is not unary");
    assert.ok(!isUnaryRule(Rules.POE), "Process of Elimination is not unary");
    assert.ok(isUnaryRule(Rules.Simp), "Simplification is unary");
    assert.ok(isUnaryRule(Rules.Taut), "Tautology is unary");
    assert.ok(isUnaryRule(Rules.Trans), "Transposition is unary");
});