// START 2016-12-27添加，用于输入分页页码
$(".gotoPage").remove();
var pageHtml =  "<div class='gotoPage'>" +
					"<span>到第</span>" +
					"<input type='text' class='integer' id='textGotoPage' data-prev='"+(page+1)+"' value='"+(page+1)+"'>" +
					"<span>頁</span>" +
					"<a class='paginate_button' id='btnGotoPage'>確定</a>" +
				"</div>";
$(pageHtml).appendTo(".leveledBooks-table__footer");





// 对页码输入进行限制，只能输入数字
var sfn = function() {
    var value = $(this).val();
    if (value == '') {
        $(this).data("prev", $(this).val());
        return;
    }

    var max = $(this).attr("maxlength");
    if (value.length > max)
        $(this).val(value.slice(0, max));

    var regex = /^\d+$/;
    if (!regex.test(value)) {
        $(this).val($(this).data("prev"));
    }

    $(this).data("prev", $(this).val());
};

var testinput = document.createElement('input');     
if('oninput' in testinput){ 
    document.getElementById("textGotoPage").addEventListener("input", sfn, false); 
} else {
    $("#textGotoPage").onpropertychange = sfn; 
}

//// 为确认按钮添加点击事件，执行分页跳转
$("#btnGotoPage").click(function(){
    var textGotoPage = $("#textGotoPage").val();
    if (textGotoPage == null || textGotoPage === '' || textGotoPage.match(/[^0-9]/)) {
        // 没有输入或者输入了非数字，清除非数字
        $("#textGotoPage").val(textGotoPage.replace(/[^\d]/g, ''));
        return;
    }

    if(parseInt(textGotoPage) > 0){
        var oSettings = settings;

        var iNewStart = oSettings._iDisplayLength * (textGotoPage - 1);
        if (iNewStart < 0) {
            iNewStart = 0;
        }
        if (iNewStart >= oSettings.fnRecordsDisplay()) {
            iNewStart = (Math.ceil((oSettings.fnRecordsDisplay()) / oSettings._iDisplayLength) - 1) * oSettings._iDisplayLength;
        }

        oSettings._iDisplayStart = iNewStart;
        _fnDraw(oSettings);
    }
});
// END