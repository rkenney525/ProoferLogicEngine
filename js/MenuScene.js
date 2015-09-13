define(['underscore', 'Scene'], function(_, Scene) {
  var MenuScene = Scene.extend({
    template: _.template($('#mainMenuTemplate').html()),
    events: {
      'click #PlayGame': 'test',
      'click #PickLevel': 'test',
      'click #Options': 'test',
      'click #Reset': 'test',
      'click #ExitGame': 'exit'
    },
    init: function() {
    },
    start: function(data) {
      this.$stage.append(this.template());
    },
    test: function() {
      alert('dees');
    },
    exit: function() {
      window.close();
    }
  });
  return MenuScene;
});