define([], function () {
  var Scene = function (options) {
    // Get the stage
    this.$stage = options.$stage;
    
    // Get the initialization function
    this.start = options.start;
    if (this.start === undefined) {
      this.start = function() {};
    }
  };
  Scene.extend = function (extOptions) {
    // Init
    var parent = this;
    
    // Handle inheritence
    return function (options) {
      // Create the base object
      var object = new parent(options);
      
      // Handle all properties passed into the extend call
      for (var property in extOptions) {
        // These properties are extendable, which means the result is the combined
        // functionality of child and parent.
        // TODO add event delegation
        
        // Default action is to replace with new value
        object[property] = extOptions[property];
      }
      return object;
    };
  };
  return Scene;
});