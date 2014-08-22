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

/*
 * Test nextLevel method of the Levels object
 */
QUnit.test("Levels.nextLevel", function(assert) {
    // Init
    var currentLevel;
    var expectedLevel;

    // Without save data, should be initialized to 0, so next Level is 1
    Levels.currentIndex = 0;
    Levels.current = null;
    currentLevel = Levels.nextLevel();
    expectedLevel = Levels.data[1]();
    assert.deepEqual(currentLevel, expectedLevel, "Initial Level should be Level 1, so Next Level gives Level 2");

    // When there is no active level, nextLevel should still work
    Levels.current = null;
    currentLevel = Levels.nextLevel();
    expectedLevel = Levels.data[2]();
    assert.deepEqual(currentLevel, expectedLevel, "When there is no active level, current level should be initialized");

    // If index is changed but data isnt cleared, use index
    Levels.current = null;
    Levels.currentIndex = 4;
    currentLevel = Levels.nextLevel();
    Levels.currentIndex = 1;
    currentLevel = Levels.nextLevel();
    expectedLevel = Levels.data[2]();
    assert.deepEqual(currentLevel, expectedLevel, "If index is changed but data isnt cleared, use index");
});

/*
 * Test onLastLevel method of the Levels object
 */
QUnit.test("Levels.onLastLevel", function(assert) {
    // Init
    Levels.currentIndex = 0;

    for (var i = 0; i < Levels.data.length; i++) {
        var expected = (i === Levels.data.length - 1);
        assert.strictEqual(Levels.onLastLevel(), expected, "[" + i + "] Making sure only the last Level returns true");
        
        // Go to the next level if we havent reached the end
        if (!expected) {
            Levels.nextLevel();
        }
    }
});

/*
 * Test reset method of the Levels object
 */
QUnit.test("Levels.reset", function(assert) {
    // Init
    Levels.currentIndex = 0;
    Levels.current = null;
    var currentLevel, expectedLevel;

    // After reseting, internal Level should be null
    var level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[0](), "Before reset, make sure we have some Level data");
    Levels.reset();
    assert.strictEqual(Levels.current, null, "After reset, contents should be cleared");
    
    // Reseting a Level and then changing index should cause currentLevel to pull 
    // the Level based on the index.
    Levels.current = null;
    Levels.currentIndex = 4;
    currentLevel = Levels.getCurrentLevel();
    Levels.currentIndex = 1;
    Levels.reset();
    currentLevel = Levels.getCurrentLevel();
    expectedLevel = Levels.data[1]();
    assert.deepEqual(currentLevel, expectedLevel, "If index is changed, getCurreentLevel should return level from new index after a reset");
});

/*
 * Test clearState method of the Levels object
 */
QUnit.test("Levels.clearState", function(assert) {
    // From an unknown state
    Levels.clearState();
    var level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[0](), "[unknown] clearState should take back to first level");
    
    // From an known incorrect state
    Levels.clearState();
    Levels.currentIndex = 5;
    level = Levels.getCurrentLevel();
    Levels.clearState();
    level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[0](), "[known] clearState should take back to first level");
});

/*
 * Test goToLevel method of the Levels object
 */
QUnit.test("Levels.goToLevel", function(assert) {
    // Go to a random Level
    Levels.goToLevel(5);
    var level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[5](), "Go to the specified Level");
    
    // Go to a random Level
    Levels.goToLevel(8);
    var level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[8](), "Go to the specified Level");
    
    // Go to a random Level
    Levels.goToLevel(2);
    var level = Levels.getCurrentLevel();
    assert.deepEqual(level, Levels.data[2](), "Go to the specified Level");
});