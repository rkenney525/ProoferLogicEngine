define(['underscore', 'Scene'], function(_, Scene) {
  var MenuScene = Scene.extend({
    template: _.template($('#mainMenuTemplate').html()),
    start: function(data) {
      this.$stage.append(this.template());
    }
  });
  return MenuScene;
});