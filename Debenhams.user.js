// ==UserScript==
// @name           Debenhams
// @description    Replaces text in AppDynamics Demo Applications.
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

        //Channels:
         'SILVER' : 'STORE',
         'PLATINUM' : 'WEB',
         'GOLD' : 'AMAZON',
         'BRONZE' : 'EBAY',
         'DIAMOND' : 'MANUAL',
         'customerType' : '',

        // Tiers & Nodes on the flowmap:
        'INVENTORY-MySQL' : 'Customers-',
        'APPDY-MySQL' : 'Accounts-MySQL',
        'ECommerce-Services' : 'Yantra',
        'ECommerce-Fulfillment' : 'Greenford DR',
        'fulfillmentQueue' : 'paymentMethodQueue',
        'OrderQueue' : 'paymentInputQueue',
        'Order-Processing-Services' : 'Payment-Processing-Services',
        'Inventory-Services' : 'Shipments',
        'ECommerce' : 'Debenhams',
        'api.mainsupplier.com' : 'Click and Collect',
        'api.secondarysupplier.com': 'DHL',
        'api.shipping.com': 'Royal Mail',
        'Fulfillment-Services': 'Payment_Processor',
        'Amazon-SQS': 'Gateway',
        'XE-Oracle DB-': '',
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
