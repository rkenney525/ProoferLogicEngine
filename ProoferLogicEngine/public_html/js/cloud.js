define(['Rule', 'Fact'], function(Rules, Fact) {

    return {
        // TODO platform independence
        //greenworks: require('./node_modules/greenworks/greenworks-linux64'),
        /**
         * Store data locally
         * 
         * @param {String} key The key to store value under
         * @param {Object} value The value to store
         */
        saveData: function(key, value) {
            var obj = {};
            obj[key] = value;
            chrome.storage.local.set(obj);
        },
        /**
         * Store data locally with code executed at the end
         * 
         * @param {String} key The key to store value under
         * @param {Object} value The value to store
         * @param {Function} callback the code to execute upon completion
         */
        saveDataSync: function(key, value, callback) {
            var obj = {};
            obj[key] = value;
            chrome.storage.local.set(obj, callback);
            callback();
        },
        /**
         * Get saved data.
         * 
         * @param {String} key The key of the data to retrieve
         * @param {Function} context The code to execute that needs this data
         */
        getData: function(key, context) {
            chrome.storage.local.get(key, function(items) {
                context(items[key]);
            });
            context(undefined);

        },
        /**
         * Clear all saved data
         */
        clearData: function() {
            chrome.storage.local.clear();
        },
        /**
         * Format a Level to save
         * @param {Level} level The Level to save
         * @returns {Object} The save object
         */
        getSaveLevelObj: function(level) {
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
        },
        /**
         * Get a saved Level object
         * @param {Object} levelObj The saved Object
         * @returns {Level} The formatted Level
         */
        loadLevelObj: function(levelObj) {
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
                facts.push(Fact.getFactFromString(levelObj.facts[i]));
            }
            // Conclusion
            var conclusion = Fact.getFactFromString(levelObj.conclusion);
            // Par
            var par = levelObj.par;
            // Tutorial
            var tutorial = levelObj.tutorial;
            // Return
            return new Level(id, rules, facts, conclusion, par, tutorial);
        }
    };
});