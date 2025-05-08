$(document).ready(function () {
  //call header 
  $('.header').load('master_header.html');
});


// demo 播放題目 ///////////////////////////////////////////////// 
$('.btn-play').click(function (e) {
  PLAYTOPIC(e, 'Content/temp/模擬點選播放題目.mp3')
});

function PLAYTOPIC(e, mp3) {
  //播放中閃爍效果+按鈕失效(防重複播放)
  $(e.target).addClass('playing').prop('disabled', true);

  //播放音效
  var audio = new Audio(mp3);
  var isPlaying = false;

  if (!isPlaying) {
    audio.play();
    isPlaying = true;
  }

  audio.addEventListener('ended', function () {
    isPlaying = false;

    //結束播放移除閃爍效果+按鈕恢復
    $(e.target).removeClass('playing').prop('disabled', false);
  });
}

//d emo ?pinyin=0 無拼音模式 ///////////////////////////////////////////////// 
let params = new URLSearchParams(document.location.search);
let pinyin;
if (params.has("pinyin")) {
  pinyin = params.get("pinyin");
}
if (pinyin == 0) {
  $('ruby rt').hide();
  /*$('ruby rt').text('');*/ //rt隱藏或無字皆可
}

// [NEXT]狀態 ///////////////////////////////////////////////// 
// 預設 [NEXT]
$('.test-btn .btn').addClass('disabled').wrap('<span data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Please complete this question first before moving on to the next one.">');

// 初始化BS Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// radio check 
var radioGroups = {};
$('input[type="radio"]').each(function () {
  var name = $(this).attr('name');
  radioGroups[name] = true;
});
var groupCount = Object.keys(radioGroups).length; // radio 群組數量

$('input[type="radio"]').change(function () {
  let radioChecked = $('input[type="radio"]:checked').length; // radio:checked 數量
  let tooltipElement = $('.test-btn').find('[data-bs-toggle="tooltip"]');

  if (tooltipElement.length) { //有tooltip再執行
    if (radioChecked === groupCount) { // radio 全勾選則開啟按鈕+銷毀tooltip
      $('.test-btn .btn').removeClass('disabled');

      let tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement[0]);
      tooltipInstance.dispose(); // 銷毀 Tooltip
    } else {
      $('.test-btn .btn').addClass('disabled'); // 不可無選擇故無銷毀tooltip

      let tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement[0]);
      tooltipInstance.enable();
    }
  }
});


//select check (reading-10.html)
$('select').change(function () {
  var allSelected = true;
  let tooltipElement = $('.test-btn').find('[data-bs-toggle="tooltip"]');

  if (tooltipElement.length) { //有tooltip再執行
    $('select').each(function () {
      if (!$(this).val()) {
        allSelected = false;
        return false;
      }
    });

    if (allSelected) {
      $('.test-btn .btn').removeClass('disabled');

      let tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement[0]);
      tooltipInstance.disable();
    } else {
      $('.test-btn .btn').addClass('disabled');

      let tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement[0]);
      tooltipInstance.enable();

    }
  }
});


// drag&drop check (分別寫在 reading-11.html、reading-12.html 裡) ///////////////////////////////////////////////// 

// carousel 箭頭隱藏 ///////////////////////////////////////////////// 
// 預設初始是第一張投影片，prev按鈕隱藏
$(".carousel-control-prev").hide();

// 輪播完成後，依當前投影片設定 prev、next 顯示與否
$('#option-carousel').on('slid.bs.carousel', function (e) {
  if ($(this).find('.carousel-inner .carousel-item:first').hasClass('active')) {
    $(".carousel-control-prev").hide();
  } else if ($(this).find('.carousel-inner .carousel-item:last').hasClass('active')) {
    $(".carousel-control-next").hide();
  } else {
    $(".carousel-control-prev").show();
    $(".carousel-control-next").show();
  }
});


//alertModal 警報視窗 (無右上X，不可點黑處關閉)
function alertModalDOM(html) {
  $('body').append(`<div class="modal fade" id="alertModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body pt-5">`
    + html
    + `<div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal">確定</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
  var myModal = new bootstrap.Modal(document.getElementById('alertModal'));
  myModal.show();

  $('#alertModal').on('hidden.bs.modal', function () {
    $(this).remove();
  });
}

//confirmModal 確認視窗 (無右上X，不可點黑處關閉)
function confirmModalDOM(html) {
  $('body').append(`<div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body pt-5">`
    + html
    + `<div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-outline-primary rounded-pill px-4" data-bs-dismiss="modal">取消</button>
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal" id="CONFIRM_OK">確定</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
  var myModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  myModal.show();

  $('#confirmModal').on('hidden.bs.modal', function () {
    $(this).remove();
  });
}
