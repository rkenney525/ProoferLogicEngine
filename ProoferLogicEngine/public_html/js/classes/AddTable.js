var AddTable = {
    AT1: null,
    AT2: null,
    AT3: null,
    AT4: null,
    AT5: null,
    loadData: function() {

    },
    updateHtml: function() {
        // AT1
        var at1 = $('#Controls_AddTable_Fact1');
        at1.clear();
        at1.append('<td>AT1</td>');
        if (this.AT1 !== null) {
            at1.append('<td><div class="select-fact">' + this.AT1.toPrettyString() + '</div></td>');
            at1.append('<td><div class="edit-fact">..</div></td>');
        } else {
            at1.append('<td colspan="2"><div class="add-fact">+</div></td>');
        }
        
        // AT2
        var at2 = $('#Controls_AddTable_Fact2');
        at2.clear();
        at2.append('<td>AT2</td>');
        if (this.AT2 !== null) {
            at2.append('<td><div class="select-fact">' + this.AT2.toPrettyString() + '</div></td>');
            at2.append('<td><div class="edit-fact">..</div></td>');
        } else {
            at2.append('<td colspan="2"><div class="add-fact">+</div></td>');
        }
        
        // AT3
        var at3 = $('#Controls_AddTable_Fact3');
        at3.clear();
        at3.append('<td>AT3</td>');
        if (this.AT3 !== null) {
            at3.append('<td><div class="select-fact">' + this.AT3.toPrettyString() + '</div></td>');
            at3.append('<td><div class="edit-fact">..</div></td>');
        } else {
            at3.append('<td colspan="3"><div class="add-fact">+</div></td>');
        }
        
        // AT4
        var at4 = $('#Controls_AddTable_Fact4');
        at4.clear();
        at4.append('<td>AT4</td>');
        if (this.AT4 !== null) {
            at4.append('<td><div class="select-fact">' + this.AT4.toPrettyString() + '</div></td>');
            at4.append('<td><div class="edit-fact">..</div></td>');
        } else {
            at4.append('<td colspan="4"><div class="add-fact">+</div></td>');
        }
        
        // AT5
        var at5 = $('#Controls_AddTable_Fact5');
        at5.clear();
        at5.append('<td>AT5</td>');
        if (this.AT5 !== null) {
            at5.append('<td><div class="select-fact">' + this.AT5.toPrettyString() + '</div></td>');
            at5.append('<td><div class="edit-fact">..</div></td>');
        } else {
            at5.append('<td colspan="5"><div class="add-fact">+</div></td>');
        }
        
        // Update events
        updateAddTableEvents();
    }
};