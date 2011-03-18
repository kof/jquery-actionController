/*
 * jQuery actionController 0.0.4
 * 
 * @author Oleg Slobodskoi
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Depends:
 *  jquery.js
 *  
 */
(function( $, document, undefined ) {

var plugin = "actionController",
    doc = $(document),
    events = {},
    slice = Array.prototype.slice;

var defaults = {
        controller: undefined,
        events: "click",
        context: "element", // object || "element"
        actionAttr: "data-action",
        paramsAttr: "data-params",
        actionPrefix: "",
        defaultAction: "action",
        disabled: false     
    };
    
function eventsDelegator( event ) {

    var element = $(this),
        controllerElement = element.closest( ":data(" + plugin + ")" );
        
    if ( !controllerElement.length ) {
        return;
    }   
    
    var args = arguments,
        o = controllerElement.data( plugin ).options;
    
    if ( o.disabled ) {
        return;
    }    
        
    var params = element.attr( o.paramsAttr ),
        // click -> Click
        actionSuffix = event.type.substr( 0, 1 ).toUpperCase() + event.type.substr( 1 ),
        handler = o.controller[o.actionPrefix + $.trim( element.attr(o.actionAttr) ) + actionSuffix],
        defaultHandler = o.controller[o.actionPrefix + o.defaultAction + actionSuffix],
        context = o.context ? (o.context === 'element' ? element[0] :  o.context) : o.controller;
        
    if ( params ) {
        // convert params to array and trim whitespaces
        params = $.map( params.split( ',' ), function( param, i ) { 
            return $.trim(param); 
        });
        
        // convert arguments to true array and add params array
        params = slice.call(args, 0).concat( params );        
    } else {
        params = args;
    }   

    if ( typeof defaultHandler === 'function' && defaultHandler.apply( context, params ) === false ) {
        return false;
    }
    
    if ( typeof handler === 'function' ) {
        return handler.apply( context, params );
    }     
}


$.fn[plugin] = function( method, options ) {
    
    if ( typeof method === "object" ) {
        options = method;
        method =  null;
    }
    
    var ret;
    
    this.each( function() {
        
        var inst = $.data( this, plugin ) || $.data( this, plugin, new $[plugin]( this, options ) );        
        
        if ( method ) {
            ret = inst[method]( options );                
        }
    });
    
    return ret || this; 
};

$[plugin] = function( element, options ) {

    var o = $.extend( {}, $[plugin].defaults, options ),
        types = "";
    
    this.element = $(element);
    this.options = o;
    
    $.each( o.events.split(" "), function( i, type ) {
        if ( events[type] && events[type] > 0 ) {
            events[type]++;
        } else {
            events[type] = 1;
            types += type + " ";
        }
    });
    
    types && doc.delegate( "[" + o.actionAttr + "]", types, eventsDelegator );
};

$[plugin].defaults = defaults;

$[plugin].prototype = {
    
    destroy: function() {
        
        var o = this.options;

        $.each( o.events.split(" "), function( i, type ) {
            if ( events[type] > 1 ) {
                events[type]--;
            // undelegate the event if nobody needs it
            } else {
                doc.undelegate( "[" + o.actionAttr + "]", type, eventsDelegator );    
            }            
        });
        
        this.element.removeData( plugin );
    },
    
    enable: function() {
        this.options.disabled = false;    
    },
    
    disable: function() {
        this.options.disabled = true;    
    }    
};

$.expr[ ":" ].data = function( elem, i, match ) {
	return !!$.data( elem, match[ 3 ] );
};

})( jQuery, window.document );