function Tutorial(pages) {
    this.pages = pages;
}

Tutorial.prototype.getHTML = function() {
    // TODO iterate through the pages and add HTML where necessary
};

var Tutorials = {
    INTRO: new Tutorial()
};