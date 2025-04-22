//密碼-顯示/隱藏
$('.pd-show-hide button').click(function(){
    $(this).html( function(index, html){
        return html == '<i class="fa-solid fa-eye"></i>' ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
    $(this).parents('.input-group').find('input').attr('type', function(index, attr){
        return attr == 'password' ? 'text' : 'password';
    });
 });

//搜尋-[X]顯示
$('.input-group-clear > input').keyup(function(){
    if ( $(this).val() ){
        $(this).parent('.input-group-clear').addClass('active');
    }else{
        $(this).parent('.input-group-clear').removeClass('active');
    }
});
//搜尋-[X]清除
$('.input-group-clear > .btn-close').click(function(){
    $(this).parent('.input-group-clear').removeClass('active');
    
    $(this).parent('.input-group-clear').find('input').val('');
});

//上傳檔案
$('.input-group-file input[type="file"]').on('change', function(){ 
    var file = this.files[0];
    var objectURL = URL.createObjectURL(file);

    //$(this).parents('.form-control-file').addClass('selected');
    $(this).siblings('input[type="text"]').val(file.name);
});
 
//alertModal 訊息視窗
function alertModal(html){
    $('body').append(`<div class="modal fade alertModal" id="alertModal" tabindex="-1" aria-labelledby="alertModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                      <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content">
                          <div class="modal-body">
                            <div>
                              ` + html + `
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-primary mx-auto btn-sm" data-bs-dismiss="modal">確定</button>
                          </div>
                        </div>
                      </div>
                    </div>`);
    
    $('#alertModal').modal('show');
    
    $('#alertModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
}

//confirmModal 確認視窗
function confirmModal(html){
    $('body').append(`<div class="modal fade confirmModal" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered modal-sm">
                        <div class="modal-content">
                          <div class="modal-body">
                            <div>
                              ` + html + `
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-outline-primary mx-auto" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-primary mx-auto" data-bs-dismiss="modal" id="confirmOk">確定</button>
                          </div>
                        </div>
                      </div>
                    </div>`);
    
    $('#confirmModal').modal('show');
    
    $('#confirmModal').on('hidden.bs.modal', function () {
      $(this).remove();
    });
}

//datatable footer input page
function datatableInputPage(table){
    //到第X頁DOM
    let info = table.DataTable().page.info();   
    
    let inputHTML =	'<div class="add_dataTables_input">'+
                        '到第&nbsp;'+
                        '<input type="text" class="form-control input-lg d-inline paginate_input">'+ 
                        '&nbsp;頁'+
                        '<a class="btn paginate_button">確定</a>'+
                    '</div>';

    $('#' + table.attr('id') + '_wrapper').find('.datatables-custom-footer').append(inputHTML);
    
    let textGoPage = $('#' + table.attr('id') + '_wrapper').find('.add_dataTables_input .paginate_input'); 
    let btnGoPage  = $('#' + table.attr('id') + '_wrapper').find('.add_dataTables_input .paginate_button'); 

    //頁碼欄位輸入後按ENTER鍵觸發[確定]
    textGoPage.keypress(function(event) {
        if (event.keyCode === 13) {
            btnGoPage.click();
        }
    });
    //頁碼欄位監聽清除invalid
    textGoPage.keyup(function(){
        if( parseInt(textGoPage.val())>0 && parseInt(textGoPage.val())<=info.pages || !textGoPage.val()){
            textGoPage.removeClass('invalid');      
        }
    });
    
    //頁碼[確定]
    btnGoPage.click(function(){ 
        if( parseInt(textGoPage.val())>0 && parseInt(textGoPage.val())<=info.pages ){
            table.DataTable().page(parseInt(textGoPage.val()) - 1).draw(false);
        }else{
            alertModal('<div class="text-red">請輸入正確頁數。</div>');

            $('#alertModal').on('hidden.bs.modal', function () {
               textGoPage.addClass('invalid').focus();    
            });
        }
    });


    //點擊table頁碼滑動至最表格上方
    table.on('page.dt', function() {
        textGoPage.removeClass('invalid').val('');//清空頁碼輸入欄位 
        
        if( table.parents('.modal').length > 0 ){ 
            $('.modal').animate({scrollTop:0}, 0);   
        }else{
            $('html, body').animate({scrollTop: 0}, 0);    
        }
    });
}