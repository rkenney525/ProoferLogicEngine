requirejs(['jquery', 'SceneManager', 'MenuScene'],
  function ($, SceneManager, MenuScene) {
    var manager = new SceneManager({
      $stage: $('#stage'),
      scenes: {
        MENU: MenuScene
      }
    });
    manager.startScene("MENU", {
      value: "world"
    });
});