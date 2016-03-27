'use strict';

/**
 * @constructor
 */
tt.TweetThing = function() {
    this.$searchInput = $('#search-input');
    this.searchQuery = '';
    this.$resultsDiv = $('#search-results');
    this.results = [];
    this.apiBase = 'http://digitrash.com/tweet-thing/';

    this.ractive = new Ractive({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#search-results',
        template: '#content',
        // Here, we're passing in some initial data
        data: {
            searchResults: this.results
        }
    });

    this.listeners();
};

tt.TweetThing.prototype.listeners = function() {
    this.$searchInput.on('change', this.onSearchInput.bind(this))
};

tt.TweetThing.prototype.onSearchInput = function() {
    if ((this.$searchInput.val() && this.$searchInput.val().length) && (this.$searchInput.val() != this.searchQuery)) {
        this.searchQuery = this.$searchInput.val();
        $.ajax(this.apiBase+"/user-search.php?q="+this.searchQuery)
            .done(function(data) {
                this.results = data;
                console.log("results =============>", this.results);
                if (this.results.length) {
                    this.ractive.set('searchResults', this.results);
                }
            }.bind(this))
            .fail(function() {
                alert( "error" );
            });
    }
};