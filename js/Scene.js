define([], function () {
  var Scene = function (options) {
    // Get the stage
    this.$stage = options.$stage;

    // Get a reference to the scene transfer function from the scene manager
    // as well as the list of scenes
    var sceneManager = options.sceneManager;
    this.toScene = sceneManager.startScene;
    this.scenes = sceneManager.scenes;

    // Get the initialization function
    this.start = options.start;
    if (this.start === undefined) {
      this.start = function () {
      };
    }
  };
  
  Scene.prototype.init = function() {};
  
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

        // Default action is to replace with new value
        object[property] = extOptions[property];
      }

      // Event delegation
      for (var event in object.events) {
        // Get all necessary parts
        var parts = event.split(' ');
        var eventType = parts[0];
        var selector = parts[1];
        var actionName = object.events[event];
        var action = object[actionName];
        
        // Validate
        if (typeof action !== 'function') {
          throw new Error(actionName + 'is not a member of scene.');
        }
        
        // Bind
        object.$stage.on(eventType, selector, action);
      }
      
      // Finally, call the initialize functionality
      object.init();

      return object;
    };
  };

  return Scene;
});