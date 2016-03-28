'use strict';

/**
 * @constructor
 */
tt.TweetThing = function() {
    // DOM elements
    this.$searchInput = $('#search-input');
    this.searchQuery = '';
    this.$searchSpinner = $('#search-spinner');
    this.$tweetsSpinner = $('#tweet-spinner');

    // data storage
    this.results = [];
    this.tweets = [];
    this.selectedUser = {};

    // state
    this.sortedByRetweets = false;

    this.apiBase = 'http://digitrash.com/tweet-thing/';

    this.ractive = new Ractive({
        // The `el` option can be a node, an ID, or a CSS selector.
        el: '#template-area',
        template: '#content',
        data: {
            searchResults: this.results,
            user: this.selectedUser,
            tweets: [],
            showPhotos: true
        }
    });

    // Wait half-second after last keyup event
    this.debouncedSearchInput = _.debounce( this.onSearchInput.bind(this), 500, false );

    this.resetSearch();

    this.listeners();
};

tt.TweetThing.prototype.listeners = function() {
    this.$searchInput.on('keyup', this.debouncedSearchInput.bind(this));
    this.ractive.on('selectUser', this.onResultSelect.bind(this));
    this.ractive.on('sortByRetweets', this.sortByRetweets.bind(this));
    this.ractive.on('togglePhotos', this.togglePhotos.bind(this));
};

tt.TweetThing.prototype.onSearchInput = function() {
    if ((this.$searchInput.val() && this.$searchInput.val().length) && (this.$searchInput.val() != this.searchQuery)) {
        this.$searchSpinner.show();
        $('#search-results').hide();
        this.searchQuery = this.$searchInput.val();
        $.ajax(this.apiBase+"/user-search.php?q="+this.searchQuery)
            .done(function(data) {
                this.results = data;
                this.$searchSpinner.hide();
                $('#search-results').show();
                if (this.results.length) {
                    $('#empty-results').hide();
                    var liteResults = this.results.map(function(obj){
                       return {
                           'name': obj['name'],
                           'screen_name': obj['screen_name'],
                           'id': obj['id']
                       };
                    });
                    this.ractive.set('searchResults', liteResults);
                } else {
                    this.ractive.set('searchResults', []);
                    $('#empty-results').show();
                }
            }.bind(this))
            .fail(function() {
                alert( "error" );
            });
    }
};


tt.TweetThing.prototype.resetSearch = function() {
    this.ractive.set('searchResults', []);
    $('#search-results').hide();
    this.$searchInput.val('');
    this.searchQuery = '';
};

/**
 * @param {Object} e
 */
tt.TweetThing.prototype.onResultSelect = function(e) {
    var index = e.index.num;
    if (index < this.results.length) {
        this.selectedUser = this.results[index];
        this.showUserSummary();
        this.resetSearch();
    }
};

tt.TweetThing.prototype.showUserSummary = function() {
    this.ractive.set('user', this.selectedUser);
    this.ractive.set('tweets', []);
    $('#user-profile').show();
    this.getUserTweets();
};

tt.TweetThing.prototype.getUserTweets = function() {
    if (this.selectedUser) {
        this.$tweetsSpinner.show();
        $.ajax(this.apiBase+"/tweets.php?id="+this.selectedUser.id)
            .done(function(data) {
                this.tweets = data;
                this.$tweetsSpinner.hide();
                if (this.tweets.length) {
                    $('#user-tweets').show();
                    this.ractive.set('tweets', this.tweets);
                } else {
                    this.ractive.set('tweets', []);
                    $('#user-tweets').hide();
                }
            }.bind(this))
            .fail(function() {
                alert( "error" );
            });
    }
};

tt.TweetThing.prototype.sortByRetweets = function() {
    if (this.tweets && !this.sortedByRetweets) {
        this.tweets.sort(function(a,b) {
            return b.retweet_count - a.retweet_count;
        });
        this.sortedByRetweets = true;
        $('#retweet-filter').addClass('on');
        this.ractive.set('tweets', this.tweets);
    } else if (this.tweets && this.sortedByRetweets) {
        this.sortedByRetweets = false;
        $('#retweet-filter').removeClass('on');
        this.tweets.sort(function(a,b) {
            return a.index - b.index;
        });
    }
};

tt.TweetThing.prototype.togglePhotos = function() {
    if (this.tweets && !this.ractive.get('showPhotos')) {
        this.ractive.set('showPhotos', true);
        $('#photo-filter').addClass('on');
    } else if (this.tweets && this.ractive.get('showPhotos')) {
        $('#photo-filter').removeClass('on');
        this.ractive.set('showPhotos', false);
    }
};
