define(['underscore', 'Scene'], function(_, Scene) {
  var MenuScene = Scene.extend({
    template: _.template($('#pickLevelTemplate').html()),
    events: {
    },
    start: function(data) {
      this.$stage.append(this.template());
    }
  });
  return MenuScene;
});