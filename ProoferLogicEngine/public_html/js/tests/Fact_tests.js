/**
 * Tests for the Fact class
 */

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
    // TODO implement
});