(function($) {

$.fn.collapser = function(options) {

    if (typeof options === "string") {
        options = { selector: options };
    }

    var defaults = {
        selector: null,
        initialopen: false,
        onlychildrens: true,
        openIcon: "arrow-left-mini.png",
        closeIcon: "arrow-down-mini.png"
    };
    options = $.extend(defaults, options);

    var close = function(img, elems) {
        img.attr({src: options.openIcon,
                  alt: "\u21D2"})
        elems.hide();
    }
    var open = function(img, elems) {
        img.attr({src: options.closeIcon,
                  alt: "\u21D3"})
        elems.show();
    }

    this.each(function() {
        var elem = $(this);
        var target;
        if (options.onlychildrens) {
            target = elem.children(options.selector);
        } else {
            target = elem.find(options.selector);
        }
        if (!target.length) {
            return;
        }

        var img = $('<img tabindex="0">');
        img.css({"margin-right": "4px", "vertical-align": "middle"});

        img.bind('mousedown ', function(evt) {
            if (evt.preventDefault) {
                // otherwise, it selects some text, and a popup is show in opera
                evt.preventDefault();
            }
        });

        img.bind('click keypress', (function() {
            var elems = target;
            return (function(evt) {
                if (evt.type === 'keypress' && evt.keyCode !== 13) {
                    return;
                }
                if (evt.type === 'click' && evt.button !== 0) {
                    return;
                }
                if (elems.is(":visible")) {
                    close($(this), elems);
                } else {
                    open($(this), elems);
                }
            });
        }()));

        if (options.initialopen) {
            open(img, target);
        } else {
            close(img, target);
        }
        elem.children(":first-child").prepend(img)
    });
    return this;
};
})(jQuery);
