/**
* dev by zz on 2017/7/10.
*/
var loadPageMax = 0, //最大加载次数
    menuArr = [], //菜单结构
    varietiesArr = [], //品种结构
    genderArr = [], //性别结构
    sterilizationArr = [], //绝育结构
    amountSum = 0,
    intSum = 0,
    phone = '',
    storage = window.localStorage,
    isBackHome = 0,  //是否自动返回首页标示0为不返回
    acuArr = [],
    pageArr = [ //页面数组
        {
        id: 'ishome',
        title: '寻宠宝',
        desc: '专业找猫寻狗宠物侦探'
        //desc: 'According to the chief complaints of the patient, please select  the listed diseases in the menu.'
    }, {
        id: 'search',
        title: 'Search',
        desc: ''
    }, {
        id: 'empty',
        title: 'Not open',
        desc: ''
    }
    ];


function onLoadPage(page) {
    //$('#' + page).find('.page__bd').addClass("page__bd_spacing");
    switch (page.toLowerCase()) {
        case 'ishome':
            var ui = 2;

            switch (ui) {
                case 1:
                    //$('#' + page).find('.weui-cells').remove();

                    var data = menuArr, dataid, desc, icon = "", iconimg = "", a;
                    if (data.length == 0) setTimeout(function() { $.toast('菜单加载失败', 'err', 0); }, 200);
                    for (var i in data) {
                        desc = data[i].desc == undefined ? '' : unescape(data[i].desc);
                        dataid = data[i].dataid.replaceAll(' ', '_');
                        icon = data[i].icon == undefined ? '' : data[i].icon;
                        iconimg = data[i].iconimg == undefined ? '' : data[i].iconimg;
                        if (icon != '') icon = "<i class=" + icon + "></i>";
                        if (iconimg != '') iconimg = "<img src='images/" + iconimg + "' class='listIcon'></i>";
                        if (icon == "" && iconimg == "") icon = '<span style="margin-right:5px;color:' + getColorByRandom() + ';font-weight:bold;">•</span>';
                        if (dataid == '' || dataid == undefined) dataid = 'empty'
                        a = $('<a class="weui-cell weui-cell_access js_item" data-id="' + dataid + '" name="" href="javascript:;"><div class="weui-cell__bd"><p>' + icon + iconimg + unescape(data[i].title) + '</p></div><div class="weui-cell__ft"><small>' + desc + '</small></div></a>');

                        $('#' + page).find('.weui-cells').append(a);

                    }

                    $('#' + page).find('.js_item').on('click', function() {
                        isBackHome = 1;
                        var id = $(this).data('id');
                        window.pageManager.go(id);
                    });

                    break;
                case 2:
                    var data = menuArr, dataid, desc, iconimg = "";
                    $('#' + page).find('.page__bd').append('<div class="weui-grids">');
                    for (var i in data) {
                        desc = data[i].desc == undefined ? '' : unescape(data[i].desc);
                        dataid = data[i].dataid.replaceAll(' ', '_');
                        iconimg = data[i].iconimg == undefined ? '' : data[i].iconimg;
                        if (dataid == '' || dataid == undefined) dataid = 'empty';
                        if (iconimg != '') iconimg = '<div class="weui-grid__icon"><img src="./images/' + iconimg + '" alt=""></div>';
                        if (dataid == '' || dataid == undefined) dataid = 'empty'
                        var a = $('<a class="weui-grid js_item" data-id="' + dataid + '" name="" value="' + unescape(data[i].title) + '">' + iconimg + '<p class="weui-grid__label">' + unescape(data[i].title) + '</p></a>');
                        $('#' + page).find('.page__bd').find('.weui-grids').append(a);
                    }

                    a = '<div class="weui-search-bar" id="searchBar"><form class="weui-search-bar__form"><div class="weui-search-bar__box"><i class="weui-icon-search"></i><input type="search" class="weui-search-bar__input" id="searchInput" placeholder="搜索" required=""><a href="javascript:" class="weui-icon-clear" id="searchClear"></a></div><label class="weui-search-bar__label" id="searchText"><i class="weui-icon-search"></i><span>搜索</span></label></form><a href="javascript:" class="weui-search-bar__cancel-btn" id="searchCancel">取消</a></div>';
                    //$('#' + page).find('.page__bd').prepend(a);
                    var $searchBar = $('#searchBar'),
                        $searchResult = $('#searchResult'),
                        $searchText = $('#searchText'),
                        $searchInput = $('#searchInput'),
                        $searchClear = $('#searchClear'),
                        $searchCancel = $('#searchCancel');

                    function hideSearchResult() {
                        $searchResult.hide();
                        $searchInput.val('');
                    }
                    function cancelSearch() {
                        hideSearchResult();
                        $searchBar.removeClass('weui-search-bar_focusing');
                        $searchText.show();
                    }

                    $searchText.on('click', function() {
                        $searchBar.addClass('weui-search-bar_focusing');
                        $searchInput.focus();
                    });
                    
                    $searchInput.on('blur', function() {
                        if (!this.value.length) cancelSearch();
                    }).on('input', function() {
                        if (this.value.length) {
                            $searchResult.show();
                        } else {
                            $searchResult.hide();
                        }
                    });
                    
                    $searchClear.on('click', function() {
                        hideSearchResult();
                        $searchInput.focus();
                    });
                    $searchCancel.on('click', function() {
                        cancelSearch();
                        $searchInput.blur();
                    });

                    $('#' + page).find('.js_item').on('click', function() {
                        isBackHome = 1;
                        var id = $(this).data('id');
                        window.pageManager.go(id);
                    });
                    break;
            }
            setFoot(page, 1, 0);
            break;
        case 'setup':
            checkHome();
            if (getQueryString("prot") != "") {
                //$('#' + page).find('.page__hd').remove();
                $('#' + page).find('.page__title').remove();
                $('#' + page).find('.page__desc').remove();

                var a = $('<a class="weui-cell js_item" name="signinBtn" name="" href="javascript:;"><div class="weui-cell__bd" style="text-align:center;"><img src="./images/wxusericon.gif" style="width:50px;height:50px;border-radius:50%;overflow:hidden;margin-bottom:5px;"><p style="color:#999;">Sign in</p><small></small></div><div class="weui-cell__ft"></div></a>');
                $('#' + page).find('.page__hd').prepend(a);

                $('a[name=signinBtn]').on('click', function() { ctrlIOSfn('wxsign', ['sign']); });
            }

            forArr(menuArr, function(arr) {
                if (typeof (arr.item) == 'object') {
                    acuArr = arr.item
                    var dataid, desc, id, group, groupArr = new Array(), groupi, a;
                    for (var i in acuArr) {
                        desc = acuArr[i].desc == undefined ? '' : unescape(acuArr[i].desc);
                        group = acuArr[i].group == undefined ? '' : unescape(acuArr[i].group);
                        groupi = 0;
                        if (acuArr[i].id == undefined) {
                            if (acuArr[i].dataid) dataid = acuArr[i].dataid.replaceAll(' ', '_');
                            if (dataid == '' || dataid == undefined) dataid = 'empty';
                            a = $('<a class="weui-cell weui-cell_access js_item" data-id="' + dataid + '" name="" href="javascript:;"><div class="weui-cell__bd"><p>' + unescape(acuArr[i].title) + '</p><small>' + desc + '</small></div><div class="weui-cell__ft"></div></a>');
                            $('#' + page).find('.page__bd').find('.weui-cells').append(a);
                        }
                    }

                    a = $('<a class="weui-cell weui-cell_access" name="clearCache" href="javascript:;"><div class="weui-cell__bd"><p><i class="weui-icon-cancel"></i>删除缓存</p></div><div class="weui-cell__ft"></div></a>')
                    $('#' + page).find('.page__bd').find('.weui-cells').append(a);
                    $('a[name=clearCache]').on('click', function() {
                        $.toast('正在清除...', 'loading', 0);
                        setTimeout(function() {
                            storage.removeItem("divSwiperInfo");
                            storage.removeItem("menuArr");

                            if (getQueryString("prot") != "") {
                                ctrlIOSfn("removecache", ["remove"]);
                            } else {
                                window.location.href = 'index.html';
                            }
                        }, 1000);
                    });

                    $('#' + page).find('.js_item').on('click', function() {
                        isBackHome = 1;
                        var id = $(this).data('id');
                        window.pageManager.go(id);
                    });
                }

            }, page);
            setFoot(page, 0, 1);
            break;
        case 'find_pet':
            checkHome();
            FindPetFn(page, 0);
            setFoot(page, 0, 1);
            break;
        case 'pick_up':
            checkHome();
            FindPetFn(page, 1);
            setFoot(page, 0, 1);
            break;

        case 'empty':
            checkHome();
            setFoot(page, 0, 1);
            break;
        default:
            checkHome();
            forArr(menuArr, function(arr) {
                setMenu(arr, page, 2);
            }, page);
            setFoot(page, 0, 1);
            break;
    }
}

function setFoot(page, s, h) {
    $('#' + page).find('.page__ft').remove();
    $('#' + page).append('<div class="page__ft"><br><a href="javascript:" class="foodstyle">Design by zz</a></div>')
    if (getQueryString("prot") != "") {
        if (h) {
            //$('#' + page).find('.page__ft').prepend('<a href="javascript:;" name="homeBtn" class="weui-btn weui-btn_mini weui-btn_default btn_rightM">Home</a>');
        }
        if (s) {
            $('#' + page).find('.page__ft').prepend('<a href="javascript:;" name="shareBtn" class="weui-btn weui-btn_mini weui-btn_primary btn_rightM">Share</a>');
        }
    } else {
        if (h) {
            //$('#' + page).find('.page__ft').prepend('<a href="javascript:;" name="homeBtnC" class="weui-btn weui-btn_mini weui-btn_default">Home</a>');
        }
    }
    $('div[name=bottomBtn]').remove();
    $('div[name=bottomSearchBtn]').remove();
    if (h) {
        //$('body').append('<div name="bottomBtnback" class="backBtnStyleGrundback"></div>')
        $('body').append('<div name="bottomBtn" class="backBtnStyle"><i class="weui-icon-download"></i></div>')
        $('body').append('<div name="bottomSearchBtn" class="searchBtnStyle"><img src="./images/homeicon.png" style="width:20px;"></div>')
    }

    $('div[name=bottomBtn]').on('click', function() {
        window.history.go(-1);
    });
    $('div[name=bottomSearchBtn]').on('click', function() {
        isBackHome = 1;
        //window.pageManager.go('search');
        window.location.href = 'index.html';
    });
    $('a[name=homeBtn]').on('click', function() {
        window.location.href = '/eng/client/index.html?isver=6&prot=' + getQueryString('prot') + '&prok=' + getQueryString('prok');
        //ctrlIOSfn('reset', ['reset']);
    });
    $('a[name=shareBtn]').on('click', function() { ctrlIOSfn('shareapp', ['share']); });
    $('a[name=homeBtnC]').on('click', function() { window.location.href = 'index.html'; });
}


function checkHome() {
    if (isBackHome == 0) window.location.href = "../client/index.html"; //必须从首页开始
}
function getData(page, callback, parameter, errCallback) {// page:模块（页面）名称，callback:回调函数，parameter:参数json， errCallback:错误后回调函数
    loadPageMax++;
    $.ajax({
        type: 'GET',
        url: '../server/' + page + '.asp?callback=?',
        data: parameter,
        dataType: 'json',
        timeout: 30000,
        context: $('body'),
        success: callback,
        error: function(xhr, type) {
            if (loadPageMax < 3) {
                setTimeout(function() {
                    getData(page, callback, parameter, errCallback);
                }, 200);
                //window.history.back();
            } else {
                $('.weui-mask_transparent').parent().fadeOut(100);
                $.toast('加载失败', 'err', 2000);
                setTimeout(function() {
                    errCallback();
                }, 2000);
            }
        }
    });
}
//替换所有要替换的文字
String.prototype.replaceAll = function(str1, str2) {
    var str = this;
    var result = str.replace(eval("/" + str1 + "/gi"), str2);
    return result;
}
function checkPhone(v) {//手机号码校验
    var phone = v;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        //$.alert("手机号码有误，请重填", "确定", function() { });
        $.toast('手机号码有误', 'err', 2000)
        return false;
    } else {
        return true;
    }
}
function setMenuPage() {
    for (var j in pageArr) {
        $('body').append('<script type="text/html" id="tpl_' + pageArr[j].id + '"><div class="page" id="' + pageArr[j].id + '"><div class="page__hd"><h1 class="page__title">' + unescape(pageArr[j].title) + '</h1><p class="page__desc">' + unescape(pageArr[j].desc) + '</p></div><div class="page__bd "><div class="weui-cells"></div></div></div><script type="text/javascript">$(function(){onLoadPage("' + pageArr[j].id + '");});</script>');
    }
    forArr(menuArr, function(arr) {
        if (arr.dataid) {
            var dataid = arr.dataid.replaceAll(' ', '_'),
                desc = arr.desc == undefined ? '' : unescape(arr.desc);
            //desc = '';
            $('body').append('<script type="text/html" id="tpl_' + dataid + '"><div class="page" id="' + dataid + '"><div class="page__hd"><h1 class="page__title">' + unescape(arr.title) + '</h1><p class="page__desc">' + unescape(desc) + '</p></div><div class="page__bd "><div class="weui-cells"></div></div></div><script type="text/javascript">$(function(){onLoadPage("' + dataid + '");});</script>');
        }
    });
}

function forArr(arr, fn, t) {
    for (var i in arr) {
        if (t) {
            if (arr[i].dataid) {
                if (t == arr[i].dataid.replaceAll(' ', '_')) {
                    fn(arr[i]);
                }
                if (typeof (arr[i].item) == 'object') {
                    forArr(arr[i].item, fn, t);
                }
            }
        } else {
            fn(arr[i]);
            if (typeof (arr[i].item) == 'object') {
                forArr(arr[i].item, fn, t)
            }
        }
    }
}
function ctrlIOSfn(ctrl, value) {//iOS原生调用接口程序 2016-12-6 zz
    var url = ctrl
    for (var i in value) {
        url += ":" + value[i];
    }
    document.location = url;
}
function getQueryString(name) {
    if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
        return '';
    }
    var queryString = location.href.substring(location.href.indexOf("?") + 1).split("#")[0];
    var parameters = queryString.split("&");
    var pos, paraName, paraValue;
    for (var i = 0; i < parameters.length; i++) {
        pos = parameters[i].indexOf('=');
        if (pos == -1) { continue; }
        paraName = parameters[i].substring(0, pos);
        paraValue = parameters[i].substring(pos + 1);
        if (paraName == name) {
            return unescape(paraValue.replace(/\+/g, " "));
        }
    }
    return '';
};
$(document).ready(function(e) {//监听返回事件并处理分享标题和返回按钮
    var counter = 0;
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function() {
            dtitle = location.href.split('#')[1];
            if (dtitle == undefined) {
                $('div[name=bottomBtn]').remove();
                //$('div[name=bottomBtnback]').remove();
                $('div[name=bottomSearchBtn]').remove();
                //document.title = '会员中心';
            } else {
                //document.title = dtitle.replaceAll('_', ' ');
            }
        });
    }
});

function getColorByRandom() {
    var colorList = ["#BBA37F", "#EC9B80", "#5E534F", "#DCB6A1", "#B3BFBD", "#617F77", "#91A560", "#E8C172", "#C7BC9E"];
    if (colorList.length == 0) {
        colorList = ["#BBA37F", "#EC9B80", "#5E534F", "#DCB6A1", "#B3BFBD", "#617F77", "#91A560", "#E8C172", "#C7BC9E"];
    }
    var colorIndex = Math.floor(Math.random() * colorList.length);
    var color = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    return color;
}
function imgLoad(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        callback(img.width, img.height);
    } else {
        img.onload = function() {
            callback(img.width, img.height);
            img.onload = null;
        };
    };
}

imgLoad("./images/wxusericon.gif", function() { });

function setMenu(aArr, page, m) {
    acuArr = aArr.item;
    var sh = 0, icon = "", iconimg = "";
    for (var i in acuArr) {
        if (acuArr[i].dataid) dataid = acuArr[i].dataid.replaceAll(' ', '_');
        if (dataid == '' || dataid == undefined) dataid = 'empty';
        desc = acuArr[i].desc == undefined ? '' : unescape(acuArr[i].desc);
        icon = data[i].icon == undefined ? '' : data[i].icon;
        iconimg = data[i].iconimg == undefined ? '' : data[i].iconimg;
        if (icon != '') icon = "<i class=" + icon + "></i>";
        if (iconimg != '') iconimg = "<img src='images/" + iconimg + "' class='listIcon'></i>";
        var a = $('<a class="weui-cell weui-cell_access js_item" data-id="' + dataid + '" name="" href="javascript:;"><div class="weui-cell__bd"><p>' + icon + iconimg + unescape(acuArr[i].title) + '</p><small>' + desc + '</small></div><div class="weui-cell__ft"></div></a>');
        $('#' + page).find('.page__bd').find('.weui-cells').append(a);
    }

    var explain = aArr.explain,
        img = aArr.img;

    $('#' + page).find('.page__bd').append('<article class="weui-panel weui-panel_access"></div>');

    if (img != undefined && img != '') {
        sh = 1;
        var a = $('<div class="weui-panel__bd"><div class="weui-media-box weui-media-box_text" style="text-align:center;"><p><img style="max-width:100%;" src="' + img + '"></p></div></div>');
        $('#' + page).find('.page__bd').find('.weui-panel').append(a);
    }

    if (explain != undefined && explain != '') {
        var a = $('<div class="weui-panel__bd"><div class="weui-media-box weui-media-box_text"><p>' + unescape(explain) + '</p></div></div>');
        $('#' + page).find('.page__bd').find('.weui-panel').append(a);
    }
    $('#' + page).find('.js_item').on('click', function() {
        isBackHome = 1;
        var id = $(this).data('id');
        window.pageManager.go(id);
    });
        setFoot(page, sh, 1);
}

function validFloat(f, def)
{
	var n = parseFloat(f);
	if (isNaN(n)) return def;
	return n;
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function checkLen(obj) {

    var maxChars = 200; //最多字符数  

    if (obj.value.length > maxChars) obj.value = obj.value.substring(0, maxChars);

    var curr = maxChars - obj.value.length;

    $("#areaTextCount").text(maxChars - curr.toString());

}

function checkPhone(v) {//手机号码校验
    var phone = v;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        //$.alert("手机号码有误，请重填", "确定", function() { });
        $.toast('手机号码有误', 'err', 2000)
        return false;
    } else {
        return true;
    }
}

function getColorByRandom() {
    var colorList = ["#BBA37F", "#EC9B80", "#5E534F", "#DCB6A1", "#B3BFBD", "#617F77", "#91A560", "#E8C172", "#C7BC9E"];
    if (colorList.length == 0) {
        colorList = ["#BBA37F", "#EC9B80", "#5E534F", "#DCB6A1", "#B3BFBD", "#617F77", "#91A560", "#E8C172", "#C7BC9E"];
    }
    var colorIndex = Math.floor(Math.random() * colorList.length);
    var color = colorList[colorIndex];
    colorList.splice(colorIndex, 1);
    return color;
}

function FindPetFn(page, sendType) {
    var a,
        fnidpetArr = {}; //寻宠内容结构

    fnidpetArr.img = [];  //定义上传的图片地址字典
    fnidpetArr.imgNum = 0;
    fnidpetArr.imgMaxNum = 0;

    fnidpetArr.placeText = '';
    fnidpetArr.placepoint = '';
    $('#' + page).find('.weui-cells').addClass('weui-cells_form');

    a = '<div class="weui-cell weui-cell_access"><div class="weui-cell__hd"><label for="fp_timeInput" class="weui-label">时间</label></div><div class="weui-cell__bd" style="width:50px;"><input class="weui-input" type="date" value="" id="fp_timeInput" placeholder=""/></div><div class="weui-cell__ft"></div></div>';

    a += '<div class="weui-cell weui-cell_access"><div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="走失地点（格式：省,市,区,街道,门牌号）" id="place_Text"></div><div class="weui-cell__ft"><button name="place" class="weui-vcode-btn">地图</button></div></div>';

    a += '<div class="weui-cell weui-cell_select weui-cell_select-after"><div class="weui-cell__hd"><label for="fp_Varieties" class="weui-label">品种</label></div><div class="weui-cell__bd"><select class="weui-select" id="fp_Varieties">';
    a += '<option value=""></option>';
    for (var each in varietiesArr) {
        a += '<option value="' + unescape(varietiesArr[each]) + '">' + unescape(varietiesArr[each]) + '</option>';
    }
    a += '</select>'
    a += '</div>'
    a += '</div>'

    a += '<div class="weui-cell weui-cell_select weui-cell_select-after"><div class="weui-cell__hd"><label for="fp_Gender" class="weui-label">性别</label></div><div class="weui-cell__bd"><select class="weui-select" id="fp_Gender">';
    a += '<option value=""></option>';
    for (var each in genderArr) {
        a += '<option value="' + unescape(genderArr[each]) + '">' + unescape(genderArr[each]) + '</option>';
    }
    a += '</select>'
    a += '</div>'
    a += '</div>'

    a += '<div class="weui-cell weui-cell_select weui-cell_select-after"><div class="weui-cell__hd"><label for="fp_sterilization" class="weui-label">是否绝育</label></div><div class="weui-cell__bd"><select class="weui-select" id="fp_sterilization">';
    a += '<option value=""></option>';
    for (var each in sterilizationArr) {
        a += '<option value="' + unescape(sterilizationArr[each]) + '">' + unescape(sterilizationArr[each]) + '</option>';
    }
    a += '</select>'
    a += '</div>'
    a += '</div>'

    a += '<div class="weui-gallery" id="gallery"><span class="weui-gallery__img" id="galleryImg"></span><div class="weui-gallery__opr"><a href="javascript:" class="weui-gallery__del"><i class="weui-icon-delete weui-icon_gallery-delete"></i></a></div></div><div class="weui-cell"><div class="weui-cell__bd"><div class="weui-uploader"><div class="weui-uploader__hd"><p class="weui-uploader__title"><small>每次可多选9张，最多上传20张。</small></p><div class="weui-uploader__info">0</div></div><div class="weui-uploader__bd"><ul class="weui-uploader__files" id="uploaderFiles"></ul><div class="weui-uploader__input-box"><input id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*" multiple /></div></div></div></div></div>';

    a += '<div class="weui-cell"><div class="weui-cell__hd"><label for="fp_color" class="weui-label">毛色</label></div><div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="请输入毛色" id="fp_color"></div></div>';

    a += '<div class="weui-cell"><div class="weui-cell__hd"><label for="fp_isname" class="weui-label">联系人</label></div><div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="请输入联系人姓名" id="fp_name"></div></div>';

    a += '<div class="weui-cell"><div class="weui-cell__hd"><label for="fp_isphone" class="weui-label">手机号码</label></div><div class="weui-cell__bd"><input class="weui-input" type="tel" placeholder="请输入电话" id="fp_phone"></div></div>';
    if (sendType == 0) {
        a += '<div class="weui-cell"><div class="weui-cell__hd"><label for="Amount" class="weui-label">赏金</label></div><div class="weui-cell__bd"><input class="weui-input" type="number" placeholder="请输入赏金" id="Amount" value="0" pattern="[0-9]*" ></div></div>';
    }
    a += '<div class="weui-cell"><div class="weui-cell__bd"><textarea onkeyup="checkLen(this)" class="weui-textarea" placeholder="更多信息（其他特征）" rows="3" id="fp_memo"></textarea><div class="weui-textarea-counter"><span id="areaTextCount">0</span>/200</div></div></div>';
    $('#' + page).find('.weui-cells_form').append(a);

    a = '<div class="weui-btn-area"><a class="weui-btn weui-btn_primary" name="findpetSubmit" href="javascript:">提交信息</a></div>';
    $('#' + page).find('.page__bd').append(a);

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
        $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
        $uploaderInput = $("#uploaderInput"),
        $uploaderFiles = $("#uploaderFiles");

    for (var i in fnidpetArr.img) {
        $uploaderFiles.append($(tmpl.replace('#url#', fnidpetArr.img[i].src)));
    }
    $('.weui-uploader__info').text(fnidpetArr.imgMaxNum)

    $("#" + page).find('a[name=findpetSubmit]').on('click', function() {
        fnidpetArr.placeText = $('#place_Text').val();
        if (fp_timeInput.value == '') {
            $.toast('确定时间', 'err', 2000);
            return;
        }

        if (fnidpetArr.placeText == '') {
            $.toast('确定走失地点', 'err', 2000);
            return;
        }
        if (fp_Varieties.value == '') {
            $.toast('选择品种', 'err', 2000);
            return;
        }
        if (fp_Gender.value == '') {
            $.toast('选择性别', 'err', 2000);
            return;
        }
        if (fp_sterilization.value == '') {
            $.toast('确定是否节育', 'err', 2000);
            return;
        }

        if (fp_color.value == '') {
            $.toast('录入毛色', 'err', 2000);
            return;
        }
        if (fp_name.value == '') {
            $.toast('录入姓名', 'err', 2000);
            return;
        }
        if (fp_phone.value == '') {
            $.toast('录入电话', 'err', 2000);
            return;
        }

        if (!checkPhone(fp_phone.value)) {
            return;
        }

        fnidpetArr.timeInput = fp_timeInput.value;
        fnidpetArr.Varieties = escape(fp_Varieties.value);
        fnidpetArr.Gender = escape(fp_Gender.value);
        fnidpetArr.sterilization = escape(fp_sterilization.value);
        fnidpetArr.color = escape(fp_color.value);
        fnidpetArr.name = escape(fp_name.value);
        fnidpetArr.phone = fp_phone.value;
        fnidpetArr.memo = escape(fp_memo.value);
        fnidpetArr.placeTextES = escape(fnidpetArr.placeText);
        fnidpetArr.imgText = '';
        fnidpetArr.sendType = sendType;
        fnidpetArr.amount = Amount.value;
        fnidpetArr.isfrom = getQueryString("isfrom") ? getQueryString("isfrom") : 0
        for (i in fnidpetArr.img) {
            fnidpetArr.imgText += escape(fnidpetArr.img[i].src) + ',';
        }
        getData('setFindpet', function(data) {
            if (data) {
                if (data.result) {
                    $.toast('提交成功', 'success', 2000);
                    setTimeout(function() {
                        window.history.go(-1);
                    }, 2000);
                }
            } else {

            }
        }, fnidpetArr, function() { $.toast('提交失败', 'err', 2000); });

        //alert(JSON.stringify(fnidpetArr));
    })

    $uploaderFiles.on("click", "li", function() {
        var delimg = $(this);
        $.confirm('确认删除？', '您确定要删除这张图片吗？', '确定', '取消', function() {
            for (var i in fnidpetArr.img) {
                if ("url(\"" + fnidpetArr.img[i].src + "\")" == delimg.css('background-image') || "url(http://" + window.location.host + fnidpetArr.img[i].src + ")" == delimg.css('background-image')) {
                    fnidpetArr.img = removeArr(fnidpetArr.img, i);
                    fnidpetArr.imgMaxNum--;
                    fnidpetArr.imgNum--
                    $('.weui-uploader__info').text(fnidpetArr.imgMaxNum)
                }
            }
            delimg.remove();
        }, function() { });
    });

    var f = document.querySelector('#uploaderInput');

    f.onchange = function(e) {
        var files = e.target.files;
        var len = files.length;
        if (len > 9) {
            $.alert('一次最多只能上传9张图片！', '确认', function() { });
            return;
        }
        if (fnidpetArr.imgNum + len > 20) {
            $.alert('最多只能上传20张图片！', '确认', function() { });
            return;
        }
        var l = $.toast('正在上传...', 'loading', 0, null, 0);
        fnidpetArr.imgMaxNum += len
        $('.weui-uploader__info').text(fnidpetArr.imgNum + "/" + fnidpetArr.imgMaxNum)
        for (var i = 0; i < len; i++) {
            lrz(files[i], { width: 640, fieldName: "file" }).then(function(rst) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/server/uploader.asp?fn=' + escape(rst.origin.name));

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var obj = JSON.parse(xhr.response), src;
                        src = unescape(obj.src);
                        setTimeout(function() {
                            $uploaderFiles.append($(tmpl.replace('#url#', src)));
                        }, 100);
                        fnidpetArr.img[fnidpetArr.imgNum] = {};
                        fnidpetArr.img[fnidpetArr.imgNum].src = src;
                        fnidpetArr.imgNum++;
                        if (fnidpetArr.imgNum == fnidpetArr.imgMaxNum) {
                            $('.weui-uploader__info').text(fnidpetArr.imgNum);
                            l.hide();
                            //$('#' + page).find('.weui-uploader__file').remove();
                            //$('#' + page).find('a').remove();
                            //onLoadPage('uploader');
                        } else {
                            l.hide();
                            $('.weui-uploader__info').text(fnidpetArr.imgNum + "/" + fnidpetArr.imgMaxNum)
                        }

                    } else {
                        // 处理其他情况
                    }
                };

                xhr.onerror = function() {
                    // 处理错误
                };

                xhr.upload.onprogress = function(e) {
                    // 上传进度
                    var percentComplete = ((e.loaded / e.total) || 0) * 100;
                };

                // 添加参数
                rst.formData.append('size', rst.fileLen);
                rst.formData.append('base64', rst.base64);

                // 触发上传
                xhr.send(rst.formData);
                return rst;
            })

            //                .catch(function (err) {
            //                alert(err);
            //                })

            //                .always(function () {// 不管是成功失败，这里都会执行
            //                });

        } //for end
    }

    fp_timeInput.value = new Date().Format("yyyy-MM-dd");

    $('#' + page).find("button[name=place]").on('click', function() {
        var h = ($('#container').height() - 120), w = ($('#container').width() - 40);
        var a = $('<div class="weui-mask_transparent"></div><div style="width:' + w + 'px;height:' + h + 'px;" class="mapStyle weui-form-preview"><div class="weui-cell"><div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="输入地址，点击搜索" id="SearchMap"></div><div class="weui-cell__ft"><button class="weui-vcode-btn" id="SearchMapbtn">搜索</button></div></div><div id="allmap"></div><div class="weui-form-preview__ft"><a href="javascript:;" class="weui-form-preview__btn weui-form-preview__btn_primary">确定</a><a href="javascript:;" class="weui-form-preview__btn weui-form-preview__btn_default">取消</a></div></div>');
        a.css({ marginTop: -h / 2, marginLeft: -w / 2 });

        a.find('#allmap').css({ height: h - 113 });
        $('#container').append(a);
        a.animate({
            transform: 'perspective(500px) rotateY(0deg)',
            webkitTransform: 'perspective(500px) rotateY(0deg)',
            MozTransform: 'perspective(500px) rotateY(0deg)',
            msTransform: 'perspective(500px) rotateY(0deg)',
            OTransform: 'perspective(500px) rotateY(0deg)'
        }, 200);

        var map = new BMap.Map("allmap"),
            point = new BMap.Point(fnidpetArr.placepoint.split(',')[0], fnidpetArr.placepoint.split(',')[1]),
            geolocationControl = new BMap.GeolocationControl();

        geolocationControl.addEventListener("locationSuccess", function(e) {
            // 定位成功事件
            var address = '';
            address += e.addressComponent.province + ',';
            address += e.addressComponent.city + ',';
            address += e.addressComponent.district + ',';
            address += e.addressComponent.street + ',';
            address += e.addressComponent.streetNumber;

            fnidpetArr.placeText = address;
            fnidpetArr.placepoint = e.point.lng + ',' + e.point.lat;
            //alert("当前定位地址为：" + address);
        });
        geolocationControl.addEventListener("locationError", function(e) {
            // 定位失败事件
            //alert(e.message);
        });
        map.addControl(geolocationControl);

        if (fnidpetArr.placepoint != '') {
            map.centerAndZoom(point, 15);
            var mk = new BMap.Marker(point);
            map.clearOverlays();
            map.addOverlay(mk);
            map.panTo(point);

            map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
            map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
            var top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL });
            map.addControl(top_right_navigation);
        } else {
            fnidpetArr.placeText = '';
            var geolocation = new BMap.Geolocation();

            geolocation.getCurrentPosition(function(r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    map.centerAndZoom(r.point, 15);
                } else {
                    map.centerAndZoom(point, 15);
                }
                map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
                map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
                var top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL });
                map.addControl(top_right_navigation);
            }, { enableHighAccuracy: true })
        }

        $('.mapStyle').find('.weui-form-preview__btn_primary').on('click', function() {
            //$('#' + page).find("a[name=place]").find('small').remove();
            //$('#' + page).find("a[name=place]").find('p').append(' <small>' + fnidpetArr.placeText + '</small>');
            $('#place_Text').val(fnidpetArr.placeText)
            a.animate({
                transform: 'perspective(500px) rotateY(90deg)'
            }, 200);
            setTimeout(function() {
                a.remove();
            }, 200);
        })

        $('.mapStyle').find('.weui-form-preview__btn_default').on('click', function() {
            a.animate({
                transform: 'perspective(500px) rotateY(90deg)'
            }, 200);
            setTimeout(function() {
                a.remove();
            }, 200);
        })

        $('.weui-mask_transparent').on('click', function() {
            a.animate({
                transform: 'perspective(500px) rotateY(90deg)'
            }, 200);
            setTimeout(function() {
                a.remove();
            }, 200);
        });
        $('#SearchMap').bind('keypress', function(event) {
            if (event.keyCode == "13") {
                var local = new BMap.LocalSearch(map, {
                    renderOptions: { map: map }
                });
                local.search($('#SearchMap').val());
            }
        });
        $('#SearchMapbtn').on('click', function() {
            var local = new BMap.LocalSearch(map, {
                renderOptions: { map: map }
            });
            local.search($('#SearchMap').val());
        });
        
        var geoc = new BMap.Geocoder();

        map.addEventListener("click", function(e) {
            var pt = e.point;
            var mk = new BMap.Marker(pt);
            map.clearOverlays();
            map.addOverlay(mk);
            map.panTo(pt);

            geoc.getLocation(pt, function(rs) {
                var addComp = rs.addressComponents;
                var p = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber;

                fnidpetArr.placepoint = pt.lng + ',' + pt.lat;
                fnidpetArr.placeText = p;
            });
        });


    });
}