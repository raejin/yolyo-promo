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
    if (!$('.modal-backdrop').length) {
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
    }
  });

  var emailPattern = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;

  $('#join_modal_guest').find('form').on('submit', function (evt) {
    evt.preventDefault();
    console.log("submit");
  });

  $('#join_modal_user').find('form').on('submit', function (evt) {
    evt.preventDefault();
    var emailInput = $(this).find('input').eq(0),
        locationInput = $(this).find('input').eq(1),
        doWhatInput = $(this).find('input').eq(2),
        dreamInput = $(this).find('input').eq(3),
        isEmail = emailInput.val().match(emailPattern);
    emailInput.tooltip({
      title: "E-mail 格式不正確",
      trigger: "manual"
    });
    locationInput.tooltip({
      title: "跟我們分享一下你在哪裡打拼吧",
      trigger: "manual"
    });
    doWhatInput.tooltip({
      title: "我們想要了解使用者的多樣性，分享一下你在做什麼吧！",
      trigger: "manual"
    });
    dreamInput.tooltip({
      title: "不需要很偉大，只是一個簡單的、短期的夢想即可 :)",
      trigger: "manual"
    });
    if (isEmail === null) {
      emailInput.parent().addClass('has-error');
      emailInput.tooltip('show');
    } else {
      emailInput.parent().removeClass('has-error');
      emailInput.tooltip('hide');
    }
    if (locationInput.val().length <= 1) {
      locationInput.parent().addClass('has-error');
      locationInput.tooltip('show');
    } else {
      locationInput.parent().removeClass('has-error');
      locationInput.tooltip('hide');
    }
    if (doWhatInput.val().length <= 2) {
      doWhatInput.parent().addClass('has-error');
      doWhatInput.tooltip('show');
    } else {
      doWhatInput.parent().removeClass('has-error');
      doWhatInput.tooltip('hide');
    }
    if (dreamInput.val().length <= 2) {
      dreamInput.parent().addClass('has-error');
      dreamInput.tooltip('show');
    } else {
      dreamInput.parent().removeClass('has-error');
      dreamInput.tooltip('hide');
    }

    if (isEmail && locationInput.val().length > 1 && doWhatInput.val().length > 2 && dreamInput.val().length > 2) {

      var joinList = new Firebase('https://join-yolyo.firebaseIO.com/join_list');
      joinList.push({
        email: emailInput.val(),
        where: locationInput.val(),
        what: doWhatInput.val(),
        dream: dreamInput.val()
      }, function (response) {
        $(this).parent().hide().next().show();
        $(this).parent().next().next().find('.submit').hide().next().show();

        // resetting the form, and tooltips
        $(this)[0].reset();
        $(this).find('input').tooltip('hide');

        $('#join_modal_user').on('hidden.bs.modal', function () {
          $(this).find('.modal-body').eq(0).show().next().hide();
          $(this).find('.submit').eq(0).show().next().hide();
        });
      });
    } // if form valid

  });

  $('#join_modal_user').find('.submit').on('click', function () {
    $(this).parent().prev().prev().find('form').trigger('submit');
  });
  $('#join_modal_guest').find('.submit').on('click', function () {
    $(this).parent().prev().prev().find('form').trigger('submit');
  });

});