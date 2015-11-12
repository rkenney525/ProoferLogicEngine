define([], function () {
  /**
   * Creates a Symbol based on a CSS font-class.
   * 
   * @param {String} glyphClass The CSS font-class
   * @returns {Symbol} The Symbol
   */
  var Symbol = function (glyphClass) {
    this.glyphClass = glyphClass;
  };
  
  /**
   * Get the HTML form of this Symbol.
   * 
   * @returns {String} The HTML that renders the Symbol
   */
  Symbol.prototype.html = function() {
    return '<span class="' + glyphClass + '"></span>'; 
  };
  
  /**
   * Checks this Symbol and other for equivalence.
   * 
   * @param {Symbol} other Another Symbol
   * @returns {Boolean} True if the Symbols are identical, false otherwise
   */
  Symbol.prototype.equals = function(other) {
    return this.glyphClass === other.glyphClass;
  };

  // Return the Symbol class
  return Symbol;
});