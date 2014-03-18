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
	new Page('<p>Welcome to Proofer - The Logic Engine! Proofer is a game of logical thinking. ' +
		'The object of the game is to prove a statement to be true given limited ' +
		'information and using some of the rules of logic.</p><br />' +
		'<p>Soon you will be introduced to a set of rules. These rules allow you to ' +
		'assert certain statements based on other statements that have been proven ' +
		'(or provided to you initially).</p><br /><p>Before we can begin, ' +
		'we will first go over some of the basic types of statements you ' +
		'will encounter, the symbols used in those facts, and what it ' +
		'all means.</p>',
		'About the Game'),
	new Page('<p>There are two types of statements: Simple and Complex.</p><h3>' +
		'Simple Statements:</h3><p>Simple statements are statements that ' +
		'are either true or false and represent the base level of simplicity ' +
		'desired. Simple statements are represented with single letters like ' +
		'<i>p</i> or <i>q</i>.</p><h3>Complex Statements</h3><p>Complex statements ' +
		'are compositions with simple statements joined together using ' +
		'logical operators. The next sections will tell you more about ' +
		'logical operators. Listed are few examples of complex statements:' +
		'<ul><li><i>p</i> and <i>q</i></li><li><i>i</i> or <i>s</i></li>' +
		'<li>if <i>a</i> then <i>b</i></li></ul></p>',
		'About Statements'),
	new Page('<p>Logical operators are to logic like mathematical operators (' +
		'plus, minus, times) are to math. Each operator will be given a brief ' +
		'summary and then a truth table. A truth table is a table that shows ' +
		'every combination of truth values for the simple statements, ' +
		'and then what the calculated truth value of the complex statements ' +
		'is. The first couple levels will deal with only these operators:' +
		'<ul><li>CONJUNCTION (&and;)</li><li>INCLUSIVE OR (&or;)</li><li>' +
		'IMPLICATION (&rarr;)</li><li>NEGATION (&tilde;)</li></ul></p>',
		'About Operators'),
	new Page('<p>Conjunction, or "And", means that both statements must ' +
		'be true for the conjunction to be true.</p><div class="tutorial-table">' +
		'<table><thead><tr><th>p</th><th>q</th><th>p&and;q</th></tr></thead><tbody><tr><td>T' +
		'</td><td>T</td><td>T</td></tr><tr class="alt"><td>T</td><td>F</td><td>F</td>' +
		'</tr><tr><td>F</td><td>T</td><td>F</td></tr><tr class="alt"><td>F</td><td>F' +
		'</td><td>F</td></tr></tbody</table></div>',
		'Conjunction'),
	new Page('<p>Or has two different meanings in English, inclusive and exclusive. ' +
		'Exclusive or is more common, but inclusive or, in logic, happens ' +
		'to be the most useful. The statement <i>p</i> &or; <i>q</i>, is ' +
		'true if <i>p</i> is true, <i>q</i> is true, or both are true.</p>' +
		'<div class="tutorial-table"><table><thead><tr><th>p</th><th>q</th>' +
		'<th>p&or;q</th></tr></thead><tbody><tr><td>T</td><td>T</td><td>' +
		'T</td></tr><tr class="alt"><td>T</td><td>F</td><td>T</td></tr>' +
		'<tr><td>F</td><td>T</td><td>T</td></tr><tr class="alt"><td>F</td>' +
		'<td>F</td><td>F</td></tr></tbody></table></div>',
		'Inclusive Or'),
	new Page('<p>An implication is like saying "If <i>p</i> is true, then <i>q' +
		'</i> must also be true". So the implication is true if <i>p</i> ' +
		'is true and <i>q</i> is also true. Likewise, if <i>p</i> was true ' +
		'but <i>q</i> wasn\'t, the implication is false. If <i>p</i> is ' +
		'false, then we assume the implication is true (technically it isn\'t lying!)' +
		'</p><div class="tutorial-table"><table><thead><tr><th>p</th><th>q' +
		'</th><th>p&rarr;q</th></tr></thead><tbody><tr><td>T</td><td>T</td>' +
		'<td>T</td></tr><tr class="alt"><td>T</td><td>F</td><td>F</td></tr>' +
		'<tr><td>F</td><td>T</td><td>T</td></tr><tr class="alt"><td>F</td>' +
		'<td>F</td><td>T</td></tr></tbody></table></div>',
		'Implication'),
	new Page('<p>A negation, represented with &tilde;, is essentially taking the ' +
		'opposite of a statement. The &tilde; will always be beside the ' +
		'parenthesis of the statement it is negating. If <i>p</i> is true, ' +
		'then &tilde;<i>(p)</i> is false. Likewise if <i>p</i> is false, ' +
		'then &tilde;<i>(p)</i> is true.</p><div class="tutorial-table">' +
		'<table><thead><tr><th>p</th><th>&tilde;p</th></tr></thead><tbody>' +
		'<tr><td>T</td><td>F</td></tr><tr class="alt"><td>F</td><td>T</td>' +
		'</tr></tbody></table></div>',
		'Negation'),
	new Page('<p>In Proofer, you use rules of logic to jump from one set of ' +
		'known facts to another. Sometimes, as with the first few levels, ' +
		'the rule you employ is obvious. In others, not so much. The rules ' +
		'contain one or two premises, or statements that must be true for ' +
		'the argument to work, and offer a conclusion. You use a rule by ' +
		'finding two facts that work as premises for that rule</p>' +
		'<p>The rules are generic. Consider the following:<ul style="' +
		'list-style-type: none;"><li>p&rarr;q</li><li>p</li><li>therefore ' +
		'q</li></ul>Now assume that the following two facts are true:<ul ' +
		'style="list-style-type: none;"><li>(q&or;r)&rarr;&tilde;(s)</li>' +
		'<li>q&or;r</li></ul>Then &tilde;(s) must be true, since those ' +
		'facts fit the form.</p>',
		'Rules'),
	new Page('<p>The first rule you will learn is called Modus Ponens. It is ' +
		'an argument form everybody knows and uses, but probably didn\'t ' +
		'know it had a name. As a matter of fact, it was the argument form ' +
		'used to explain that rules are generic in the last page.  Let\'s ' +
		'recap.</p><h3>The form</h3><ul style="list-style-type: none;"><li>' +
		'p&rarr;q</li><li>p</li><li>therefore q</li></ul><p>In general, ' +
		'keep an out for some fact that you\'ve shown being the first part ' +
		'of an implication.</p>',
		'Modus Ponens'),
	// TODO location of objective needs to be confirmed
	// TODO either make tutorial accessible or make rule reminders
	new Page('<h3>What to do</h3><p>The statement you want to try to prove is in the top left ' +
		'corner of the screen. Use your new knowledge of statements and ' +
		'the Modus Ponens rule to complete this level.</p><p>If at any ' +
		'point you forget what a rule does, you\'re fucked because I ' +
		'haven\'t implemented a way for you to get in-game help yet.</p>' +
		'<h3>How to do it</h3><p>Use your mouse to drag the Rule onto the bottom slot, the ' +
		'first premise onto the left slot, and the second premise onto ' +
		'the right slot. Click the button to apply the rule, and click the ' +
		'result to collect it. If a result doesn\'t appear, you might have ' +
		'made a mistake.</p>',
		'Objective')
    ],
	    'How To Play'),
    MT_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p>Now that you\'ve mastered Modus Ponens, ' +
		'it\'s time to learn its counterpart - Modus Tollens. The form for ' +
		'Modus Tollens will be shown below:</p><h3>The form</h3><ul style=' +
		'"list-style-type: none;"><li>p&rarr;q</li><li>&tilde;(q)</li>' +
		'<li>therefore &tilde;(p)</li></ul><h3>Summary</h3><p>Remember, for ' +
		'this rule, you\'re looking for a negation of the second part of an ' +
		'implication. Even though it returns a negation, sometimes those are ' +
		'handy, as you will soon find out once you learn a few more rules.</p>',
		'Modus Tollens')
    ],
	    'New Rule'),
    DS_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p>The next rule to add to your toolbelt is ' +
		'called Disjunctive Syllogism. This one lets you do something with ' +
		'those inclusive-or statements under the right conditions. The form ' +
		'for the rule is given below:</p><h3>The form</h3><ul style=' +
		'"list-style-type: none;"><li>p&or;q</li><li>&tilde;(p)</li>' +
		'<li>therefore q</li></ul><h3>Summary</h3><p>If the second part of ' +
		'an inclusive-or looks like something you could use, look around ' +
		'for a negation of the first part. Sometimes it\'s helpful to ' +
		'go ahead and apply a rule, even if you don\'t know what to do with ' +
		'the result just yet. You might not get as good of a score, but ' +
		'you\'ll find the solution a lot faster.</p>',
		'Disjunctive Syllogism')
    ],
	    'New Rule'),
    HS_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p>Hypothetical Syllogism is all about ' +
		'implications. When you see the form, you might recognize the ' +
		'rule from mathematics. It is simply the logical form of the ' +
		'transitive property of equality. Simply put, if a implies b and ' +
		'b implies c, then a implies c.</p><h3>The form</h3><ul style=' +
		'"list-style-type: none;"><li>p&rarr;q</li><li>q&rarr;r</li>' +
		'<li>therefore p&rarr;r</li></ul><h3>Summary</h3><p>With the ' +
		'rules you know right now, HS is little more than an alternative ' +
		'to chaining MP or MT. Once you\'ve mastered more tutorial stages ' +
		'and learned more rules of logic, you may find this rule to be much ' +
		'more useful.</p>',
		'Hypothetical Syllogism')
    ],
	    'New Rule'),
    CD_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p>Constructive dilemma is a complex rule. ' +
		'It says if you have a conunction (and) of two implications, and ' +
		'you know at least one of the first parts of the implications is ' +
		'true, then you know one of the second parts must be true as well. ' +
		'Check out the form.</p><h3>The form</h3><ul style="list-style-type:' +
		' none;"><li>(p&rarr;q)&and;(r&rarr;s)</li><li>p&or;r</li>' +
		'<li>therefore q&or;s</li></ul><h3>Summary</h3><p>This can be ' +
		'a tricky one to find a use for. After the tutorials, you may find ' +
		'this more useful.</p>',
		'')
    ],
	    'New Rule'),
    Conj_Simp_INTRO: new Tutorial([
	new Page(
		'<h3>The first new rule</h3><p>This time, we\'re going to learn ' +
		'two new rules at once. The first rule is conjunction. Take any ' +
		'two facts and make yourself an "AND" sandwhich.</p><h3>The form' +
		'</h3><ul style="list-style-type: none;"><li>p</li><li>q</li><li>' +
		'therefore p&and;q</li></ul><h3>Summary</h3><p>Not much to it. ' +
		'Unlike the other rules, this rule can <u>always</u> be applied ' +
		'given any parameters.. However it is only useful if it helps you ' +
		'get to your conclusion, so keep that in mind.</p>',
		'Conjunction'),
	new Page(
		'<h3>The second new rule</h3><p>The next rule is just the opposite. ' +
		'Previously you used two statements to make a conjunction, while ' +
		'here you take a conjunction and get the first statement. This is ' +
		'the first rule that only takes one statement as a parameter.</p>' +
		'<h3>The form</h3><ul style="list-style-type: none;"><li>p&and;q' +
		'</li><li>therefore p</li></ul><h3>Summary</h3><p>You might think, ' +
		'a conjunction is true when both parts are true, so why am I only ' +
		'getting the first part? The short answer is it makes for a simpler ' +
		'rule. Once you get to the second series of tutorials, you will learn ' +
		'about rules of replacement, which will allow you to get that second ' +
		'part of a conjunction. For now, this is a limitation you must ' +
		'strategize around.</p>',
		'Simplification')
    ],
	    'New Rule'),
    Abs_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p>The next rule, Absorption, is a statement ' +
		'of the obvious. If you know that <i>p</i> gives you <i>q</i>, then ' +
		'<i>p</i> also gives you <i>p</i> AND <i>q</i>.</p><h3>The form</h3>' +
		'<ul style="list-style-type: none;"><li>p&rarr;q</li><li>therefore ' +
		'p&rarr;(p&and;q)</li></ul><h3>Summary</h3><p>Absorption is a unique ' +
		'rule in that it can be applied in the reverse order. Have a fact that ' +
		'looks like the conclusion? Apply the rule and you get a statement that ' +
		'looks like the premise. Keep that in mind.</p>',
		'Absorption')
    ],
	    'New Rule'),
    Add_INTRO: new Tutorial([
	new Page(
		'<h3>The new rule</h3><p></p><h3>The form</h3><ul style="list-style-type: none;"><li>(((p&rarr;q))&and;((r&rarr;s)))</li><li>(p&or;r)</li><li>therefore (q&or;s)</li></ul><h3>Summary</h3><p></p>',
		'')
    ],
	    'New Rule')
};