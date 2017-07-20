$(function() {
    $(document).on("click", ".checkbox", function() {
        $input = $(this).find("input");

        if ($input &&!$input.is(":disabled") && !$input[0].readOnly)
            $input.prop("checked", !$input.prop("checked")).change();
        return false;

    });
    $(".checkbox input").on("change", function() {
        var $par = $(this).parents(".checkbox");
        if ($(this).is(":disabled")) {
            $par.addClass("disabled");
        } else {
            $par.removeClass("disabled");
        }
        if (this.readOnly) {
            $par.addClass("readonly");
        } else {
            $par.removeClass("readonly");
        }
        if ($(this).is(":checked"))
            $par.addClass("checked");
        else
            $par.removeClass("checked");
    });
    $(".checkbox").each(function() {

        if ($(this).find("input").is(":disabled")) {
            $(this).addClass("disabled");
        } else {
            $(this).removeClass("disabled");
        }
        if ($(this).find("input").is(":checked"))
            $(this).addClass("checked");
        else
            $(this).removeClass("checked");
    });
    //tag pseudo input
    $(document).on("blur", ".pseudo-input", function() {

        var text = $(this).text().trim();
        var placeholder = $(this).attr("placeholder") || "";
        placeholder.trim();
        if (text == "" || text == placeholder) {
            $(this).addClass("placeholder");
            $(this).parent().find("input").first().val("");
            $(this).text(placeholder);
        } else {
            $(this).removeClass("placeholder");
            $(this).parent().find("input").first().val(text);
        }

    });
    $(document).on("focus", ".pseudo-input", function() {
        var text = $(this).text().trim();
        var placeholder = $(this).attr("placeholder") || "";
        placeholder.trim();
        if (text === placeholder) {
            $(this).text("");
        }
        $(this).removeClass("placeholder");
    });
    $(".select[placeholder]").each(function() {
        var text = $(this).find("select")[0].selectedIndex;
        if (text === 0) {
            $(this).addClass("placeholder");
        }
    });
    $(document).on("blur", ".select[placeholder]", function() {
        if (!$(this).find("select")[0].selectedIndex) {
            $(this).addClass("placeholder");
        }

    }).on("focus", ".select[placeholder]", function() {
        $(this).removeClass("placeholder");
    });
    if (browerVersion.ie() <= 9) {
        $("input[placeholder]").each(function() {
            var text = $(this).val().trim();
            var placeholder = $(this).attr("placeholder") || "";
            placeholder.trim();
            if (!text || text === placeholder) {
                $(this).val(placeholder).addClass("placeholder");
            }
        });

        $(document).on("blur", "input[placeholder]", function() {
            var text = $(this).val().trim();
            var placeholder = $(this).attr("placeholder") || "";
            placeholder.trim();
            if (text === '') {
                $(this).val(placeholder).addClass("placeholder");
            }

        }).on("focus", "input[placeholder]", function() {
            var text = $(this).val().trim();
            var placeholder = $(this).attr("placeholder") || "";
            placeholder.trim();
            if (text === placeholder) {
                $(this).val("");
            }
            $(this).removeClass("placeholder");

        })
    }
    // $(".input-num input").each(function(){

    // }); 
    $(document).on("click", ".num-up", function() {
        if ($(this).hasClass("disabled")) return;
        $input = $(this).parents(".input-num").find("input");
        var max = parseInt($input.attr("max")) || null;
        var step = parseInt($input.attr("step")) || 1;
        var value = parseInt($input.val());
        if (max && value + step > max) {
            $(this).addClass("disabled");
        } else $input.val(value + step);

    }).on("click", ".num-down", function() {
        if ($(this).hasClass("disabled")) return;
        $input = $(this).parents(".input-num").find("input");
        var min = parseInt($input.attr("min")) || null;
        var step = parseInt($input.attr("step")) || 1;
        var value = parseInt($input.val());
        if (min && value - step < min) {
            $(this).addClass("disabled");
        } else $input.val(value - step);

    });
    $(document).on("keyup", ".input-num input", function() {
        $(this).val($(this).val().replace(/\D/g, ""));

    });


    //table checkbox 全选
    $(document).on("click", ".cb-all ", function() {
        $cb = $(this).find("input:checkbox");
        var flag = $cb.is(":checked");
        var _tal = $(this).parents("table").first();
        var tableId = $(this).parents(".thead").attr("for");
        var tableId2 = $(this).parents(".t-head-fixed ").attr("for");
        // _tal= _tal!= $(tableId) && $(tableId)? $(tableId) : _tal;
        _tal = tableId2 ? tableId2 : (tableId ? tableId : _tal);
        $(_tal).find(".cb-tr").each(function() {
            var $cb = $(this).children('input:checkbox');
            if (!$cb.is(":disabled")) {
                if (flag) {
                    $cb.prop("checked", true).change().parents("tr").first().addClass("sel");
                } else {
                    $cb.prop("checked", false).change().parents("tr").first().removeClass("sel");
                }
            }
        });

    })
    $(document).on("click", ".cb-tr ", function() {
        $cb = $(this).find("input:checkbox");
        var _tal = $(this).parents("table").first();

        // $(".thead").each(function() {
        //     var tableId = $(this).attr("for");
        //     _tal = "#" + $(_tal).attr("id") === tableId ? this : _tal;
        // });
        var temp = $(".t-head-fixed[for=\"#" + $(_tal).attr("id") + "\"]");
        var temp2 = $(".thead[for=\"#" + $(_tal).attr("id") + "\"]");
        if (temp.length > 0) _tal = temp;
        else if (temp2.length > 0) _tal = temp2;
        var cb_all = $(_tal).find(".cb-all");
        var flag = $cb.is(":checked");
        var allflag = true;
        var ntr = $(this).parents("tr");
        var ntrc = $(this);
        if (flag) {
            $(ntr).addClass("sel");
            var _all = $(this).parents("table").first().find(".cb-tr");

            $(_all).each(function() {
                if (!$(ntrc).is(this) && !$(this).children('input:checkbox').is(":disabled") && !$(this).children('input:checkbox').is(":checked")) {
                    allflag = false;
                    return false;
                }
            });
            if (allflag) {
                $(cb_all).children('input:checkbox').prop("checked", true).change();
            }
        } else {
            $(ntr).removeClass("sel");
            $(cb_all).children('input:checkbox').prop("checked", false).change();
        }
    });
    $(document).on("click", ".cbx-in-tr", function(event) {
        if (event.target != $(this).find(".cb-tr").children('input:checkbox')[0]) {
            $(this).find(".cb-tr").children('input:checkbox')[0].click();
        }
    });
    $(".file-btn").on("click", function() {
        $(this).parent().find("file-input");
    });


    $(".file-btn input[type='file']").on("change", function() {
        $(this).parents(".file-group").parent().find(".file-input").val($(this).val());
    });



    //左右的
    $(".lr-icon-toggle").on("click", function() {
        $(".leftmain").toggleClass("hide");
    });
    $(".leftmain .scrollcontain").css('height', 'auto');
    var $leftmain = $(".leftmain .scrollcontain");
    var top = 0;
    if ($leftmain.length > 0) {
        top = $leftmain.offset().top;
    }
    var h = $(".leftmain").height() - top - $(".left-f").outerHeight() || 0;
    if ($(".left-f").length > 0) {
        var sh = $(".left-f").offset().top - $(".leftmain .scrollcontain").offset().top;
        if (sh > h)
            $(".leftmain .scrollcontain").css('height', h);
        else {
            $(".leftmain .scrollcontain").css('height', sh);
        }
    } else {
        $(".leftmain .scrollcontain").css('height', sh);
    }


});

!(function($) {
    // body...
    var a = function(d) {
        this.init("tooltip", d);
    }
    a.prototype = {
        init: function(f, d) {
            this.element = $(d);
            this.type = f;
            $(this.element).on("mouseenter", change(this.enter, this))
            $(this.element).on("mouseleave", change(this.leave, this))
        },
        enter: function(e) {
            var el = e.currentTarget;
            this.element = el;
            var d = $(el).data(this.type);
            if (d !== null) {
                d.show();
            }
        },
        leave: function(e) {
            var el = e.currentTarget;
            this.element = el;
            var d = $(el).data(this.type);
            if (d !== null) {
                d.hide();
            }
        },
        hasContent: function() {
            return this.getTitle()
        },
        getTitle: function() {
            var title, el = this.element,
                title = $(el).attr("tooltip");
            return title;
        },
        show: function() {
            var _this = this;
            if (this.hasContent()) {
                var html = "<div class=\"tooltip\">" +
                    "<div class=\"tooltip-arrow\"></div>" +
                    "<div class=\"tooltip-con\">" +
                    this.getTitle() +
                    "</div>" +
                    "</div>";
                $("body").append(html);
                var position = this.getPosition();
                $(".tooltip").css({
                    'left': position.tooltip.left,
                    "top": position.tooltip.top,
                    'bottom': position.tooltip.bottom,
                    "right": position.tooltip.right,
                    "visibility": "visible"
                })

                $(".tooltip-arrow").css({
                    //'left': $(this.element).offset().left + $(this.element).innerWidth() / 2 - position.left
                    'left': position.arrow.left,
                    "top": position.arrow.top,
                    'bottom': position.arrow.bottom,
                    "right": position.arrow.right,
                })
            }
        },
        hide: function() {
            $(".tooltip").remove();
        },
        getPosition: function() {
            var d =(  $(this.element).attr("tooltip-dirction")+"").trim();
            var pos = $(this.element).offset();
            var w = $(".tooltip").width(),
                h = $(".tooltip").height(),
                ww = $(window).width(),
                wh = $(window).height();
            h>40&&($(".tooltip").addClass("multi"),h=$(".tooltip").height());
            var p=  {tooltip:  {
                    top: "",
                    left:"",
                    bottom: "",
                    right: "",
                } ,
                arrow:{ 
                    top: "",
                    left:"",
                    bottom: "",
                    right: ""
                }
            };
            if (d.length<=0 ||d=="undefined") {
                var x = pos.left + $(this.element).innerWidth() / 2 - $(".tooltip").outerWidth() / 2,
                    y = pos.top + $(this.element).innerHeight();
                x = x < 0 ? 0 : x;
                x = (x + w > ww ? ww - w : x);
                y = y < 0 ? 0 : y;
                y = y + h > wh ? wh - h : y;
                
                    $(".tooltip").addClass("top");
                p.tooltip.top= y;
                p.tooltip.left= x;
                p.arrow.left=pos.left + $(this.element).innerWidth() / 2 - p.tooltip.top;
                
            } else {
                switch (d) {  
                    case "left":
                        $(".tooltip").addClass("left");
                        p.tooltip.top=  pos.top-($(".tooltip").outerHeight(true)-$(this.element).innerHeight())/2;
                        p.tooltip.right= ww-pos.left;
                        p.arrow.top= $(".tooltip").outerHeight(true)/2   -4;
                        break;
                    case "right":
                        $(".tooltip").addClass("right");
                        p.tooltip.top=  pos.top-($(".tooltip").outerHeight(true)-$(this.element).innerHeight())/2;
                        p.tooltip.left= pos.left + $(this.element).innerWidth();
                        p.arrow.top= $(".tooltip").outerHeight(true)/2   -4;
                        break;
                    case "bottom":
                        $(".tooltip").addClass("bottom");
                        p.tooltip.top=  pos.top +$(this.element).innerHeight();
                        p.tooltip.left=  pos.left-($(".tooltip").outerWidth(true)-$(this.element).innerWidth())/2;
                        p.arrow.left= pos.left +$(this.element).outerWidth()/2-p.tooltip.left-6;
                        break;
                    case "top":
                        $(".tooltip").addClass("top");
                        p.tooltip.bottom=  wh-pos.top ;
                        p.tooltip.left=  pos.left-($(".tooltip").outerWidth(true)-$(this.element).innerWidth())/2;
                        p.arrow.left= pos.left +$(this.element).outerWidth()/2-p.tooltip.left-6;
                        break;
                      
                }
            }
            return p;
        }
    }

    function change(func, obj) {
        return function() {
            func.apply(obj, arguments);
        };
    }
    $(function() {
        $("[tooltip]").each(function() {
            $(this).data("tooltip", new a(this));
        });
    });
    $.fn.mtooltip=function(){
        $(this).data("tooltip", new a(this));
    };
}(jQuery));
var showMess = {
    htext: "",
    corfimresult: 0,
    conbgigueDialog: function() {

    },
    confirm: function(text, arg, submintfun) {
        this.htext = "提示";
        var _this = this;
        if (Object.prototype.toString.call(arg) === "[object Function]") {
            _this.submintfun = arg;
            _this.arg = null;
        } else {
            _this.submintfun = submintfun;
            _this.arg = arg;
        }
        var html = " <div class='checktip-page'>" +
            "<div class='checktip-box'>" +
            "<p class='checktip-h'>" + this.htext + "</p>" +
            "<div class='checktip-inner'>" +
            "<p class='checktip-title'>" + text + "</p>" +
            "<div class='btn-block'>" +
            "<a href='javascript:void(0)' class='btn' id='checkbox-submit'>确认</a><a href='javascript:void(0)' class='btn-gray' id='checkbox-cancel'>取消</a>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $("body").append(html);
        $(".checktip-page").show();
        $("#checkbox-submit").on("click", function() {
            _this.remove();
            if (Object.prototype.toString.call(_this.submintfun) === "[object Function]") {
                if (_this.arg !== null) {
                    _this.submintfun.call(_this, _this.arg);
                } else {
                    _this.submintfun.call(_this);
                }

            }
        });
        $("#checkbox-cancel").on("click", function() {
            _this.remove();
        });



    },
    alert: function(text, arg, submintfun) {
        var _this = this;
        this.htext = "消息";
         if (Object.prototype.toString.call(arg) === "[object Function]") {
            _this.submintfun = arg;
            _this.arg = null;
        } else {                
            _this.submintfun = submintfun;
            _this.arg = arg;
        }
        var html = " <div class='checktip-page'>" +
            "<div class='checktip-box'>" +
            "<p class='checktip-h'>" + this.htext + "</p>" +
            "<div class='checktip-inner'>" +
            "<p class='checktip-title'>" + text + "</p>" +
            "<div class='btn-block'>" +
            "<a href='javascript:void(0)' class='btn' id='checkbox-submit'>确认</a> " +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";
        $("body").append(html);
        $(".checktip-page").show();
        $("  #checkbox-submit").on("click", function() { 
            _this.remove();
             if (Object.prototype.toString.call(_this.submintfun) === "[object Function]") {
                if (_this.arg !== null) {
                    _this.submintfun.call(_this, _this.arg);
                } else {
                    _this.submintfun.call(_this);
                }

            }
        });
    },
    
    remove: function() {
        $(".checktip-page") && $(".checktip-page").remove();
    },


};
String.prototype.trim = function() {
    if (this)
        return this.replace(/(^\s*)|(\s*$)/g, "");
    else
        return this;
};

var browerVersion = {
    userAgent: navigator.userAgent,
    ie: function() {
        var fIEVersion = 11;
        if (this.userAgent.indexOf("compatible") > -1 && this.userAgent.indexOf("MSIE") > -1) {
            var reIE = new RegExp("MSIE (\\d+)(\\.\\d+);");
            reIE.test(this.userAgent);
            var fIEVersion1 = parseFloat(RegExp["$1"]) || 0;
            var fIEVersion2 = window.document.documentMode;
            fIEVersion = fIEVersion1 > fIEVersion2 ? fIEVersion2 : fIEVersion1;
        }
        return fIEVersion;

    },
    ff: function() {
        return this.userAgent.indexOf("Firefox") > -1;
    }

};

function fixed() {
    $(window).scrollTop(0);
    $(".js-fixed").each(function(i) {
        $(this).css("z-index", 98 - i);
        if ($(this).parents(".fixed-wrap").length == 0) {
            var h1 = $(this).outerHeight(true) - $(this).find(".t-head-fixed").outerHeight(true);
            $(this).css({
                "left": $(this).position().left,
                "right": $(window).width() - $(this).position().left - $(this).width()
            });
            $(this).attr("fixed-direction") === "bottom" ?
                $(this).css("bottom", "0") :
                $(this).css({
                    "top": "0",
                    "padding-top": $(this).position().top - $(document).scrollTop()
                });
            $(this).addClass("fixed");
            $(this).wrap("<div class=\"fixed-wrap\" style=\"height:" + h1 + "px\"></div>");
        }
    });
}
function updateFixed () { 
    $(".js-fixed").each(function(i) {
        $(this).css("z-index", 98 - i);
        var $par= $(this).parents(".fixed-wrap"); 
            var h1 = $(this).height( ) - $(this).find(".t-head-fixed").outerHeight(true);
            $(this).css({
                "left": $(this).position().left,
                "right": $(window).width() - $(this).position().left - $(this).width()
            });
            $(this).attr("fixed-direction") === "bottom" ?
                $(this).css("bottom", "0") :
                $(this).css({
                    "top": "0", 
                });
            $(this).addClass("fixed"); 
        $par.css("height",h1)
    });
}
function tablecolfixed() {

    $(".sx-t tr").hover(function() {
        var i = $(this).index();
        $(".sx-t table ").each(function() {
            $(this).find("tr").eq(i).addClass("hover");
        });
    }, function() {
        var i = $(this).index();
        $(" .sx-t table ").each(function() {
            $(this).find("tr").eq(i).removeClass("hover");
        });
    });
    tablecolfixedInit();
    $(" .sx-t-c  .sx-t-table").scroll(function() {
        var _this = this;
        $(".sx-t-c ").find(".sx-fixed").scrollLeft($(_this).scrollLeft());
    });


    $(".scrolly").find(".sx-t-table ").scroll(function() {
        var _this = this;
        $(".scrolly").siblings().each(function() {
            $(this).find(".sx-t-table").scrollTop($(_this).scrollTop());
        });
    });
    $(window).resize(function() {
        tablecolfixedInit();
    });


}

function tablecolfixedInit() {
    var h = $(".sx-t").height()  ,
        isX = false,
        isY = false,
        tempx = 0,
        tempy = 0,
        t_head=35,
        h_temp = $(".sx-t-c .sx-t-table .table").height();

    isscrollX();
    if($(".sx-t").data("heightAuto")){
        $(".sx-t").css("height","");
    }
    if($(".sx-t")[0].style.height=="" ){

        isX&&(h=h+20) ;
        $(".sx-t").height(h).data("heightAuto","true");

    } 
    isscrollY( );
    if (!isX && isY) {
        isscrollX( );
        isscrollY( );
    }

 
    var $scrollypanel = $(".sx-t-r").length > 0 ? $(".sx-t-r") : $(".sx-t-c");
    if (isY) {
        $scrollypanel.addClass("scrolly");
    } else {
        $scrollypanel.removeClass("scrolly");
    }
     h -=t_head;
     if(isX&&isY) h-=tempy;
    if (isX) {
        $(".sx-t").addClass("scrollx");

        $(".sx-t   .sx-t-table").css({ "height":  h- 18   });
        $(".sx-t-c  .sx-t-table").css({ "height": h  });
    } else {
        $(".sx-t").removeClass("scrollx");
        $(".sx-t   .sx-t-table").css({ "height": h });
    }
    $(".sx-t").find(".sx-fixed").each(function() {
        var $fixtable = $(this).find(".table"),
            $table = $($(this).find(".table").attr("for"));
        $table.find("th").each(function() {
            var i = $(this).index();
            $fixtable.find("th").eq(i).attr("width", $(this).width());

        });

    });

    function isscrollX() {
        var w=$(".sx-t-c  .sx-t-table").width();
        $(".sx-t-c  .sx-t-table").width(w-tempx)
        if (!isX&&$(".sx-t-c  .sx-t-table").width() < $(".sx-t-c  .sx-t-table .table").width() ) {
            isX = true;
            tempy += 18;
        }
        $(".sx-t-c  .sx-t-table").css("width","");

    }

    function isscrollY() {
        if (!isY&&$(".sx-t").height() < $(".sx-t-c .sx-t-table .table").height() + t_head - tempy) {
            isY = true;
            tempx += 18;
        }
    }               
}
                