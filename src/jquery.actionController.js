/*
 * actionController - Plugin for jQuery
 * 
 * @depends: 
 *     jquery.js
 *     jquery.historyManager.js (optional)
 * @version 1.4
 * @license Dual licensed under the MIT and GPL licenses.
 * @author  Oleg Slobodskoi aka Kof
 * @website http://jsui.de
 */

(function($, slice){

$.fn.actionController = function( controller, options ) {
    return this.each(function(){
        var instance = $.data(this, 'actionController') || $.data(this, 'actionController', new actionController($(this), controller, options));
        // its a method call 
        typeof controller == 'string' && instance[controller](options);
    });
};

$.fn.actionController.defaults = {
    actionPrefix: '_',
    actionAttr: 'data-action',
    paramsAttr: 'data-params',
    historyAttr: 'data-history',
    defaultAction: 'action',
    events: 'click',
    history: false,
    context: 'element' // controller || element
};

function actionController( $container, controller, options ) {
    this.enabled = true;    
    this.$container = $container;
    this.controller = controller;
    var s = this.settings = $.extend({}, $.fn.actionController.defaults, options);
    s.history && $.fn.historyManager && $container.historyManager();        
    $('[' + s.actionAttr + ']', $container).live(s.events, $.proxy( this, 'handler'));    
}

actionController.prototype = {
    destroy: function() {
        $('[' + this.settings.actionAttr + ']', this.$container).die(this.events, this.handler);
        this.$container.removeData('actionController');    
    },
    
    disable: function() {
        this.enabled = false;    
    },
    
    enable: function() {
        this.enabled = true;    
    },
    
    handler: function( e ) {
        if ( !this.enabled ) return;
        var s = this.settings,
            $target = $(e.currentTarget),
            args = arguments,
            params = $target.attr(s.paramsAttr),
            actionSuffix = e.type.substr(0,1).toUpperCase() + e.type.substr(1),
            action = this.controller[s.actionPrefix + $.trim($target.attr(s.actionAttr)) + actionSuffix],
            defaultAction = this.controller[s.actionPrefix + s.defaultAction + actionSuffix],
            context = s.context == 'controller' ? this.controller : $target[0];
        
        if ( params ) {
            params = $.map(params.split(','), function(param, i){ 
                return $.trim(param); 
            });
            args = slice.call(args, 0).concat( params );        
        }
        
                    
        if ( $.isFunction(defaultAction) && defaultAction.apply(context, args) === false ) {
            return false;
        }
    
        if ( $.isFunction(action) ) {
            if ( s.history ) {
                var historyMethod = $.trim($target.attr(s.historyAttr));
                if (!e.historyHandled && historyMethod) {
                    $target.historyManager(historyMethod , function historyHandler(){
                        action.apply(context, args);        
                    });
                    return false;
                } 
            }
            return action.apply(context, args);        
        }      
    }    
};

})(jQuery, Array.prototype.slice);