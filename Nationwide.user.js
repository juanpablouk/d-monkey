// ==UserScript==
// @name           Nationwide
// @description    Replace Movie Ticket based on https://singularity.jira.com/wiki/display/SALESENG/How+to+Instrument+and+Configure+Dynamics+CRM
// @include        /^https?://.*appdynamics\.com/.*$/
// @copyright      JoeSimmons, Severin Neumann
// @version        0.1.0
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// ==/UserScript==
(function () {
    'use strict';

    /*
        NOTE:
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */
     var words = {
        // Syntax: 'Search word' : 'Replace word',

         // Application Name
        'Movie Tickets Online' : 'Nationwide Mortgages - MSO',
        'ECommerce' : 'NEM',
        'NEM-Fulfillment' : 'Downstream Application',

        // Tiers & Nodes on the flowmap:
         'Web-Tier-Services' : 'IBM HTTP Server',
         'NEM-Services' : 'WebSphere App Services',
         'Inventory-Services' : 'Banking-Services',
         'api.shipping.com' : ' IIB',
         'APPDY-MySQL-DB-...ubuntu0.16.04.2' : 'DB2',
         'XE-Oracle DB-or...4bit Production' : 'DB2',
         'INVENTORY-MySQL...ubuntu0.16.04.2' : 'DB2',
         'XE-Oracle-ORACL...4bit Production' : 'DB2',
        'frontEnd' : 'Frontend',
        '127.0.0.1:6379 - REDIS' : 'Cache',
        'winedb - MONGODB' : 'Frontend Database',
        'MovieSearchSite' : 'IIS Web site',
        'CoreServices' : 'Products Service',
        'PaymentsWS' : 'Mortgage Service',
        'ConfirmationSyncService' : 'Account Service',
        'MovieProcessingRole' : 'Backoffice',
        'api.partner.imdb.com' : 'http://www.nationwide.co.uk/',
        'sql.objectsearch...p-MovieDatabase' :  'Oracle',
        'sql.objectsearch...p-EntLibLogging' : 'SQL Server',
        'movieconfirmationqueue' :  'Message Queue 1',
        'moviepurchasequeue' :  'Message Queue 2',
        'secure.payments.visa.com-80' :  'Experian',
        'SharePoint Search' : 'SharePoint',

        // Business Transactions
         'Fetch Catalog' : 'Payment',
         'Add to Cart' : 'Transfer',
         'Shipping Address' : 'Balance',
         'Confirm Order' : 'Login',
         'Oder.update' : 'Update Details',
        '/login.aspx' : 'login',
        '/logout.aspx' : 'logout',
        '/Movie' : 'accept-mortgage_LR',
        '/api/search' : 'get-mortgages',
        '/Movie/Search' : 'search',
        '/api/details' : 'add-mortgage_LR',
        '/api/reviews' : 'contact-and-information',
        '/Cart/Checkout' : 'accept-mortgage',
        '/Cart/Add' : 'add-mortgage',

        // Snapshot
        'sql.objectsearch.corp-MovieDatabase' : 'SQL Server',
        'moviesearch' : 'objectsearch',
        'moviesearch.com/IMovieService' : 'nationwide.co.uk/ObjectDetail',
        'MovieSearch' : 'ObjectSearch',
        '.MovieService' : '.SearchService',
        'spMovieSearch': 'spObjectSearch',
        'Cart' : 'Cart',
        'cart' : 'cart',
        'PaymentService' : 'CommitService',
        'IPaymentService': 'ICommitService',

        // Database Monitoring
        'MovieTicketsOnline' : 'MS CRM DB',
        'sql.moviesearch.corp': 'sql.mscrm2015.corp',
        'PurchaseID' : 'MortgageTypeID',
        'Purchases' : 'Purchases',
        'MovieID' : 'MortgageID',

        // RUM Monitoring
        'movietix1.demo.appdynamics.com' : 'http://www.nationwide.co.uk',
        '/movie' : '/contact-and-information',
        '/movie/reviews' : '/careers',

         //Dashboard
         "ACTIVE USER SESSIONS" : "Number of users",
         "USER CONVERSION" : "Error",
         "REVENUE BY VERSION" : "Number of transactions",
         "Receive Offer" : "Check Balance",
         "Convert Offer" : "Transfer Funds",
        
         //ANALYTICS
        'cartTotal (Sum)' : 'Mortgage Total £',
        'Checkout' : 'NEM Mortgage Application',
        'Business Transaction (Count)' : 'Successful Applications',
        'Top Items by  Customer Segment' : 'Top Mortgages by Customer Segment',
        'topItem' : 'Top Mortgages',
        'Sacred Hoops' : 'Fixed 2 Years',
        'A Clockwork Orange' : 'Fixed 3 Years',
        'Unbroken' : 'Fixed 5 Years',
        'The Goldfinch: A Novel' : 'Tracker 2 Years',
        'Shantaram' : 'Tracker 3 Years',
        'Farewell To Arms' : 'Tracker 5 Years',
        'The Tourist' : 'Fixed 10 Years',
        'The Fist Of God' : 'Tracker 10 Years',
        'The Lost City Of Z' : 'HTB Fixed 2 Years',
        'Freakonomics' : 'HTB Tracker 2 Years',
        'The Godfather' : 'HTB Fixed 3 Years',
        'Driven From Within' : 'HTB Tracker 3 Years',
        'Personal' : 'HTB Fixed 5 Years',
        'customerType' : 'Mortgage Type',
        'SILVER' : 'First Time Mortgage',
        'PLATINUM' : 'Remortgage',
        'DIAMOND' : 'Moving Home',
        'BRONZE' : 'SMB',
        'GOLD' : 'Corporate',
        'Customer Segments By City' : 'Customer Segment by City',
        'customerCity' : 'City',
        'San Francisco' : 'Manchester',
        'Seattle' : 'Bristol',
        'New York' : 'Leeds',
        'Redwood City' : 'Southampton',
        'Sunnyvale' : 'Exeter',
        'Paris' : 'Newcastle',
        'Bangalore' : 'Glasgow',
        'Palo Alto' : 'Swindon',
        'New England' : 'Hatfield',
        'Honolulu' : 'Watford',
        'Cupertino' : 'Reigate',
        'Cleveland' : 'Newport',
        'Hatfield' : 'Swansea',
        'Mountain View' : 'Liverpool',
        'Revenue by Items' : 'Revenue by Mortgage Type',
       

    ///////////////////////////////////////////////////////
    '':''};

    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this

    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON',
                         'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g,
                              '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
    // I put an extra empty key/value pair in the object.
    // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g,
                                                          function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    setInterval(function() {
        texts = document.evaluate('//body//text()[ normalize-space(.) != ""]', document, null, 6, null);
        for (i = 0; (text = texts.snapshotItem(i)) !== null; i += 1) {
            if ( isTagOk(text.parentNode.tagName) ) {
                regexs.forEach(function (value, index) {
                    text.data = text.data.replace( value, replacements[index] );
                });
            }
        }
        regexs.forEach(function (value, index) {
            document.title = document.title.replace( value,
                                                    replacements[index] );
        });
    }, 100);

}());