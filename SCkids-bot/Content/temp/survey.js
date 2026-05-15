$(function () {
  var surveyData = null;
  var currentIndex = 0;
  var totalQuestions = 0;
  var currentLang = getCurrentLang();

  var $guide = $('.survey-guide');
  var $questions = $('.survey-Questions');
  var $actions = $('.survey-actions');
  var $end = $('.survey-end');

  var $previous = $('#Previous');
  var $next = $('#Next');
  var $submit = $('#Submit');

  init();

  function init() {
    $guide.show();
    $questions.hide();
    $actions.hide();
    $end.hide();

    $previous.hide();
    $next.hide();
    $submit.hide();

    $('.quiz-qa-group-tool .recording').hide();
    $('.quiz-qa-group-tool .recorded').hide();

    $.getJSON('Content/temp/survey.json')
      .done(function (data) {
        surveyData = data;
        totalQuestions = surveyData.questions.length;

        renderSurvey(surveyData);
        bindEvents();

        // 修正 1：初始進度條為 0
        setInitialProgress();

        applyLanguageByQuery();
      })
      .fail(function () {
        console.error('survey.json 載入失敗，請確認路徑 Content/temp/survey.json 是否正確。');
      });
  }

  function bindEvents() {
    $('#Start').off('click').on('click', function () {
      currentIndex = 0;

      $guide.hide();
      $end.hide();
      $questions.show();
      $actions.show();

      showQuestion(currentIndex);

      $('html, body').animate({
        scrollTop: $questions.offset().top - 80
      }, 500);
    });

    $previous.off('click').on('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        showQuestion(currentIndex);
      }
    });

    $next.off('click').on('click', function () {
      if (!validateCurrentQuestion()) {
        showRequiredAlert();
        return;
      }

      if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        showQuestion(currentIndex);
      }
    });

    $submit.off('click').on('click', function () {
      if (!validateCurrentQuestion()) {
        showRequiredAlert();
        return;
      }

      $guide.hide();
      $questions.hide();
      $actions.hide();
      $end.show();

      $('html, body').animate({
        scrollTop: $end.offset().top - 80
      }, 500);
    });

    $('#Back').off('click').on('click', function () {
      window.history.go(-2);
    });

    bindRecordButton();
  }

  function renderSurvey(data) {
    renderTitle(data);
    renderGuide(data);
    renderQuestions(data.questions);
    renderButtons(data);

    totalQuestions = data.questions.length;
    $('.progress-count span').eq(1).text(totalQuestions);
  }

  function renderTitle(data) {
    if (!data.surveyTitle) return;

    $('.tool-title .lang-main').html(textToHtml(data.surveyTitle.zh));
    $('.tool-title .lang-en').html(textToHtml(data.surveyTitle.en));
    $('.tool-title .lang-jp').html(textToHtml(data.surveyTitle.jp));
  }

  function renderGuide(data) {
    if (!data.guide) return;

    $guide.find('.lang-main').first().html(textToHtml(data.guide.zh));
    $guide.find('.lang-en').first().html(textToHtml(data.guide.en));
    $guide.find('.lang-jp').first().html(textToHtml(data.guide.jp));

    if (data.startButton) {
      $('#Start .lang-main').text(data.startButton.zh);
      $('#Start .lang-en').text(data.startButton.en);
      $('#Start .lang-jp').text(data.startButton.jp);
    }

    if (data.end) {
      $end.find('.lang-main').first().html(textToHtml(data.end.zh));
      $end.find('.lang-en').first().html(textToHtml(data.end.en));
      $end.find('.lang-jp').first().html(textToHtml(data.end.jp));
    }

    if (data.backButton) {
      $('#Back .lang-main').text(data.backButton.zh);
      $('#Back .lang-en').text(data.backButton.en);
      $('#Back .lang-jp').text(data.backButton.jp);
    }
  }

  function renderButtons(data) {
    if (data.submitButton) {
      $('#Submit .lang-main').text(data.submitButton.zh);
      $('#Submit .lang-en').text(data.submitButton.en);
      $('#Submit .lang-jp').text(data.submitButton.jp);
    }
  }

  function renderQuestions(questions) {
    var html = '';

    $.each(questions, function (index, question) {
      html += '<div class="survey-quiz" data-question-index="' + index + '" data-question-id="' + escapeHtml(question.id) + '" data-type="' + escapeHtml(question.type) + '" data-required="' + question.required + '">';
      html += '  <div class="quiz-num">' + escapeHtml(question.id) + '</div>';
      html += '  <div class="quiz-topic">';
      html += '    <div class="lang-main">' + textToHtml(question.title.zh) + '</div>';
      html += '    <div class="lang-en">' + textToHtml(question.title.en) + '</div>';
      html += '    <div class="lang-jp">' + textToHtml(question.title.jp) + '</div>';
      html += '  </div>';
      html += '  <div class="quiz-answer">';
      html += renderAnswer(question);
      html += '  </div>';
      html += '</div>';
    });

    $questions.html(html);
    $('.survey-quiz').hide();

    $('.quiz-qa-group-tool .recording').hide();
    $('.quiz-qa-group-tool .recorded').hide();
  }

  function renderAnswer(question) {
    var html = '';

    if (question.type === 'select') {
      var placeholderText = getLangText(question.placeholder);

      html += '<select class="form-select" name="' + escapeHtml(question.id) + '" aria-label="' + escapeHtml(question.id) + '">';
      html += '  <option value="" selected>' + escapeHtml(placeholderText) + '</option>';

      $.each(question.options, function (_, option) {
        html += '<option value="' + escapeHtml(option.value) + '">';
        html += escapeHtml(getLangText(option.label));
        html += '</option>';
      });

      html += '</select>';
    }

    if (question.type === 'radio' || question.type === 'checkbox') {
      html += '<div class="btn-group-vertical" role="group">';

      $.each(question.options, function (optionIndex, option) {
        var inputId = question.id + '-' + (optionIndex + 1);
        var inputName = question.id;
        var inputType = question.type;

        html += '<input type="' + inputType + '" class="btn-check" name="' + escapeHtml(inputName) + '" id="' + escapeHtml(inputId) + '" value="' + escapeHtml(option.value) + '" autocomplete="off">';
        html += '<label class="btn btn-outline-primary" for="' + escapeHtml(inputId) + '">';
        html += '  <span class="lang-main">' + escapeHtml(option.label.zh) + '</span>';
        html += '  <span class="lang-en">' + escapeHtml(option.label.en) + '</span>';
        html += '  <span class="lang-jp">' + escapeHtml(option.label.jp) + '</span>';
        html += '</label>';
      });

      html += '</div>';
    }

    if (question.type === 'textarea') {
      var textareaId = question.input && question.input.htmlId ? question.input.htmlId : question.id + '-textarea';

      html += '<div class="quiz-qa-group">';
      html += '  <div contenteditable="true" class="form-control" id="' + escapeHtml(textareaId) + '" data-name="' + escapeHtml(question.id) + '" placeholder=""></div>';
      html += '  <div class="quiz-qa-group-tool">';
      html += '    <div class="recording">錄製中</div>';
      html += '    <div class="recorded">';
      html += '      <button type="button" class="btn btn-success btn__playTitle" title="播放" onClick="PLAYTITLE(this, \'Content/temp/播放錄製完成.mp3\')"><span class="visually-hidden">播放</span></button>';
      html += '      <span>錄製完成</span>';
      html += '      <button type="button" class="btn btn-link btn__delete" title="刪除"><i class="fa-regular fa-trash-can"></i></button>';
      html += '    </div>';

      // 保留 main.js 的 REC()，不可更改
      html += '    <button type="button" class="btn btn-primary btn-sm btn__record ms-auto" onclick="REC(null, false)" title="錄製檔案"><i class="fa-solid fa-microphone" aria-hidden="true"></i></button>';
      html += '  </div>';
      html += '</div>';
    }

    return html;
  }

  function showQuestion(index) {
    $('.survey-quiz').hide();
    $('.survey-quiz').eq(index).show();

    updateActionButtons();
    updateProgress();

    $('html, body').animate({
      scrollTop: $questions.offset().top - 80
    }, 400);
  }

  function updateActionButtons() {
    $previous.hide();
    $next.hide();
    $submit.hide();

    if (currentIndex > 0) {
      $previous.show();
    }

    if (currentIndex < totalQuestions - 1) {
      $next.show();
    } else {
      $submit.show();
    }
  }

  // 修正 1：初始狀態顯示 0/12，進度條 0%
  function setInitialProgress() {
    $('.progress-count span').eq(0).text(0);
    $('.progress-count span').eq(1).text(totalQuestions);
    $('.progress-bar-fill').css('width', '0%');
  }

  function updateProgress() {
    var current = currentIndex + 1;
    var percent = totalQuestions > 0 ? (current / totalQuestions) * 100 : 0;

    $('.progress-count span').eq(0).text(current);
    $('.progress-count span').eq(1).text(totalQuestions);
    $('.progress-bar-fill').css('width', percent + '%');
  }

  function validateCurrentQuestion() {
    var $current = $('.survey-quiz').eq(currentIndex);
    var required = String($current.data('required')) === 'true';
    var type = $current.data('type');

    if (!required) {
      return true;
    }

    if (type === 'select') {
      return $.trim($current.find('select').val()) !== '';
    }

    if (type === 'radio') {
      return $current.find('input[type="radio"]:checked').length > 0;
    }

    if (type === 'checkbox') {
      return $current.find('input[type="checkbox"]:checked').length > 0;
    }

    if (type === 'textarea') {
      return $.trim($current.find('[contenteditable="true"]').text()) !== '';
    }

    return true;
  }

	function showRequiredAlert() {
		var message = getRequiredAlertMessage();

		if (typeof alertModalDOM === 'function') {
			alertModalDOM('<div class="text-center">' + textToHtml(message) + '</div>');
		} else {
			alert(message);
		}
	}

	function getRequiredAlertMessage() {
		var defaultMessage = '請先完成這一題再繼續喔！';

		if (!surveyData || !surveyData.requiredAlert) {
			return defaultMessage;
		}

		if (currentLang === 'en' && surveyData.requiredAlert.en) {
			return surveyData.requiredAlert.zh + ' ' + surveyData.requiredAlert.en;
		}

		if (currentLang === 'jp' && surveyData.requiredAlert.jp) {
			return surveyData.requiredAlert.zh + ' ' + surveyData.requiredAlert.jp;
		}

		return surveyData.requiredAlert.zh || defaultMessage;
	}

  // 修正 3：
  // 點選錄製按鈕後，會先執行 inline onclick="REC()"
  // REC() 會切換 .btn__record 的 active 狀態
  // 所以這裡要依照 active 判斷目前是錄製中或已停止
  function bindRecordButton() {
    $(document).off('click.surveyRecord', '.btn__record').on('click.surveyRecord', '.btn__record', function () {
      var $button = $(this);
      var $tool = $button.closest('.quiz-qa-group-tool');

      setTimeout(function () {
        if ($button.hasClass('active')) {
          // 開始錄製
          $tool.find('.recording').show();
          $tool.find('.recorded').hide();
        } else {
          // 停止錄製
          $tool.find('.recording').hide();
          $tool.find('.recorded').show();
        }
      }, 0);
    });

    $(document).off('click.surveyDeleteRecord', '.btn__delete').on('click.surveyDeleteRecord', '.btn__delete', function () {
      var $tool = $(this).closest('.quiz-qa-group-tool');

      $tool.find('.recording').hide();
      $tool.find('.recorded').hide();
    });
  }

  function applyLanguageByQuery() {
    if (currentLang === 'en') {
      $('.lang-en').show();
      $('.lang-jp').remove();
    } else if (currentLang === 'jp') {
      $('.lang-jp').show();
      $('.lang-en').remove();
    } else {
      $('.lang-en').remove();
      $('.lang-jp').remove();
    }
  }

  function getCurrentLang() {
    var params = new URLSearchParams(window.location.search);
    var lang = params.get('lang');

    if (lang === 'en') return 'en';
    if (lang === 'jp') return 'jp';

    return 'zh';
  }

  // 修正 2：
  // select 的 option 不能包 span，所以這裡直接輸出文字
  // lang=en：請選擇年齡 Please select your age
  // lang=jp：請選擇年齡 年齢を選んでください
  function getLangText(obj) {
    if (!obj) return '';

    if (currentLang === 'en') {
      return obj.zh + ' ' + obj.en;
    }

    if (currentLang === 'jp') {
      return obj.zh + ' ' + obj.jp;
    }

    return obj.zh;
  }

  function textToHtml(text) {
    if (!text) return '';
    return escapeHtml(text).replace(/\n/g, '<br>');
  }

  function escapeHtml(text) {
    if (text === undefined || text === null) return '';

    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});