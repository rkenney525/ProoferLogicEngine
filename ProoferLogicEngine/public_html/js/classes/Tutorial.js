/**
 * Creates a Tutorial object. A Tutorial is composed of Pages, which are objects 
 * that define a visible piece of text and an accomponying subtitle.
 * 
 * @param {Page} pages The text and title for each individual slide
 * @param {String} title The title to give the dialog box
 * @returns {Tutorial} The Tutorial object created
 */
function Tutorial(pages, title) {
    this.pages = pages;
    this.title = title;
}

function Page(content, subtitle) {
    this.content = content;
    this.subtitle = subtitle;
}

var Tutorials = {
    INTRO: new Tutorial([
        new Page("<p>Welcome to Proofer - The Logic Engine! Proofer is a game of logical thinking. " +
                "Soon you will be introduced to a set of rules. These rules allow you to " +
                "assert certain facts based on other facts that have been proven " +
                "(or provided to you initially).</p><br /><p>Before we can begin, " +
                "we will first go over some of the basic types of facts you " +
                "will encounter, the symbols used in those facts, and what it " +
                "all means.</p>",
                "About the Game"),
        new Page("<p>Test.</p>", "About Facts")
    ],
            "Intro")
};