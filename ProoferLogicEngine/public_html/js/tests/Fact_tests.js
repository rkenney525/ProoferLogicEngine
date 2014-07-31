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
 * @returns {undefined}
 */
function testToStringFamily(factString, expectedString, functionString) {
    var fact = getFactFromString(factString);
    var result = fact[functionString]();
    assert.strictEqual(result, expectedString, result + " should be " + expectedString);
}

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
    testToStringFamily("a", "a", "toString");

    // Basic
    testToStringFamily("(p|q)", "(p&or;q)", "toString");

    // Complex
    testToStringFamily("((~(s)|b)#~((a&(c>b))))", 
    "((&tilde;s&or;b)&oplus;&tilde;(a&and;(c&rarr;b)))", 
    "toString");
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
    testToStringFamily("a", "a", "toParsableString");
    testToStringFamily("(a>q)", "(a>q)", "toParsableString");
    testToStringFamily("~((a|c))", "~((a|c))", "toParsableString");
    testToStringFamily("(a|(b|(c&~(d))))", "(a|(b|(c&~(d))))", "toParsableString");
    testToStringFamily("((((x|a)>s)&p)|s)", "((((x|a)>s)&p)|s)", "toParsableString");
});

/*
 * Test the toPrettyString method of Fact
 */
QUnit.test("Fact.toPrettyString", function(assert) {
    // Some generic tests
    testToStringFamily("a", "a", "toPrettyString");
    testToStringFamily("(a>q)", "a&rarr;q", "toPrettyString");
    testToStringFamily("~((a|c))", "&tilde;(a&or;c)", "toPrettyString");
    testToStringFamily("(a|(b|(c&~(d))))", "a&or;(b&or;(c&and;&tilde;d))", "toPrettyString");
    testToStringFamily("((((x|a)>s)&p)|s)", "(((x&or;a)&rarr;s)&and;p)&or;s", "toPrettyString");
});