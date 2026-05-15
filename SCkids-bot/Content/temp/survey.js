$(function () {
  const SURVEY_JSON_PATHS = ['Content/temp/survey.json', 'survey.json'];
  const $questions = $('#surveyQuestions');
  const $guide = $('.survey-guide');
  const $actions = $('.survey-actions');
  const $end = $('.survey-end');
  const $submit = $('#Submit');

  let surveyData = null;
  const currentLang = getCurrentLang();

  initSurvey();

  function initSurvey() {
    $end.hide();
    $submit.prop('disabled', true);
    loadSurveyJson(0);
    bindSurveyEvents();
  }

  function loadSurveyJson(index) {
    $.getJSON(SURVEY_JSON_PATHS[index])
      .done(function (data) {
        surveyData = data;
        renderSurvey(data);
        applyLangVisibility();
        validateSurvey();
      })
      .fail(function () {
        if (index + 1 < SURVEY_JSON_PATHS.length) {
          loadSurveyJson(index + 1);
        } else {
          console.error('survey.json 載入失敗');
        }
      });
  }

  function bindSurveyEvents() {
    $(document).on('click', '#Start', function (e) {
      e.preventDefault();
      scrollToQuiz(getQuizById('Q1'));
    });

    $questions.on('change input keyup blur', 'select, input, [contenteditable="true"]', function () {
      validateSurvey();
    });

    // 單選題完成後自動滑動到下一題；例如 Q2 -> Q3、Q4 -> Q5。
    $questions.on('change', 'input[type="radio"]', function () {
      autoScrollToNextQuiz($(this));
    });

    // 下拉題完成後自動滑動到下一題；例如 Q1 -> Q2。
    $questions.on('change', 'select', function () {
      if ($(this).val()) {
        autoScrollToNextQuiz($(this));
      }
    });

    // 多選題 checkbox 不自動滑動，讓使用者自行往下一題。

    $questions.on('click', '.btn__record', function () {
      const $tool = $(this).closest('.quiz-qa-group-tool');
      window.setTimeout(function () {
        if ($tool.find('.btn__record').hasClass('active')) {
          $tool.find('.recorded').hide();
          $tool.find('.recording').show();
        }
      }, 0);
    });

    $questions.on('click', '.btn__delete', function () {
      const $tool = $(this).closest('.quiz-qa-group-tool');
      $tool.find('.recorded, .recording').hide();
    });

    $submit.on('click', function () {
      if ($(this).prop('disabled')) return;
      $guide.hide();
      $questions.hide();
      $actions.hide();
      $end.show();
      $('html, body').animate({ scrollTop: $end.offset().top - 80 }, 500);
    });

    $(document).on('click', '#Back', function (e) {
      e.preventDefault();
      history.go(-2);
    });
  }

  window.chat_analyze = function () {
    const $tool = $('.quiz-qa-group-tool');
    $tool.find('.recording').hide();
    $tool.find('.recorded').show();
  };

  function renderSurvey(data) {
    renderTitle(data.surveyTitle);
    renderGuide(data.guide, data.startButton);
    renderQuestions(data.questions || []);
    renderSubmitButton(data.submitButton);
    renderEnd(data.end, data.backButton);
  }

  function renderTitle(title) {
    if (!title) return;
    $('.tool-title').html(
      '<div class="lang-main">' + escapeHtml(title.zh) + '</div>' +
      '<small class="lang-en">' + escapeHtml(title.en) + '</small>' +
      '<small class="lang-jp">' + escapeHtml(title.jp) + '</small>'
    );
  }

  function renderGuide(guide, startButton) {
    if (!guide) return;
    $guide.html(
      langBlock(guide, 'div', true) +
      '<button type="button" class="survey-scroll-btn" id="Start">' +
        langBlock(startButton, 'span') +
        '<i class="fa-solid fa-arrow-down"></i>' +
      '</button>'
    );
  }

  function renderQuestions(questions) {
    $questions.empty();
    $.each(questions, function (_, question) {
      $questions.append(renderQuestion(question));
    });
  }

  function renderQuestion(question) {
    const requiredAttr = question.required ? ' data-required="true"' : ' data-required="false"';
    return '' +
      '<div class="survey-quiz" id="' + safeAttr(question.id) + '" data-question-id="' + safeAttr(question.id) + '" data-type="' + safeAttr(question.type) + '"' + requiredAttr + '>' +
        '<div class="quiz-num">' + escapeHtml(question.id) + '</div>' +
        '<div class="quiz-topic">' + langBlock(question.title, 'div') + '</div>' +
        '<div class="quiz-answer">' + renderAnswer(question) + '</div>' +
      '</div>';
  }

  function renderAnswer(question) {
    switch (question.type) {
      case 'select':
        return renderSelect(question);
      case 'radio':
        return renderChoice(question, 'radio');
      case 'checkbox':
        return renderChoice(question, 'checkbox');
      case 'textarea':
        return renderTextarea(question);
      default:
        return '';
    }
  }

  function renderSelect(question) {
    let html = '<select class="form-select" name="' + safeAttr(question.id) + '" aria-label="' + safeAttr(getLangText(question.title, question.id)) + '">';
    html += '<option value="" selected>' + escapeHtml(getLangText(question.placeholder, '請選擇')) + '</option>';
    $.each(question.options || [], function (_, option) {
      html += '<option value="' + safeAttr(option.value) + '">' + escapeHtml(getLangText(option.label, option.value)) + '</option>';
    });
    html += '</select>';
    return html;
  }

  function renderChoice(question, type) {
    let html = '<div class="btn-group-vertical" role="group">';
    $.each(question.options || [], function (index, option) {
      const inputId = question.id + '-' + (index + 1);
      html +=
        '<input type="' + type + '" class="btn-check" name="' + safeAttr(question.id) + '" id="' + safeAttr(inputId) + '" value="' + safeAttr(option.value) + '" autocomplete="off">' +
        '<label class="btn btn-outline-primary" for="' + safeAttr(inputId) + '">' + langBlock(option.label, 'span') + '</label>';
    });
    html += '</div>';
    return html;
  }

  function renderTextarea(question) {
    const htmlId = question.input && question.input.htmlId ? question.input.htmlId : question.id + '-textarea';
    return '' +
      '<div class="quiz-qa-group">' +
        '<div contenteditable="true" class="form-control" id="' + safeAttr(htmlId) + '" role="textbox" aria-label="' + safeAttr(getLangText(question.title, question.id)) + '"></div>' +
        '<div class="quiz-qa-group-tool">' +
          '<div class="recording" style="display: none;">錄製中</div>' +
          '<div class="recorded" style="display: none;">' +
            '<button type="button" class="btn btn-success btn__playTitle" title="播放" onClick="PLAYTITLE(this, \'Content/temp/播放錄製完成.mp3\')"><span class="visually-hidden">播放</span></button>' +
            '<span>錄製完成</span>' +
            '<button type="button" class="btn btn-link btn__delete" title="刪除"><i class="fa-regular fa-trash-can"></i></button>' +
          '</div>' +
          '<button type="button" class="btn btn-primary btn-sm btn__record ms-auto" onclick="REC(null, true)" title="錄製檔案"><i class="fa-solid fa-microphone" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>';
  }

  function renderSubmitButton(submitButton) {
    if (!submitButton) return;
    $submit.html(langBlock(submitButton, 'span') + '<i class="fa-regular fa-paper-plane"></i>');
  }

  function renderEnd(end, backButton) {
    if (!end) return;
    $end.html(
      langBlock(end, 'div', true) +
      '<a href="javascript:history.go(-2);" role="button" class="btn btn-outline-primary rounded-pill" id="Back">' +
        langBlock(backButton, 'span') +
        '<i class="fa-solid fa-arrow-right"></i>' +
      '</a>'
    ).hide();
  }

  function validateSurvey() {
    let isValid = true;
    $questions.find('.survey-quiz[data-required="true"]').each(function () {
      if (!isQuestionAnswered($(this))) {
        isValid = false;
        return false;
      }
    });
    $submit.prop('disabled', !isValid);
  }

  function isQuestionAnswered($quiz) {
    const type = $quiz.data('type');
    if (type === 'select') {
      return !!$quiz.find('select').val();
    }
    if (type === 'radio') {
      return $quiz.find('input[type="radio"]:checked').length > 0;
    }
    if (type === 'checkbox') {
      return $quiz.find('input[type="checkbox"]:checked').length > 0;
    }
    if (type === 'textarea') {
      return $.trim($quiz.find('[contenteditable="true"]').text()).length > 0;
    }
    return true;
  }

  function getQuizById(id) {
    return $questions.find('.survey-quiz[data-question-id="' + id + '"], #' + id).first();
  }

  function autoScrollToNextQuiz($field) {
    const $quiz = $field.closest('.survey-quiz');
    const $nextQuiz = $quiz.next('.survey-quiz');
    scrollToQuiz($nextQuiz);
  }

  function scrollToQuiz($target) {
    if (!$target || !$target.length) return;
    $('html, body').stop(true).animate({ scrollTop: $target.offset().top - 80 }, 500);
  }

  function langBlock(data, tag, useBreaks) {
    data = data || {};
    return '' +
      '<' + tag + ' class="lang-main">' + formatLangText(data.zh, useBreaks) + '</' + tag + '>' +
      '<' + tag + ' class="lang-en">' + formatLangText(data.en, useBreaks) + '</' + tag + '>' +
      '<' + tag + ' class="lang-jp">' + formatLangText(data.jp, useBreaks) + '</' + tag + '>';
  }



  function getCurrentLang() {
    const params = new URLSearchParams(window.location.search);
    const lang = (params.get('lang') || '').toLowerCase();
    return lang === 'en' || lang === 'jp' ? lang : 'zh';
  }

  function applyLangVisibility() {
    if (currentLang === 'en') {
      $('.lang-en').show();
      $('.lang-jp').remove();
    } else if (currentLang === 'jp') {
      $('.lang-jp').show();
      $('.lang-en').remove();
    }
  }

  function getLangText(data, fallback) {
    data = data || {};
    if (currentLang === 'en' && data.en) return data.en;
    if (currentLang === 'jp' && data.jp) return data.jp;
    return data.zh || fallback || '';
  }

  function formatLangText(text, useBreaks) {
    const escaped = escapeHtml(text || '');
    return useBreaks ? escaped.replace(/\n/g, '<br>') : escaped;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeAttr(value) {
    return escapeHtml(value);
  }
});
