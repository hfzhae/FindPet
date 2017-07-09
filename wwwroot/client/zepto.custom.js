$.alert = function(c, bt, fn) {
    var dialogalert = $('<div class="js_dialog" id="iosDialog2" style="display: none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__bd">' + c + '</div><div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">' + bt + '</a></div></div></div>');
    $('#container').append(dialogalert);
    dialogalert.fadeIn(100);
    dialogalert.on('click', '.weui-dialog__btn', function() {
        fn();
        $(this).parents('.js_dialog').fadeOut(100);
    });
}

$.confirm = function(t, c, bt1, bt2, fn1, fn2) {
    if (bt1 != '') bt1 = '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">' + bt1 + '</a>';
    if (bt2 != '') bt2 = '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">' + bt2 + '</a>';
    var dialogConfirm = $('<div class="js_dialog" style="display: none;"><div class="weui-mask"></div><div class="weui-dialog"><div class="weui-dialog__hd"><strong class="weui-dialog__title">' + t + '</strong></div><div class="weui-dialog__bd">' + c + '</div><div class="weui-dialog__ft">' + bt1 + bt2 + '</div></div></div>');
    $('#container').append(dialogConfirm);
    dialogConfirm.fadeIn(100);
    dialogConfirm.on('click', '.weui-dialog__btn_primary', function() {
        fn1();
        $(this).parents('.js_dialog').fadeOut(100);
    });
    dialogConfirm.on('click', '.weui-dialog__btn_default', function() {
        fn2();
        $(this).parents('.js_dialog').fadeOut(100);
        //$.toast('ȡ������', 'cancel');
    });
};
$.toast = function(c, i, t, crl, s) {//c:���⣬i:ͼ�꣬crl:1Ϊ�رղ�����s:��ת������ʱΪ����Ĭ��300
    switch (i) {
        case 'loading':
            i = '<i class="weui-loading weui-icon_toast"></i>';
            break;
        case 'success':
            i = '<i class="weui-icon-success-no-circle weui-icon_toast" style="font-size:80px;margin:10px;"></i>';
            break;
        case 'err':
            i = '<i class="weui-icon-cancel weui-icon_msg" style="font-size:80px;margin:10px;"></i>';
            break;
        default:
            i = '<i class="weui-icon-info-circle weui-icon_msg" style="font-size:80px;margin:10px;"></i>';
            break;
    }
    if (s == undefined) {//��ת������ʱ
        s = 200;
    }
    var l = $('<div class="weui-mask_transparent"></div><div class="weui-toast_custom">' + i + '<p class="weui-toast__content">' + c + '</p></div>');
    $('#container').append(l);

    if (!crl) {
        //l.fadeIn(100);
        var browser = {
            versions: function() {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE�ں�
                    presto: u.indexOf('Presto') > -1, //opera�ں�
                    webKit: u.indexOf('AppleWebKit') > -1, //ƻ�����ȸ��ں�
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //����ں�
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //�Ƿ�Ϊ�ƶ��ն�
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios�ն�
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android�ն�
                    iPhone: u.indexOf('iPhone') > -1, //�Ƿ�ΪiPhone����QQHD�����
                    iPad: u.indexOf('iPad') > -1, //�Ƿ�iPad
                    webApp: u.indexOf('Safari') == -1, //�Ƿ�webӦ�ó���û��ͷ����ײ�
                    weixin: u.indexOf('MicroMessenger') > -1, //�Ƿ�΢�� ��2015-01-22������
                    qq: u.match(/\sQQ/i) == " qq" //�Ƿ�QQ
                };
            } (),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if (!browser.versions.android) l.css('-webkit-transform', 'rotate3d(0,1,0,-90deg');
        l.animate({
            transform: 'perspective(500px) rotateY(0deg)'
        }, s);
        if (t > 0) {
            setTimeout(function() {
                l.animate({
                    transform: 'perspective(500px) rotateY(90deg)'
                }, s);
                setTimeout(function() {
                    l.fadeOut(100);
                }, s);
            }, t);
        }
    } else {
        l.animate({
            transform: 'perspective(500px) rotateY(90deg)'
        }, s);
        setTimeout(function() {
            l.fadeOut(100);
        }, s);
    }
    this.hide = function() {
        l.animate({
            transform: 'perspective(500px) rotateY(90deg)'
        }, s);
        setTimeout(function() {
            l.fadeOut(100);
        }, s);
    }
    this.show = function() {
        l.fadeIn(100);
        l.animate({
            transform: 'perspective(500px) rotateY(0deg)'
        }, s);
    }
    return l;
}
