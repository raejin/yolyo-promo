var joinList = new Firebase('https://join-yolyo.firebaseIO.com/join_list');

$(function () {

  $(window).resize(windowResizeFn);
  $(window).trigger('resize');

  function windowResizeFn() {
    var windowHeight    = $(window).height(),
        windowWidth     = $(window).width(),
        backgroundRatio = 1280 / 787.0;
    $('.content_wrap').each(function (index) {

      if ((windowWidth / windowHeight) < backgroundRatio) {
        $(this).removeClass('background_regular').addClass('background_different');
      } else if ($(this).hasClass('background_different')) {
        $(this).removeClass('background_different').addClass('background_regular');
      }
      $(this).css('height', windowHeight + 'px');
      // if (index === 0) {
      //   $(this).css('height', (windowHeight - 80) + 'px');
      // } else {
      //   $(this).css('height', windowHeight + 'px');
      // }
    });
  }
  function goSection(action, windowHeight, scrollTop) {
    var currentPageNumber = Math.floor(scrollTop / windowHeight),
        nextPageNumber = (currentPageNumber !== 10) ? currentPageNumber + 1: 10,
        prevPageNumber = currentPageNumber ? currentPageNumber - 1: 0;

    if (action === 'next') {
      // document.body.scrollTop = nextPageNumber * windowHeight;
      $(document).scrollTop(nextPageNumber * windowHeight);
    } else if (action === 'prev') {
      // document.body.scrollTop = prevPageNumber * windowHeight;
      $(document).scrollTop(prevPageNumber * windowHeight);
    }
  }

  $('#join_role_buttons').find('button').each(function (index) {
    $(this).on('click', function () {
      switch (index) {
        case 0:
          $('#join_modal_user').modal('show');
        break;
        case 1:
          $('#join_modal_guest').modal('show');
        break;
        case 2:
          $('#join_modal_yolyo').modal('show');
        break;
      }
    });
  });

  var hashMap = [
    'mission',
    'why',
    'why_two',
    'why_three',
    'action',
    'tool',
    'guest',
    'join',
    'team'
  ];

  var oldPageNumber = Math.floor(document.body.scrollTop / $(window).height());

  $(document).on('scroll', function () {
    var currentPageNumber = Math.floor(document.body.scrollTop / $(window).height()),
        hashbang = '#' + hashMap[currentPageNumber - 1];
    if (currentPageNumber !== oldPageNumber && currentPageNumber > 0) {
      if (history.pushState) {
        history.pushState(null, "what is Yolyo", hashbang);
      }
      else {
        window.location.hash = hashbang;
      }
      oldPageNumber = currentPageNumber;
    } else if (currentPageNumber !== oldPageNumber && currentPageNumber === 0) {
      history.pushState(null, "what is Yolyo", window.location.pathname + window.location.search);
      oldPageNumber = currentPageNumber;
    }
  });

  $(document).on('keydown', function (evt) {
    var windowHeight = $(window).height();
    if (evt.keyCode === 27 && $('.modal').is(':visible')) {
      $('.modal').modal('hide');
    } else if (evt.keyCode === 39 || evt.keyCode === 40) {
      evt.preventDefault();
      // right arrow
      goSection('next' ,windowHeight, document.body.scrollTop);
    } else if (evt.keyCode === 37 || evt.keyCode === 38) {
      evt.preventDefault();
      goSection('prev' ,windowHeight, document.body.scrollTop);
    }
  });

  $('#join_modal_user').on('shown.bs.modal', function () {
    $(this).find('input').eq(0).focus();
  });
  $('#join_modal_guest').on('shown.bs.modal', function () {
    $(this).find('input').eq(0).focus();
  });
  $('#join_modal_yolyo').on('shown.bs.modal', function () {
    $(this).find('input').eq(0).focus();
  });

  $('#join_modal_user').find('form').on('submit', function () {
    console.log('submit yo');
  });

  $('form').find('input').on('keypress', function (evt) {
    if (evt.keyCode === 13) {
      $(this).closest('form').trigger('submit');
      // $(this).closest('.modal-body').next().find('.submit').trigger('click');
    }
  });

  $('#join_modal_user').find('form').on('submit', function (evt) {
    evt.preventDefault();
    console.log("real submit");
  });

  $('#join_modal_user').find('.submit').on('click', function () {
    console.log("testing yo");
  });

});