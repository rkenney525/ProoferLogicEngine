/**
 * Tests for the operator class
 */
require(['jquery', 'util', 'Operator'],
        function($, util, Operators) {
            util.addPrototypes();
            /*
             * Test the Operators.getOperatorFromString function, which is the only way to retrieve Operators
             * without using the explicit reference in the Operators object.
             */
            QUnit.test("Operator retrieval - Operators.getOperatorFromString", function(assert) {
                assert.strictEqual(Operators.getOperatorFromString("|"), Operators.OR, "| should yield OR");
                assert.strictEqual(Operators.getOperatorFromString("&"), Operators.AND, "& should yield AND");
                assert.strictEqual(Operators.getOperatorFromString("#"), Operators.XOR, "# should yield XOR");
                assert.strictEqual(Operators.getOperatorFromString(">"), Operators.COND, "> should yield CONDITIONAL");
                assert.strictEqual(Operators.getOperatorFromString("%"), Operators.BICOND, "% should yield BICONDITIONAL");
                assert.strictEqual(Operators.getOperatorFromString("~"), Operators.NEG, "~ should yield NEGATION");
                assert.strictEqual(Operators.getOperatorFromString("*"), null, "anything else should yield null");
                assert.ok(Operators.getOperatorFromString("~") === Operators.NEG, "The result should be a reference to an existing Operator");
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
        });