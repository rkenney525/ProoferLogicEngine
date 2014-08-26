/**
 * Store data locally
 * 
 * @param {String} key The key to store value under
 * @param {Object} value The value to store
 */
function saveData(key, value) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj);
}

/**
 * Store data locally with code executed at the end
 * 
 * @param {String} key The key to store value under
 * @param {Object} value The value to store
 * @param {Function} callback the code to execute upon completion
 */
function saveDataSync(key, value, callback) {
    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, callback);
}

/**
 * Get saved data.
 * 
 * @param {String} key The key of the data to retrieve
 * @param {Function} context The code to execute that needs this data
 */
function getData(key, context) {
    chrome.storage.local.get(key, function(items) {
        context(items[key]);
    });
}

/**
 * Clear all saved data
 */
function clearData() {
    chrome.storage.local.clear();
}


/**
 * Format a Level to save
 * @param {Level} level The Level to save
 * @returns {Object} The save object
 */
function getSaveLevelObj(level) {
    var obj = {};
    // Rules
    obj.rules = [];
    for (var i = 0; i < level.rules.length; i++) {
        obj.rules.push(level.rules[i].displayName);
    }
    // ID
    obj.id = level.id;
    // Facts
    obj.facts = [];
    for (var i = 0; i < level.facts.length; i++) {
        obj.facts.push(level.facts[i].toParsableString());
    }
    // Conclusion
    obj.conclusion = level.conclusion.toParsableString();
    // Par
    obj.par = level.par;
    // Tutorial
    obj.tutorial = level.tutorial;
    // Return
    return obj;
}

/**
 * Get a saved Level object
 * @param {Object} levelObj The saved Object
 * @returns {Level} The formatted Level
 */
function loadLevelObj(levelObj) {
    // Rules
    var rules = [];
    for (var i = 0; i < levelObj.rules.length; i++) {
        for (var rule in Rules) {
            if (rule !== undefined &&
                    levelObj.rules[i] === rule) {
                rules.push(Rules[rule]);
                break;
            }
        }
    }
    // ID
    var id = levelObj.id;
    // Facts
    var facts = [];
    for (var i = 0; i < levelObj.facts.length; i++) {
        facts.push(getFactFromString(levelObj.facts[i]));
    }
    // Conclusion
    var conclusion = getFactFromString(levelObj.conclusion);
    // Par
    var par = levelObj.par;
    // Tutorial
    var tutorial = levelObj.tutorial;
    // Return
    return new Level(id, rules, facts, conclusion, par, tutorial);
}