function getUrlParams(dParam) {
  var dPageURL = window.location.search.substring(1),
    dURLVariables = dPageURL.split("&"),
    dParameterName,
    i;

  for (i = 0; i < dURLVariables.length; i++) {
    dParameterName = dURLVariables[i].split("=");

    if (dParameterName[0] === dParam) {
      return dParameterName[1] === undefined
        ? true
        : decodeURIComponent(dParameterName[1]);
    }
  }
}

(function ($) {
  /* "use strict" */
  var eres = (function () {
    var screenWidth = $(window).width();

    var checkboxSelectAll = function () {
      $("#checkAll").change(function () {
        $("td input:checkbox").prop("checked", $(this).prop("checked"));
      });
    };

    var contentBodyHeight = function () {
      var win_h = window.outerHeight;
      if (win_h > 0 ? win_h : screen.height) {
        $(".content-body").css("min-height", win_h - 100 + "px");
      }
    };

    var cardCollapse = function () {
      $('a[data-action="collapse"]').on("click", function (i) {
        i.preventDefault(),
          $(this)
            .closest(".card")
            .find('[data-action="collapse"] i')
            .toggleClass("mdi-arrow-down mdi-arrow-up"),
          $(this).closest(".card").children(".card-body").collapse("toggle");
      });

      $('a[data-action="expand"]').on("click", function (i) {
        i.preventDefault(),
          $(this)
            .closest(".card")
            .find('[data-action="expand"] i')
            .toggleClass("icon-size-actual icon-size-fullscreen"),
          $(this).closest(".card").toggleClass("card-fullscreen");
      });
    };

    var cardLoader = function () {
      $('[data-action="close"]').on("click", function () {
        $(this).closest(".card").removeClass().slideUp("fast");
      });

      $('[data-action="reload"]').on("click", function () {
        var e = $(this);
        e.parents(".card").addClass("card-load"),
          e
            .parents(".card")
            .append(
              '<div className="card-loader"><i className=" ti-reload rotate-refresh"></div>'
            ),
          setTimeout(function () {
            e.parents(".card").children(".card-loader").remove(),
              e.parents(".card").removeClass("card-load");
          }, 2000);
      });
    };

    var dzScrollBar = function () {
      jQuery(".dz-scroll").each(function () {
        var scroolWidgetId = jQuery(this).attr("id");
        const ps = new PerfectScrollbar("#" + scroolWidgetId, {
          wheelSpeed: 2,
          wheelPropagation: true,
          minScrollbarLength: 20,
        });
      });
    };

    var handleBodyLayout = function () {
      const headerHight = $(".header").innerHeight();

      $(window).scroll(function () {
        if (
          $("body").attr("data-layout") === "horizontal" &&
          $("body").attr("data-header-position") === "static" &&
          $("body").attr("data-sidebar-position") === "fixed"
        )
          $(this.window).scrollTop() >= headerHight
            ? $(".deznav").addClass("fixed")
            : $(".deznav").removeClass("fixed");
      });
    };
    var dzAjex = function () {
      jQuery(".bell-link").on("click", function () {
        jQuery(".chatbox").addClass("active");
      });
      jQuery(".chatbox-close").on("click", function () {
        jQuery(".chatbox").removeClass("active");
      });

      jQuery(".dz-fullscreen").on("click", function () {
        jQuery(".dz-fullscreen").toggleClass("active");
      });
    };
    var btnNumber = function () {
      $(".btn-number").on("click", function (e) {
        e.preventDefault();

        fieldName = $(this).attr("data-field");
        type = $(this).attr("data-type");
        var input = $("input[name='" + fieldName + "']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
          if (type == "minus") input.val(currentVal - 1);
          else if (type == "plus") input.val(currentVal + 1);
        } else {
          input.val(0);
        }
      });
    };

    var dzFullScreen = function () {
      jQuery(".dz-fullscreen").on("click", function (e) {
        if (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        ) {
          /* Enter fullscreen */

          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen(); /* IE/Edge */
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen(); /* Firefox */
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen(); /* Chrome, Safari & Opera */
          }
        } else {
          /* exit fullscreen */
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        }
      });
    };

    /* Function ============ */
    return {
      init: function () {
        checkboxSelectAll();
        // handleToggleMenu();
        contentBodyHeight();
        cardCollapse();
        cardLoader();
        handleBodyLayout();
        dzScrollBar();
        dzAjex();
        btnNumber();
        dzFullScreen();
      },

      load: function () { },

      resize: function () { },
    };
  })();
  jQuery(document).ready(function () {
    $("#menu").metisMenu();
    const qs = new PerfectScrollbar(".deznav-scroll");
    eres.init();
  });
  jQuery(window).on("load", function () {
    $("#preloader").fadeOut(500);
    $("#main-wrapper").addClass("show");

    eres.load();
  });
  jQuery(window).on("resize", function () {
    eres.resize();
  });
})(jQuery);

// (function ($) {
//   var direction = getUrlParams("dir");
//   if (direction != "rtl") {
//     direction = "ltr";
//   }

//   var dezSettingsOptions = {
//     version: "light",
//     layout: "Vertical",
//     headerBg: "color_1",
//     navheaderBg: "color_1",
//     sidebarBg: "color_1",
//     sidebarStyle: "full",
//     sidebarPosition: "fixed",
//     headerPosition: "fixed",
//     containerLayout: "full",
//     direction: direction,
//   };

//   new dezSettings(dezSettingsOptions);

//   jQuery(window).on("resize", function () {
//     new dezSettings(dezSettingsOptions);
//   });
// })(jQuery);
// Add active class to the current button (highlight it)
var header = document.getElementById("pills-tab");

if (header.getElementsByClassName("nav-item")) {
  var btns = header.getElementsByClassName("nav-item");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}