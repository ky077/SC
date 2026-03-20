$(document).ready(function () {
  //初始化BS Tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  });
});

//播放題目
function PLAYTITLE(button, item) {
  let button_now = $(button),
    button_next = $('.btn__record');

  //播放中閃爍效果
  button_now.addClass('current');

  //模擬播放音效
  var audio = new Audio(item);
  var isPlaying = false;

  if (!isPlaying) {
    audio.play();
    isPlaying = true;

    // 禁用按鈕  
    button_now.prop('disabled', true);
  }
  audio.addEventListener('ended', function () {
    isPlaying = false;

    // 啟用按鈕  
    button_now.prop('disabled', false);

    //結束播放，移除閃爍效果
    button_now.removeClass('current');
  });
}

//錄製音檔
let interval;
let isRecording = false; // 用於追蹤是否正在錄音
function REC(s, isChatInterface) { 
  let button_now = $('.btn__record');
  let button_disabled = $('.btn__playRec'); //用於 practiceInterface
  if (!isRecording) {
    // 開始錄音
    isRecording = true;

    // 禁用播放按鈕，用於 practiceInterface
    button_disabled.addClass('disabled');

    // 顯示錄製中效果
    button_now.attr('title', '停止錄製'); //更改title  
    button_now.addClass('active current'); //增加閃爍效果
    button_now.html('<i class="fa-solid fa-stop" aria-hidden="true"></i>'); //更改按鈕狀態  

    // 倒數秒數：判斷是否提供了參數 s (用於是否限制錄音時間)
    if (s) {
      let sec = parseInt(s, 10); // 將秒數轉換為整數
      //button_count.find('.sec').text(sec < 10 ? '0' + sec : sec);

      interval = setInterval(function () {
        sec--;
        //button_count.find('.sec').text(sec < 10 ? '0' + sec : sec);

        if (sec < 0) {
          // 錄音時間到，停止錄音
          stopRecording(button_now, button_disabled, isChatInterface);
        }
      }, 1000);
    }
  } else {
    // 再次點選則停止錄音
    stopRecording(button_now, button_disabled, isChatInterface);
  }
}

function stopRecording(button_now, button_disabled, isChatInterface) { 
  isRecording = false;

  // 清除倒數計時器（如果存在）
  clearInterval(interval);

  // 停止錄音效果
  button_now.attr('title', '錄製檔案'); //更改title 	
  button_now.removeClass('active current').blur(); //移除閃爍效果
  button_now.html('<i class="fa-solid fa-microphone fa-1x" aria-hidden="true"></i>'); //更改按鈕狀態	

  // 啟用播放按鈕，用於 practiceInterface
  button_disabled.removeClass('disabled');

  //啟動分析，用於 chatInterface
  if (isChatInterface) {
    chat_analyze();
  }
}

//播放錄音
let audio = new Audio();
let isPlaying = false;
let hasPlayed = false;

function PLAYREC(src) {
  let button_now = $('.btn__playRec'),
    button_disabled = $('.btn__record');

  if (isPlaying) {
    audio.pause();
  } else {
    if (!hasPlayed || audio.ended) {
      audio.src = src;
      hasPlayed = true;
    }
    audio.play();
  }

  audio.addEventListener('play', function () { //播放中
    isPlaying = true;

    // 禁用錄製按鈕，用於 practiceInterface
    button_disabled.addClass('disabled');

    button_now.attr('title', '停止播放'); //更改title
    button_now.addClass('current').blur(); //增加閃爍效果 
    button_now.html('<i class="fa-solid fa-pause" aria-hidden="true"></i>'); //更改按鈕樣式
  });

  audio.addEventListener('pause', function () { //播放暫停
    isPlaying = false;

    button_now.attr('title', '播放錄音'); //更改title	
    button_now.removeClass('current').blur(); //移除閃爍效果
    button_now.html('<i class="fa-solid fa-play" aria-hidden="true"></i>'); //更改按鈕狀態

    // 啟用播放按鈕，用於 practiceInterface
    button_disabled.removeClass('disabled');
  });

  audio.addEventListener('ended', function () { //播放完
    isPlaying = false;

    button_now.attr('title', '播放錄音'); //更改title	
    button_now.removeClass('current'); //移除閃爍效果
    button_now.html('<i class="fa-solid fa-play" aria-hidden="true"></i>'); //更改按鈕狀態

    // 啟用播放按鈕，用於 practiceInterface
    button_disabled.removeClass('disabled');
  });
}

//停止播放錄音
function STOPAUDIO(button_now, button_next) {
  if (!audio.paused) {
    audio.pause();
    audio.currentTime = 0;

    button_now.attr('title', '播放錄音'); //更改title	
    button_now.removeClass('current'); //移除閃爍效果
    button_now.html('<i class="fa-solid fa-play" aria-hidden="true"></i>'); //更改按鈕狀態
  }
}

//lightbox大螢幕圖片
function lightboxModal(e) {
  var _getSrc = e.getAttribute('href');

  $('body').append(`<div class="modal fade lightbox2" id="lightboxModal" tabindex="-1" aria-hidden="true">
                          <div class="modal-dialog modal-dialog-centered modal-xl">
                            <div class="modal-content">
                              <div class="modal-body">
                                <div>
                                  <button type="button" class="btn-close btn-close-white float-end" data-bs-dismiss="modal" aria-label="Close"></button>
                                  <img src="" class="img-fluid" alt=""/></div>
                              </div>
                            </div>
                          </div>
                        </div>`);

  $('#lightboxModal .modal-body img').attr('src', _getSrc);

  const myModal = new bootstrap.Modal('#lightboxModal');
  myModal.show();

  const myModalEl = document.getElementById('lightboxModal');
  myModalEl.addEventListener('hidden.bs.modal', event => {
    if (myModalEl.parentNode !== null) {
      myModalEl.parentNode.removeChild(myModalEl);
    }
  })

  return false;
}

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

  const myModalEl = document.getElementById('alertModal');
  myModalEl.addEventListener('hidden.bs.modal', event => {
    if (myModalEl.parentNode !== null) {
      myModalEl.parentNode.removeChild(myModalEl);
    }
  })
}

//confirmModal 確認視窗 (無右上X，不可點黑處關閉)
function confirmModalDOM(html) {
  $('body').append(`<div class="modal fade" id="confirmModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body pt-5">`
    + html
    + `<div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-primary rounded-pill px-4 mx-2" data-bs-dismiss="modal">取消</button>  
                          <button type="button" class="btn btn-primary rounded-pill px-4 mx-2" data-bs-dismiss="modal" id="OK">確定</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
  var myModal = new bootstrap.Modal(document.getElementById('confirmModal'));
  myModal.show();

  const myModalEl = document.getElementById('confirmModal');
  myModalEl.addEventListener('hidden.bs.modal', event => {
    if (myModalEl.parentNode !== null) {
      myModalEl.parentNode.removeChild(myModalEl);
    }
  })
}

//msgModalDOM 訊息視窗 (有右上X，可點黑處關閉)
function msgModalDOM(html) {
  $('body').append(`<div class="modal fade" id="msgModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body">
                        <div class="text-end mb-3">
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>`
    + html
    + `<div class="text-center mt-4 mb-3">
                          <button type="button" class="btn btn-primary rounded-pill px-4" data-bs-dismiss="modal">關閉</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>`);
  var myModal = new bootstrap.Modal(document.getElementById('msgModal'));
  myModal.show();

  const myModalEl = document.getElementById('confirmModal');
  myModalEl.addEventListener('hidden.bs.modal', event => {
    if (myModalEl.parentNode !== null) {
      myModalEl.parentNode.removeChild(myModalEl);
    }
  })
}

//feedbackModal 回饋視窗
function feedbackModalDOM(v1, v2, v3, v4) {
  $('body').append(`<div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                      <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h4 class="modal-title fs-5 text-primary" id="feedbackModalLabel"><label class="me-1">Task 1</label>紀錄及回饋</h4>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <h5 class="h6 feedback-h5">2020.10.10</h5>
                            <div class="row row-cols-1 g-0 feedback-card-group px-3">
                              <div class="col">
                                <div class="card feedback-card-text">
                                  <div class="card-body">
                                    <div class="row">
                                      <div class="col-2 col-xl-1 px-0 px-md-2"> <img src="Content/images/feedback/text.png" alt="text.png"/> </div>
                                      <div class="col-10 col-xl-11">
                                        <h5 class="card-title">內容</h5>
                                        <p class="card-text">` + v1 + `</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col">
                                <div class="card feedback-card-phonology">
                                  <div class="card-body">
                                    <div class="row">
                                      <div class="col-2 col-xl-1 px-0 px-md-2"> <img src="Content/images/feedback/phonology.png" alt="phonology.png"/> </div>
                                      <div class="col-10 col-xl-11">
                                        <h5 class="card-title">音韻</h5>
                                        <p class="card-text">` + v2 + `</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col">
                                <div class="card feedback-card-words">
                                  <div class="card-body">
                                    <div class="row">
                                      <div class="col-2 col-xl-1 px-0 px-md-2"> <img src="Content/images/feedback/words.png" alt="words.png"/> </div>
                                      <div class="col-10 col-xl-11">
                                        <h5 class="card-title">詞語</h5>
                                        <p class="card-text">` + v3 + `</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="col">
                                <div class="card feedback-card-overall">
                                  <div class="card-body">
                                    <div class="row">
                                      <div class="col-2 col-xl-1 px-0 px-md-2"> <img src="Content/images/feedback/overall.png" alt="overall.png"/> </div>
                                      <div class="col-10 col-xl-11">
                                        <h5 class="card-title">整體表現</h5>
                                        <p class="card-text">` + v4 + `</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="text-center"> <a href="feedback.html" role="button" class="btn btn-primary btn-lg rounded-pill px-5 m-3" id="GO_FEEDBACK">以往紀錄及回饋</a> <a href="partIndex.html" role="button" class="btn btn-primary btn-lg rounded-pill px-5 m-3" id="GO_PARTINDEX">Part<label class="mx-1">1</label>首頁</a>
                              <button type="button" class="btn btn-primary btn-lg rounded-pill px-5 my-3" data-bs-dismiss="modal" id="CLOSE">關閉</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`);

  var myModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
  myModal.show();

  $('#feedbackModal').on('hidden.bs.modal', function () {
    $(this).remove();
  });

  //modal 回饋特效(顯示後方題型名稱) 
  $('#feedbackModal').on('shown.bs.modal', function () {
    let topH = $('.header').height() + 30;

    if ($(document).height() > $(window).height()) { //網頁有卷軸
      $('html, body').animate({
        scrollTop: $('.page').offset().top + topH
      }, 500);
    } else { //網頁沒有卷軸
      $('.page').animate({
        'margin-top': '-' + topH + 'px'
      }, 500);
    }

    $(this).css('padding-top', topH / 2);
  });
  $('#feedbackModal').on('hidden.bs.modal', function () {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
    $('.page').animate({
      'margin-top': ''
    }, 500);
  });
}

//Loading Spinners 
function loadingDOM(ms) { 
  $('body').append(`<div class="modal fade" id="loadingModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                          <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content bg-transparent border-0">
                              <div class="modal-body text-center">
                                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                                  <span class="visually-hidden">Loading...</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>`);
  var myModal = new bootstrap.Modal(document.getElementById('loadingModal'));
  myModal.show();

  var timeout = setTimeout(function () {
    myModal.hide();
  }, ms);

  $('#loadingModal').on('hidden.bs.modal', function () { 
    $(this).remove();
  });
}

//Loading BOT Spinners 
function loadingBotDOM(ms, text) { 
  $('body').append(`
<div class="modal fade loading-bot-modal" id="loadingBotModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content bg-transparent border-0">
      <div class="modal-body text-center">
        <div class="spinner-bot" role="status">
          <svg version="1.1" id="TEEMI-Bot-tool" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
	 y="0px" viewBox="0 0 670 530" style="enable-background:new 0 0 670 530;" xml:space="preserve">
            <g id="dialogue">
              <path id="dialogueBg" class="st0" d="M586.4,13.8L586.4,13.8c-46.1,0.1-83.6,26.1-83.6,58.2s15.3,38.6,38.5,48.9
		c-0.7,1.6-1.5,3.2-2.4,4.8c-5.9,11.2-12.9,19.2-18.1,24.3c7.4,0,20.8-0.8,35.3-8.1c7.8-3.9,13.6-8.6,17.9-12.5
		c4,0.4,8.2,0.6,12.4,0.6c46.2,0,83.6-26,83.6-58.1S632.6,13.8,586.4,13.8L586.4,13.8z"/>
              <path id="gear2" class="st1" d="M634.9,100.2c-1-1.2-2.3-2.2-3.5-3.1c-0.2-0.2-0.5-0.4-0.5-0.7v-0.9c0.2-0.6,0.2-1.2,0.2-1.8v-1.8
		c0-1.2-0.3-2.4-0.6-3.5c0-0.7,0-1.4,0.5-1.8c1.1-1,2.1-2.1,3.1-3.3c0.5-0.5,0.5-1.4,0-2.2l-0.7-1.2c-0.3-0.4-0.5-0.7-0.8-1.1
		c-0.2-0.4-0.6-0.6-0.9-0.8h-1c-1.5,0.4-3,0.8-4.4,1.5s-1.3,0.2-1.8-0.2c-0.9-0.7-1.9-1.4-3-1.9c-0.5-0.2-1-0.5-1.6-0.7
		s-1.1-0.5-1.7-0.5c-0.3,0-0.6-0.3-0.8-0.5c-0.3-0.2-0.5-0.5-0.5-0.8c-0.3-1.4-0.8-2.9-1.3-4.3c-0.2-0.6-1-1-1.9-1h-2.8
		c-0.9,0.2-1.6,0.6-1.8,1.3c-0.4,1.6-0.7,3.1-0.9,4.6c0,0.6-0.5,1.2-1.1,1.4l-1.6,0.8l-1.5,0.9l-1.4,1.1l-1.3,1.2
		c-0.5,0.5-1.2,0.7-1.8,0.5c-1.4-0.5-2.9-0.9-4.4-1.1c-0.7,0-1.4,0.3-1.9,1.1c-0.5,0.7-0.8,1.6-1.2,2.4s-0.3,1.7,0.2,2.2
		c1,1.2,2.3,2.2,3.5,3.1c0.2,0.2,0.5,0.4,0.5,0.7v0.9c-0.2,0.6-0.2,1.2-0.2,1.8v1.8c0,1.2,0.3,2.4,0.6,3.5c0,0.7,0,1.4-0.5,1.8
		c-1.1,1-2.1,2.1-3.1,3.3c-0.5,0.5-0.5,1.4,0,2.2l0.7,1.2c0.3,0.4,0.5,0.7,0.8,1.1c0.2,0.4,0.6,0.6,0.9,0.8h1c1.5-0.4,3-0.8,4.4-1.5
		s1.3-0.2,1.8,0.2c0.9,0.7,1.9,1.4,3,1.9c0.5,0.2,1,0.5,1.6,0.7s1.1,0.5,1.7,0.5c0.3,0,0.6,0.3,0.8,0.5c0.3,0.2,0.5,0.5,0.5,0.8
		c0.3,1.4,0.8,2.9,1.3,4.3c0.2,0.6,1,1,1.9,1h2.8c0.9-0.2,1.6-0.6,1.8-1.3c0.4-1.6,0.7-3.1,0.9-4.6c0-0.6,0.5-1.2,1.1-1.4l1.6-0.8
		l1.5-0.9l1.4-1.1l1.3-1.2c0.5-0.5,1.2-0.7,1.8-0.5c1.4,0.5,2.9,0.9,4.4,1.1c0.7,0,1.4-0.3,1.9-1.1c0.5-0.7,0.8-1.6,1.2-2.4
		C635.5,101.6,635.4,100.7,634.9,100.2z M621.6,96.6c0,0.2-0.2,0.3-0.2,0.5c0,0.2-0.2,0.3-0.3,0.5c0,0.2-0.2,0.3-0.3,0.5
		c-0.2,0.3-0.4,0.6-0.7,0.9c-0.5,0.6-1.1,1-1.7,1.5c-0.7,0.4-1.3,0.8-2,1c-0.3,0.2-0.7,0.2-1.1,0.3h-4.4l-0.5-0.3
		c-0.2,0-0.3-0.2-0.5-0.2s-0.3-0.2-0.5-0.3c-0.2,0-0.3-0.2-0.5-0.3c-0.3-0.2-0.6-0.4-0.9-0.7c-0.6-0.5-1-1.1-1.5-1.7
		c-0.4-0.7-0.8-1.3-1-2c-0.2-0.3-0.2-0.7-0.3-1.1v-4.8l0.3-0.5c0-0.2,0.2-0.3,0.2-0.5c0-0.2,0.2-0.3,0.3-0.5c0-0.2,0.2-0.3,0.3-0.5
		c0.2-0.3,0.4-0.6,0.7-0.9c0.5-0.6,1.1-1,1.7-1.5c0.7-0.4,1.3-0.8,2-1c0.3-0.2,0.7-0.2,1.1-0.3h4.3l0.5,0.3c0.2,0,0.3,0.2,0.5,0.2
		s0.3,0.2,0.5,0.3c0.2,0,0.3,0.2,0.5,0.3c0.3,0.2,0.6,0.4,0.9,0.7c0.6,0.5,1,1.1,1.5,1.7c0.4,0.7,0.8,1.3,1,2
		c0.2,0.3,0.2,0.7,0.3,1.1v1.2h0.1v3.6h0L621.6,96.6z"/>
              <path id="gear1" class="st1" d="M600.6,55L600.6,55c-0.2-0.7-0.7-1.3-1.3-1.3c-1.4-0.3-2.8-0.5-4.2-0.5c-0.6,0-1.1-0.5-1.3-1
		c-0.3-1.1-0.8-2-1.3-3c-0.2-0.2-0.4-0.5-0.4-0.7l-0.4-0.7l-0.9-1.4c-0.3-0.5-0.3-1.1,0-1.6c0.8-1.1,1.4-2.4,2.1-3.6
		c0.3-0.6,0.2-1.3-0.3-1.8l-1.5-1.6c-0.5-0.4-1.3-0.6-1.8-0.4c-1.3,0.6-2.6,1.2-3.8,1.9c-0.5,0.4-1.1,0.3-1.6,0
		c-0.4-0.3-0.8-0.6-1.3-0.9l-1.4-0.8c-0.9-0.5-1.9-0.9-2.9-1.4c-0.5-0.3-0.9,0-0.9-1.4c0-1.4-0.2-2.7-0.2-4.1c0-1.4-0.5-1.2-1.2-1.4
		l-2.1-0.5c-0.7-0.2-1.4,0.1-1.7,0.6c-0.8,1.2-1.5,2.5-2.2,3.7c-0.3,0.6-0.8,0.8-1.4,0.8h-3.2c-1.1,0-2.2,0.2-3.2,0.4
		c-0.6,0.1-1.2-0.2-1.5-0.7c-0.7-1.1-1.5-2.2-2.4-3.3c-0.4-0.5-1.1-0.7-1.8-0.5c-0.7,0.3-1.4,0.5-2.1,0.8c-0.6,0.3-1.1-0.1-1.1,1.4
		s0.2,2.9,0.2,4.3c0,1.4-0.3,1.1-0.8,1.4l-1.4,0.9c-0.4,0.3-0.9,0.5-1.3,0.9c-0.9,0.6-1.7,1.2-2.5,2c-0.4,0.3-1.1,0.5-1.6,0.3
		c-1.2-0.6-2.5-1-3.8-1.5c-0.6-0.2-1.3,0.1-1.8,0.6s-0.9,1.1-1.3,1.7c-0.4,0.6-0.5,1.3-0.2,1.8c0.8,1.2,1.6,2.4,2.5,3.5
		c0.3,0.5,0.4,1.1,0.1,1.6c-0.5,1-0.9,2-1.4,3c-0.3,1.1-0.7,2.1-1,3.1c0,0.6-0.6,1.1-1.2,1.1c-1.4,0.2-2.7,0.5-4.1,0.8
		c-0.6,0.1-1.1,0.7-1.1,1.4c0,0.7-0.2,1.5-0.2,2.2c0,0.7,0.4,1.4,0.9,1.6c1.3,0.6,2.5,1.1,3.9,1.6c0.6,0.2,1,0.7,1,1.3
		c0.1,1.1,0.3,2.1,0.5,3.2c0.1,0.6,0.3,1.1,0.4,1.6l0.4,1.5c0.2,0.6,0.1,1.2-0.4,1.6c-1,0.9-2,1.9-3,2.9c-0.5,0.4-0.5,1.2-0.2,1.8
		c0.3,0.6,0.6,1.3,1,1.9c0.4,0.6,1,0.9,1.6,0.9c1.4,0,2.8-0.4,4.2-0.7c0.5-0.2,1.1,0,1.5,0.5c0.3,0.5,0.6,0.9,1,1.3l1.1,1.2l0.5,0.6
		l0.6,0.5l1.2,1.1c0.5,0.4,0.7,1,0.5,1.6c-0.4,1.3-0.7,2.6-1,4c-0.2,0.3,0,0.6,0,0.9c0.2,0.3,0.4,0.5,0.7,0.7l1.9,1.1
		c0.6,0.5,1.3,0.4,1.8,0c1.1-0.9,2.1-1.9,3.1-2.9c0.4-0.4,1.1-0.6,1.6-0.4c1,0.3,2,0.7,3.1,0.9l1.6,0.3c0.5,0.2,1.1,0.2,1.6,0.2
		c0.6,0,1.1,0.5,1.3,1.1c0.4,1.3,0.9,2.6,1.4,3.9c0.2,0.6,0.9,1,1.6,1c0.7-0.2,1.5-0.2,2.2-0.2s1.3-0.5,1.5-1.1
		c0.4-1.4,0.7-2.8,1-4.2c0-0.5,0.5-0.9,1.1-1.1l1.6-0.4l0.8-0.2c0.3,0,0.6-0.3,0.8-0.3c1-0.4,2.1-0.8,3-1.3c0.5-0.3,1.1-0.2,1.6,0.2
		c1.1,0.9,2.2,1.7,3.3,2.5c0.4,0.4,1.2,0.4,1.8,0c0.7-0.4,1.2-0.9,1.8-1.3c0.7-0.5,0.9-1.1,0.7-1.7c-0.4-1.4-0.9-2.8-1.4-4.1
		c-0.2-0.6-0.1-1.2,0.3-1.6c0.7-0.9,1.5-1.6,2.1-2.5l0.9-1.3l0.3-0.4l0.4-0.7c0.3-0.5,0.9-0.7,1.5-0.7c0.7,0.2,1.4,0.2,2.1,0.2h2.1
		c0.6,0,1.2-0.4,1.5-1.1l0.4-1c0.2-0.3,0.4-0.7,0.4-1c0.2-0.7,0-1.4-0.4-1.8c-0.5-0.5-1.1-0.9-1.6-1.4c-0.5-0.4-1.1-0.9-1.7-1.3
		c-0.6-0.3-0.6-0.9-0.6-1.5l0.3-0.8V67l0.2-1.6v-3.2c-0.1-0.6,0.3-1.1,0.8-1.4c1.2-0.6,2.5-1.2,3.7-1.9c0.7-0.3,0.7-1,0.7-1.7
		C600.9,56.4,600.8,55.7,600.6,55z M584.1,64L584.1,64c0,1.6-0.6,3.2-1.1,4.8c-0.6,1.5-1.4,3-2.4,4.3c-2,2.7-4.8,4.7-7.9,5.8
		c-1.5,0.5-3.2,1-4.8,1s-3.3,0-4.9-0.5h-0.6c-0.2-0.2-0.4-0.2-0.6-0.2l-1.2-0.4l-1.1-0.5c-0.2,0-0.4-0.3-0.6-0.3l-0.5-0.3
		c-1.4-0.8-2.7-1.8-3.9-3c-2.3-2.3-3.9-5.4-4.6-8.6l-0.3-1.2v-3.6c0-1.6,0.6-3.2,1.1-4.8c0.6-1.5,1.4-3,2.4-4.3
		c0.2-0.4,0.5-0.7,0.8-1s0.6-0.6,0.9-0.9l0.9-0.8l1-0.8c2.7-1.9,5.9-3.1,9.2-3.3c1.6,0,3.3,0,4.9,0.6h0.6c0.2,0.2,0.4,0.2,0.6,0.2
		l1.2,0.4l1.1,0.5c0.2,0.1,0.4,0.3,0.6,0.3l0.5,0.3c1.5,0.8,2.7,1.8,3.9,3s2,2.5,2.8,3.8C583.7,57.4,584.4,60.7,584.1,64z"/>
            </g>
            <path id="foot" class="st2" d="M354.8,496.9c0,0,29.6-0.2,58-1.9c-11.6,11.6-38.1,35.4-60.1,34.9c-20.9-0.4-45.8-22.6-58.3-35.1
	C323.6,496.6,354.8,496.8,354.8,496.9L354.8,496.9L354.8,496.9z"/>
            <g id="body">
              <path id="bodyShadow" class="st2" d="M377.7,452.5c-46.8,5.1-117.2-7.5-162.2-34.8c-14.8-8.5-27.1-17.7-35.6-26.3
		c-14.1-14.5-22.6-38.1-27.6-58.6c0,5,0.2,9.7,0.5,13.7c1.6,18,8.5,57.7,27.5,78.6c7.1,7.6,17.3,15.8,29.5,23.5
		c37.4,24.7,95.8,39,135.2,38h0.4c38.9,0.5,95.6-13.6,132.6-37.9c12.9-8,23.6-16.6,30.9-24.5c7.1-7.6,12.4-16.8,16.5-26.6
		c-41.8,30.9-103.6,51.8-147.3,54.9L377.7,452.5L377.7,452.5L377.7,452.5z"/>
              <path id="bodyMain" class="st3" d="M536.6,345.7v-3.6c0.2-17.5,4.1-135.8-8.7-159.1c-4-5.6-8.8-10.9-14.3-15.6
		c-3.2-2.7-6.6-5.3-10.2-7.6c-26-16.3-62.2-24.8-94.9-28.6c-1.7-0.2-3.4-0.4-5.1-0.6c-18.5-1.9-35.6-2.4-49-2.5h-26.1
		c-38.2,0-106.6,4.9-148.8,31.4c-45,27.2-24.8,143.1-26,152.4c-0.9,7-1.2,14.2-1.2,20.8c5,20.5,13.5,44.1,27.6,58.6
		c8.5,8.6,20.8,17.8,35.5,26.3c45,27.4,115.4,40,162.2,34.8h0.5c43.8-3.1,105.5-24,147.3-54.9c3.5-8.5,6.1-17.5,7.9-26.5
		c1.7-8.6,2.9-17.2,3.2-25.5l0,0L536.6,345.7L536.6,345.7L536.6,345.7z"/>
            </g>
            <g id="tele">
              <path id="tube" class="st2" d="M409.9,78.8c-6.6,0.2-11.9,5.8-11.7,12.5c0.2,4.8,3.1,8.9,7.2,10.7l-3.7,28.2
		c-0.2,1.5,0.8,2.8,2.3,3h0.4c1.3,0,2.5-1,2.7-2.3l3.7-27.9l0,0c3.2,0,6.2-1.5,8.4-3.9c2.1-2.2,3.2-5.2,3.2-8.3v-0.4
		c-0.1-3.2-1.5-6.2-3.8-8.4C416.2,79.8,413.1,78.7,409.9,78.8L409.9,78.8L409.9,78.8z"/>
              <path id="leftWave1" class="st2" d="M441.9,71.7c-1.4-0.6-3,0-3.5,1.4c-0.6,1.4,0,3,1.4,3.5c2.3,1,4.2,3.3,5,6.2
		c1,3.4,0.2,7-2,10.2c-0.9,1.2-0.5,2.9,0.7,3.7c0.5,0.3,1,0.5,1.5,0.5c0.9,0,1.7-0.4,2.2-1.2c3.1-4.6,4.1-9.8,2.7-14.7
		C448.7,77,445.7,73.4,441.9,71.7L441.9,71.7L441.9,71.7z"/>
              <path id="leftWave2" class="st2" d="M470.2,75.2c-1.8-6.6-6.4-12-12.1-14.5c-1.4-0.6-3,0-3.5,1.4c-0.6,1.4,0,3,1.4,3.5
		c4.3,1.9,7.6,6,9.1,11.1c1.7,6,0.5,12.4-3.5,18c-0.9,1.2-0.5,2.9,0.7,3.8c0.5,0.3,1,0.5,1.5,0.5c0.9,0,1.7-0.4,2.2-1.2
		c4.8-7,6.3-14.9,4.2-22.5l0,0L470.2,75.2z"/>
              <path id="rightWave1" class="st2" d="M377.5,63.3c-4,1-7.6,4-9.6,8c-2.2,4.6-2.2,10,0.1,15c0.5,1,1.4,1.6,2.5,1.6s0.8,0,1.1-0.2
		c1.4-0.6,2-2.2,1.3-3.6c-1.6-3.6-1.7-7.3-0.1-10.4c1.3-2.6,3.5-4.5,6-5.2c1.4-0.3,2.3-1.8,2-3.2C380.4,63.9,379,63,377.5,63.3
		L377.5,63.3L377.5,63.3z"/>
              <path id="rightWave2" class="st2" d="M366.6,51.6c-0.4-1.4-1.8-2.3-3.3-2c-6.1,1.5-11.5,6.1-14.4,12.2c-3.4,7-3.3,15.2,0.2,22.9
		c0.5,1,1.4,1.6,2.5,1.6s0.8,0,1.1-0.2c1.4-0.6,1.9-2.2,1.3-3.6c-2.9-6.2-2.9-12.7-0.2-18.3c2.3-4.7,6.3-8.2,10.9-9.3
		c1.4-0.4,2.3-1.8,2-3.3H366.6z"/>
            </g>
            <g id="head">
              <path id="face" class="st1" d="M463.4,302.6c-28.1,11.5-81.8,11.5-124.5,11.5s-96.4,0-124.5-11.5s-39.7-82.1-27-105.7
		c12.8-23.5,85.6-39.5,151.4-39.5s138.7,15.9,151.4,39.5c12.8,23.6,1.1,94.2-27,105.7H463.4z"/>
              <path id="mouth" class="st2" d="M370.3,228.1l-63.4,6.5c-7.9,0.8-13,9-9.9,16.3c20,46.7,72.1,45.3,85.9-7.7
		c2.1-8.1-4.4-15.9-12.7-15.1H370.3z"/>
              <path id="rightEye" class="st2" d="M276,201.1c0,6.2-5.1,11.3-11.3,11.3s-11.3-5.1-11.3-11.3s5.1-11.3,11.3-11.3
		S276,194.9,276,201.1z"/>
              <circle id="leftEye" class="st2" cx="424.8" cy="201.1" r="11.3"/>
            </g>
            <path id="leftHand" class="st3" d="M500,273c11.8,1.4,23.5,1.2,34.7,0.2c40.2-3.8,74.7-19.4,89-19c0.5,0,1,0,1.5,0.1
	c0.3,0,0.6,0,0.9,0.1c0.3,0,0.6,0.1,0.9,0.2l0,0c0.4,0.1,0.8,0.3,1.1,0.5c12.1,7.4,12.1,28.8-36.8,69.4c-10.1,8.4-20,15.2-29.5,20.8
	c-23.5,13.9-54.3,2.1-61.1-24.4c-3.4-13.1-4.5-29.2-0.7-48.1l0,0L500,273L500,273L500,273z"/>
            <path id="rightHand" class="st3" d="M210.1,341.5c-12.6,1.7-24.6,5-35.9,9.1c-40.5,14.7-71.9,40.1-86.8,43.6
	c-0.5,0.1-1.1,0.2-1.5,0.3c-0.3,0-0.6,0.1-0.9,0h-1c-0.5,0-0.9-0.1-1.3-0.2c-14.5-4.4-20.3-26.5,19.4-81.6
	c8.1-11.3,16.6-21.1,24.9-29.5c20.5-20.7,55.5-16.7,69.6,8.8c7,12.6,12.5,28.9,13.6,49.4l0,0L210.1,341.5z"/>
            <path id="screwdriver" class="st0" d="M660.9,334c-10.8-31.4-24.1-65-35.9-95.9l0,0c14.5-10.2,15.2-34.4,0.8-45.4l-10.2,3.4
	l5.2,15.6l-9.8,14.2l-16.4-5.5l-5.2-15.6l-10.2,3.4c-5.2,18.4,11.8,37.9,30.4,35.7c9,30.1,20.1,67,29.9,97.2c4,15.2,27,7.5,21.2-7
	L660.9,334L660.9,334z M649,333.2c5.6-1.9,8.5,6.9,2.9,8.7C646.3,343.9,643.3,335,649,333.2z"/>
            <path id="leftHand2" class="st3" d="M616,253.4c4.5,7.7,3.4,16.7-2.3,20s-14-0.3-18.5-8s-3.4-16.7,2.3-20S611.5,245.7,616,253.4z"/>
          </svg>
		  </div>
          <div class="spinner-text">` + text + `</div>  
      </div>
    </div>
  </div>
</div>
  `);
  var myModal = new bootstrap.Modal(document.getElementById('loadingBotModal'));
  myModal.show();

  var timeout = setTimeout(function () {
    myModal.hide();
  }, ms);

  $('#loadingBotModal').on('hidden.bs.modal', function () { 
    $(this).remove();
  });
}


// 語速 (點擊更新dropdown當前語速選項)
function SPEED(e, rate){
	$(e).parents('.dropdown').find('.dropdown-toggle span').text(rate + 'x');
}
