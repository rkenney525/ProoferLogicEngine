define([], function () {
  /**
   * Create a SceneManager, which controls transition between various Scenes.
   * 
   * @param {Object} options All options being passed in to the SceneManager.
   * @returns {SceneManager} A SceneManager with the given scenes
   */
  var SceneManager = function (options) {
    this.$stage = options.$stage;
  };

  SceneManager.prototype.begin = function (Scene, data) {
    // TODO make sure
    // Create the scene
    var scene = new Scene({
      $stage: this.$stage,
      startScene: this.begin
    });

    // TODO stop any running scene
    this.$stage.empty();

    // Invoke the startup sequence
    scene.start(data);

    // TODO start any scene-independent event bindings
  };

  // Return the "class"
  return SceneManager;
});