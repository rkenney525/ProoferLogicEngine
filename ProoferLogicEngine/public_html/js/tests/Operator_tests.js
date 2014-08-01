/**
 * Tests for the operator class
 */


/*
 * Test the getOperatorFromString function, which is the only way to retrieve Operators
 * without using the explicit reference in the Operators object.
 */
QUnit.test("Operator retrieval - getOperatorFromString", function(assert) {
    assert.strictEqual(getOperatorFromString("|"), Operators.OR, "| should yield OR");
    assert.strictEqual(getOperatorFromString("&"), Operators.AND, "& should yield AND");
    assert.strictEqual(getOperatorFromString("#"), Operators.XOR, "# should yield XOR");
    assert.strictEqual(getOperatorFromString(">"), Operators.COND, "> should yield CONDITIONAL");
    assert.strictEqual(getOperatorFromString("%"), Operators.BICOND, "% should yield BICONDITIONAL");
    assert.strictEqual(getOperatorFromString("~"), Operators.NEG, "~ should yield NEGATION");
    assert.strictEqual(getOperatorFromString("*"), null, "anything else should yield null");
    assert.ok(getOperatorFromString("~") === Operators.NEG, "The result should be a reference to an existing Operator");
});

/*
 * Test the equals method of the Operator class
 */
QUnit.test("Operator.equals", function(assert) {
    assert.strictEqual(Operators.OR, Operators.OR, "An Operator should equal itself");
    assert.notStrictEqual(Operators.AND, Operators.OR, "An Operator should not equal any other Operator");
    assert.notStrictEqual(Operators.AND, "&or;", "An Operator should not equal any other object");
});

/*
 * Test the toString method of the Operator class
 */
QUnit.test("Operator.toString", function(assert) {
    assert.strictEqual(Operators.OR.toString(), Operators.OR.symbol, "toString should return the Operator's symbol");
    assert.notStrictEqual(Operators.AND.toString(), Operators.AND.id, "toString should not return the Operator's id");
});