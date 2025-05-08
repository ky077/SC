$(document).ready(function () {
  // 帶有?viewTopic=true [閱覽題目]時...
  if (params.has('viewTopic') && params.get('viewTopic') === 'true') {

    // 銷毀tooltip，讓[NEXT]可點選 
    let tooltipElement = $('.test-btn').find('[data-bs-toggle="tooltip"]');
    let tooltipInstance = tooltipElement.length ? bootstrap.Tooltip.getInstance(tooltipElement[0]) : null;
    if (tooltipInstance) tooltipInstance.dispose(); // 銷毀 Tooltip
    $('.test-btn [data-bs-toggle="tooltip"]>').unwrap();
    $('.test-btn .btn').removeClass('disabled');

    // demo假裝題號
    const pageName = window.location.pathname.split("/").pop().replace(".html", "");
    let topicNum;
    switch (pageName) {
      //題組    
      case 'listening-01':
        topicNum = '1';
        break;
      case 'listening-02':
        topicNum = '2';
        break;
      case 'listening-03':
        topicNum = '3';
        break;
      case 'listening-04':
        topicNum = '4';
        break;
      case 'listening-05':
        topicNum = '5';
        break;
      case 'listening-06':
        topicNum = '6';
        break;
      case 'listening-07':
        topicNum = '7';
        break;
      case 'reading-01':
        topicNum = '8';
        break;
      case 'reading-02':
        topicNum = '9';
        break;
      case 'reading-03':
        topicNum = '10';
        break;
      case 'reading-04':
        topicNum = '11';
        break;
      case 'reading-05':
        topicNum = '12';
        break;
      case 'reading-06':
        topicNum = '13';
        break;
      case 'reading-07':
        topicNum = '14';
        break;
      case 'reading-08':
        topicNum = '15';
        break;
      case 'reading-09':
        topicNum = '16';
        break;
      case 'reading-10':
        topicNum = '17';
        break;
      case 'reading-11':
        topicNum = '18';
        break;
      case 'reading-12':
        topicNum = '19';
        break;
      case 'reading-13':
        topicNum = '20';
        break;
      default:
        break;
    }

    // 等待 header 載入完成後再執行刪除選單
    $('.header').load('master_header.html', function () {
      $('.header-navi .nav-item').remove();
    });

    // 浮水印
    $('.content .container').addClass('viewTopic-bg');

    // 顯示[PREV][顯示答案]按鈕
    $('.content .test-btn').wrap(`<div class="viewTopic-btn"></div>`)
      .before(`<div class="prev-btn">
									   <a role="button" class="btn btn-secondary btn-lg fw-bold" href="javascript:void(0);" onclick="window.history.back();">PREV</a>
									 </div>
									 <div class="view-btn">
									   <button type="button" class="btn btn-primary btn-lg fw-bold">顯示答案</button>
									 </div>`);

    // [顯示答案]click
    $(".content .view-btn").click(function () {
      $.getJSON("Content/json/correctAnswer.json", function (data) {
        // 找出符合當前題號的josn值
        let answerData = data.data.find(item => item.no === Number(topicNum));

        for (let i = 0; i < answerData.cAns.length; i++) {
          // 找出各題型答案(父)區塊 
          let parentDOM = '';
          switch (answerData.page) {
            //題組    
            case 'listening-07':
            case 'reading-07':
            case 'reading-08':
            case 'reading-09':
              parentDOM = '.q-wrapper > .q-content > .q-option .q-wrapper:nth-child(' + (i + 1) + ')';
              break;

              //下拉選單   
            case 'reading-10':
              parentDOM = '.q-wrapper > .q-content > .q-topic .select-section:nth-of-type(' + (i + 1) + ')';
              break;

              //輪播 
            case 'reading-11':
            case 'reading-12':
            case 'reading-13':
              parentDOM = '.q-wrapper > .q-content > .q-option .carousel-item:nth-child(' + (i + 1) + ')';
              break;

              //一般題    
            default:
              parentDOM = '.q-wrapper > .q-content > .q-option';
              break;
          }

          // 找出正確答案給予樣式
          let correctAns;
          // 下拉選單 
          if (answerData.page == 'reading-10') {
            correctAns = answerData.cAns[i];

            // 先銷毀selectpicker，設correctBg、val後再selectpicker
            $(parentDOM).find('select').selectpicker('destroy');
            $(parentDOM).find('select option[value="' + correctAns + '"]').addClass('correctBg');
            $(parentDOM).find('select').selectpicker('val', correctAns).selectpicker();
            //顯示答案後，不可下拉
            $(parentDOM).find('select').prop('disabled', true);

          }
          // 輪播圖片、輪播拖曳 
          else if (answerData.page == 'reading-11' || answerData.page == 'reading-12') { //待修正
            correctAns = answerData.cAns[i];

            //正確答案 (複製題目區符合區塊，放置至拖曳區)
            correctAns = $('.drag-section').find('.drag-draggable > span').filter(function () {
              return $(this).text().trim() === correctAns;
            });
            let correctAnsDOM = correctAns.closest('.drag-draggable').removeClass('correctBg ui-draggable-disabled').clone();
            $(parentDOM).find('.drop-section').html(correctAnsDOM);


          }
          // 其他選擇題
          else {
            let correctAns = $(parentDOM).find('.form-check-label span').filter(function () {
              return $(this).text().trim() === answerData.cAns[i];
            });

            correctAns.closest('.form-check').find('.form-check-input').prop('checked', true);
            correctAns.closest('.form-check').find('.form-check-label').addClass('correctBg');

            $(parentDOM).find('input').prop('disabled', true);
          }
        }
      });
    });

    // demo 第一題拿掉[PREV]按鈕
    if (pageName === 'listening-01') {
      $('.prev-btn .btn').remove();
    }
    // demo 最後一題拿掉[NEXT]按鈕，換[CLOSE]按鈕
    else if (pageName === 'reading-13') {
      $('.test-btn .btn').remove();
      $('.test-btn').append(`<button type="button" class="btn btn-secondary btn-lg fw-bold" onClick="window.close();">CLOSE</button>`);
    }

    // demo [NEXT]修改href
    $('.test-btn .btn').each(function () {
      var currentHref, changeHref;
      if (pageName === 'listening-07') { //listening-07.html 改連到 reading-01.html
        changeHref = 'reading-01.html';
        currentHref = changeHref;
      } else {
        currentHref = $(this).attr('href');
      }

      var newHref = currentHref.includes('?') ? currentHref + '&viewTopic=true' : currentHref + '?viewTopic=true';
      $(this).attr('href', newHref);
    });

  }
});
