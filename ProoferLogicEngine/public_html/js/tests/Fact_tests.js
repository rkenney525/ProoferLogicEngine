/**
 * Tests for the Fact class
 */



// Utility functions
/**
 * Test toString, toParsableString, and toPrettyString
 * 
 * @param {String} factString The String to generate the Fact you are testing
 * @param {String} expectedString What the result of the operation should yield
 * @param {String} functionString String name of the function to test
 * @param {Object} assert The assertion object
 * @returns {undefined}
 */
function testToStringFamily(factString, expectedString, functionString, assert) {
    var fact = getFactFromString(factString);
    var result = fact[functionString]();
    assert.strictEqual(result, expectedString, result + " should be " + expectedString);
}


// Test cases
/*
 * Test a Fact of a simple statement
 */
QUnit.test("Fact parsing - Single", function(assert) {
    var fact = getFactFromString("p");
    assert.strictEqual(fact.arg0, "p", "Verify the p is stored");
    assert.strictEqual(fact.arg1, null, "Verify there is no second argument");
    assert.strictEqual(fact.op, null, "Verify there is no operator");
});

/*
 * Test a Fact containing an Operator
 */
QUnit.test("Fact parsing - Basic", function(assert) {
    var fact = "p > q";
    var conditional = getFactFromString("(p>q)");
    var shouldBeP = conditional.arg0.arg0;
    var shouldBeQ = conditional.arg1.arg0;
    assert.strictEqual(shouldBeP, "p", "Verify the p in " + fact);
    assert.strictEqual(shouldBeQ, "q", "Verify the q in " + fact);
    assert.strictEqual(conditional.op, Operators.COND, "Verify the conditional in " + fact);
});

/*
 * Test a Fact containing multiple operators, including negations
 */
QUnit.test("Fact parsing - Complex", function(assert) {
    var fact = "~p > (q # (r & ~s))";
    var complex = getFactFromString("(~(p)>(q#(r&~(s))))");
    // Check the operator
    assert.strictEqual(complex.op, Operators.COND, "Verify the conditional in " + fact);

    // Check the first argument
    assert.strictEqual(complex.arg0.op, Operators.NEG, "Verify the negation of p " + fact);
    assert.strictEqual(complex.arg0.arg0.arg0, "p", "Verify 'p' in " + fact);

    // Check the second argument
    assert.strictEqual(complex.arg1.op, Operators.XOR, "Verify the exclusive or in " + fact);
    assert.strictEqual(complex.arg1.arg0.arg0, "q", "Verify the q in " + fact);
    assert.strictEqual(complex.arg1.arg1.op, Operators.AND, "Verify the and in " + fact);
    assert.strictEqual(complex.arg1.arg1.arg0.arg0, "r", "Verify the r in " + fact);
    assert.strictEqual(complex.arg1.arg1.arg1.op, Operators.NEG, "Verify the negation of s in " + fact);
    assert.strictEqual(complex.arg1.arg1.arg1.arg0.arg0, "s", "Verify the s in " + fact);
});

/*
 * Test the equals method of Fact
 */
QUnit.test("Fact.equals", function(assert) {
    // Init
    var fact1, fact2;

    // The no shit equality
    fact1 = getFactFromString("a");
    assert.ok(fact1.equals(fact1), "A Fact should equal itself");

    // Identical Instantiation
    fact1 = getFactFromString("p");
    fact2 = getFactFromString("p");
    assert.ok(fact1.equals(fact2), "Two identical instatiations should equal");

    // Partial equal
    fact1 = getFactFromString("p");
    fact2 = getFactFromString("(p&q)");
    assert.ok(!fact1.equals(fact2), "Equality is not containment");

    // Clearly different
    fact1 = getFactFromString("(r&s)");
    fact2 = getFactFromString("~(a)");
    assert.ok(!fact1.equals(fact2), "Clearly different facts should not equal");
});

/*
 * Test the toString method of Fact
 */
QUnit.test("Fact.toString", function(assert) {
    // Simple
    testToStringFamily("a", "a", "toString", assert);

    // Basic
    testToStringFamily("(p|q)", "(p&or;q)", "toString", assert);

    // Complex
    testToStringFamily("((~(s)|b)#~((a&(c>b))))",
	    "((&tilde;s&or;b)&oplus;&tilde;(a&and;(c&rarr;b)))",
	    "toString",
	    assert);
});

/*
 * Test the toParsableString method of Fact
 */
QUnit.test("Fact.toParsableString", function(assert) {
    // Reflective test
    var fact = getFactFromString("((~(s)|b)#~((a&(c>b))))");
    var reflect = getFactFromString(fact.toParsableString());
    assert.deepEqual(fact, reflect, "Generating a Fact from fact.toParsableString should create an identical Fact");

    // Some generic tests
    testToStringFamily("a", "a", "toParsableString", assert);
    testToStringFamily("(a>q)", "(a>q)", "toParsableString", assert);
    testToStringFamily("~((a|c))", "~((a|c))", "toParsableString", assert);
    testToStringFamily("(a|(b|(c&~(d))))", "(a|(b|(c&~(d))))", "toParsableString", assert);
    testToStringFamily("((((x|a)>s)&p)|s)", "((((x|a)>s)&p)|s)", "toParsableString", assert);
});

/*
 * Test the toPrettyString method of Fact
 */
QUnit.test("Fact.toPrettyString", function(assert) {
    // Some generic tests
    testToStringFamily("a", "a", "toPrettyString", assert);
    testToStringFamily("(a>q)", "a&rarr;q", "toPrettyString", assert);
    testToStringFamily("~((a|c))", "&tilde;(a&or;c)", "toPrettyString", assert);
    testToStringFamily("(a|(b|(c&~(d))))", "a&or;(b&or;(c&and;&tilde;d))", "toPrettyString", assert);
    testToStringFamily("((((x|a)>s)&p)|s)", "(((x&or;a)&rarr;s)&and;p)&or;s", "toPrettyString", assert);
});

/*
 * Test the getCopy method of Fact
 */
QUnit.test("Fact.getCopy", function(assert) {
    // Init
    var ref1, ref2;

    // Verify that identical references return true but copies return false
    ref1 = getFactFromString("(a|b)");
    ref2 = ref1;
    assert.strictEqual(ref1, ref2, "References to the same object are equal");
    ref2 = ref1.getCopy();
    assert.notStrictEqual(ref1, ref2, "But a call to getCopy doesn't return a reference to the same object");

    // Manipulation test without copy
    ref1 = getFactFromString("(p&q)");
    ref2 = ref1;
    ref1.op = Operators.COND;
    assert.strictEqual(ref1.op, ref2.op, "With a reference copy, manipulating the original manipulates the copy");

    // Manipulation test with copy
    ref1 = getFactFromString("(p&q)");
    ref2 = ref1.getCopy();
    ref1.op = Operators.COND;
    assert.notStrictEqual(ref1.op, ref2.op, "With a deep copy, manipulating the original does nothing to the copy.");
});

/*
 * Test the getCopy method of Fact
 */
QUnit.test("Fact.getInverse", function(assert) {
    // Init
    var fact, manipulated, expecting;

    // The p scenario
    fact = getFactFromString("(a|~(c))");
    expecting = getFactFromString("~((a|~(c)))");
    manipulated = fact.getInverse();
    assert.deepEqual(manipulated, expecting, "The inverse of p is ~p");

    // The ~p scenario
    fact = getFactFromString("~((a&(c|d)))");
    expecting = getFactFromString("(a&(c|d))");
    manipulated = fact.getInverse();
    assert.deepEqual(manipulated, expecting, "The inverse of ~p is p");
});

/*
 * Test the getNegation method of Fact
 */
QUnit.test("Fact.getNegation", function(assert) {
    // Init
    var fact, manipulated, expecting;

    // The p scenario
    fact = getFactFromString("(a|b)");
    expecting = getFactFromString("~((a|b))");
    manipulated = fact.getNegation();
    assert.deepEqual(manipulated, expecting, "The negation of p is ~p");

    // The ~p scenario
    fact = getFactFromString("~((a&(c|d)))");
    expecting = getFactFromString("~(~((a&(c|d))))");
    manipulated = fact.getNegation();
    assert.deepEqual(manipulated, expecting, "The negation of ~p is ~~p");
});

/*
 * Test the createFactFromComponents factory function
 */
QUnit.test("createFactFromComponents", function(assert) {
    // Init
    var fact, arg0, arg1, op;

    // Do the test
    arg0 = getFactFromString("(a|b)");
    arg1 = getFactFromString("(a|c)");
    op = Operators.AND;
    fact = createFactFromComponents(arg0, arg1, op);
    assert.deepEqual(fact.arg0, arg0, "The contents of the first component should be what we provided");
    assert.notStrictEqual(fact.arg0, arg0, "However the first component shouldn't be a reference to what was provided");
    assert.deepEqual(fact.arg1, arg1, "The contents of the second component should be what we provided");
    assert.notStrictEqual(fact.arg1, arg1, "However the second component shouldn't be a reference to what was provided");
    assert.strictEqual(fact.op, op, "The operator should be the same as the one provided");
});

/**
 * Test the getFactFromPrettyString utility function
 */
QUnit.test("getFactFromHTMLString", function(assert) {
    /**
     * Test getFactFromPrettyString by comparing it to the original.
     * 
     * @param {String} factString The String to test with 
     */
    function test(factString) {
	// Create the fact
	var expectedFact = getFactFromString(factString);
	
	// Get the Html Fact
	generateFactHTML(expectedFact, $('#util'), 'test', function() {});
	var actualFact = getFactFromHTMLString($('#util').text());
	assert.deepEqual(expectedFact, actualFact,
		actualFact.toParsableString() + " should be " + expectedFact.toParsableString());
    }
    
    // The tests
    test("a");
    test("~(p)");
    test("(p>q)");
    test("(p&~(q))");
    test("~((p&~(q)))");
    test("((~(s)>~(q))|~((p%~(r))))");
});