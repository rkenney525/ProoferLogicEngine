/**
 * Tests for the Fact class
 */

/*
 * Test a Fact of a simple statement
 */
QUnit.test("Fact parsing - Single", function(assert) {
    var fact = getFactFromString("p");
    assert.deepEqual(fact.arg0, "p", "Verify the p is stored");
    assert.deepEqual(fact.arg1, null, "Verify there is no second argument");
    assert.deepEqual(fact.op, null, "Verify there is no operator");
});

/*
 * Test a Fact containing an Operator
 */
QUnit.test("Fact parsing - Basic", function(assert) {
    var fact = "p > q";
    var conditional = getFactFromString("(p>q)");
    var shouldBeP = conditional.arg0.arg0;
    var shouldBeQ = conditional.arg1.arg0;
    assert.deepEqual(shouldBeP, "p", "Verify the p in " + fact);
    assert.deepEqual(shouldBeQ, "q", "Verify the q in " + fact);
    assert.deepEqual(conditional.op, Operators.COND, "Verify the conditional in " + fact);
});

/*
 * Test a Fact containing multiple operators, including negations
 */
QUnit.test("Fact parsing - Complex", function(assert) {
    var fact = "~p > (q # (r & ~s))";
    var complex = getFactFromString("(~(p)>(q#(r&~(s))))");
    // Check the operator
    assert.deepEqual(complex.op, Operators.COND, "Verify the conditional in " + fact);
    
    // Check the first argument
    assert.deepEqual(complex.arg0.op, Operators.NEG, "Verify the negation of p " + fact);
    assert.deepEqual(complex.arg0.arg0.arg0, "p", "Verify 'p' in " + fact);
    
    // Check the second argument
    assert.deepEqual(complex.arg1.op, Operators.XOR, "Verify the exclusive or in " + fact);
    assert.deepEqual(complex.arg1.arg0.arg0, "q", "Verify the q in " + fact);
    assert.deepEqual(complex.arg1.arg1.op, Operators.AND, "Verify the and in " + fact);
    assert.deepEqual(complex.arg1.arg1.arg0.arg0, "r", "Verify the r in " + fact);
    assert.deepEqual(complex.arg1.arg1.arg1.op, Operators.NEG, "Verify the negation of s in " + fact);
    assert.deepEqual(complex.arg1.arg1.arg1.arg0.arg0, "s", "Verify the s in " + fact);
});