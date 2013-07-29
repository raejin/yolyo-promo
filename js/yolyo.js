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
    if (evt.keyCode === 27 && $('#join_modal_yolyo').is(':visible')) {
      $('#join_modal_yolyo').modal('hide');
    }
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

  $('form').find('input').on('keypress', function (evt) {
    if (evt.keyCode === 13) {
      $(this).closest('form').trigger('submit');
    }
  });

  var emailPattern = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;

  $('#join_modal_guest').find('form').on('submit', function (evt) {
    evt.preventDefault();
    var inputs        = $(this).find('input'),
        emailInput    = inputs.eq(0),
        nameInput     = inputs.eq(1),
        taizhuEmail   = inputs.eq(2),
        taizhuName    = inputs.eq(3),
        taizhuDo      = inputs.eq(4),
        whyTaizhu     = inputs.eq(5);

    emailInput.tooltip({
      title: "E-mail 格式不正確",
      trigger: "manual"
    });

    taizhuEmail.tooltip({
      title: "E-mail 格式不正確",
      trigger: "manual"
    });

    nameInput.tooltip({
      title: "怎麼稱呼？",
      trigger: "manual"
    });

    taizhuName.tooltip({
      title: "臺柱怎麼稱呼？",
      trigger: "manual"
    });

    taizhuDo.tooltip({
      title: "我們想要稍微了解一下臺柱所在的領域",
      trigger: "manual"
    });

    whyTaizhu.tooltip({
      title: "理由不需要很複雜，他可以只是你的朋友",
      trigger: "manual"
    });

    inputs.each(function (index) {
      if (index !== 0 && index !== 2) {
        if (inputs.eq(index).val().length === 0) {
          inputs.eq(index).parent().addClass('has-error');
          inputs.eq(index).tooltip('show');
        } else {
          inputs.eq(index).parent().removeClass('has-error');
          inputs.eq(index).tooltip('hide');
        }
      }
    });

    if (emailInput.val().match(emailPattern) === null) {
      emailInput.parent().addClass('has-error');
      emailInput.tooltip('show');
    } else {
      emailInput.parent().removeClass('has-error');
      emailInput.tooltip('hide');
    }
    if (taizhuEmail.val().match(emailPattern) === null) {
      taizhuEmail.parent().addClass('has-error');
      taizhuEmail.tooltip('show');
    } else {
      taizhuEmail.parent().removeClass('has-error');
      taizhuEmail.tooltip('hide');
    }

    var form = $(this);
    if ($(this).find('.has-error').length === 0) {
      var newTaizhuList = new Firebase('https://taizhu-yolyo.firebaseIO.com/taizu');
      newTaizhuList.push({
        email: emailInput.val(),
        name: nameInput.val(),
        taizhu: {
          email: taizhuEmail.val(),
          name: taizhuName.val(),
          occupation: taizhuDo.val()
        },
        why: whyTaizhu.val()
      }, function (response) {
        if (response === null) {

          form.parent().hide().next().show();
          form.parent().next().next().find('.submit').hide().next().show();

          // resetting the form, and tooltips
          form[0].reset();
          form.find('input').tooltip('hide');

          $('#join_modal_guest').on('hidden.bs.modal', function () {
            $(this).find('.modal-body').eq(0).show().next().hide();
            $(this).find('.submit').eq(0).show().next().hide();
          });
        } else {
          console.log("something went wrong");
        }
      });
    }

  });

  $('#join_modal_user').find('form').on('submit', function (evt) {
    evt.preventDefault();
    var inputs        = $(this).find('input'),
        emailInput    = inputs.eq(0),
        nameInput     = inputs.eq(1),
        locationInput = inputs.eq(2),
        doWhatInput   = inputs.eq(3),
        dreamInput    = inputs.eq(4),
        isEmail       = emailInput.val().match(emailPattern);
    emailInput.tooltip({
      title: "E-mail 格式不正確",
      trigger: "manual"
    });
    nameInput.tooltip({
      title: "請留下大名",
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
    if (nameInput.val().length === 0) {
      nameInput.parent().addClass('has-error');
      nameInput.tooltip('show');
    } else {
      nameInput.parent().removeClass('has-error');
      nameInput.tooltip('hide');
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
      var form = $(this);
      var joinList = new Firebase('https://join-yolyo.firebaseIO.com/join_list');
      joinList.push({
        name: nameInput.val(),
        email: emailInput.val(),
        where: locationInput.val(),
        what: doWhatInput.val(),
        dream: dreamInput.val()
      }, function (response) {
        if (response === null) {
          form.parent().hide().next().show();
          form.parent().next().next().find('.submit').hide().next().show();

          // resetting the form, and tooltips
          form[0].reset();
          form.find('input').tooltip('hide');

          $('#join_modal_user').on('hidden.bs.modal', function () {
            $(this).find('.modal-body').eq(0).show().next().hide();
            $(this).find('.submit').eq(0).show().next().hide();
          });
        } else {
          console.log("something went wrong");
        }
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