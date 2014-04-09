function Canvas(id) {
    this.c = $('#' + id)[0].getContext("2d");
    this.arrowLength = 100;
    this.headTheta = Math.PI / 3;
    this.headLength = 25;
}

Canvas.prototype.pointAt = function(x, y, theta) {
    // Init
    this.c.lineWidth = 5;
    this.c.strokeStyle = "#FFD700";
    
    // Get values
    var xMod = Math.cos(theta) * this.arrowLength;
    var yMod = Math.sin(theta) * this.arrowLength;
    var baseX = x + xMod;
    var baseY = y + yMod;

    // Draw the head (giggity)
    var headXMod = Math.cos(this.headTheta) * this.headLength;
    var headYMod = Math.cos(this.headTheta) * this.headLength;
    var head1x = x - headXMod;
    var head1y = y - headYMod;
    var head2x = x - headXMod;
    var head2y = y + headYMod;

    // Draw
    this.c.beginPath();
    this.c.moveTo(baseX, baseY);
    this.c.lineTo(x, y);
    this.c.moveTo(x, y);
    this.c.lineTo(head1x, head1y);
    this.c.lineTo(head2x, head2y);
    this.c.lineTo(x, y);
    this.c.stroke();
};

Canvas.prototype.circle = function(x, y, width, height) {

};