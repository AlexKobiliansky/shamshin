$(document).ready(function(){

    $('.lazy').lazy();

    $('img.svg').each(function(){
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);
        }, 'xml');
    });

    // $('.gallery-wrap').magnificPopup({
    //     delegate: 'a',
    //     type: 'image',
    //     tLoading: 'Loading image #%curr%...',
    //     mainClass: 'mfp-img-mobile',
    //     gallery: {
    //         enabled: true,
    //         navigateByImgClick: true,
    //         preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    //     },
    // });

    $('.gallery-wrap').magnificPopup({
        mainClass: 'mfp-zoom-in',
        delegate: 'a',
        type: 'image',
        tLoading: '',
        gallery:{
            enabled:true,
        },
        removalDelay: 300,
        callbacks: {
            beforeChange: function() {
                this.items[0].src = this.items[0].src + '?=' + Math.random();
            },
            open: function() {
                $.magnificPopup.instance.next = function() {
                    var self = this;
                    self.wrap.removeClass('mfp-image-loaded');
                    setTimeout(function() { $.magnificPopup.proto.next.call(self); }, 120);
                }
                $.magnificPopup.instance.prev = function() {
                    var self = this;
                    self.wrap.removeClass('mfp-image-loaded');
                    setTimeout(function() { $.magnificPopup.proto.prev.call(self); }, 120);
                }
            },
            imageLoadComplete: function() {
                var self = this;
                setTimeout(function() { self.wrap.addClass('mfp-image-loaded'); }, 16);
            }
        }
    });

    $('.preloader').fadeOut();

    $("a[href='#popup-form']").magnificPopup({
        type: "inline",
        fixedContentPos: !1,
        fixedBgPos: !0,
        overflowY: "auto",
        closeBtnInside: !0,
        preloader: !1,
        midClick: !0,
        removalDelay: 300,
        mainClass: "my-mfp-zoom-in",
    });


    $('section.s-intro').on("mousemove", function (e) {
        if ($(window).width() > 1023) {
            var w = $('section.s-intro').width(),
                h = $('section.s-intro').height(),
                x = e.clientX,
                y = e.clientY,
                indX = Math.ceil(x / (w / 5)),
                indY = Math.ceil(y / (h / 4));
            if (!indX || !indY) {
                return false;
            }
            var ind = ((indY - 1) * 5) + indX;
            $('section.s-intro .intro-slider').attr('class', 'intro-slider state-' + ind);
        }
    });


    var uPhone = $('.user-phone');
    uPhone.mask("+7 (999) 999-99-99",{autoclear: false});

    uPhone.on('click', function (ele) {
        var needelem = ele.target || event.srcElement;
        needelem.setSelectionRange(4,4);
        needelem.focus();
    });

    $.validate({
        form : '.contact-form, .getinfo-form',
        scrollToTopOnError: false
    });

    //E-mail Ajax Send
    $("form").submit(function() { //Change
        var th = $(this);
        var t = th.find(".btn").text();
        th.find(".btn").prop("disabled", "disabled").attr("data-text", "Отправлено!").find('span').text("Отправлено!");
        console.log('sd');

        $.ajax({
            type: "POST",
            url: "mail.php", //Change
            data: th.serialize()
        }).done(function() {
            setTimeout(function() {
                th.find(".btn").removeAttr('disabled').removeClass("disabled").attr("data-text", t).find('span').text(t);
                th.trigger("reset");
                $.magnificPopup.close();
            }, 2000);
        });
        return false;
    });



    /** PARALLAX START */
    function myPar(){
        if ($(window).width() > 1200) {
            (function() {
                var Parallax, initMap, throttle;

                window.scrollList = [];

                throttle = function(fn, env, time) {
                    if (((time + 30) - Date.now()) < 0) {
                        fn.call(env);
                        return true;
                    } else {
                        return false;
                    }
                };

                Parallax = (function() {
                    function Parallax(node) {
                        var top;
                        this.node = $(node);
                        this.listed = this.node.find(' > *');
                        this.coef = [0.1, 0.2, 0.3, 0.4, 0.5];
                        top = this.node.offset().top;
                        this.top = top + parseInt(this.node.data('totop') ? this.node.data('totop') : 0);
                        this.bot = top + this.node.height() + parseInt(this.node.data('tobot') ? this.node.data('tobot') : 0);
                        this.reverse = this.node.data('reverse') ? true : false;
                        this.horizontal = this.node.data('horizontal') ? true : false;
                        this.doc = document.documentElement;
                        this.init();
                    }

                    Parallax.prototype.init = function() {
                        if (this.reverse) {
                            if (!this.horizontal) {
                                return window.scrollList.push([this.rscroll, this]);
                            } else {
                                return window.scrollList.push([this.hrscroll, this]);
                            }
                        } else {
                            if (!this.horizontal) {
                                return window.scrollList.push([this.scroll, this]);
                            } else {
                                return window.scrollList.push([this.hscroll, this]);
                            }
                        }
                    };

                    Parallax.prototype.scroll = function() {
                        var P, rbot, rtop, top, wh;
                        P = this;
                        top = (window.pageYOffset || this.doc.scrollTop) + (this.doc.clientTop || 0);
                        wh = window.innerHeight;
                        rtop = this.top - wh;
                        rbot = this.bot;
                        if (top > rtop && top < rbot) {
                            return this.listed.each(function(index, o) {
                                var mt, obj;
                                obj = $(o);
                                mt = parseInt((P.top - top) * P.coef[index]);
                                return obj.css('margin-top', mt + 'px');
                            });
                        }
                    };

                    Parallax.prototype.rscroll = function() {
                        var P, rbot, rtop, top, wh;
                        P = this;
                        top = (window.pageYOffset || this.doc.scrollTop) + (this.doc.clientTop || 0);
                        wh = window.innerHeight;
                        rtop = this.top - wh;
                        rbot = this.bot;
                        if (top > rtop && top < rbot) {
                            return this.listed.each(function(index, o) {
                                var mt, obj;
                                obj = $(o);
                                mt = parseInt((top - P.top) * P.coef[index]);
                                return obj.css('margin-top', mt + 'px');
                            });
                        }
                    };

                    Parallax.prototype.hscroll = function() {
                        var P, mt, rbot, rtop, top, wh;
                        P = this;
                        top = (window.pageYOffset || this.doc.scrollTop) + (this.doc.clientTop || 0);
                        wh = window.innerHeight;
                        rtop = this.top - wh;
                        rbot = this.bot;
                        if (top > rtop && top < rbot) {
                            mt = parseInt((this.top - top) * this.coef[2]);
                            return this.node.css('background-position', mt + 'px top');
                        }
                    };

                    Parallax.prototype.hrscroll = function() {
                        var P, mt, rbot, rtop, top, wh;
                        P = this;
                        top = (window.pageYOffset || this.doc.scrollTop) + (this.doc.clientTop || 0);
                        wh = window.innerHeight;
                        rtop = this.top - wh;
                        rbot = this.bot;
                        if (top > rtop && top < rbot) {
                            mt = parseInt((top - this.top) * this.coef[2]);
                            return this.node.css('background-position', mt + 'px top');
                        }
                    };

                    return Parallax;
                })();

                $('document').ready(function() {
                    var parallaxTime;
                    $('[data-node="parallax"]').each(function(index, node) {
                        new Parallax(node);
                        return true;
                    });
                    parallaxTime = Date.now();
                    $(document).on('scroll', function() {
                        var fnwe, j, len, ref, reset;
                        reset = false;
                        ref = window.scrollList;
                        for (j = 0, len = ref.length; j < len; j++) {
                            fnwe = ref[j];
                            if (throttle(fnwe[0], fnwe[1], parallaxTime)) {
                                reset = true;
                            }
                        }
                        if (reset) {
                            return parallaxTime = Date.now();
                        }
                    });
                    setTimeout(function() {
                        return $(document).trigger('scroll');
                    }, 100);
                });

            }).call(this);
        }
    }

    myPar();

    /** PARALLAX END*/
});
