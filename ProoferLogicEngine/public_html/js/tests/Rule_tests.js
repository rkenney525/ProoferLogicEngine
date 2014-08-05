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

//QUnit.test("Rules - DeM", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Com", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Assoc", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Dist", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - DN", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Trans", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Impl", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Equiv", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Exp", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - Taut", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});
//
//QUnit.test("Rules - POE", function(assert) {
//    testRule(Rules.HS, "", "", "", assert);
//});