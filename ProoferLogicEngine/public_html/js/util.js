/**
 * Close the browser window
 */
function closeWindow() {
    // TODO closeWindow() doesnt work in chrome app
    //if (chrome.app.window != null) {
    chrome.app.window.close();
    window.close();
    //} else {
    //    window.open('', '_self', '');
    //    window.close();
    //}
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
 * Get saved data.
 * 
 * @param {String} key The key of the data to retrieve
 * @param {Function} context The code to execute that needs this data
 */
function getData(key, context) {
    var that = this;
    chrome.storage.local.get(key, function(items) {
        context(items[key]);
    });
}

function clearData() {
    chrome.storage.local.clear();
}