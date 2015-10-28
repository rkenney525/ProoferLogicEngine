define(['underscore', 'Scene', 'PickLevelScene'], function(_, Scene, PickLevelScene) {
  return Scene.extend({
    template: _.template($('#mainMenuTemplate').html()),
    events: {
      'click #PlayGame': 'test',
      'click #PickLevel': 'pickLevel',
      'click #Options': 'test',
      'click #ExitGame': 'exit'
    },
    start: function(data) {
      this.$stage.append(this.template());
    },
    test: function() {
      alert('dees');
    },
    pickLevel: function() {
      this.startScene(PickLevelScene);
    },
    exit: function() {
      window.close();
    }
  });
});