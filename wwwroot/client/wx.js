var sysInfo = {};
sysInfo.openid = "oFJGzjonPcOjHDQpzeyLXmNuG6Vg";
function wxObj() {
    this.init = function(appId) {
        sysInfo.appId = appId
        sysInfo.timestamp = new Date().getTime()
        sysInfo.nonceStr = randomString(16)
        sysInfo.link = location.href.split('#')[0]
        sysInfo.imgUrl = "http://" + document.domain + "/weixin1/client/images/logo.jpg"
        sysInfo.title = "会员中心"
        sysInfo.desc = "华中通讯手机连锁"
    }
    this.getWx = function(callback) {
        getData("wxticket", function(data) {
            sysInfo.ticket = data.ticket;
            sysInfo.timestamp = parseInt(sysInfo.timestamp / 1000);

            var calcSignature = function(ticket, nonceStr, ts, url) {
                var str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + ts + '&url=' + url;
                shaObj = new jsSHA(str, 'TEXT');
                return shaObj.getHash('SHA-1', 'HEX');
            }
            sysInfo.signature = calcSignature(sysInfo.ticket, sysInfo.nonceStr, sysInfo.timestamp, sysInfo.link);

            wx.config({
                debug: false,
                appId: sysInfo.appId,
                timestamp: sysInfo.timestamp,
                nonceStr: sysInfo.nonceStr,
                signature: sysInfo.signature,
                jsApiList: ['chooseImage', 'onMenuShareAppMessage']
            });

            wx.ready(function() {
                wx.checkJsApi({
                    jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function(res) {
                        if (res.checkResult.chooseImage) {
                            getData("GetOpenID", function(res) {
                                if (res.openid) sysInfo.openid = res.openid;
                                callback();
                            }, { code: qsCode, appid: sysInfo.appId }, callback)
                        } else {
                            callback();
                        }
                    }
                });

                wx.onMenuShareAppMessage({
                    title: sysInfo.title, // 分享标题
                    desc: sysInfo.desc, // 分享描述
                    link: sysInfo.link, //link, // 分享链接
                    imgUrl: sysInfo.imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        //getshareAD();//暂停开放2016-10-31zz
                        //sharelog(title, desc);
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        //alert("分享失败")
                    }
                });

                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            });

        }, {}, callback);
    }
}

function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
