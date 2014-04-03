/**
 * Close the browser window
 */
function closeWindow() {
    window.close();
}

/*** Pagination ***/

/**
 * Basic functionality for a homemade pagination solution. This is primarily useful 
 * for non-tabular data since there are already plenty of pagination libraries 
 * for tables.
 * 
 * @param {Array} items Items on the page
 * @param {Number} perPage Number of items to display per page
 * @returns {Pagination} A Pagination object
 */
function Pagination(items, perPage) {
    this.items = items;
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].paginationId = i + 1;
    }
    this.perPage = perPage;
    this.page = 1;
    this.pages = Math.ceil(items.length / perPage);
}

/**
 * Get the current page's contents.
 * 
 * @returns {Array} A subset of items that contains only the current page's contents.
 */
Pagination.prototype.getPage = function() {
    // Init
    var start = this.perPage * (this.page - 1);
    var ret = [];

    // Build the return array
    var counter = 0;
    for (var i = start; i < this.items.length && counter < this.perPage; i++) {
        ret.push(this.items[i]);
        counter++;
    }

    // Return
    return ret;
};

/**
 * Check if you're on the first page
 * 
 * @returns {Boolean} True if on the first page, false otherwise
 */
Pagination.prototype.onFirstPage = function() {
    return this.page === 1;
};

/**
 * Check if you're on the last page
 * 
 * @returns {Boolean} True if on the last page, false otherwise
 */
Pagination.prototype.onLastPage = function() {
    return this.page === this.pages;
};

/**
 * Go to the next page
 * 
 * @returns {Boolean} True if there is another page to turn to. False otherwise.
 */
Pagination.prototype.nextPage = function() {
    if (!this.onLastPage()) {
        this.page++;
        return true;
    } else {
        return false;
    }
};

/**
 * Go to the previous page
 * 
 * @returns {Boolean} True if there is another page to turn to. False otherwise.
 */
Pagination.prototype.prevPage = function() {
    if (!this.onFirstPage()) {
        this.page--;
        return true;
    } else {
        return false;
    }
};

/*** End Pagination ***/

/*** Saving ***/
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