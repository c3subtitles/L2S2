$(function() {
  var
  socketPath = window.location.protocol+'//'+window.location.host,
      socket = io(socketPath),
      $nav = $('nav'),
      $login = $('nav .login'),
      $disconnect = $('.disconnect'),
      $writeLog = $('.writeInterface ul.log'),
      $lineTpl = $writeLog.find('li.line.template')
  .removeClass('template')
  .detach(),
      $correctLog = $('.correctInterface ul.log'),
      $correctTpl = $correctLog.find('li.correct.template')
  .removeClass('template')
  .detach(),
      $input = $('.writeInterface > input'),
      intervals = {},

      // system state
      state = {
        room: null,
        username: null,
        password: null,
        interface: 'write',
        speechLocked: false,
        delay: 5,
        delays: [],
        writers: []
      };

  $.fn.serializeObject = function() {
    var object = {};

    $.each($(this).serializeArray(), function(idx, field) {
      object[field.name] = field.value || '';
    });

    return object;
  };

  // user/pass interaction
  $login.find('input.username').focus();
  $nav.on('keyup', 'input', function() {
    var lengths = $login
    .find('input')
    .map(function() { return $(this).val().length; })
    .toArray();

    $login
    .find('a')
    .toggleClass('active', lengths.indexOf(0) === -1);

  }).find('input').first().trigger('keyup');

  // joining
  $login.on('click', 'a', function(e) {
    e.preventDefault();
    var $a = $(this);

    if(!$a.hasClass('active')) {
      return;
    }

    var room = $a.text(),
        username = $login.find('input.username').val(),
        password = $login.find('input.password').val();

    // emit join-login command
    socket.emit(
      'join',
      room,
      username,
      password,

      // acknowledgement
      function(success, writers) {
        // login-error
        if(!success) {
          $nav.addClass('error');
          return setTimeout(function() { $nav.removeClass('error'); }, 500);
        }

        // login-success
        state.room = room;
        state.username = username;
        state.password = password;
        state.writers = writers;

        updateWritersList();

        $nav.hide();

        // header setup
        $('header h2').text($a.text());

        $('header .manage')
        .find('.username')
        .text(username)
        .end()
        .find('a')
        .toggleClass('visible', !!writers[username].admin);

        if (writers[username].speech) {
          $('.dospeech').show();
        }

        $('.docorrect').hide();

        $input.focus();
      }
    );
  });

  // disconnect/reconnect
  socket.on('disconnect', function() {
    $disconnect.show();
  });

  socket.on('connect', function() {
    $disconnect.hide();

    if(state.room) {
      // re-join
      socket.emit(
        'join',
        state.room,
        state.username,
        state.password
      );
    }
  });


  // receiving
  socket.on('partline', function(text, writer, socketid) {
    var $line = $writeLog.find('.partline[data-socketid='+socketid+']');
    
    if ($writeLog.find('.partline').length === 0) {
      $lineTpl
      .clone()
      .addClass('partline first')
      .appendTo($writeLog)
      .text('');
    }

    if($line.length === 0) {
      $line = $lineTpl
      .clone()
      .addClass('partline')
      .attr('data-socketid', socketid)
      .css('color', state.writers[writer].color || 'black')
      .appendTo($writeLog);
    }

    $line
    .find('span')
    .text(text);

    $writeLog.scrollTop($writeLog.prop('scrollHeight'));
  });

  // sending
  var preVal = '';
  $input.on('keypress', function(e) {
    //DEBUG
    console.log(e.which);

    if(e.which !== 13 && e.which !== 85 /* ENTER */) {
      return;
    }

    if($input.val() === '' /* EMPTY */) {
      return;
    }

    if (!state.speechLocked) {
      socket.emit('line', $input.val());
    } else {
      socket.emit('correct',$input.val());
    }

    $input.val('').focus();
    preVal = '';
  }).on('keyup', function() {
    var val = $input.val();
    if(val !== preVal) {
      preVal = val;

      $('input.shortcut').each(function() {
        val = val.replace(this.name, this.value);
        val = val.replace(this.name.toLowerCase(), this.value);
      });

      if(val !== preVal) {
        $input.val(val);
      }

      if (state.interface === 'write') {
        socket.emit('partline', val);
      }
    }
  });

  setInterval(function() {
    $input.trigger('keyup');
  }, 500);

  // shortcut updating
  $('a.load-shortcuts').on('click', function(e) {
    e.preventDefault();
    var $shortcuts = $('main .shortcuts input:enabled');

    $.ajax({
      url: 'current-talk/'+state.room,
      dataType: 'json',
      success: function(talk) {
        if(!talk) {
          $('main .shortcuts').addClass('error');
          setTimeout(function() { $('main .shortcuts').removeClass('error'); }, 500);
          return;
        }

        for (var i = 0; i < Math.min(10, talk.persons.length); i++) {
          $shortcuts.get(i).value = talk.persons[i].full_public_name;
        }

        $('main .shortcuts input.shortcut.fixed').each(function() {
          if(!$(this).data('de')) {
            $(this).data('de', $(this).val());
          }

          $(this).val($(this).data(talk.language));
        });

        $lineTpl
        .clone()
        .addClass('note')
        .find('strong')
        .text(moment(talk.now).format('dd, HH:mm:ss.SSS'))
        .end()
        .find('span')
        .text('Fahrplan: Current Talk is '+talk.title+' in '+talk.language)
        .end()
        .appendTo($writeLog);
      }
    });
  });



  var
  $usermgmt = $nav.find('section.usermgmt'),
      $userul = $usermgmt.find('ul.users'),
      $tpl = $userul.find('> li.template')
  .detach()
  .removeClass('template');

  $('header a.docorrect').on('click', function() {
    //switch to correctInterface
    if (state.interface === 'write') {
      state.interface = 'correct';
      $('.writeInterface').hide();
      $('.correctInterface').show();
      $('.docorrect').text('[Write Interface]');
    } else {
      state.interface = 'write';
      $('.writeInterface').show();
      $('.correctInterface').hide();
      $('.docorrect').text('[Correct Interface]');
    }
  });


  $('header a.domanage').on('click', function() {
    $nav
    .show()
    .find('section')
    .hide();

    function updateUsermgmtList(userlist) {
      $userul.empty();
      for(var user in userlist) {
        $tpl
        .clone()
        .find('a')
        .text(user)
        .end()
        .find('strong')
        .toggle(!!userlist[user].admin)
        .end()
        .appendTo($userul);
      }
    }

    socket.emit('usermgmt', null, function(userlist) {
      state.userlist = userlist;
      updateUsermgmtList(userlist);

      $usermgmt.show();
    });

    $usermgmt.on('click', 'ul.users a', function(e) {
      e.preventDefault();
      var user = $(this).text();
      $usermgmt
      .find('input[name=username]')
      .val(user)
      .end()
      .find('input[name=admin]')
      .prop('checked', !!state.userlist[user].admin)
      .end()
      .find('input[name=speech]')
      .prop('checked', !!state.userlist[user].speech)
      .end()
      .find('input[name=color]')
      .val(state.userlist[user].color || 'black');
    }).on('click', 'button', function(e) {
      e.preventDefault();
      var
      $btn = $(this),
          cmd = $btn.closest('form').serializeObject();

      if($btn.hasClass('delete')) {
        cmd['delete'] = true;
      }

      // Map '1' to true
      cmd.admin = (cmd.admin === '1');
      cmd.speech = (cmd.speech === '1');

      socket.emit('usermgmt', cmd, function(userlist) {
        console.log(userlist);
        if(!userlist) {
          $nav.addClass('error');
          return setTimeout(function() { $nav.removeClass('error'); }, 500);
        }

        state.userlist = userlist;
        updateUsermgmtList(userlist);
        $usermgmt
        .find('input:text')
        .val('')
        .end()
        .find('input:checkbox')
        .prop('checked', false);

        $nav.addClass('success');
        return setTimeout(function() { $nav.removeClass('success'); }, 500);
      });
    }).on('click', '.close', function(e) {
      e.preventDefault();
      $nav.hide();
    });

    var $color = $usermgmt.find('input[name=color]').ColorPicker({
      onChange: function(hsb, hex, rgb) {
        $color.val('#'+hex);
      },
      onSubmit: function(hsb, hex, rgb) {
        $color.ColorPickerHide();
      },
      onBeforeShow: function () {
        $(this).ColorPickerSetColor(this.value);
      }
    }).on('keyup', function(){
      $(this).ColorPickerSetColor(this.value);
    });
  });

  $('header a.dolock').on('click', function() {
    var dolock = !$writeLog.hasClass('locked');
    $(this).text(dolock ? '[unlock room]' : '[lock room]');

    socket.emit(
      dolock ? 'adminlock' : 'adminunlock',
      function(success) {
        if(success) {
          $writeLog.toggleClass('locked', dolock);
        } else {
          $writeLog.addClass('error');
          return setTimeout(function() { $writeLog.removeClass('error'); }, 500);
        }
      }
    );
  });

  $('header a.dospeech').on('click', function() {
    var dospeech = !$writeLog.hasClass('locked');
    $(this).text(dospeech ? '[unlock for speech recognition]' : '[lock for speech recognition]');

    socket.emit(
      dospeech ? 'speechlock' : 'speechunlock',
      function(success) {
        if(success) {
          $writeLog.toggleClass('locked', dospeech);
          if (dospeech) {
            $('.docorrect').show();
            state.speechLocked = true;
          } else {
            $('.docorrect').hide();
            state.speechLocked = false;
          }
        } else {
          $writeLog.addClass('error');
          return setTimeout(function() { $writeLog.removeClass('error'); }, 500);
        }
      }
    );
  });

  // focus tracking
  $('main').on('click', function(e) {
    if(!$(e.target).is('input:enabled')) {
      $input.focus();
    }
  });

  // writers-list change
  socket.on('writers', function(writers) {
    state.writers = writers;
    updateWritersList();
  });

  socket.on('adminlock', function(name) {
    $nav
    .show()
    .find('section')
    .hide()
    .end()
    .find('section.lock')
    .show()
    .find('.name')
    .text(name);
    $('header h2').append(' (Locked)');
  });


  socket.on('adminunlock', function(name) {
    $nav.hide();
    $('header h2').text(state.room);
  });

  socket.on('speechlock', function(name) {
    state.speechLocked = true;
    $('.part.shortcuts > .delay').on('change', function() {
      socket.emit('speechDelay', this.value);
    });
    $('header h2').append(' (Speech Locked)');
    // If current username is not in one of both roles
    if(state.writers[state.username].speech ||
       state.writers[state.username].admin) {
      $writeLog.addClass('locked');
      $('.docorrect').show();
    }
    else { 
      state.interface = 'correct';
      $('.writeInterface').hide();
      $('.correctInterface').show();
      $('.docorrect').text('[Write Interface]');
    }
  });

  socket.on('speechunlock', function(name) {
    state.speechLocked = false;
    $('.docorrect').hide();
    $nav.hide();
    $writeLog.removeClass('locked');
    $('header h2').text(state.room);
  });

  // receiving
  socket.on('line', function(stamp, text, writer, socketid, correctionId) {
    $correctLog.find('.correct[data-id='+correctionId+']').remove();
    try {
      clearInterval(intervals[correctionId]);
      $('.correctInterface .log').find('input').first().focus();
    } catch (e) {}
    $correctLog.find('li > i.ion-checkmark').first().show();
    $writeLog.find('.partline[data-socketid='+socketid+']').remove();
    if ($writeLog.find('.partline').length <= 1) {
      $writeLog.find('.partline').remove();
    }

    var $line = $lineTpl
    .clone()
    .find('strong')
    .text(moment(stamp).format('dd, HH:mm:ss.SSS'))
    .end()
    .find('span')
    .text(text)
    .end();

    var $partline = $writeLog.find('li.partline').first();
    if($partline.length > 0) {
      $line.insertBefore($partline);
    } else {
      $line.appendTo($writeLog);
    }

    $writeLog.scrollTop($writeLog.prop('scrollHeight'));
  });

  function sendCorrection(line, correctionId) {
    socket.emit('line', line.find('input').val(), correctionId);
  }

  function deleteCorrection(correctionId) {
    socket.emit('removeCorrection', correctionId);
    clearInterval(intervals[correctionId]);
  }

  socket.on('removeCorrection', function(correctionId) {
    $correctLog.find('.correct[data-id='+correctionId+']').remove();
    clearInterval(intervals[correctionId]);
    $correctLog.find('li > i.ion-checkmark').first().show();
  });

  socket.on('correct', function(stamp, text, writer, socketid) {
    $correctLog.find('.partline[data-socketid='+socketid+']').remove();
    if ($writeLog.find('.partline').length <= 1) {
      $writeLog.find('.partline').remove();
    }

    var $line = $correctTpl
    .clone()
    .attr('data-id', stamp+writer)
    .find('strong')
    .text(moment(stamp).format('dd, HH:mm:ss.SSS'))
    .end()
    .find('input')
    .val(text)
    .end();

    $line.find('i.ion-checkmark').on('click', function() {
      sendCorrection($line, stamp+writer);
    });

    $line.find('i.ion-trash-a').on('click', function() {
      deleteCorrection(stamp+writer);
    });

    var delaySpan = $line.find('.delay');
    state.delays[stamp+writer]=state.delay;
    delaySpan.text(state.delays[stamp+writer]);
    intervals[stamp+writer] = setInterval(function() {
      state.delays[stamp+writer]-=0.1;
      if (state.delays[stamp+writer] <= 0.1) {
        clearInterval(intervals[stamp+writer]);
        sendCorrection($line, stamp+writer);
      }
      var delayText = Math.round(state.delays[stamp+writer] * 10) / 10;
      if (!delayText.toString().contains('.')) {
        delayText+='.0';
      }
      delaySpan.text(delayText);
    }, 100);

    var $partline = $correctLog.find('li.partline').last();
    if($partline.length > 0) {
      $line.insertBefore($partline);
    } else {
      $line.appendTo($correctLog);
    }
    var corrections = $correctLog.find('li > i.ion-checkmark');
    corrections.hide();
    corrections.first().show();
    if (corrections.count === 1) {
      corrections.first().focus();
    }

    var input = $line.find('input').first();
    input.on('keypress', function(e) {
      if (e.which === 27) {
        input.val('');
        return;
      }
      if(e.which !== 13 /* ENTER */) {
        return;
      }
      sendCorrection($(this).parent(), stamp+writer);
    });
    $line.parent().find('input').first().focus();

    $correctLog.scrollTop($correctLog.prop('scrollHeight'));
  });

  socket.on('speechDelay', function(delay) {
    state.delay = delay;
    $('.part.shortcuts > .delay').val(delay);
  });

  function updateWritersList() {
    var $ul = $('.writers > ul').empty();
    for(var writer in state.writers) {
      $('<li>')
      .text([
        writer,
        (state.writers[writer].admin ? '*' : ''),
        (state.writers[writer].speech ? '<' : ''),
        (state.writers[writer].cnt > 1 ? ' ×'+state.writers[writer].cnt : '')
      ].join(''))
      .css('color', state.writers[writer].color || 'black')
      .appendTo($ul);
    }
  }
});
/* vim: ts=4:sw=4:noet
 */
