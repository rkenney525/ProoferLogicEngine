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

/*
 * Test getCurrentLevel method of the Levels object
 */
QUnit.test("Levels.getCurrentLevel", function(assert) {
    // Init
    var currentLevel;
    var expectedLevel;
    
    // Without save data, should be initialized to 0
    currentLevel = Levels.getCurrentLevel();
    expectedLevel = Levels.data[0]();
    assert.deepEqual(currentLevel, expectedLevel, "Initial Level should be Level 1");
    
    // When there is no active level, current level should be initialized
    Levels.current = null;
    currentLevel = Levels.getCurrentLevel();
    expectedLevel = Levels.data[0]();
    assert.deepEqual(currentLevel, expectedLevel, "When there is no active level, current level should be initialized");
    
    // Make sure it loads the Level from the index when there isnt active Level
    Levels.current = null;
    Levels.currentIndex = 4;
    currentLevel = Levels.getCurrentLevel();
    expectedLevel = Levels.data[4]();
    assert.deepEqual(currentLevel, expectedLevel, "Load Level from index (when there is no active Level");
    
    // If index is changed but data isnt cleared, don't reload a new level
    Levels.current = null;
    Levels.currentIndex = 4;
    currentLevel = Levels.getCurrentLevel();
    Levels.currentIndex = 5;
    currentLevel = Levels.getCurrentLevel();
    expectedLevel = Levels.data[4]();
    assert.deepEqual(currentLevel, expectedLevel, "If index is changed but data isnt cleared, don't reload a new level");
});