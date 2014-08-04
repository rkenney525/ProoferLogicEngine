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
    var arg1 = (arg0String !== null) ? getFactFromString(arg1String) : null;
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