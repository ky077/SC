// 問卷資料 JSON
  var surveyData = null;

  function loadSurveyData() {
    return $.getJSON('Content/temp/survey.json')
      .done(function (data) {
        surveyData = data;
        renderSurveyMeta();
        renderSurvey();
        applyLanguageByQuery();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('survey.json 載入失敗：', textStatus, errorThrown);
        $('#surveyQuestions').html('<div class="alert alert-danger" role="alert">問卷資料載入失敗，請確認 survey.json 與 survey.html 放在同一層目錄，並透過 localhost / 網頁伺服器開啟。</div>');
      });
  }

  function safeValue(value) {
    return value == null ? '' : value;
  }

  function getQueryParam(name) {
    var query = window.location.search || '';
    var pairs;
    var i;
    var pair;
    var key;
    var value;

    if (query.charAt(0) === '?') {
      query = query.substring(1);
    }

    pairs = query.split('&');

    for (i = 0; i < pairs.length; i += 1) {
      if (!pairs[i]) continue;

      pair = pairs[i].split('=');
      key = decodeURIComponent((pair[0] || '').replace(/\+/g, ' '));

      if (key === name) {
        value = pair.length > 1 ? pair.slice(1).join('=') : '';
        return decodeURIComponent(value.replace(/\+/g, ' '));
      }
    }

    return '';
  }

  function applyLanguageByQuery() {
    var lang = String(getQueryParam('lang')).toLowerCase();

    if (lang === 'en') {
      $('.lang-jp').remove();
    }

    if (lang === 'jp') {
      $('.lang-en').remove();
    }
  }

  function escapeHtml(value) {
    return String(safeValue(value))
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderLangText(textGroup, tagName) {
    tagName = tagName || 'span';
    if (!textGroup) return '';

    return '' +
      '<' + tagName + ' class="lang-main">' + escapeHtml(textGroup.zh) + '</' + tagName + '>' +
      '<' + tagName + ' class="lang-en">' + escapeHtml(textGroup.en) + '</' + tagName + '>' +
      '<' + tagName + ' class="lang-jp">' + escapeHtml(textGroup.jp) + '</' + tagName + '>';
  }

  function renderQuestionTitle(question) {

    return '' +
      '<div class="quiz-topic">' +
        renderLangText(question.title, 'span') +
      '</div>';
  }

  function renderSelect(question) {
    var placeholder = question.placeholder || {};
    var optionsHtml = '';

    $.each(question.options || [], function (index, option) {
      var label = option.label || {};
      optionsHtml += '<option value="' + escapeHtml(option.value) + '">' + escapeHtml(label.zh) + '</option>';
    });

    return '' +
      '<select class="form-select survey-field" name="' + escapeHtml(question.id) + '" id="' + escapeHtml(question.id) + '" ' + (question.required ? 'required' : '') + ' aria-label="' + escapeHtml(question.title && question.title.zh) + '">' +
        '<option value="" selected disabled>' + escapeHtml(placeholder.zh || '請選擇') + '</option>' +
        optionsHtml +
      '</select>';
  }

  function renderChoice(question) {
    var inputType = question.type === 'checkbox' ? 'checkbox' : 'radio';
    var name = question.type === 'checkbox' ? question.id + '[]' : question.id;
    var optionsHtml = '';

    $.each(question.options || [], function (index, option) {
      var optionId = question.id + '-' + (index + 1);
      optionsHtml += '' +
        '<input type="' + inputType + '" class="btn-check survey-field" name="' + escapeHtml(name) + '" id="' + escapeHtml(optionId) + '" value="' + escapeHtml(option.value) + '" autocomplete="off" ' + (question.required && index === 0 && inputType === 'radio' ? 'required' : '') + '>' +
        '<label class="btn btn-outline-primary" for="' + escapeHtml(optionId) + '">' +
          renderLangText(option.label, 'span') +
        '</label>';
    });

    return '<div class="btn-group-vertical" role="group">' + optionsHtml + '</div>';
  }

  function renderTextarea(question) {
    var inputConfig = question.input || {};
    var htmlId = inputConfig.htmlId || (question.id + '-textarea');
    var recordButton = '';

    if (inputConfig.allowVoiceRecord) {
      recordButton = '' +
        '<button type="button" class="btn btn-primary btn-sm btn__record" onclick="REC(null, true)" title="錄製檔案">' +
          '<i class="fa-solid fa-microphone" aria-hidden="true"></i>' +
        '</button>';
    }

    return '' +
      '<div class="quiz-qa-group">' +
        '<div contenteditable="' + (inputConfig.contentEditable ? 'true' : 'false') + '" class="form-control survey-field" id="' + escapeHtml(htmlId) + '" data-name="' + escapeHtml(question.id) + '" role="textbox" aria-label="' + escapeHtml(question.title && question.title.zh) + '"></div>' +
        recordButton +
      '</div>';
  }

  function renderAnswer(question) {
    var answerHtml = '';

    if (question.type === 'select') {
      answerHtml = renderSelect(question);
    } else if (question.type === 'radio' || question.type === 'checkbox') {
      answerHtml = renderChoice(question);
    } else if (question.type === 'textarea') {
      answerHtml = renderTextarea(question);
    }

    return '<div class="quiz-answer">' + answerHtml + '</div>';
  }

  function nl2br(value) {
    return escapeHtml(value).replace(/\n/g, '<br>');
  }

  function renderMultilineLangText(textGroup) {
    if (!textGroup) return '';

    return '' +
      '<div class="lang-main">' + nl2br(textGroup.zh) + '</div>' +
      '<div class="lang-en">' + nl2br(textGroup.en) + '</div>' +
      '<div class="lang-jp">' + nl2br(textGroup.jp) + '</div>';
  }

  function renderSurveyMeta() {
    if (!surveyData) return;

    if (surveyData.surveyTitle) {
      $('.tool-title').html('' +
        '<div class="lang-main">' + escapeHtml(surveyData.surveyTitle.zh) + '</div>' +
        '<small class="lang-en">' + escapeHtml(surveyData.surveyTitle.en) + '</small>' +
        '<small class="lang-jp">' + escapeHtml(surveyData.surveyTitle.jp) + '</small>'
      );
    }

    if (surveyData.guide || surveyData.scrollButton) {
      $('.survey-guide').html('' +
        renderMultilineLangText(surveyData.guide) +
        '<button type="button" class="survey-scroll-btn">' +
          renderLangText(surveyData.scrollButton, 'span') +
        '</button>'
      );
    }

    if (surveyData.submitButton) {
      $('.survey-send-btn').html('' +
        renderLangText(surveyData.submitButton, 'span') +
        '<i class="fa-regular fa-paper-plane"></i>'
      );
    }
  }

  function renderSurvey() {
    var questionsHtml = '';

    $.each(surveyData.questions || [], function (index, question) {
      questionsHtml += '' +
        '<div class="survey-quiz" data-question-id="' + escapeHtml(question.id) + '" data-question-type="' + escapeHtml(question.type) + '">' +
          '<div class="quiz-num">' + escapeHtml(question.id) + '</div>' +
          renderQuestionTitle(question) +
          renderAnswer(question) +
        '</div>';
    });

    $('#surveyQuestions').html(questionsHtml);
  }

  function getSurveyAnswers() {
    var answers = {};

    $.each(surveyData.questions || [], function (index, question) {
      var inputConfig;
      var htmlId;

      if (question.type === 'select') {
        answers[question.id] = $('#' + question.id).val() || '';
      }

      if (question.type === 'radio') {
        answers[question.id] = $('input[name="' + question.id + '"]:checked').val() || '';
      }

      if (question.type === 'checkbox') {
        answers[question.id] = $('input[name="' + question.id + '[]"]:checked').map(function () {
          return $(this).val();
        }).get();
      }

      if (question.type === 'textarea') {
        inputConfig = question.input || {};
        htmlId = inputConfig.htmlId || (question.id + '-textarea');
        answers[question.id] = $.trim($('#' + htmlId).text());
      }
    });

    return answers;
  }

  $(function () {
    loadSurveyData();

    $('.survey-send-btn').on('click', function () {
      var answers;

      if (!surveyData) {
        alert('問卷資料尚未載入完成，請稍後再試。');
        return;
      }

      answers = getSurveyAnswers();
      console.log('survey answers:', answers);

      // TODO: 可在這裡改成 AJAX 送出
      // $.ajax({
      //   url: '/api/survey',
      //   method: 'POST',
      //   contentType: 'application/json',
      //   data: JSON.stringify(answers)
      // });
    });
  });