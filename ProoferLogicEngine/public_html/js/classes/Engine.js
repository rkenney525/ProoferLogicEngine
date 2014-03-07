var Engine = {
    el: $('#MainGameCanvas'),
    clear: function() {
        // Erase the contents of the canvas
        var canvas = this.el.get(0);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
};