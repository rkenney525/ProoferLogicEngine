requirejs(['jquery', 'SceneManager', 'MenuScene'],
  function ($, SceneManager, MenuScene) {
    var manager = new SceneManager({
      $stage: $('#stage')
    });
    manager.begin(MenuScene, {
      value: "world"
    });
});