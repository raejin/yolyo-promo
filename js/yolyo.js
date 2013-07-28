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

      if (index === 0) {
        $(this).css('height', (windowHeight - 80) + 'px');
      } else {
        $(this).css('height', windowHeight + 'px');
      }
    });
  }

  $('#join_form').find('.btn-group').eq(0).find('.btn').each(function (index) {
    $(this).on('click', function () {
      $('#join').find('.intro_role').find('div:visible').hide().end().find('div').eq(index).show();
    });
  });

  $('#join_form').find('button').on('click', function (event) {
    event.preventDefault();
  });

  $('#join_form').find('.submit').on('click', function (e) {
    e.preventDefault();
    $(this).parent().hide();
    $('.form_message').show();
  });

  $('#joinUsBtn').on('click', function () {
    $('#join_modal').modal();
  });

  $('#submit_join_form').on('click', function (event) {
    event.preventDefault();
    $('#join_modal').find('form').trigger('submit');
  });

  $('#join_modal').find('form').on('submit', function (event) {
    event.preventDefault();
    var request_body = {
      name: $(this).find('input').eq(0).val(),
      email: $(this).find('input').eq(1).val()
    };
    joinList.push(request_body, function (res) {
      $('#join_modal').find('form').hide().next().show();
      $('#submit_join_form').hide().next().show();
      if (res !== null) $('#join_modal').find('form').next().text('資料處理過程中出現問題，麻煩你再嘗試一次！');
    });
  });

});