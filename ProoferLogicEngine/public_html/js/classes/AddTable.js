define(['jquery', 'cloud', 'Fact', 'events'], function($, cloud, Fact, events) {
    return {
        AT1: null,
        AT2: null,
        AT3: null,
        AT4: null,
        AT5: null,
        /**
         * Add fact to the table and move everything down.
         * 
         * @param {Fact} fact The Fact to add
         * @param {Function} callback Code to execute after fact has been added
         * @returns {undefined}
         */
        addEntry: function(fact, callback) {
            // Update Fact Table
            this.AT5 = this.AT4;
            this.AT4 = this.AT3;
            this.AT3 = this.AT2;
            this.AT2 = this.AT1;
            this.AT1 = fact;

            // Update the save data
            cloud.getData("addTable", function(data) {
                // AT5
                data.AT5 = data.AT4;

                // AT4
                data.AT4 = data.AT3;

                // AT3
                data.AT3 = data.AT2;

                // AT2
                data.AT2 = data.AT1;

                // AT1
                data.AT1 = fact.toParsableString();

                // Save
                cloud.saveData("addTable", data);
            });

            // Additional changes
            callback();

        },
        loadData: function() {
            var AddTable = this;
            cloud.getData("addTable", function(data) {
                if (data !== undefined) {
                    // AT1
                    if (data.AT1 !== undefined) {
                        AddTable.AT1 = Fact.getFactFromString(data.AT1);
                    }

                    // AT2
                    if (data.AT2 !== undefined) {
                        AddTable.AT2 = Fact.getFactFromString(data.AT2);
                    }

                    // AT3
                    if (data.AT3 !== undefined) {
                        AddTable.AT3 = Fact.getFactFromString(data.AT3);
                    }

                    // AT4
                    if (data.AT4 !== undefined) {
                        AddTable.AT4 = Fact.getFactFromString(data.AT4);
                    }

                    // AT5
                    if (data.AT5 !== undefined) {
                        AddTable.AT5 = Fact.getFactFromString(data.AT5);
                    }

                    // Update
                    AddTable.updateHtml();
                }
            });
        },
        updateHtml: function() {
            // AT1
            var at1 = $('#Controls_AddTable_Fact1');
            at1.empty();
            at1.append('<td>AT1</td>');
            if (this.AT1 !== null) {
                at1.append('<td><div class="select-fact">' + this.AT1.toPrettyString() + '</div></td>');
                at1.append('<td style="text-align: right;"><div class="edit-fact" data="AT1">..</div></td>');
            } else {
                at1.append('<td colspan="2"></td>');
            }

            // AT2
            var at2 = $('#Controls_AddTable_Fact2');
            at2.empty();
            at2.append('<td>AT2</td>');
            if (this.AT2 !== null) {
                at2.append('<td><div class="select-fact">' + this.AT2.toPrettyString() + '</div></td>');
                at2.append('<td style="text-align: right;"><div class="edit-fact" data="AT2">..</div></td>');
            } else {
                at2.append('<td colspan="2"></td>');
            }

            // AT3
            var at3 = $('#Controls_AddTable_Fact3');
            at3.empty();
            at3.append('<td>AT3</td>');
            if (this.AT3 !== null) {
                at3.append('<td><div class="select-fact">' + this.AT3.toPrettyString() + '</div></td>');
                at3.append('<td style="text-align: right;"><div class="edit-fact" data="AT3">..</div></td>');
            } else {
                at3.append('<td colspan="2"></td>');
            }

            // AT4
            var at4 = $('#Controls_AddTable_Fact4');
            at4.empty();
            at4.append('<td>AT4</td>');
            if (this.AT4 !== null) {
                at4.append('<td><div class="select-fact">' + this.AT4.toPrettyString() + '</div></td>');
                at4.append('<td style="text-align: right;"><div class="edit-fact" data="AT4">..</div></td>');
            } else {
                at4.append('<td colspan="2"></td>');
            }

            // AT5
            var at5 = $('#Controls_AddTable_Fact5');
            at5.empty();
            at5.append('<td>AT5</td>');
            if (this.AT5 !== null) {
                at5.append('<td><div class="select-fact">' + this.AT5.toPrettyString() + '</div></td>');
                at5.append('<td style="text-align: right;"><div class="edit-fact" data="AT5">..</div></td>');
            } else {
                at5.append('<td colspan="2"></td>');
            }

            // Update events
            events.updateAddTableEvents();
        }
    };
});