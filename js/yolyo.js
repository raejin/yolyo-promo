$(function () {

  $(window).resize(windowResizeFn);
  $(window).trigger('resize');

  function windowResizeFn() {
    var windowHeight = $(window).height();
    $('.content_wrap').each(function (index) {

      if (index === 0) {
        $(this).css('height', (windowHeight - 80) + 'px');
      } else {
        $(this).css('height', windowHeight + 'px');
      }

    });

  }

});