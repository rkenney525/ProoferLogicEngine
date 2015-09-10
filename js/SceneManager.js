define([], function() {
  /**
   * Create a SceneManager, which controls transition between various Scenes.
   * 
   * @param {Object} options All options being passed in to the SceneManager.
   * @returns {SceneManager} A SceneManager with the given scenes
   */
  var SceneManager = function(options) {
    this.$stage = options.$stage;
    this.scenes = options.scenes;
  };
  
  SceneManager.prototype.startScene = function(sceneName, data) {
    // Attempt to get the Scene
    // TODO pretty this up and keep track of the current Scene
    var scene = new this.scenes[sceneName]({
      $stage: this.$stage
    });
    if (scene === undefined) {
      throw "That scene is undefined";
    }
    
    // TODO stop any running scene
    this.$stage.empty();
    
    // Invoke the startup sequence
    scene.start(data);
    
    // TODO start event bindings
  };
  
  // Return the "class"
  return SceneManager;
});