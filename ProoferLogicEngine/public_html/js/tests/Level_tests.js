/*
 * Test the getHTML method of the Level class
 */
QUnit.test("Level.getHTML", function(assert) {
    
    /**
     * Test the getHTML function
     * 
     * @param {Level} level The Level object to test
     * @return {undefined}
     */
    function testGetHTML(level) {
        // Init
        var html = level.getHtml();
        var expected;

        // Get pieces
        var text = $('#util').append(html).text();
        $('#util').empty();
        var premises = text.match(/\d\.\D*(?=(\d|(Therefore)))/gi);
        var conclusion = text.match(/(Therefore:  ).*/gi)[0];

        // Verify premises
        for (var i = 0; i < premises.length; i++) {
            expected = $('#util').append(String(i + 1) + ". " + level.facts[i].toPrettyString()).text();
            $('#util').empty();
            assert.strictEqual(premises[i], expected, "[" + level.id + "] Check premise #" + String(i + 1));
        }

        // Verify conclusion
        expected = $('#util').append("Therefore:  " + level.conclusion.toPrettyString()).text();
        $('#util').empty();
        assert.strictEqual(conclusion, expected, "[" + level.id + "] Check the conclusion");
    }

    // Test all Levels
    for (var i = 0; i < Levels.data.length; i++) {
        testGetHTML(Levels.data[i]());
    }
});