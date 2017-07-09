
/*******************************************************************************
Copyright(c) 2000-2013 by zydsoft ALL RIGHTS RESERVED.
********************************************************************************/

var now = new Date(),
        lstSymp = [],
        WdArr = [],
        acuData = [],
        Layer = [],
        Symptom = [],
        SymptomTitle = "",
        sysTheme = "c",
        LoadingTime = 200,
        LayerMenu = "",
        LayerMenui = 0;

//2013-1-15 显示式样部分代码 zz
$("div[data-role='header']").find("a").attr({ "data-iconpos": "notext" });
$("div[data-role='footer']").attr({ "data-theme": "c", "data-position": "fixed" }).html("<p align='center'>&copy; " + now.getFullYear() + " zydsoft v6.0</p>");
if (document.body.scrollWidth >= 650) {
    $("div[class='content-secondary']").css({ "height": document.body.offsetHeight - 123 });
}

$(window).resize(function(e) {
    if (document.body.scrollWidth >= 650) {
        $("div[class='content-secondary']").css({ "height": document.body.offsetHeight - 97 });
    } else {
        $("div[class='content-secondary']").css({ "height": $("div[class='content-secondary']").find("ul[data-role='listview']").height() });
    }
});

function setloading(n, t) {
    //        if (!n) {
    //            $.mobile.loading('show', {
    //                //text: '',
    //                textVisible: false,
    //                theme: 'z',
    //                html: ""
    //            });
    //        } else {
    //            setTimeout(function() {
    //                $.mobile.loading('hide');
    //            }, t);
    //        }
    if (n) setanimate($("body"), 300, function() { }, 20);
}

//获取URL参数 zz 2012-7-12
function request(strParame) {
    var args = new Object();
    var query = location.search.substring(1);

    var pairs = query.split("&"); // Break at ampersand 
    for (var i = 0; i < pairs.length; i++) {
        var argname = pairs[i].split("=")[0];
        var value = pairs[i].split("=")[1];
        value = decodeURIComponent(value);
        args[argname] = value;
    }
    return args[strParame];
}

function ViewWD(key) {
    var v = WdArr[key];
    if (v != undefined) {
        $(popupInfotitle).html("Reference")
        $(popupInfotext).html("<h3 class='ui-title'>" + v + "</h3><p/>");
        $(popupInfo).find("#popupInfobtn").html("<a href='#' data-role='button' data-rel='back' data-theme='" + sysTheme + "'>OK</a>").trigger("create")
        $(popupInfo).popup("open").css({ "min-width": "200px" });
        $(popupInfoFX).hide();
    } else {
        $(popupInfotitle).html("Reference")
        $(popupInfotext).html("<h3 class='ui-title'>标准版不包含专家诊疗，请购买iOS专业版！</h3><p/>");
        $(popupInfo).find("#popupInfobtn").html("<a href='#' data-role='button' data-rel='back' data-theme='" + sysTheme + "'>OK</a>").trigger("create")
        $(popupInfo).popup("open");
        $(popupInfoFX).hide();
    }
}

function setMenu(v) {
    setloading()
    v = replaceEx(v, "_", " ");
    getLayer(v, acuData);
    $("#content").html("");
    var m = getLayerMenuEx(v) + "<ul data-role='listview' data-inset='true' class='" + sysTheme + "'>";
    //m += "<li data-theme='" + sysTheme + "' style='text-align:center;'></li>";
    for (var key in Layer) {
        if (typeof Layer[key] == "string") {
            m += "<li data-theme='c' data-icon='edit'><a onclick=getlstSymp('" + Layer[key] + "','" + replaceEx(key, " ", "_") + "')>" + key + "</a><a data-icon='info' data-theme='c' onclick=ViewWD('" + Layer[key] + "');>Reference</a></li>";
        } else {
            m += "<li data-theme='c'><a onclick=setMenu('" + replaceEx(key, " ", "_") + "')>" + key + "</a></li>";
        }
    }
    m += "</ul>";
    $("#content").html(m).trigger("create").listview().listview("refresh");
    $("#LayerMenubtn")
            .removeClass("ui-corner-all")
            .css({
                "margin-bottom": "0px",
                "margin-top": "0px",
                "border-top-left-radius": "10px",
                "border-top-right-radius": "10px",
                "border-bottom": "0px"
            }).find("a").css({ "border-bottom": "0px" })
    $("#LayerMenubtn").find("span").css({ "border-bottom": "0px" });
    $("#content").find("ul")
            .removeClass("ui-corner-all")
            .css({
                "margin-top": "0px",
                "border-bottom-left-radius": "10px",
                "border-top-right-radius": "10px",
                "border-bottom-right-radius": "10px"
            });
    setloading(1, LoadingTime)
}

function getLayerMenuEx(v) {
    LayerMenu = ""
    LayerMenui = 0;
    getLayerMenu(v, acuData);
    var m = LayerMenu.split("."), Menu = "<div data-mini='true' id='LayerMenubtn' data-role='controlgroup' data-type='horizontal'>";
    var s = LayerMenu.split(".")[0];

    var o = $("a:contains('" + s + "')").parent().parent();
    $("#divMenu").find(".ui-btn-active").removeClass("ui-btn-active");
    $(o).addClass("ui-btn-active");

    for (var i = 0; i < m.length - 1; i++) {
        Menu += "<a href='#' data-role='button' data-theme='" + sysTheme + "' data-iconpos='notext' data-icon='arrow-l' onclick=setMenu('" + replaceEx(m[i], " ", "_") + "')>" + m[i] + "</a>";
    }
    Menu += "<a href='#' data-role='button' data-theme='" + sysTheme + "'>" + m[m.length - 1] + "</a>";
    Menu += "</div>"
    return Menu;
}

function setLiactive(o) {
    $(divMenu).find("li").removeClass("ui-btn-active");
    $(o).addClass("ui-btn-active");
}

function getLayer(v, o) {
    for (var key in o) {
        if (v == key) {
            Layer = o[key]
            return;
        } else {
            if (typeof o[key] == "object") {
                getLayer(v, o[key]);
            }
        }
    }
}

function getlstSymp(code, title) {
    title = replaceEx(title, "_", " ");

    if (typeof lstSymp[code] != "object") {
        $(popupInfotitle).html("提示")
        $(popupInfotext).html("<h3 class='ui-title'>标准版不包含专家诊疗，请购买iOS专业版！</h3><p/>");
        $(popupInfo).find("#popupInfobtn").html("<a href='#' data-role='button' data-rel='back' data-theme='" + sysTheme + "'>OK</a>").trigger("create")
        $(popupInfo).popup("open");
        $(popupInfoFX).hide();
        return;
    }
    setloading()
    Symptom = [];
    $("#content").html("");
    v = getLayerMenuEx(title);
    v += "<ul data-role='listview' data-inset='true' class='" + sysTheme + "'>";
    v += "<li data-theme='b'>Please select the listed symptoms, then click on the \"Diagnosis and Treatment\" button.</li>";
    for (var key in lstSymp[code]) {
        Symptom[key] = 0;
        v += "<li data-theme='c' data-icon='checkbox-off'><a onclick=checkSymptom(" + key + ",'" + replaceEx(lstSymp[code][key], " ", "_") + "',this)>" + lstSymp[code][key] + "</a></li>"
    }
    v += "</ul>";
    v += "<a data-role='button' data-icon='gear' data-theme='" + sysTheme + "' onclick=GetGT('" + code + "','" + replaceEx(title, " ", "_") + "')>Diagnosis and Treatment</a></div>";
    //v += "<a data-role='button' data-icon='info' data-theme='c' onclick=ViewWD('" + code + "')>Reference</a>";
    v += "<a data-role='button' data-icon='delete' data-theme='c' onclick='claerCheck();'>Reset</a>";
    $("#content").html(v).trigger("create");
    $("#LayerMenubtn")
            .removeClass("ui-corner-all")
            .css({
                "margin-bottom": "0px",
                "margin-top": "0px",
                "border-top-left-radius": "10px",
                "border-top-right-radius": "10px",
                "border-bottom": "0px"
            }).find("a").css({ "border-bottom": "0px" })
    $("#LayerMenubtn").find("span").css({ "border-bottom": "0px" });
    $("#content").find("ul")
            .removeClass("ui-corner-all")
            .css({
                "margin-top": "0px",
                "border-bottom-left-radius": "10px",
                "border-top-right-radius": "10px",
                "border-bottom-right-radius": "10px"
            });
    setloading(1, LoadingTime)
}

function claerCheck() {
    $("#content").find(".ui-btn-active").removeClass("ui-btn-active")
    $("#content").find(".ui-icon-checkbox-on").addClass("ui-icon-checkbox-off").removeClass("ui-icon-checkbox-on");
    for (var key in Symptom) {
        Symptom[key] = 0;
    }
}

function checkSymptom(key, t, o) {
    title = replaceEx(t, "_", " ");
    var obj = $(o).parent().parent();
    if (obj.hasClass("ui-btn-active")) {
        obj.removeClass("ui-btn-active")
                .find(".ui-icon-checkbox-on")
                    .addClass("ui-icon-checkbox-off")
                    .removeClass("ui-icon-checkbox-on")
        Symptom[key] = 0;
    } else {
        obj.addClass("ui-btn-active")
                .find(".ui-icon-checkbox-off")
                    .addClass("ui-icon-checkbox-on")
                    .removeClass("ui-icon-checkbox-off")
        Symptom[key] = 1;
    }
}

function serachAcu() {
    setloading()
    Layer = [];
    $("#divMenu").find(".ui-btn-active").removeClass("ui-btn-active");
    getAcu(acuData);
    $("#content").html("");
    var t = ""
    var m = "<ul data-role='listview' data-inset='true' data-filter='true'data-filter-placeholder='Search Disease...'>";
    for (var key in Layer) {
        LayerMenu = ""
        LayerMenui = 0;
        getLayerMenu(key, acuData)
        var arr = LayerMenu.split(".");
        if (t != arr[arr.length - 2]) {
            m += "<li data-theme='" + sysTheme + "' ><a onclick=setMenu('" + replaceEx(arr[arr.length - 2], " ", "_") + "')>" + arr[arr.length - 2] + "</a></li>";
        }
        t = arr[arr.length - 2];
        if (typeof Layer[key] == "string") {
            m += "<li data-theme='c' data-icon='edit'><a onclick=getlstSymp('" + Layer[key] + "','" + replaceEx(key, " ", "_") + "')>" + key + "</a><a data-icon='info' data-theme='c' onclick=ViewWD('" + Layer[key] + "');>Reference</a></li>";
        } else {
            m += "<li data-theme='c'><a onclick=setMenu('" + replaceEx(key, " ", "_") + "')>" + key + "</a></li>";
        }
    }
    m += "</ul>";
    $("#content").html(m).trigger("create").listview().listview("refresh");
    setloading(1, LoadingTime)
}

function getAcu(o) {
    for (var key in o) {
        if (typeof o[key] == "object") {
            getAcu(o[key]);
        } else if (typeof o[key] == "string") {
            if (o[key] != "") Layer[key] = o[key];
        }
    }
}

function getLayerMenu(v, o) {
    var x = 0, t = "";
    for (var key in o) {
        if (v == key) {
            LayerMenu += "." + v;
            LayerMenui = 1;
            x = 1;
            LayerMenu = LayerMenu.substr(1, LayerMenu.length);
            return;
        } else {
            if (typeof o[key] == "object") {
                LayerMenu += "." + key;
                t = LayerMenu;
                getLayerMenu(v, o[key]);
                if (LayerMenui == 1) return;
                var s = t.split(".")
                LayerMenu = "";
                for (var i = 0; i < s.length - 1; i++) {
                    if (s[i] != "") LayerMenu += "." + s[i];
                }
            }
        }
    }
}

function setInfo() {
    $("#content").html("<span>欢迎使用！！！请选择您需要诊断的科目，您也可以点击左上角的搜索按钮进行搜索。</span>")
}


//Diagnosis部分代码 2013-1-19 zz
var J1 = "", J2 = "", J3 = "", J4 = "", J5 = "", J6 = "", J7 = "", J8 = "", J9 = "", BZ = "", ZF = "", ZJF = "", CM1 = "", CM2 = "", K1 = "", K2 = "", K3 = "", K4 = "", K5 = "", K6 = "", K7 = "", K8 = "", K9 = "", CF = "", QT = "";

function GetGT(code, title) {
    title = replaceEx(title, "_", " ");
    var X = Symptom, Y = [], diff = "", text = "", textFX;
    SymptomTitle = "";
    J1 = "", J2 = "", J3 = "", J4 = "", J5 = "", J6 = "", J7 = "", J8 = "", J9 = "", BZ = "", ZF = "", ZJF = "", CF = "", CM1 = "", CM2 = "", K1 = "", K2 = "", K3 = "", K4 = "", K5 = "", K6 = "", K7 = "", K8 = "", K9 = "", QT = "";
    for (var key in lstSymp[code]) {
        if (Symptom[key] == 1) {
            SymptomTitle += lstSymp[code][key] + " ";
        }
    }
    switch (code.toLowerCase()) {
        case "n101": //感冒Common Cold
            Y[1] = 2 * X[0] + X[3] + X[8] + 3 * X[1] + 3 * X[4] + 4 * X[6] - 2 * X[11] + 3 * X[13] + 2 * X[16] + 2 * X[19] + 2 * X[22];
            Y[2] = 2 * X[0] + X[3] + X[8] + 3 * X[2] + 3 * X[5] - 2 * X[6] + 3 * X[7] + 3 * X[11] - X[13] + 4 * X[18] + 2 * X[20] + X[23];
            Y[3] = 2 * X[0] + X[3] + X[8] + 2 * X[2] + X[7] + 2 * X[9] + X[10] + 2 * X[11] + 2 * X[12] + 2 * X[14] + 2 * X[15] + 2 * X[17] + 2 * X[21] + X[23];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-cold syndrome";
                    ZF = "Expelling wind & clearing away cold, ventilating the lung & relieving exterior syndrome";
                    CF = "LU7  GB20  BL12  LI4  LI20  ";
                    if (X[8] == 1) J1 = "Taiyang  ";
                    if (X[16] == 1) J2 = "BL13  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Jing Fang Baidu San";
                    CM2 = "Jing-jie 09  Fang-feng 09  Qiang-huo 09  Du-huo 09  Chai-hu 09  Qian-hu 09  Chuan-xiong 09  Zhi-ke 09  Fu-ling 12  Jie-geng 09  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Wind-heat syndrome";
                    ZF = "Dispelling wind & heat from the lung, facilitating the flow of lung-qi";
                    CF = "GV14  LI11  TE5  LU10  LU5  ";
                    if (X[18] == 1) J1 = "LU11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yin Qiao San";
                    CM2 = "Jin-yin-hua 15  Lian-qiao 09  Dan-dou-chi 09  Niu-bang-zi 09  Jing-jie 09  Jie-geng 09  Gan-cao 06  Dan-zhu-ye 09  Lu-gen 30  ";
                    break;
                case "DF3":
                    BZ = "Summer-heat and dampness";
                    ZF = "Clearing away summer-heat & eliminating dampness, relieving exterior syndrome and regulating the stomach";
                    CF = "LU6  LI4  CV12  ST36  TE6  ";
                    if (X[7] == 1) J1 = "GV14  ";
                    if (X[21] == 1) J2 = "SP9  ";
                    if (X[17] == 1) J3 = "ST25  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xinjia Xiangru Yin";
                    CM2 = "Xiang-ru 12  Bian-dou-hua 15  Hou-po 09  Jin-yin-hua 15  Lian-qiao 09  ";
                    break;
            }
            break;
        case "n102": //咳嗽Cough
            Y[1] = 3 * X[0] + 3 * X[3] + 3 * X[5] - X[6] + 2 * X[14] + 3 * X[15] + 3 * X[16] - X[17] + X[19] + X[22];
            Y[2] = 3 * X[0] - X[3] + 3 * X[4] - X[5] + 3 * X[6] + 3 * X[11] + 2 * X[14] - 2 * X[16] + 3 * X[17] + X[20] + X[23];
            Y[3] = 3 * X[0] + 3 * X[3] - X[4] + 3 * X[5] - 2 * X[6] + 4 * X[8] - X[9] + 3 * X[13] + 2 * X[21] + X[24];
            Y[4] = 3 * X[0] + 3 * X[1] + 3 * X[4] - X[5] + 2 * X[6] + X[7] + 2 * X[10] + 3 * X[12] + X[20] + X[25];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-cold pathogen tightening the lung";
                    ZF = "Dispelling wind-cold from the body, ventilating the lung and resolving phlegm";
                    CF = "LU7  LI4  BL13  TE5  ";
                    if (X[14] == 1) J1 = "GB20  GV23  ";
                    if (X[15] == 1) J2 = "BL60  LI7  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Zhisou San";
                    CM2 = "Jing-jie 09  Jie-geng 09  Gan-cao 06  Bai-qian 09  Chen-pi 09  Bai-bu 09  Zi-yuan 09  ";
                    break;
                case "DF2":
                    BZ = "Impairment of the lung by wind-heat";
                    ZF = "Dispelling wind-heat from the body, ventilating the lung and resolving phlegm";
                    CF = "LU5  BL13  LI11  GV14  ";
                    if (X[10] == 1 || X[11] == 1) J1 = "LU11  ";
                    if (X[18] == 1) J2 = "LI4  ";
                    if (X[17] == 1) J3 = "ST43  KI7  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Sang Ju Yin";
                    CM2 = "Sang-ye 09  Ju-hua 09  Lian-qiao 09  Bo-he 06  Jie-geng 09  Xin-ren 09  Lu-gen 09  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "Accumulation of phlegm-dampness in the lung";
                    ZF = "Strengthening the spleen and reducing phlegm, invigorating lung-qi";
                    CF = "BL13  BL20  LU9  SP3  ST40  LI4  ";
                    if (X[2] == 1) J1 = "Dingchuan  ";
                    if (X[13] == 1) J2 = "ST36  PC6  ";
                    ZJF = "Uniform reinforcing-reducing method in acupuncture";
                    CM1 = "Er Chen Tang & San Zi Yangqin Tang";
                    CM2 = "Ban-xia 09  Chen-pi 09  Fu-ling 12  Gan-cao 06  Su-zi 09  Bai-jie-zi 09  Lai-fu-zi 09  ";
                    break;
                case "DF4":
                    BZ = "The liver-fire attaching lung";
                    ZF = "Calming liver-fire, removing heat from the lung and dissolving phlegm";
                    CF = "BL13  BL18  LU8  LR3  ";
                    if (X[10] == 1) J1 = "KI6  ";
                    if (X[7] == 1) J2 = "LU6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Jiajian Xiebai San & Daige San";
                    CM2 = "Sang-bai-pi 12  Di-gu-pi 09  Gan-cao 06  Geng-mi 12  Qin-pi 09  Chen-pi 09  Wu-wei-zi 09  Ren-shen 12  Fu-ling 12  Qin-dai 09  Ge-qiao 09  ";
                    break;
            }
            break;
        case "n103": //哮喘Asthma
            Y[1] = 2 * X[0] - X[1] + 3 * X[3] - 2 * X[4] + 3 * X[5] - 2 * X[6] + 2 * X[7] + 3 * X[9] + 3 * X[13] + X[21] + X[23];
            Y[2] = 2 * X[0] - X[1] - 2 * X[3] + 3 * X[4] - 2 * X[5] + 3 * X[6] - X[9] + 2 * X[10] + 3 * X[12] + 2 * X[20] + 2 * X[22] + X[24];
            Y[3] = 2 * X[0] + 4 * X[1] + 3 * X[11] + 3 * X[16] + 3 * X[17] + 3 * X[18] + X[19] + X[25];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Obstruction of the lung by cold-phlegm";
                    ZF = "Expelling cold and facilitating the flow of lung-qi to relieve asthma";
                    CF = "LU7  LU5  BL12  BL13  ";
                    if (X[14] == 1) J1 = "GB29  ";
                    if (X[15] == 1) J2 = "LI7  ";
                    if (X[12] == 1 && X[13] == 1) J3 = "SI7  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Shegan Mahuang Tang";
                    CM2 = "She-gan 12  Ma-huang 09  Xi-xin 03  Zi-yuan 09  Kuan-dong-hua 09  Ban-xia 09  Wu-wei-zi 06  Sheng-jiang 03  Da-zao 06  ";
                    break;
                case "DF2":
                    BZ = "Accumulation of phlegm and heat in the lung";
                    ZF = "Clearing away the heat and facilitating the flow of lung-qi to relieve asthma";
                    CF = "LI4  GV14  ST40  CV17  LU1  LU6  ";
                    if (X[0] == 1 && X[2] == 1) J1 = "BL13  LU2  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Dingchuan Tang";
                    CM2 = "Bai-guo 09  Ma-huang 09  Sang-bai-pi 09  Kuan-dong-hua 09  Ban-xia 09  Xing-ren 09  Su-zi 09  Huang-qin 12  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "Insufficiency of the lung and the kidney qi";
                    ZF = "Strengthening the body resistance to consolidate the constitution and resolving sputum and relieving asthma";
                    CF = "Dingchuan  BL43  BL13  LU9  KI3  ";
                    if (X[18] == 1) J1 = "BL20  ST36  ";
                    if (X[17] == 1) J2 = "PC6  HT7  CV6  CV4  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Yupingfeng San & Jinkui Shenqi Wan";
                    CM2 = "Huang-qi 15  Bai-zhu 12  Fang-feng 09  Gui-zhi 09  Fu-zi 06  Shu-di-huang 12  Shan-zhu-yu 09  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  ";
                    break;
            }
            break;
        case "n104": //肺痨Phthisis
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7] + X[8];
            if (Y[1] > 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Infection of mycobacterium tuberculosis and deficiency of yin";
                    ZF = "Invigorating the deficiency syndrome and antiphthisic treatment";
                    CF = "LU9  BL13  BL43  ST36  SP6  KI3  ";
                    if (X[4] == 1) J1 = "LU5  ";
                    if (X[2] == 1) J2 = "LU10  ";
                    if (X[1] == 1) J3 = "LU6  ";
                    if (X[3] == 1) J4 = "HT6  ";
                    if (X[5] == 1) J5 = "KI6  ";
                    if (X[6] == 1) J6 = "BL52  ";
                    if (X[7] == 1) J7 = "SP10  ";
                    if (X[8] == 1) J8 = "CV4  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Yuehua Wan";
                    CM2 = "Tian-dong 09  Mai-dong 09  Sheng-di-huang 12  Shu-di-huang 12  Shan-yao 15  Bai-bu 09  Sha-shen 09  Chuan-bei-mu 09  Fu-ling 12  E-jiao 09  San-qi 09  Ta-gan 09  Ju-hua 09 Sang-ye 09  ";
                    break;
            }
            break;
        case "n105": //咳血Hemoptysis 
            Y[1] = 2 * X[0] + 2 * X[1] + 2 * X[2] + 3 * X[5] + 4 * X[8] + 4 * X[9] + 2 * X[10] + X[11];
            Y[2] = 2 * X[0] + 2 * X[1] + 2 * X[2] + 4 * X[3] + 3 * X[4] + 3 * X[6] + 2 * X[7] + X[10] + X[12];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "The liver-fire attaching lung";
                    ZF = "clearing away the heat of liver and lung";
                    CF = "BL13  LU10  PC8  LR2  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiebai San & Daige San";
                    CM2 = "Sang-bai-pi 12  Di-gu-pi 09  Gan-cao 06  Geng-mi 12  Qin-dai 09  Ge-qiao 09  ";
                    break;
                case "DF2":
                    BZ = "Hyperactivity of fire due to yin deficiency";
                    ZF = "Nourishing yin to clear away the lung-heat and stop bleeding";
                    CF = "LU5  LU10  LU6  Jingbailao  KI2  ";
                    ZJF = "Reduction and reinforcement in acupuncture";
                    CM1 = "Baihe Gujin Tang";
                    CM2 = "Sheng-di 12  Shu-di-huang 12  Mai-dong 09  Bei-mu 09  Bai-he 09  Dang-gui 09  Bai-shao 09  Gan-cao 06  Xuan-shen 09  Jie-geng 09  ";
                    break;
            }
            break;
        case "n201": //呃逆Hiccup
            Y[1] = 3 * X[0] + 6 * X[5] + 2 * X[7] - 2 * X[10] - 2 * X[11] + 2 * X[15] + 2 * X[18] - 2 * X[19] + X[21];
            Y[2] = 3 * X[1] - 2 * X[5] - 2 * X[8] + 3 * X[9] + 4 * X[10] + 2 * X[14] - X[15] + 2 * X[16] + X[19] + X[22];
            Y[3] = 3 * X[2] + 5 * X[6] + 4 * X[12] + 2 * X[13] + X[24];
            Y[4] = 3 * X[3] + 2 * X[5] + 3 * X[7] + 3 * X[8] - 2 * X[10] - 2 * X[11] + 3 * X[15] - 2 * X[16] - 2 * X[17] + X[18] + X[25];
            Y[5] = 3 * X[4] - 2 * X[5] + 3 * X[11] + 3 * X[13] - 2 * X[15] + X[16] + 2 * X[17] + 3 * X[20] + X[23];
            if (Y[1] > 6 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5]) diff = "DF2";
            if (Y[3] > 6 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5]) diff = "DF3";
            if (Y[4] > 6 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5]) diff = "DF4";
            if (Y[5] > 6 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4]) diff = "DF5";
            switch (diff) {
                case "DF1":
                    BZ = "Stomach-cold";
                    ZF = "Warming the stomach to dispel cold";
                    CF = "CV12  PC6  ST36  BL17  ST21  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Dingxiang San";
                    CM2 = "Ding-xiang 12  Shi-di 09  Gao-liang-jiang 09  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Adverse rising of the stomach-fire";
                    ZF = "Clearing out the interior heat and reducing the stomach-fire";
                    CF = "CV12  PC6  ST36  BL17  ST43  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Zhuye Shigao Tang";
                    CM2 = "Dan-zhu-ye 09  Shi-gao 30  Mai-dong 09  Ren-shen 12  Ban-xia 09  Geng-mi 15  Gan-cao 06  Shi-di 09  Zhu-li 09  ";
                    break;
                case "DF3":
                    BZ = "The hyperactive liver-qi attacking the stomach";
                    ZF = "Calming the liver to checking upward adverse flow of the stomach-qi";
                    CF = "CV12  PC6  ST36  BL17  LR14  LR3  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Wumo Yin Zi";
                    CM2 = "Wu-yao 09  Chen-xiang 06  Bing-lang 09  Zhi-shi 09  Mu-xiang 09  ";
                    break;
                case "DF4":
                    BZ = "Insufficiency of the spleen and stomach-yang";
                    ZF = "Warming and invigorating the spleen and stomach";
                    CF = "CV12  PC6  ST36  BL17  CV6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Lizhong Wan";
                    CM2 = "Ren-shen 12  Bai-zhu 09  Gan-jiang 09  Zhi-gan-cao 06  Wu-zhu-yu 09  Ding-xiang 09  ";
                    break;
                case "DF5":
                    BZ = "Deficiency of the stomach-yin";
                    ZF = "Nourishing the stomach-yin";
                    CF = "CV12  PC6  ST36  BL17  SP18  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Yiwei Tang";
                    CM2 = "Sha-shen 15  Mai-dong 09  Sheng-di-huang 12  Yu-zhu 09  Bing-tang 09  Pi-pa-ye 12  Shi-hu 09  Shi-di 09  ";
                    break;
            }
            break;
        case "n202": //噎膈Dysphagia
            Y[1] = X[0] + X[2] + X[3] + X[4] + X[5];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of phlegm & qi,deficiency of body fluid & collection of heat";
                    ZF = "Relieving stagnation and regulating the flow of qi,nourishing yin and moistening the dryness";
                    CF = "CV22  CV17  ST36  PC6  CV13  BL21  BL20  BL17  ";
                    if (X[4] == 1) J1 = "KI6  ";
                    if (X[2] == 1) J2 = "CV6  ";
                    if (X[3] == 1 && X[5] == 1) J3 = "GV4  BL23  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Qige San & Wuzhi Anzhong Yin";
                    CM2 = "Sha-shen 12  Fu-ling 12  Dan-shen 09  Chuan-bei-mu 09  Yu-jin 09  Sha-ren 06  He-ye-di 09  Chu-tou-kang 09  Jiu-zhi 09  Niu-ru 09  Sheng-jiang-zhi 09  Li-zhi 09  Ou-zhi 09  ";
                    break;
            }
            break;
        case "n203": //胃痛Epigastralgia
            Y[1] = 3 * X[0] + 4 * X[2] + 2 * X[5] + 3 * X[7] + 3 * X[8] + X[16];
            Y[2] = 3 * X[1] + 4 * X[3] + 3 * X[6] + 2 * X[10] + 3 * X[11] + X[17];
            if (Y[1] > 6 && Y[1] > Y[2]) diff = "DF1";
            if (Y[1] > 6 && Y[1] > Y[2] && X[4] == 1) diff = "DF2";
            if (Y[1] > 6 && Y[1] > Y[2] && X[4] == 0 && X[6] == 1 && X[15] == 0) diff = "DF3";
            if (Y[2] > 6 && Y[2] > Y[1]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Excess syndrome";
                    ZF = "Warming the stomach to dispel cold, relieving the depressed liver-qi,clearing away the heat";
                    CF = "CV12  ST36  PC6  SP4  LR2  ";
                    if (X[2] == 1) J1 = "ST34  ";
                    if (X[5] == 1) J2 == "GB34  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Chaihu Shugan San";
                    CM2 = "Chai-hu 09  Zhi-ke 09  Bai-shao 12  Gan-cao 06  Xiang-fu 09  Chuan-xiong 09  Chuan-lian-zi 09  Yan-hu-suo 09  ";
                    break;
                case "DF2":
                    BZ = "Excess syndrome";
                    ZF = "Warming the stomach to dispel cold, relieving the depressed liver-qi,clearing away the heat";
                    CF = "CV12  ST36  PC6  SP4  LR2  ";
                    if (X[2] == 1) J1 = "ST34  ";
                    if (X[5] == 1) J2 = "GB34  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Huagan Jian";
                    CM2 = "Qing-pi 09  Chen-pi 09  Bai-shao 12  Dan-pi 09  Zhi-zi 09  Ze-xie 09  Bei-mu 09  ";
                    break;
                case "DF3":
                    BZ = "Excess syndrome";
                    ZF = "Warming the stomach to dispel cold, relieving the depressed liver-qi,clearing away the heat";
                    CF = "CV12  ST36  PC6  SP4  LR2  ";
                    if (X[2] == 1) J1 = "ST34  ";
                    if (X[5] == 1) J2 = "GB34  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Liang Fu Wan";
                    CM2 = "Gao-liang-jiang 12  Xiang-fu 09  Wu-zhu-yu 09  Chen-pi 09  ";
                    break;
                case "DF4":
                    BZ = "Deficiency syndrome";
                    ZF = "Warming & invigorating spleen and stomach to dispel cold, nourishing the stomach-yin";
                    CF = "BL20  BL21  CV12  LR13  ST36  PC6  SP6  ";
                    if (X[9] == 1 && X[15] == 1) J1 = "HT8  ";
                    if (X[4] == 1) J2 = "KI3  ";
                    if (X[13] == 1) J3 = "SP10  ";
                    if (X[12] == 1) J4 = "BL17  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Huangqi Jianzhong Tang";
                    CM2 = "Huang-qi 15  Bai-shao 12  Gui-zhi 09  Zhi-gan-cao 06  Sheng-jiang 03  Da-zao 06  Yi-tang 09  ";
                    break;
            }
            break;
        case "n204": //呕吐Vomiting
            Y[1] = 3 * X[0] + 4 * X[2] + 3 * X[4] + 2 * X[9] + 2 * X[14] + 2 * X[16] + 2 * X[18] + X[20];
            Y[2] = 3 * X[0] + 4 * X[3] + 3 * X[7] + 3 * X[8] + 3 * X[12] + X[17] + X[20];
            Y[3] = 3 * X[0] + 4 * X[1] + 3 * X[9] + 4 * X[10] + 4 * X[13] + X[21];
            Y[4] = 3 * X[0] + 6 * X[5] + 5 * X[6] + 2 * X[12] + X[17] + X[19];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Improper diet";
                    ZF = "Promoting flow of qi and removing stagnancy";
                    CF = "CV10  CV21  ST36  SP14  ";
                    if (X[14] == 1) J1 = "CV6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Baohe Wan";
                    CM2 = "Shen-qu 09  Shan-zha 09  Fu-ling 12  Ban-xia 09  Chen-pi 09  Lian-qiao 09  Lai-fu-zi 09  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of phlegm retention";
                    ZF = "Strengthening the function of the stomach and resolving phlegm";
                    CF = "LR13  SP4  CV12  ST40  ";
                    if (X[15] == 1) J1 = "BL20  BL25  ";
                    ZJF = "Uniform reinforcing-reducing method in acupuncture and moxibustion";
                    CM1 = "Xiao Banxia Tang & Ling Gui Zhu Gan Tang";
                    CM2 = "Ban-xia 09  Sheng-jiang 09  Fu-ling 12  Gui-zhi 09  Bai-zhu 09  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "The hyperactive liver-qi attacking the stomach";
                    ZF = "Soothing the liver and strengthening the stomach";
                    CF = "CV13  GB34  LR3  ST34  HT7  ";
                    if (X[9] == 1 || X[10] == 1) J1 = "PC6  SP4  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Banxia Houpo Tang & Zuojin Wan";
                    CM2 = "Ban-xia 09  Hou-po 09  Zi-su 09  Fu-ling 12  Sheng-jiang 06  Huang-liang 06  Wu-zhu-yu 09  ";
                    break;
                case "DF4":
                    BZ = "Exopathogen attack the stomach";
                    ZF = "Relieving exterior syndrome and strengthening the stomach";
                    CF = "GV14  TE5  LI4  ST44  CV12  SP6  LR3  ";
                    if (X[9] == 1) J1 = "PC5  ";
                    if (X[7] == 1) J2 = "GB20  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Huoxiang Zhengqi San";
                    CM2 = "Huo-xiang 12  Zi-su 09  Bai-zhi 09  Jie-geng 09  Bai-zhu 09  Hou-po 09  Ban-xia 09  Da-fu-pi 09  Fu-ling 12  Chen-pi 09  Gan-cao 06  Da-zao 03  ";
                    break;
            }
            break;
        case "n205": //腹痛Abdominal Pain
            Y[1] = 3 * X[0] + 3 * X[1] + 6 * X[9] + 2 * X[19] + 2 * X[21];
            Y[2] = 3 * X[0] + 2 * X[5] + 3 * X[7] - 2 * X[8] + 2 * X[11] + 3 * X[17] + 2 * X[22] + X[23];
            Y[3] = 3 * X[0] + 3 * X[2] + 3 * X[10] + 4 * X[12] + 2 * X[15] + X[24];
            Y[4] = 3 * X[0] - 3 * X[1] + 2 * X[6] + 3 * X[8] + 2 * X[9] + 2 * X[13] + X[14] + 2 * X[19] + X[20] + X[25];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Cold syndrome";
                    ZF = "Expelling cold and regulating the flow of qi";
                    CF = "CV12  ST36  SP15  SP4  LI4  ";
                    if (X[19] == 1) J1 = "CV8  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Liang Fu Wan & Zhengqi Tianxiang San";
                    CM2 = "Gao-liang-jiang 12  Xiang-fu 09  Wu-yao 09  Gan-jiang 09  Zi-su 09  Chen-pi 09  ";
                    break;
                case "DF2":
                    BZ = "Improper diet";
                    ZF = "Promoting digestion and removing stagnated food";
                    CF = "CV10  ST21  ST25  LI11  ";
                    if (X[16] == 1) J1 = "ST44  ";
                    if (X[17] == 1) J2 = "GB34  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Baohe Wan";
                    CM2 = "Shen-qu 09  Shan-zha 09  Fu-ling 12  Ban-xia 09  Chen-pi 09  Lian-qiao 09  Lai-fu-zi 09  ";
                    break;
                case "DF3":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "CV17  LR3  PC6  GB34  ";
                    if (X[2] == 1) J1 = "LR14  ";
                    if (X[3] == 1) J2 = "CV12  ";
                    if (X[4] == 1) J3 = "CV6  CV10  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chaihu Shugan San";
                    CM2 = "Chai-hu 09  Zhi-ke 09  Bai-shao 12  Gan-cao 06  Xiang-fu 09  Chuan-xiong 09  ";
                    break;
                case "DF4":
                    BZ = "Insufficiency of yang and interior cold";
                    ZF = "Strengthening the spleen and warming the kidney";
                    CF = "BL20  BL23  LR13  CV4  ";
                    if (X[19] == 1) J1 = "ST36  SP6  ";
                    ZJF = "Moxibustion";
                    CM1 = "Xiao Jianzhong Tang";
                    CM2 = "Gui-zhi 12  Bai-shao 30  Gan-cao 06  Sheng-jiang 03  Da-zao 06  Yi-tang 30  ";
                    break;
            }
            break;
        case "n206": //泄泻Diarrhea
            Y[1] = 2 * X[0] + 6 * X[1] - 2 * X[2] + 3 * X[3] + 4 * X[4] + 4 * X[7] - 2 * X[8] + 3 * X[10];
            Y[2] = 2 * X[0] - 2 * X[1] + 6 * X[2] + 5 * X[5] - 2 * X[7] + 3 * X[8] + 2 * X[11] + 2 * X[12] + 2 * X[13];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[1] > 7 && Y[1] > Y[2] && X[3] == 0 && X[4] == 0) diff = "DF2";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Acute-diarrhea";
                    ZF = "Regulating the function of the stomach and intestines";
                    CF = "ST25  LI4  SP9  ST37  ST39  ";
                    if (X[3] == 1 && X[4] == 1) J1 = "ST44  LI1  ";
                    if (X[13] == 1 && X[4] == 0) J2 = "CV8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Gegeng Qin Lian Tang";
                    CM2 = "Ge-geng 12  Huang-qin 12  Huang-lian 09  Zhi-gan-cao 06  Jin-yin-hua 12  Fu-ling 12  Mu-tong 09  Che-qian-zi 09  ";
                    break;
                case "DF2":
                    BZ = "Acute-diarrhea";
                    ZF = "Regulating the function of the stomach and intestines";
                    CF = "ST25  LI4  SP9  ST37  ST39  ";
                    if (X[3] == 1 && X[4] == 1) J1 = "ST44  LI1  ";
                    if (X[13] == 1 && X[4] == 0) J2 = "CV8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Huoxiang Zhengqi San";
                    CM2 = "Huo-xiang 12  Zi-su 09  Bai-zhi 09  Jie-geng 09  Bai-zhu 09  Hou-po 09  Ban-xia 09  Da-fu-pi 09  Fu-ling 12  Chen-pi 09  Gan-cao 06  Da-zao 03  ";
                    break;
                case "DF3":
                    BZ = "Chronic-diarrhea";
                    ZF = "Invigorating the spleen,relieving depression of liver-qi and warming the kidney";
                    CF = "CV12  ST25  ST36  BL20  BL26  ";
                    if (X[9] == 1) J1 = "BL18  LR2  ";
                    if (X[6] == 1 && X[13] == 1) J2 = "BL23  GV4  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Shen Ling Baizhu San & Si Shen Wan";
                    CM2 = "Ren-shen 12  Fu-ling 15  Bai-zhu 09  Jie-geng 09  Shan-yao 15  Gan-cao 06  Bai-bian-dou 09  Lian-zi-rou 12  Sha-ren 06  Yi-yi-ren 09  Bu-gu-zhi 09  Rou-dou-kou 09  Wu-zhu-yu 09  Wu-wei-zi 09  Sheng-jiang 03  Da-zao 06  ";
                    break;
            }
            break;
        case "n207": //痢疾Dysentery
            Y[1] = 2 * X[0] + 4 * X[1] - 2 * X[3] - 2 * X[9] + 3 * X[12] + 4 * X[13] + 2 * X[15] + X[18] + X[21];
            Y[2] = 2 * X[0] + 2 * X[1] + 3 * X[6] + 3 * X[8] + 4 * X[9] + 2 * X[16] + X[19] + X[21];
            Y[3] = 2 * X[0] + 2 * X[1] + 10 * X[4] + 2 * X[10] + X[18];
            Y[4] = 2 * X[0] + 2 * X[1] + 2 * X[2] + 4 * X[3] + 2 * X[7] - 2 * X[8] - 2 * X[9] + 2 * X[10] - 2 * X[12] + X[14] + X[17] + X[20];
            Y[5] = 2 * X[0] + 2 * X[1] + 8 * X[5] - 2 * X[8] + 2 * X[11] + 2 * X[14] + X[22];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5]) diff = "DF4";
            if (Y[5] > 7 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4]) diff = "DF5";
            switch (diff) {
                case "DF1":
                    BZ = "Damp-heat dysentery";
                    ZF = "Clearing away heat & eliminating dampness, regulating of qi and blood";
                    CF = "LI4  ST25  ST37  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Shaoyao Tang";
                    CM2 = "Huang-qin 15  Bai-shao 12  Zhi-gan-cao 06  Huang-lian 06  Dai-huang 06  Bing-lang 09  Dang-gui 12  Mu-xiang 09  Rou-gui 09  Jin-yin-hua 09  ";
                    break;
                case "DF2":
                    BZ = "Fulminant dysentery";
                    ZF = "Removing pathogenic heat from blood and clearing away toxic material";
                    CF = "LI4  ST25  ST37  GV14  Shixuan  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Baitouweng Tang";
                    CM2 = "Bai-tou-weng 12  Qin-pi 09  Huang-lian 09  Huang-bai 09  Huang-qin 09  Jin-yin-hua 09  Chi-shao 09  Mu-dan-pi 09  Di-yu 09  Guan-Zhong 09  ";
                    break;
                case "DF3":
                    BZ = "Fasting dysentery";
                    ZF = "Expelling the pathogenic heat and strengthening the stomach";
                    CF = "LI4  ST25  ST37  CV12  PC6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Kaijin San";
                    CM2 = "Ren-shen 12  Huang-lian 06  Shi-chang-pu 09  Dan-shen 09  Shi-lian-zi 09  Fu-ling 12  Chen-pi 09  Dong-gua-zi 09  Chen-mi 12  He-geng 09  ";
                    break;
                case "DF4":
                    BZ = "Cold-damp dysentery";
                    ZF = "Warming and resolving cold-damp";
                    CF = "LI4  ST25  ST37  SP9  CV6  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Modified of Weiling Tang";
                    CM2 = "Cang-zhu 09  Hou-po 09  Chen-pi 09  Gan-cao 06  Sheng-jiang 03  Da-zao 06  Gui-zhi 09  Bai-zhu 09  Ze-xie 09  Bai-shao 15  Dang-gui 12  Bing-lang 09  Mu-xiang 09  Pao-jiang 09  ";
                    break;
                case "DF5":
                    BZ = "Chronic dysentery with frequent relapse";
                    ZF = "Warming the middle-jiao and clearing away heat,promoting the flow of qi";
                    CF = "LI4  ST25  ST37  BL20  BL23  ";
                    ZJF = "Uniform reinforcing-reducing method in acupuncture";
                    CM1 = "Modified of Lianli Tang";
                    CM2 = "Ren-shen 12  Bai-zhu 09  Gan-jiang 12  Zhi-gan-cao 06  Huang-lian 06  Fu-ling 12  Bing-lang 09  Mu-xiang 09  Zhi-shi 09  ";
                    break;
            }
            break;
        case "n208": //便秘Constipation
            Y[1] = 2 * X[0] + 2 * X[1] + 3 * X[5] + 3 * X[7] + 2 * X[10] - 2 * X[14] + 2 * X[15] - 2 * X[16] + X[19] + X[20];
            Y[2] = 2 * X[0] - 2 * X[5] - 2 * X[7] + 4 * X[13] + 4 * X[14] - 2 * X[15] + 3 * X[16] + X[18] + X[22];
            Y[3] = 2 * X[0] + 4 * X[3] - 2 * X[5] + 3 * X[6] + 3 * X[8] + 3 * X[12] + X[23];
            Y[4] = 2 * X[0] + 2 * X[1] + 4 * X[2] + 3 * X[9] + 4 * X[11] + X[21];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Heat in stomach and intestines";
                    ZF = "Clearing away heat and promoting salivation";
                    CF = "LI4  LI11  SP14  ST37  ";
                    if (X[7] == 1) J1 = "HT8  CV23  ";
                    if (X[4] == 1) J2 = "Yintang  ";
                    if (X[10] == 1) J3 = "CV24  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Maziren Wan";
                    CM2 = "Ma-zi-ren 12  Bai-shao 12  Zhi-shi 09  Dai-huang 09  Hou-po 09  Xin-ren 09  ";
                    break;
                case "DF2":
                    BZ = "Insufficiency of yang and interior cold";
                    ZF = "Nourishing the kidney and restoring yang";
                    CF = "CV6  BL26  KI6  KI18  BL23  ";
                    if (X[17] == 1) J1 = "GV1  GV20  ";
                    if (X[13] == 1) J2 = "BL40  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Jichuan Jian";
                    CM2 = "Dang-gui 12  Niu-xi 09  Rou-cong-rong 09  Ze-xie 09  Sheng-ma 09  Zhi-ke 09  Rou-gui 09  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of qi and blood";
                    ZF = "Invigorating qi and enriching the blood";
                    CF = "BL20  BL21  BL25  SP6  ST36  CV4  ";
                    if (X[12] == 1) J1 = "HT6  ";
                    if (X[8] == 1) J2 = "PC6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Huangqi Tang & Runchang Wan";
                    CM2 = "Huang-qi 15  Chen-pi 09  Huo-ma-ren 09  Bai-mi 09  Dang-gui 12  Sheng-di-huang 12  Tao-ren 09  Zhi-ke 09  ";
                    break;
                case "DF4":
                    BZ = "Stagnation of qi";
                    ZF = "Relieving the depressed liver";
                    CF = "CV12  GB34  CV6  LR2  ";
                    if (X[2] == 1) J1 = "LR14  GB24  ";
                    if (X[1] == 1) J2 = "SP15  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Liumo Tang";
                    CM2 = "Wu-yao 09  Chen-xiang 06  Bing-lang 09  Zhi-shi 09  Mu-xiang 09  Dai-huang 09  ";
                    break;
            }
            break;
        case "n209": //脱肛Proctoptosis
            Y[1] = 2 * X[0] + 6 * X[1] - 2 * X[2] + 6 * X[6] + X[8] + X[9];
            Y[2] = 2 * X[0] - 2 * X[1] + 6 * X[2] + 2 * X[3] + 2 * X[4] + 2 * X[5] - 2 * X[6] + X[7] + X[10];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Excess syndrome";
                    ZF = "Clearing away the damp-heat";
                    CF = "GV20  GV1  BL25  BL57  LI11  GB34  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Ermiao Wan";
                    CM2 = "Huang-bai 12  Cang-zhu 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency syndrome";
                    ZF = "Replenishing qi and elevating the spleen-qi";
                    CF = "GV20  GV1  BL25  BL57  CV6  ST36  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Buzhong Yiqi Tang";
                    CM2 = "Ren-shen 15  Huang-qi 12  Bai-zhu 09  Gan-cao 06  Dang-gui 12  Chen-pi 09  Sheng-ma 09  Chai-hu 09  ";
                    break;
            }
            break;
        case "n210": //便血Hemafecia
            Y[1] = 2 * X[0] + 3 * X[1] + 3 * X[3] - 2 * X[4] + 2 * X[5] - 2 * X[6] + 2 * X[7] + 2 * X[8] + 2 * X[9] + X[10] + X[12] + X[14];
            Y[2] = 2 * X[0] + 3 * X[2] - 2 * X[3] + 4 * X[4] + 4 * X[6] + 2 * X[11] + X[13] + X[15];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Insufficiency of the spleen-qi";
                    ZF = "Strengthening the spleen-qi to stop bleeding";
                    CF = "CV4  ST36  SP3  BL35  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Huangtu Tang";
                    CM2 = "Zao-xin-huang-tu 30  Gan-cao 06  Gan-di-huang 12  Bai-Zhu 09  Fu-zi 06  E-jiao 09  Huang-qin 09  ";
                    break;
                case "DF2":
                    BZ = "Large intestinal damp-heat";
                    ZF = "Eliminating damp-heat to stop bleeding";
                    CF = "GV1  BL32  ST37  BL57  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Diyu San";
                    CM2 = "Di-yu 12  Qian-cao-geng 09  Huang-qin 09  Huang-lian 06  Zhi-zi 09  Fu-ling 12  ";
                    break;
            }
            break;
        case "n301": //胸痹Chest Pain
            Y[1] = 2 * X[0] + 3 * X[1] + 4 * X[5] + X[6] + X[8] + X[9] + X[14] + X[18];
            Y[2] = 2 * X[0] + 3 * X[2] + 2 * X[6] + X[10] + X[11] + 2 * X[12] + 2 * X[16] + X[19];
            Y[3] = 2 * X[0] + 3 * X[3] + 3 * X[4] + 3 * X[13] + 2 * X[15] + X[17];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Cold of insufficiency type";
                    ZF = "Restoring yang and expelling cold";
                    CF = "BL15  BL14  PC6  HT5  ";
                    if (X[5] == 1) J1 = "BL13  BL12  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Gualou Xiebai Baijiu Tang";
                    CM2 = "Gua-lou 12  Xie-bai 09  Bai-jiu 15  Zhi-shi 09  Gui-zhi 09  Fu-zi 06  Dan-shen 12  Tan-xiang 06  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of phlegm";
                    ZF = "Activation yang and resolving phlegm";
                    CF = "CV14  CV17  PC4  LU9  ST40  ";
                    if (X[0] == 1) J1 = "BL13  BL15  ";
                    if (X[8] == 1) J2 = "BL24  BL23  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Gualou Xiebai Banxia Tang";
                    CM2 = "Gua-lou 12  Xie-bai 09  Bai-jiu 15  Ban-xia 09  Gan-jiang 09  Chen-pi 09  Bai-dou-kou 09  ";
                    break;
                case "DF3":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove blood stasis";
                    CF = "CV17  CV14  BL17  HT6  BL15  ";
                    if (X[13] == 1) J1 = "LU11  HT9  PC9  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xuefu Zhuyu Tang";
                    CM2 = "Dang-gui 12  Sheng-di-huang 12  Tao-ren 09  Hong-hua 09  Zhi-ke 09  Chi-shao 09  Chai-hu 09  Gan-cao 06  Jie-geng 09  Chuan-xiong 09  Niu-xi 09  ";
                    break;
            }
            break;
        case "n302": //心悸Palpitation
            Y[1] = 2 * X[0] + 4 * X[1] + 2 * X[3] + 2 * X[5] + X[9] + 2 * X[10] + X[15] + X[18] + X[20] - 2 * X[4] - 2 * X[17];
            Y[2] = 2 * X[0] + 2 * X[2] + 2 * X[3] + 2 * X[5] + 2 * X[6] + X[7] + X[10] + X[15] + X[18] + X[20] - 2 * X[4] - 2 * X[17];
            Y[3] = 2 * X[0] + X[6] + 2 * X[8] + X[9] + 2 * X[12] + 3 * X[13] + 3 * X[14] + X[16] + 2 * X[19] + X[21] - X[4] - 2 * X[17];
            Y[4] = 2 * X[0] + X[1] + 6 * X[4] + 4 * X[17] + X[22];
            if (Y[1] > 7 && Y[1] >= Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi";
                    ZF = "Invigorating qi and tranquilization";
                    CF = "BL15  CV14  PC5  HT7  ";
                    if (X[1] == 1) J1 = "PC7  ";
                    if (X[9] == 1) J2 = "BL43  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Anshen Dingzhi Wan";
                    CM2 = "Fu-ling 12  Fu-Shen 12  Yuan-zhi 09  Ren-shen 12  Shi-chang-pu 09  Long-chi 12  Hu-po 09  Ci-shi 15  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of blood";
                    ZF = "Nourishing the blood tranquilization";
                    CF = "BL17  BL20  HT5  BL44  ST36  ";
                    if (X[8] == 1) J1 = "PC8  ";
                    if (X[7] == 1) J2 = "TE3  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Guipi Tang";
                    CM2 = "Dang-shen 15  Huang-qi 12  Bai-zhu 09  Fu-sheng 12  Suan-zao-ren 09  Long-yan-rou 12  Mu-xiang 09  Gan-cao 06  Dang-gui 12  Yuan-zhi 09  Shen-jiang 03  Da-zao 03  ";
                    break;
                case "DF3":
                    BZ = "Phlegm-fire";
                    ZF = "Clearing away fire and resolving phlegm";
                    CF = "HT4  PC4  BL13  LU5  ST40  ";
                    if (X[10] == 1) J1 = "ST45  ";
                    if (X[11] == 1) J2 = "BL25  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Huanglian Wendan Tang";
                    CM2 = "Ban-xia 09  Chen-pi 09  Fu-ling 12  Gan-cao 06  Zhi-shi 09  Zhu-li 09  Huang-lian 09  Da-zao 06  ";
                    break;
                case "DF4":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove blood stasis";
                    CF = "PC3  HT3  CV6  SP10  ";
                    if (X[23] == 1) J1 = "PC6  LU9  ";
                    ZJF = "Uniform reinforcing-reducing method in acupuncture";
                    CM1 = "Taoren Honghua Jian";
                    CM2 = "Dan-shen 12  Chi-shao 09  Tao-ren 09  Hong-hua 09  Xiang-fu 09  Yan-hu-suo 09  Qing-pi 09  Dang-gui 12  Chuan-xiong 09  Sheng-di-huang 12  ";
                    break;
            }
            break;
        case "n303": //头痛Headache
            Y[1] = 3 * X[0] + 3 * X[1] + 6 * X[11] + 2 * X[23] + X[25] + X[26];
            Y[2] = 3 * X[0] + 3 * X[2] + 4 * X[12] + 3 * X[18] + 2 * X[21] + X[25];
            Y[3] = 3 * X[0] + 3 * X[3] + 2 * X[13] + 2 * X[14] + 3 * X[15] + 2 * X[24] + X[27];
            Y[4] = 3 * X[0] + 3 * X[4] + 3 * X[16] + 2 * X[17] + 3 * X[19] + X[20] + X[28];
            Y[5] = 3 * X[0] + 6 * X[5] + 3 * X[22] + 2 * X[29];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5]) diff = "DF4";
            if (Y[5] > 7 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4]) diff = "DF5";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-cold syndrome";
                    ZF = "Expelling wind and clearing away cold,resolving dampness and removing obstruction in the channels to relieve pain";
                    CF = "GB20  ST8  BL7  LI4  TE8  ";
                    if (X[6] == 1) J1 = "GV23  GB14  ";
                    if (X[8] == 1) J2 = "GV20  GV21  ";
                    if (X[7] == 1) J3 = "BL10  GV19  ";
                    if (X[9] == 1) J4 = "GB8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chuanxiong Chatiao San";
                    CM2 = "Chuan-xiong 09  Jing-jie 09  Bo-he 06  Qiang-huo 09  Xi-xin 03  Bai-zhi 09  Gan-cao 06  Fang-feng 09  ";
                    break;
                case "DF2":
                    BZ = "Hyperactivity of the liver-yang";
                    ZF = "Calming the liver";
                    CF = "GB5  GB4  LR3  KI3  ";
                    if (X[12] == 1) J1 = "TE1  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Tianma Gouteng Tang";
                    CM2 = "Tian-ma 12  Gou-teng 09  Shi-jue-ming 09  Chuan-niu-xi 09  Sang-ji-sheng 09  Du-zhong 09  Zhi-zi 09  Huang-qin 12  Yi-mu-cao 12  Zhu-fu-shen 12  Ye-jiao-teng 09  ";
                    break;
                case "DF3":
                    BZ = "Stagnation of phlegm";
                    ZF = "Resolving phlegm and removing obstruction in the channels to relieve pain";
                    CF = "CV12  ST40  GV20  Yintang  ";
                    if (X[15] == 1) J1 = "PC6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Banxia Baizhu Tianma Tang";
                    CM2 = "Ban-xia 09  Bai-zhu 09  Tian-ma 09  Chen-pi 09  Fu-ling 12  Gan-cao 06  Sheng-jiang 03  Da-zao 06  ";
                    break;
                case "DF4":
                    BZ = "Deficiency of blood";
                    ZF = "Replenishing qi and nourishing the blood";
                    CF = "GV23  SP10  ST36  SP6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Jiawei Siwu Tang";
                    CM2 = "Bai-shao 15  Dang-gui 12  Sheng-di-huang 12  Chuan-xiong 09  Man-jing-zi 09  Ju-hua 09  Huang-qin 09  Gan-cao 06  ";
                    break;
                case "DF5":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove the blood stasis and promoting circulation of qi to relieve pain";
                    CF = "Ashixue  LI4  SP6  ";
                    if (X[10] == 1) J1 = "BL2  ";
                    if (X[9] == 1) J2 = "Taiyang  ";
                    if (X[7] == 1) J3 = "TE18  ";
                    if (X[8] == 1) J4 = "Sishencong  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Tongqiao Huoxue Tang";
                    CM2 = "Chi-shao 09  Chuan-xiong 09  Tao-ren 09  Hong-hua 09  She-xiang 03  Lao-cong 06  Sheng-jiang 03  Da-zao 06  Huang-jiu 30  ";
                    break;
            }
            break;
        case "n304": //眩晕Vertigo
            Y[1] = 2 * X[0] + 3 * X[1] + 2 * X[3] + 2 * X[8] + 2 * X[10] + 2 * X[11] + 3 * X[12] + X[13] + X[15] + X[17];
            Y[2] = 2 * X[0] + 2 * X[2] + 4 * X[4] + 3 * X[5] + 2 * X[6] + 2 * X[7] + X[14] + X[16] + X[18] + X[19];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency syndrome";
                    ZF = "Invigorating qi and enriching the blood";
                    CF = "GV20  GB20  BL17  BL23  ST36  ";
                    if (X[8] == 1) J1 = "PC6  ";
                    if (X[9] == 1) J2 = "HT7  ";
                    if (X[11] == 1) J3 = "SI19  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Guipi Tang";
                    CM2 = "Dang-shen 15  Huang-qi 12  Bai-zhu 09  Fu-sheng 12  Suan-zao-ren 09  Long-yan-rou 12  Mu-xiang 09  Gan-cao 06  Dang-gui 12  Yuan-zhi 09  Shen-jiang 03  Da-zao 03  ";
                    break;
                case "DF2":
                    BZ = "Excess syndrome";
                    ZF = "Calming the liver,strengthening stomach and resolving phlegm";
                    CF = "CV12  SP9  LR2  KI5  Yintang  ";
                    if (X[5] == 1) J1 = "GB34  ";
                    if (X[2] == 1) J2 = "ST8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Tianma Gouteng Tang";
                    CM2 = "Tian-ma 12  Gou-teng 09  Shi-jue-ming 09  Chuan-niu-xi 09  Sang-ji-sheng 09  Du-zhong 09  Zhi-zi 09  Huang-qin 12  Yi-mu-cao 12  Zhu-fu-shen 12  Ye-jiao-teng 09  ";
                    break;
            }
            break;
        case "n305": //中风Apoplexy
            Y[1] = 2 * X[0] + 2 * X[3] + 4 * X[4] + 4 * X[5] - 2 * X[6] - 2 * X[7] - 2 * X[8] + 2 * X[11];
            Y[2] = 2 * X[0] + 2 * X[3] - 2 * X[4] - 2 * X[5] + 3 * X[6] + 5 * X[7] + 3 * X[8] + 2 * X[12];
            if (X[2] == 1) diff = "DF4";
            if (X[1] == 1) diff = "DF3";
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Apoplexy involving the solid organs[excess syndrome of stroke]";
                    ZF = "Causing resuscitation and reducing phlegm";
                    CF = "GV26  Shierjingxue  LR3  ST40  PC8  ";
                    if (X[4] == 1) J1 = "ST4  ST6  ";
                    if (X[9] == 1) J2 = "HT5  GV15  ";
                    if (X[10] == 1) J3 = "KI2  CV22  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Angong Niuhuang Wan or Zhibao Dan or Suhexiang Wan";
                    CM2 = "Chinese Patent Medicine";
                    break;
                case "DF2":
                    BZ = "Apoplexy involving the solid organs[prostration syndrome]";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "CV4  CV8  ";
                    if (X[7] == 1) J1 = "HT6  ";
                    if (X[6] == 1) J2 = "BL62  ";
                    if (X[8] == 1) J3 = "ST28  ST36  SP6  ";
                    ZJF = "Moxibustion";
                    CM1 = "Shen Fu Tang & Sheng Mai San";
                    CM2 = "Ren-shen 15  Fu-zi 09  Mai-dong 09  Wu-wei-zi 12  Sheng-jiang 03  Da-zao 06  ";
                    break;
                case "DF3":
                    BZ = "Apoplexy involving the channels and collaterals[hemiplegia]";
                    ZF = "Dredging the channel and regulating of qi and blood";
                    CF = "LI15  LI11  LI4  TE5  GB30  GB34  ST36  ST41  BL60  ";
                    if (X[23] == 1 && X[13] == 1) J1 = "GV14  SI14  ";
                    if (X[23] == 1 && X[14] == 1) J2 = "GV3  BL30  ";
                    if (X[16] == 1) J3 = "PC3  ";
                    if (X[17] == 1) J4 = "PC7  ";
                    if (X[18] == 1) J5 = "LR8  ";
                    if (X[19] == 1) J6 = "KI3  ";
                    if (X[20] == 1) J7 = "Baxie  ";
                    if (X[21] == 1) J8 = "Bafeng  ";
                    if (X[22] == 1) J9 = "CV23  HT5  ";
                    ZJF = "Reduction in acupuncture";
                    if (X[23] == 1) ZJF = "Reinforcement in acupuncture";
                    CM1 = "Buyang Huanwu Tang";
                    CM2 = "Dang-gui-wei 12  Chuan-xiong 09  Huang-qi 15  Tao-ren 09  Di-long 09  Chi-shao 09  Hong-hua 09  ";
                    break;
                case "DF4":
                    BZ = "Apoplexy involving the channels and collaterals[facial hemiparalysis]";
                    ZF = "Dredging the channel and regulating of qi and blood";
                    CF = "ST4  ST6  LI4  ST44  ST1  GB14  BL2  BL60  SI6  ";
                    if (X[24] == 1) J1 = "CV24  ";
                    if (X[25] == 1) J2 = "LR3  ";
                    if (X[26] == 1) J3 = "PC6  ";
                    ZJF = "Reduction in acupuncture";
                    if (X[23] == 1) ZJF = "Moxibustion after acupuncture";
                    CM1 = "Qianzheng San";
                    CM2 = "Bai-fu-zi 03  Jiang-can 09  Quan-xie 09  ";
                    break;
            }
            break;
        case "n401": //肋痛Hypochondriac Pain
            Y[1] = 2 * X[0] + 3 * X[1] + 3 * X[4] - 2 * X[5] + 3 * X[7] + 2 * X[12] + 3 * X[13] + X[22] + X[25];
            Y[2] = 2 * X[0] + 6 * X[11] + 2 * X[13] + 2 * X[15] - X[22] + 2 * X[20] + 3 * X[23] + X[25];
            Y[3] = 2 * X[0] + 4 * X[2] - 2 * X[4] + 3 * X[5] + X[6] + 4 * X[8] + 3 * X[21] + X[26];
            Y[4] = 2 * X[0] + 3 * X[3] + 3 * X[9] + 2 * X[10] + 2 * X[16] + X[17] + 2 * X[18] + 2 * X[24] + X[27];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "CV16  BL18  LR14  GB43  ";
                    if (X[13] == 1) J1 = "BL21  ";
                    if (X[19] == 1) J2 = "HT7  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chaihu Shugan San";
                    CM2 = "Chai-hu 09  Zhi-ke 09  Bai-shao 12  Gan-cao 06  Xiang-fu 09  Chuan-xiong 09  ";
                    break;
                case "DF2":
                    BZ = "Dampness and heat in the liver and the gallbladder";
                    ZF = "Clearing away heat and eliminating dampness";
                    CF = "LR14  GB24  TE6  GB34  LR3  ";
                    if (X[20] == 1) J1 = "GV14  ";
                    if (X[14] == 1) J2 = "CV12  ST36  ";
                    if (X[18] == 1) J3 = "PC4  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Longdan Xiegan Tang";
                    CM2 = "Long-dan-cao 09  Ze-xie 09  Mu-tong 09  Che-qian-zi 09  Dang-gui 12  Chai-hu 09  Sheng-di 12  Huang-qin 09  Zhi-zi 09  ";
                    break;
                case "DF3":
                    BZ = "Accumulation of blood stasis";
                    ZF = "Promoting blood circulation to stop pain";
                    CF = "SP21  GB25  LR2  BL17  SP6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Xuanfuhua Tang";
                    CM2 = "Xuan-fu-hua 30  Xin-jiang 03  Cong 09  Yu-jin 09  Tao-ren 09  Yan-hu-suo 09  Dang-gui-wei 09  ";
                    break;
                case "DF4":
                    BZ = "Deficiency of the liver-yin";
                    ZF = "Nourishing yin and supplementing blood";
                    CF = "HT6  BL15  SP10  SP6  ";
                    if (X[16] == 1) J1 = "BL43  ";
                    if (X[17] == 1) J2 = "GV20  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Yiguan Jian";
                    CM2 = "Sha-shen 15  Mai-dong 09  Dang-gui 12  Sheng-di-huang 12  Gou-ji-zi 09  Chuan-lian-zi 09  ";
                    break;
            }
            break;
        case "n402": //黄疸Jaundice
            Y[1] = 3 * X[0] + 4 * X[1] - 2 * X[2] + 3 * X[3] + 3 * X[5] + 2 * X[7] + 3 * X[8] - 2 * X[9] + X[14] + X[16] + X[18];
            Y[2] = 3 * X[0] - 2 * X[1] + 4 * X[2] + 2 * X[4] + X[6] - 2 * X[8] + 3 * X[9] + 2 * X[10] + 3 * X[12] + X[13] + X[15] + X[17];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Yang jaundice";
                    ZF = "Normalizing the function of gallbladder and curing jaundice,clearing away heat and eliminating dampness";
                    CF = "GV9  SI4  GB34  LR3  ";
                    if (X[5] == 1 && X[8] == 1) J1 = "GV14  ";
                    if (X[3] == 1) J2 = "GV26  PC9  HT9  ";
                    if (X[11] == 1 && X[12] == 1) J3 = "SP9  ST36  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yinchenhao Tang";
                    CM2 = "Yin-chen 30  Zhi-zi 12  Dai-huang 09  ";
                    break;
                case "DF2":
                    BZ = "Yin jaundice";
                    ZF = "Invigorating the spleen and normalizing the function of gallbladder, warming and resolving cold-damp";
                    CF = "BL20  ST36  BL19  GB34  SP6  CV6  ";
                    if (X[4] == 1 && X[6] == 1) J1 = "GV4  CV4  ";
                    if (X[12] == 1) J2 = "ST25  ";
                    ZJF = "Uniform reinforcing-reducing method in acupuncture";
                    CM1 = "Yinchen Zhu Fu Tang";
                    CM2 = "Yin-chen 15  Bai-zhu 12  Fu-zi 06  Gan-jiang 09  Zhi-gan-cao 06  Rou-gui 09  ";
                    break;
            }
            break;
        case "n403": //鼓胀Tympanites
            Y[1] = 2 * X[0] + 3 * X[2] + 3 * X[3] + 4 * X[9] + 3 * X[11] + X[21];
            Y[2] = 2 * X[0] + 3 * X[1] + X[4] + X[5] + 2 * X[12] + 2 * X[15] + 3 * X[17] + X[18] + X[20];
            Y[3] = 2 * X[0] + 3 * X[6] + 3 * X[7] + 3 * X[8] + 2 * X[10] + 2 * X[19] + X[22];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Tympanites due to stagnation of qi";
                    ZF = "Relieving the depressed liver and invigorating spleen for eliminating dampness";
                    CF = "CV17  CV12  CV6  ST36  LR3  ";
                    if (X[16] == 1) J1 = "SP14  ";
                    if (X[9] == 1 || X[10] == 1) J2 = "GB34  TE6  ";
                    if (X[14] == 1) J3 = "SP9  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chaihu Shugan San & Wei Ling Tang";
                    CM2 = "Chai-hu 09  Zhi-ke 09  Bai-shao 12  Gan-cao 06  Xiang-fu 09  Chuan-xiong 09  Cang-zhu 09  Hou-po 09  Chen-pi 09  Gui-zhi 09  Bai-zhu 09  Ze-xie 09  Fu-ling 12  Zhu-ling 09  Sheng-jiang 03  Da-zao 06  ";
                    break;
                case "DF2":
                    BZ = "Tympanites due to stagnation of water[ascites]";
                    ZF = "Strengthening the spleen & kidney,promoting the flow of qi & diuresis";
                    CF = "BL20  BL23  CV9  KI7  SP4  ";
                    if (X[17] == 1) J1 = "ST25  ST37  ";
                    if (X[12] == 1) J2 = "GV4  CV6  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Shipi Yin";
                    CM2 = "Fu-zi 06  Gan-jiang 09  Bai-zhu 09  Gan-cao 06  Hou-po 09  Mu-xiang 09  Cao-guo 09  Bing-lang 09  Mu-gua 09  Sheng-jiang 03  Da-zao 06  Fu-ling 12  ";
                    break;
                case "DF3":
                    BZ = "Tympanites due to blood stasis";
                    ZF = "Soothing the liver and spleen, promoting blood circulation to remove blood stasis";
                    CF = "LR14  LR13  CV5  SP6  ";
                    if (X[9] == 1) J1 = "ST21  ";
                    if (X[5] == 1) J2 = "BL48  SI4  ";
                    if (X[13] == 1) J3 = "KI3  BL43  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Tiaoying Yin";
                    CM2 = "E-zhu 09  Chuan-xiong 09  Dang-gui 12  Yan-hu-suo 09  Chi-shao 09  Qu-mai 09  Dai-huang 06  Bing-lang 09  Chen-pi 09  Da-fu-pi 09  Ting-li-zi 09  Chi-fu-ling 09  Sang-bai-pi 09  Xi-xin 03  Rou-gui 09  Gan-cao 06  Jiang-zao 03  Bai-zhi 06  ";
                    break;
            }
            break;
        case "n501": //水肿Edema
            Y[1] = 3 * X[0] - 2 * X[1] + 3 * X[2] - X[3] + 2 * X[4] + 2 * X[6] + 2 * X[8] + 2 * X[9] + X[15];
            Y[2] = -2 * X[0] + 3 * X[1] - X[2] + 3 * X[3] + 2 * X[5] + 2 * X[7] + X[10] + 2 * X[11] + X[12] + X[13] + X[14] + X[16];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Yang edema";
                    ZF = "Dispelling wind and inducing diuresis to alleviate edema";
                    CF = "BL13  SP6  LI6  SP9  LI4  TE5  ";
                    if (X[9] == 1) J1 = "LU11  ";
                    if (X[5] == 1) J2 = "GV26  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yuebi Jiazhu Tang";
                    CM2 = "Ma-huang 06  Shi-gao 30  Gan-cao 06  Sheng-jiang 03  Da-zao 06  Bai-zhu 09  ";
                    break;
                case "DF2":
                    BZ = "Yin edema";
                    ZF = "Strengthening the spleen & warming kidney,restoring yang and inducing diuresis to alleviate edema";
                    CF = "BL20  BL23  CV9  CV6  KI3  ST36  ";
                    if (X[10] == 1) J1 = "CV12  ";
                    if (X[11] == 1) J2 = "ST25  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Jisheng Shenqi Wan & Zhenwu Tang";
                    CM2 = "Di-huang 12  Shan-yao 15  Shan-zhu-yu 09  Mu-dan-pi 09  Fu-ling 12  Ze-xie 09  Fu-zi 06  Gui-zhi 09  Niu-xi 09  Che-qian-zi 09  Bai-zhu 09  Bai-shao 12  Sheng-jiang 03  ";
                    break;
            }
            break;
        case "n502": //淋证Dysuria
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6];
            if (X[0] == 1 && Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Damp-heat in lower-jiao";
                    ZF = "Promoting flow of bladder-qi  and clearing away damp-heat from lower-jiao";
                    CF = "BL28  CV3  SP9  LR2  KI3  ";
                    if (X[2] == 1) J1 = "LI4  TE5  ";
                    if (X[3] == 1) J2 = "BL39  KI2  ";
                    if (X[4] == 1) J3 = "SP10  SP6  ";
                    if (X[5] == 1) J4 = "CV6  ST28  ";
                    if (X[6] == 1) J5 = "GV20  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Bazheng San";
                    CM2 = "Mu-tong 09  Che-qian-zi 12  Bian-xu 09  Qu-mai 09  Hua-shi 15  Gan-cao-shao 09  Dai-huang 06  Zhi-zi 09  Deng-xin-cao 09  ";
                    break;
            }
            break;
        case "n503": //癃闭Uroschesis
            Y[1] = 2 * X[0] + 2 * X[1] + 2 * X[4] + 2 * X[5] + 2 * X[7] + 4 * X[10] + 2 * X[11] + 2 * X[12] + X[14] + X[17];
            Y[2] = 2 * X[0] + 2 * X[1] + 3 * X[4] + 3 * X[5] + 2 * X[8] + 3 * X[9] + 2 * X[15] + 2 * X[16] + X[18];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency syndrome";
                    ZF = "Warming and recuperating the spleen and kidney";
                    CF = "KI10  BL23  BL22  CV6  BL39  BL20  ";
                    if (X[13] == 1) J1 = "BL32  ";
                    if (X[8] == 1) J2 = "PC6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Jisheng Shenqi Wan";
                    CM2 = "Di-huang 12  Shan-yao 15  Shan-zhu-yu 12  Mu-dan-pi 09  Fu-ling 12  Ze-xie 09  Fu-zi 06  Gui-zhi 09  Niu-xi 09  Che-qian-zi 09  ";
                    break;
                case "DF2":
                    BZ = "Excess syndrome";
                    ZF = "Clearing away heat and eliminating dampness,promoting flow of qi and blood circulation";
                    CF = "SP6  SP9  BL28  CV3  ";
                    if (X[12] == 1) J1 = "LU5  LU11  ";
                    if (X[8] == 1) J2 = "PC6  ";
                    if (X[6] == 1) J3 = "GV26  PC9  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Bazheng San";
                    CM2 = "Mu-tong 09  Che-qian-zi 12  Bian-xu 09  Qu-mai 09  Hua-shi 15  Gan-cao-shao 09  Dai-huang 06  Zhi-zi 09  Deng-xin-cao 09  ";
                    break;
            }
            break;
        case "n504": //尿血Hematuria
            Y[1] = 2 * X[0] + 2 * X[1] + 3 * X[2] + 3 * X[3] + 4 * X[7] + 2 * X[8] + X[9] + X[11];
            Y[2] = 2 * X[0] + 2 * X[1] + 4 * X[4] + 3 * X[5] + 4 * X[6] + 2 * X[10] + X[12];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Hyperactivity of fire due to yin deficiency";
                    ZF = "Replenishing the vital essence and removing heat to stop bleeding";
                    CF = "CV4  KI10  KI3  LR1  ";
                    ZJF = "Reduction and reinforcement in acupuncture";
                    CM1 = "Zhi Bai Dihuang Wan";
                    CM2 = "Zhi-mu 12  Huang-bai 09  Shu-di-huang 12  Shan-zhu-yu 12  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  ";
                    break;
                case "DF2":
                    BZ = "Flaring heart-fire";
                    ZF = "Clearing away the heart-fire to stop bleeding";
                    CF = "CV4  PC8  KI2  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaoji Yinzi";
                    CM2 = "Sheng-di 12  Xiao-ji 09  Hua-shi 09  Tong-cao 06  Pu-huang 09  Dan-zhu-ye 09  Ou-jie 09  Dang-gui 12  Zhi-zi 09  Gan-cao 06  ";
                    break;
            }
            break;
        case "n505": //遗精Emission
            if (X[0] == 1 && X[1] == 1) diff = "DF1";
            if (X[0] == 1 && X[2] == 1) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Nocturnal emission";
                    ZF = "Clearing away the heart-fire, nourishing yin and controlling nocturnal emission";
                    CF = "BL15  BL23  CV4  LR4  ";
                    if (X[3] == 1) J1 = "HT7  ST45  ";
                    if (X[4] == 1) J2 = "GV20  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Huanglian Qingxin Yin";
                    CM2 = "Huang-lian 09  Sheng-di-huang 12  Dang-gui 12  Gan-cao 06  Suan-zao-ren 09  Fu-shen 09  Yuan-zhi 09  Ren-shen 12  Lian-zi-xi 12  ";
                    break;
                case "DF2":
                    BZ = "Spermatorrhoea";
                    ZF = "Replenishing & restoring the kidney-qi, controlling nocturnal emission";
                    CF = "CV6  SP6  BL52  BL23  ";
                    if (X[5] == 1) J1 = "HT6  ST36  ";
                    if (X[6] == 1) J2 = "BL13  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Jinsuo Gujing Wan & Shuilu Erxian Dan";
                    CM2 = "Sha-yuan-ji-li 15  Qian-shi 15  Lian-zi-xu 15  Long-gu 09  Mu-li 09  Lian-zi-rou 15  Jin-ying-zi 09  ";
                    break;
            }
            break;
        case "n506": //消渴Diabetes
            Y[1] = 6 * X[0] + 3 * X[5] + X[12] + X[13];
            Y[2] = 6 * X[1] + 2 * X[3] + X[10] + X[12] + X[14];
            Y[3] = 4 * X[2] + X[4] + 2 * X[6] + 3 * X[7] + 2 * X[8] + X[9] + X[15];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Diabetes involving the upper-jiao";
                    ZF = "Clearing away the lung-heat & moisturizing, promoting the production of body fluid and nourishing the lung";
                    CF = "HT8  BL15  LU9  BL13  Weiwanxiashu  ";
                    if (X[5] == 1) J1 = "CV23  CV24  ";
                    ZJF = "Reduction and reinforcement in acupuncture";
                    CM1 = "Xiaoke Fang";
                    CM2 = "Huang-lian 09  Tian-hua-fen 30  Sheng-di-zhi 12  Ou-zhi 09  Ren-ru-zhi 09  Jiang-zhi 06  Feng-mi 15  ";
                    break;
                case "DF2":
                    BZ = "Diabetes involving the middle-jiao";
                    ZF = "Clearing away the stomach-heat and nourishing yin to moisten dryness";
                    CF = "ST44  SP6  BL20  BL21  Weiwanxiashu  ";
                    if (X[1] == 1) J1 = "CV12  PC6  ";
                    ZJF = "Reduction and reinforcement in acupuncture";
                    CM1 = "Yunu Jian";
                    CM2 = "Shi-gao 30  Shu-di-huang 15  Mai-dong 09  Zhi-mu 09  Niu-xi 09  ";
                    break;
                case "DF3":
                    BZ = "Diabetes involving the lower-jiao";
                    ZF = "Nourishing yin and kidney";
                    CF = "KI3  LR3  BL18  BL23  Weiwanxiashu  ";
                    if (X[6] == 1) J1 = "GB37  GV23  ";
                    if (X[8] == 1) J2 = "GV4  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Liuwei Dihuang Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  Shan-zhu-yu 09  ";
                    break;
            }
            break;
        case "n601": //痹证Arthralgia
            Y[1] = 3 * X[0] - X[1] + 5 * X[2] - 2 * X[4] + 4 * X[17] + X[20] + X[23];
            Y[2] = 3 * X[0] - X[1] - 2 * X[2] + 5 * X[3] - 2 * X[4] + 4 * X[5] - 2 * X[6] - 2 * X[18] + X[20] + X[24];
            Y[3] = 3 * X[0] + 2 * X[1] - 2 * X[2] - 2 * X[4] - X[6] + 4 * X[15] + 4 * X[16] + X[21] + X[25];
            Y[4] = 3 * X[0] + 2 * X[1] - 2 * X[3] + 5 * X[4] - 2 * X[5] + 3 * X[6] + 2 * X[18] + X[19] + X[22] + X[26];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Migratory arthralgia";
                    ZF = "Dispelling wind and removing obstruction in the channels, dispelling cold and removing dampness";
                    CF = "BL12  BL17  BL18  ";
                    if (X[7] == 1) J1 = "TE14  LI15  SI10  ";
                    if (X[8] == 1) J2 = "LI11  LI4  TE10  LU5  ";
                    if (X[9] == 1) J3 = "TE4  TE5  LI5  SI4  ";
                    if (X[10] == 1) J4 = "GV26  GV12  GV3  ";
                    if (X[11] == 1) J5 = "GB30  GB29  GB39  ";
                    if (X[12] == 1) J6 = "BL54  BL36  SP9  ";
                    if (X[13] == 1) J7 = "ST35  ST34  GB34  GB33  ";
                    if (X[14] == 1) J8 = "BL62  KI6  BL60  GB40  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Fangfeng Tang";
                    CM2 = "Fang-feng 12  Dang-gui 12  Chi-fu-ling 12  Xing-ren 09  Huang-qin 09  Qin-jiu 09  Ge-gen 09  Ma-huang 06  Rou-gui 09  Sheng-jiang 03  Da-zao 06  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Arthralgia aggravated by cold";
                    ZF = "Dispelling cold & relieving pain, expelling wind & removing dampness";
                    CF = "BL23  CV4  ";
                    if (X[7] == 1) J1 = "TE14  LI15  SI10  ";
                    if (X[8] == 1) J2 = "LI11  LI4  TE10  LU5  ";
                    if (X[9] == 1) J3 = "TE4  TE5  LI5  SI4  ";
                    if (X[10] == 1) J4 = "GV26  GV12  GV3  ";
                    if (X[11] == 1) J5 = "GB30  GB29  GB39  ";
                    if (X[12] == 1) J6 = "BL54  BL36  SP9  ";
                    if (X[13] == 1) J7 = "ST35  ST34  GB34  GB33  ";
                    if (X[14] == 1) J8 = "BL62  KI6  BL60  GB40  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Wutou Tang";
                    CM2 = "Chuan-wu 06  Ma-huang 06  Bai-shao 15  Huang-qi 15  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "Damp arthralgia";
                    ZF = "Removing dampness and obstruction in the channels,expelling wind and clearing away cold";
                    CF = "BL20  ST36  SP9  ";
                    if (X[7] == 1) J1 = "TE14  LI15  SI10  ";
                    if (X[8] == 1) J2 = "LI11  LI4  TE10  LU5  ";
                    if (X[9] == 1) J3 = "TE4  TE5  LI5  SI4  ";
                    if (X[10] == 1) J4 = "GV26  GV12  GV3  ";
                    if (X[11] == 1) J5 = "GB30  GB29  GB39  ";
                    if (X[12] == 1) J6 = "BL54  BL36  ";
                    if (X[13] == 1) J7 = "ST35  ST34  GB34  GB33  ";
                    if (X[14] == 1) J8 = "BL62  KI6  BL60  GB40  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Yiyiren Tang";
                    CM2 = "Yi-yi-ren 12  Chuan-xiong 09  Dang-gui 12  Ma-huang 06  Gui-zhi 09  Qiang-huo 09  Du-huo 09  Fang-feng 09  Chuan-wu 06  Cang-zhu 09  Gan-cao 06  Sheng-jiang 03  ";
                    break;
                case "DF4":
                    BZ = "Arthralgia aggravated by heat";
                    ZF = "Clearing away heat & removing obstruction in the channels, expelling wind and removing dampness";
                    CF = "GV14  LI11  ";
                    if (X[7] == 1) J1 = "TE14  LI15  SI10  ";
                    if (X[8] == 1) J2 = "LI4  TE10  LU5  ";
                    if (X[9] == 1) J3 = "TE4  TE5  LI5  SI4  ";
                    if (X[10] == 1) J4 = "GV26  GV12  GV3  ";
                    if (X[11] == 1) J5 = "GB30  GB29  GB39  ";
                    if (X[12] == 1) J6 = "BL54  BL36  SP9  ";
                    if (X[13] == 1) J7 = "ST35  ST34  GB34  GB33  ";
                    if (X[14] == 1) J8 = "BL62  KI6  BL60  GB40  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Baihu Guizhi Tang";
                    CM2 = "Zhi-mu 12  Shi-gao 30  Gan-cao 06  Geng-mi 15  Gui-zhi 09  ";
                    break;
            }
            break;
        case "n602": //痿证Paralysis
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7] + X[8] + X[9];
            if (Y[1] > 1) diff = "DF1";
            if (X[4] == 1 && X[9] == 1 && X[5] + X[8] < 2) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of the tendon";
                    ZF = "Nourishing the tendon";
                    CF = "LI15  LI11  LI4  LI5  ST31  ST34  ST36  ST41  ";
                    if (X[3] == 1) J1 = "SP9  BL20  ";
                    if (X[4] == 1 && X[9] == 1) J2 = "BL18  BL23  GB39  GB34  ";
                    if (X[5] == 1) J3 = "GV14  ";
                    if (X[6] == 1) J4 = "KI3  HT6  ";
                    if (X[7] == 1 && X[8] == 1) J5 = "LU5  BL13  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Qingzao Jiufei Tang";
                    CM2 = "Sang-ye 09  Shi-gao 15  Xing-ren 09  Gan-cao 06  Mai-dong 09  Ren-shen 12  E-jiao 09  Huo-ma-ren 09  Pi-pa-ye 12  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the tendon";
                    ZF = "Nourishing the tendon";
                    CF = "LI15  LI11  LI4  LI5  ST31  ST34  ST36  ST41  ";
                    if (X[3] == 1) J1 = "SP9  BL20  ";
                    if (X[4] == 1 && X[9] == 1) J2 = "BL18  BL23  GB39  GB34  ";
                    if (X[5] == 1) J3 = "GV14  ";
                    if (X[6] == 1) J4 = "KI3  HT6  ";
                    if (X[7] == 1 && X[8] == 1) J5 = "LU5  BL13  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Shen Ling Baizhu San";
                    CM2 = "Ren-shen 12  Fu-ling 15  Bai-zhu 09  Jie-geng 09  Shan-yao 15  Gan-cao 06  Bai-bian-dou 09  Lian-zi-rou 12  Sha-ren 06  Yi-yi-ren 09  ";
                    break;
            }
            break;
        case "n603": //腰痛Lumbago
            Y[1] = X[0] + X[1] + X[2];
            if (Y[1] > 0) diff = "DF1";
            if (Y[1] > 0 && X[1] == 0 && X[2] == 0) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Blockage of lumbar tendon";
                    ZF = "Dredging the tendon";
                    CF = "BL23  BL40  GB34  Ashixue  GV3  BL52  SP6  KI3  GV4  ";
                    if (X[1] == 1) J1 = "GV26  ";
                    ZJF = "Acupuncture and moxibustion";
                    if (X[1] == 1) ZJF = "Reduction in acupuncture";
                    if (X[2] == 1) ZJF = "Reduction in acupuncture and pricking blood in Weizhong[BL40]";
                    CM1 = "Shentong Zhuyu Tang";
                    CM2 = "Qin-jiu 09  Chuan-xiong 09  Tao-ren 09  Hong-hua 09  Gan-cao 06  Qiang-huo 09  Mo-yao 09  Xiang-fu 09  Wu-ling-zhi 09  Niu-xi 09  Di-long 09  Dang-gui 12  ";
                    break;
                case "DF2":
                    BZ = "Blockage of lumbar tendon";
                    ZF = "Dredging the tendon";
                    CF = "BL23  BL40  GB34  Ashixue  GV3  BL52  SP6  KI3  GV4  ";
                    if (X[1] == 1) J1 = "GV26  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Liuwei Dihuang Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  Shan-zhu-yu 09  Du-zhong 09  Niu-xi 09  ";
                    break;
            }
            break;
        case "n604": //落枕Stiff Neck
            Y[1] = X[0] + X[1] + X[2] + X[3];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Blockage of tendon";
                    ZF = "Dredging the tendon";
                    CF = "Wailaogong  Ashixue  SI3  GB39  ";
                    if (X[1] == 1) J1 = "SI13  LI15  ";
                    if (X[2] == 1) J2 = "BL11  SI14  ";
                    if (X[3] == 1) J3 = "LI4  TE5  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "External Treatment of Chinese Drugs or Massage";
                    break;
            }
            break;
        case "n605": //漏肩风Shoulder Pain
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Blockage of shoulder tendon";
                    ZF = "Expelling wind and clearing away cold, eliminating dampness and removing obstruction in the channels";
                    CF = "LI15  SI9  LI14  LI11  TE5  ";
                    if (X[2] == 1) J1 = "LU5  LU9  ";
                    if (X[3] == 1) J2 = "SI3  SI8  ";
                    if (X[4] == 1) J3 = "LI4  LU7  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    if (X[5] == 1) ZJF = "Reduction in acupuncture";
                    CM1 = "External Treatment of Chinese Drugs";
                    break;
            }
            break;
        case "n606": //面痛Facial Pain
            Y[1] = X[0] + X[1] + X[2] + X[3];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Blockage of channel";
                    ZF = "Dredging the channel and muscle";
                    CF = "Ashixue  ";
                    if (X[1] == 1) J1 = "BL2  GB14  ST8  GB8  SI3  ";
                    if (X[2] == 1) J2 = "ST2  SI18  GB3  LI20  LI4  ";
                    if (X[3] == 1) J3 = "CV24  ST6  ST7  TE17  ST44  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "External Treatment of Chinese Drugs";
                    break;
            }
            break;
        case "n607": //面瘫Facial Paralysis
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Pathogenic factor attack the channel";
                    ZF = "Dredging the channel";
                    CF = "ST4  ST6  LI4  GB14  ST2  ";
                    if (X[1] == 1) J1 = "BL2  ";
                    if (X[2] == 1) J2 = "LI20  ";
                    if (X[3] == 1) J3 = "TE17  ";
                    if (X[4] == 1) J4 = "GV26  ";
                    if (X[5] == 1) J5 = "CV24  ";
                    if (X[6] == 1) J6 = "CV23  ";
                    ZJF = "Reduction in acupuncture";
                    if (X[7] == 1) ZJF = "Reinforcement in acupuncture";
                    CM1 = "Qianzheng San";
                    CM2 = "Bai-fu-zi 03  Jiang-can 09  Quan-xie 09  ";
                    break;
            }
            break;
        case "n701": //不寐Insomnia
            Y[1] = 3 * X[0] + 3 * X[1] + 2 * X[3] + 2 * X[5] + 2 * X[7] + 2 * X[9] + X[10] + X[17] + X[21];
            Y[2] = 3 * X[0] + 2 * X[3] + 2 * X[5] + 3 * X[14] + 4 * X[15] + 2 * X[16] + X[18] + X[22];
            Y[3] = 3 * X[0] + 3 * X[8] + 4 * X[11] + 4 * X[12] + X[20] + X[23];
            Y[4] = 3 * X[0] + 4 * X[2] + 2 * X[4] + 3 * X[6] + 2 * X[13] + X[18] + X[20] + X[24];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi and blood in the heart and spleen";
                    ZF = "Invigorating qi and enriching the blood";
                    CF = "BL20  BL15  HT7  SP6  ";
                    if (X[1] == 1) J1 = "BL42  ";
                    if (X[10] == 1) J2 = "BL52  GV20  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Guipi Tang";
                    CM2 = "Dang-shen 15  Huang-qi 12  Bai-zhu 09  Fu-sheng 12  Suan-zao-ren 09  Long-yan-rou 12  Mu-xiang 09  Gan-cao 06  Dang-gui 12  Yuan-zhi 09  Shen-jiang 03  Da-zao 03  ";
                    break;
                case "DF2":
                    BZ = "Hyperactivity of fire due to yin deficiency";
                    ZF = "Nourishing yin to reduce pathogenic fire";
                    CF = "PC7  KI3  HT7  LR3  ";
                    if (X[3] == 1) J1 = "GB20  ";
                    if (X[5] == 1) J2 = "SI19  ";
                    if (X[16] == 1) J3 = "BL52  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Huanglian Ejiao Tang";
                    CM2 = "Huang-lian 15  E-jiao 12  Huang-qin 09  Bai-shao 09  Ji-zi-huang 15  ";
                    break;
                case "DF3":
                    BZ = "Disorder of the stomach";
                    ZF = "Resolving phlegm and strengthening the stomach";
                    CF = "CV12  ST40  ST45  SP1  ";
                    if (X[8] == 1) J1 = "PC6  ";
                    if (X[3] == 1) J2 = "Yintang  LI4  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Banxia Shumi Tang";
                    CM2 = "Ban-xia 09  Shu-mi 12  Shen-qu 09  Shan-zha 09  Lai-fu-zi 09  ";
                    break;
                case "DF4":
                    BZ = "Flaming-up of the liver-fire";
                    ZF = "Calming the liver to reduce pathogenic fire";
                    CF = "LR2  GB44  GB20  HT7  ";
                    if (X[5] == 1) J1 = "TE17  TE3  ";
                    if (X[6] == 1) J2 = "Taiyang  LI5  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Longdan Xiegan Tang";
                    CM2 = "Long-dan-cao 09  Ze-xie 09  Mu-tong 09  Che-qian-zi 09  Dang-gui 12  Chai-hu 09  Sheng-di 12  Huang-qin 09  Zhi-zi 09  ";
                    break;
            }
            break;
        case "n702": //癫狂Mania and Depression
            Y[1] = 2 * X[0] + 6 * X[2] + 6 * X[3] - 2 * X[4] - 2 * X[5] + X[11] + X[13] + X[14];
            Y[2] = 2 * X[1] - 2 * X[2] - 2 * X[3] + 6 * X[4] + 6 * X[5] + X[12] + X[14] + X[15];
            if (Y[1] > 6 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Depression";
                    ZF = "Promoting the flow of qi and resolving phlegm, clearing away the heart-fire to calm the mind";
                    CF = "HT7  PC7  Yintang  CV17  ST40  SP6  ";
                    if (X[8] == 1) J1 = "BL1  ";
                    if (X[9] == 1) J2 = "SI19  ";
                    if (X[10] == 1) J3 = "LU9  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Shunqi DaoTan Tang";
                    CM2 = "Ban-xia 09  Chen-pi 09  Fu-ling 12  Gan-cao 06  Sheng-jiang 03  Dan-nan-xing 09  Zhi-shi 09  Mu-xiang 09  Xiang-fu 09  Yuan-zhi 09  Yu-jin 09  Shi-chang-pu 09  ";
                    break;
                case "DF2":
                    BZ = "Mania";
                    ZF = "Calming liver-fire, clearing away the heart-fire and resolving phlegm";
                    CF = "PC8  GV26  CV13  KI4  ";
                    if (X[7] == 1) J1 = "GV14  GV20  ";
                    if (X[6] == 1) J2 = "LR3  TE6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Shengtieluo Yin";
                    CM2 = "Tian-dong 09  Mai-dong 09  Bei-mu 09  Dan-nan-xing 09  Ju-hong 09  Yuan-zhi 09  Shi-chang-pu 09  Lian-qiao 09  Fu-ling 12  Fu-shen 12  Xuan-shen 09  Gou-teng 09  Dan-shen 09  Zhu-sha 09  Sheng-tie-luo 30  ";
                    break;
            }
            break;
        case "n703": //痫证Epilepsy
            Y[1] = 4 * X[0] + 4 * X[1] + 3 * X[2] + X[10] + X[11];
            Y[2] = 4 * X[0] + 4 * X[1] + 3 * X[2] + 2 * X[6] + 2 * X[8] + X[9] + X[12];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Excess syndrome";
                    ZF = "Calming the endopathic wind and resolving the phlegm,removing fire and relieving mental stress";
                    CF = "GV12  GB13  CV15  ST40  LR3  ";
                    if (X[3] == 1) J1 = "GV26  ST6  HT7  ";
                    if (X[4] == 1) J2 = "BL62  ";
                    if (X[5] == 1) J3 = "KI6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Dingxian Wan";
                    CM2 = "Tian-ma 12  Chuan-bei-mu 09  Dan-nan-xing 12  Ban-xia 09  Zhu-li 09  Shi-chang-pu 09  Quan-xie 09  Jiang-can 09  Hu-po 09  Zhu-sha 09  Fu-shen 09  Yuan-zhi 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency syndrome";
                    ZF = "Tonifying the heart and the spleen, resolving phlegm,tranquilizing and allaying excitement";
                    CF = "HT5  ST40  BL23  GB34  SP6  GV8  ";
                    if (X[7] == 1) J1 = "KI1  CV6  ";
                    if (X[3] == 0) J2 = "CV12  ST36  GV20  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Dabuyuan Jian and Liu Junzi Tang";
                    CM2 = "Ren-shen 12  Shan-yao 15  Shu-di-huang 12  Du-zhong 09  Gou-ji-zi 09  Dang-gui 12  Shan-zhu-yu 09  Zhi-gan-cao 06  Fu-ling 12  Bai-zhu 09  Chen-pi 09  Ban-xia 09  ";
                    break;
            }
            break;
        case "n704": //郁证Melancholia
            Y[1] = 2 * X[4] + 4 * X[5] + 4 * X[6] + 3 * X[7] + X[18];
            Y[2] = 4 * X[0] + 4 * X[1] + 3 * X[2] + X[3] - 2 * X[5] - 2 * X[6] - 2 * X[7] + X[9] + X[11] + X[12] + X[13] + X[14] + X[19];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of qi and phlegm[globus hystericus]";
                    ZF = "Relieving the depressed liver and removing heat-phlegm";
                    CF = "LR3  CV17  ST40  LU10  HT7  ";
                    if (X[4] == 1) J1 = "LI17  LI1  ";
                    if (X[15] == 1) J2 = "ST45  ";
                    ZJF = "Reinforcement & reduction in acupuncture";
                    CM1 = "Banxia Houpo Tang";
                    CM2 = "Ban-xia 09  Hou-po 09  Zi-su 09  Fu-ling 12  Sheng-jiang 03  ";
                    break;
                case "DF2":
                    BZ = "Grief impair vitality[hysteria]";
                    ZF = "Nourishing yin and supplementing qi, nourishing the heart to calm the mind";
                    CF = "BL17  BL23  BL15  PC6  SP6  ";
                    if (X[3] == 1) J1 = "GV26  PC6  ";
                    if (X[11] == 1) J2 = "LR3  GB34  ";
                    if (X[14] == 1) J3 = "GV20  PC7  ";
                    if (X[8] == 1) J4 = "LI4  ST6  ";
                    if (X[10] == 1) J5 = "CV12  ST36  ";
                    if (X[12] == 1) J6 = "CV11  ";
                    if (X[13] == 1) J7 = "GB2  TE3  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Gan Mai Dazao Tang";
                    CM2 = "Gan-cao 30  Huai-xiao-mai 60  Da-zao 09  Bai-zi-ren 09  Suan-zao-ren 09  Fu-shen 09  He-huan-pi 09  ";
                    break;
            }
            break;
        case "w101": //疔疮Furuncle
            Y[1] = X[0] + X[1] + X[3] + X[4];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Domination of toxic heat";
                    ZF = "Clearing away heat and toxic material";
                    CF = "GV12  GV10  LI4  BL40  ";
                    if (X[1] == 1) J1 = "LI1  LI11  ";
                    if (X[2] == 1) J2 = "LI20  ";
                    if (X[2] == 1 && X[1] == 0) J2 = "LI11  LI20  ";
                    if (X[3] == 1 || X[4] == 1) J3 = "GB34  GB2  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Wuwei Xiaodu Yin";
                    CM2 = "Jin-yin-hua 15  Ye-ju-hua 12  Zi-di-ding 09  Tian-gui-zi 09  Pu-gong-ying 09  ";
                    break;
            }
            break;
        case "w102": //瘰疠Scrofula
            Y[1] = 2 * X[0] + 3 * X[1] + 5 * X[10] + 4 * X[11] + X[14] + X[17];
            Y[2] = 2 * X[0] + X[2] + X[4] + 4 * X[6] + 4 * X[7] + 2 * X[9] + X[16] + X[18];
            Y[3] = 2 * X[0] + 2 * X[3] + 5 * X[5] + 2 * X[8] + 2 * X[13] + X[15] + X[19];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "LR13  TE10  GB41  ";
                    if (X[10] == 1) J1 = "GB34  PC6  ";
                    if (X[11] == 1 && X[12] == 1) J2 = "CV12  ST36  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaoyao San";
                    CM2 = "Chai-hu 09  Bai-shao 12  Dang-gui 12  Bai-zhu 09  Fu-ling 12  Zhi-gan-cao 06  Sheng-jiang 03  Bo-he 06  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the kidney-yin";
                    ZF = "Nourishing yin to reduce pathogenic fire";
                    CF = "TE10  HT3  Jingbailao  BL23  BL20  ";
                    if (X[7] == 1) J1 = "HT6  BL43  ";
                    if (X[8] == 1) J2 = "LU7  BL13  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Zhi Bai Dihuang Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  Shan-zhu-yu 09  Zhi-mu 09  Huang-bai 09  ";
                    break;
                case "DF3":
                    BZ = "Accompanying symptoms of wind-heat";
                    ZF = "Dispelling wind and heat from the body";
                    CF = "LI11  TE6  Zhoujian  LR13  ";
                    if (X[5] == 1) J1 = "GV13  ";
                    if (X[3] == 1) J2 = "Yintang  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yin Qiao San";
                    CM2 = "Jin-yin-hua 15  Lian-qiao 09  Dan-dou-chi 09  Niu-bang-zi 09  Jing-jie 09  Jie-geng 09  Gan-cao 06  Dan-zhu-ye 09  Lu-gen 30  ";
                    break;
            }
            break;
        case "w103": //蛇丹Herpes Zoster
            Y[1] = 3 * X[0] - 2 * X[2] + 3 * X[4] + 2 * X[5] + 2 * X[7] + 2 * X[10] + X[11] + X[13];
            Y[2] = 3 * X[1] + 4 * X[2] + 2 * X[6] + 2 * X[8] + X[9] + X[11] + X[12] + X[14];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-fire";
                    ZF = "Clearing away wind-fire";
                    CF = "Local points selection around affected part  LR14  LR8  GB44  TE3  ";
                    if (X[5] == 1) J1 = "PC4  HT7  ";
                    if (X[7] == 1) J2 = "GB34  TE6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Longdan Xiegan Tang";
                    CM2 = "Long-dan-cao 09  Ze-xie 09  Mu-tong 09  Che-qian-zi 09  Dang-gui 12  Chai-hu 09  Sheng-di 12  Huang-qin 09  Zhi-zi 09  Gan-cao 06  Zi-cao 09  Ban-lan-gen 30  Niu-bang-zi 09  Ju-hua 09  ";
                    break;
                case "DF2":
                    BZ = "Damp-heat";
                    ZF = "Clearing away heat and promoting diuresis";
                    CF = "Local points selection around affected part  ST44  TE5  GB43  SP4  ";
                    if (X[3] == 1) J1 = "LI4  GV14  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Longdan Xiegan Tang";
                    CM2 = "Long-dan-cao 09  Ze-xie 09  Mu-tong 09  Che-qian-zi 09  Dang-gui 12  Chai-hu 09  Sheng-di 12  Huang-qin 09  Zhi-zi 09  Gan-cao 06  Zi-cao 09  Ban-lan-gen 30  Cang-zhu 09  Huang-bai 09  ";
                    break;
            }
            break;
        case "w104": //丹毒Erysipelas
            Y[1] = 4 * X[0] - X[1] + 3 * X[5] + 3 * X[6] + 3 * X[7] + X[12] + X[14] + X[15];
            Y[2] = -X[0] + 4 * X[1] + 3 * X[8] + 3 * X[10] + 2 * X[11] + X[13] + X[14] + X[16];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-heat";
                    ZF = "Dispelling wind and heat from the body";
                    CF = "LI11  ST41  BL40  BL12  Ashixue  ";
                    if (X[3] == 1) J1 = "GV13  ";
                    if (X[7] == 1) J2 = "PC6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Puji Xiaodu Yin";
                    CM2 = "Huang-qin 12  Huang-lian 09  Gan-cao 06  Xuan-shen 09  Lian-qiao 09  Ban-lan-gen 30  Ma-bo 09  Niu-bang-zi 09  Bo-he 06  Jiang-can 09  Sheng-ma 09  Chai-hu 09  Jie-geng 09  Chen-pi 09  ";
                    break;
                case "DF2":
                    BZ = "Damp-heat";
                    ZF = "Clearing away heat and eliminating dampness";
                    CF = "LI4  ST36  SP10  SP9  Ashixue  ";
                    if (X[3] == 1 || X[4] == 1) J1 = "Shixuan  ";
                    if (X[9] == 1) J2 = "PC6  CV12  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Longdan Xiegan Tang";
                    CM2 = "Long-dan-cao 09  Ze-xie 09  Mu-tong 09  Che-qian-zi 09  Dang-gui 12  Chai-hu 09  Sheng-di 12  Huang-qin 09  Zhi-zi 09  Gan-cao 06  ";
                    break;
            }
            break;
        case "w105": //风疹Rubella
            Y[1] = 3 * X[0] + 2 * X[1] + 3 * X[2] + 3 * X[3] - 2 * X[7] + 2 * X[8] + X[10] + X[12];
            Y[2] = 3 * X[0] + 2 * X[5] + X[6] + 5 * X[7] + 2 * X[9] + 2 * X[11] + X[13];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Affection by exopathogen";
                    ZF = "Dispelling wind and regulating the nutrient system";
                    CF = "LI15  LI5  GV14  LU10  SP6  ";
                    if (X[2] == 1) J1 = "LU11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaofeng San";
                    CM2 = "Dang-gui 12  Sheng-di-huang 12  Fang-feng 09  Chan-tui 09  Zhi-mu 09  Ku-shen 09  Hu-ma 09  Jing-jie 09  Cang-zhu 09  Niu-bang-zi 09  Shi-gao 30  Gan-cao 06  Mu-tong 09  ";
                    break;
                case "DF2":
                    BZ = "Excessiveness of the stomach-heat and intestine-heat";
                    ZF = "Clearing away heat and regulating the nutrient system";
                    CF = "LI11  ST36  SP10  LU7  ";
                    if (X[7] == 1) J1 = "CV11  ";
                    if (X[9] == 1) J2 = "ST25  ";
                    if (X[4] == 1) J3 = "LU5  CV17  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Fangfeng Tongsheng San";
                    CM2 = "Fang-feng 09  Jing-jie 09  Lian-qiao 09  Ma-huang 06  Bo-he 06  Chuan-xiong 09  Dang-gui 12  Bai-shao 12  Bai-zhu 09  Zhi-zi 09  Dai-huang 06  Mang-xiao 09  Shi-gao 30  Huang-qin 12  Jie-geng 09  Gan-cao 06  Hua-shi 15  ";
                    break;
            }
            break;
        case "w106": //湿疹Eczema
            Y[1] = 3 * X[0] - X[1] + 5 * X[2] - 2 * X[3] + 2 * X[4] + 2 * X[7] + X[9] + X[11] + X[12];
            Y[2] = -X[0] + 3 * X[1] - 2 * X[2] + 5 * X[3] + 3 * X[5] + X[8] + X[10] + X[13];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Damp-heat";
                    ZF = "Eliminating damp-heat";
                    CF = "GV13  LI11  BL13  HT7  SP9  ";
                    if (X[2] == 1) J1 = "CV9  ";
                    if (X[6] == 1) J2 = "ST36  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chushi Weiling Tang";
                    CM2 = "Cang-zhu 09  Hou-po 09  Chen-pi 09  Zhu-ling 09  Ze-xie 09  Fu-ling 12  Bai-zhu 09  Hua-shi 15  Fang-feng 09  Zhi-zi 09  Mu-tong 09  Rou-gui 09  Gan-cao 06  Deng-xin-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of blood";
                    ZF = "Enriching the blood and moistening dryness";
                    CF = "ST36  SP6  SP2  PC4  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Siwu Tang and Bixie Shenshi Tang";
                    CM2 = "Shu-di-huang 15  Dang-gui 12  Bai-shao 12  Chuan-xiong 09  Bi-xie 09  Yi-yi-ren 09  Huang-bai 09  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  Hua-shi 09  Tong-cao 09  ";
                    break;
            }
            break;
        case "w107": //扁平疣Flat Wart
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Collection of heat in skin and muscle";
                    ZF = "Dispelling wind and clearing away heat";
                    CF = "TE3  GB40  LI11  LU10  Ashixue  ";
                    if (X[1] == 1 && X[2] == 1) J1 = "GB20  LI1  ";
                    if (X[3] == 1 || X[4] == 1) J2 = "LR2  GB43  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "External Treatment of Chinese Drugs";
                    CM2 = "Ya-dan-zi 30  ";
                    break;
            }
            break;
        case "w108": //牛皮癣Psoriasis
            Y[1] = 4 * X[0] - X[1] + 4 * X[2] - 2 * X[3] + X[10];
            Y[2] = -X[0] + 4 * X[1] - 2 * X[2] + 4 * X[3] + X[11];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-damp become heat";
                    ZF = "Dispelling wind, clearing away heat and promoting diuresis";
                    CF = "SP9  SP3  LU9  GB20  Ashixue  ";
                    if (X[5] == 1) J1 = "ST8  GV20  ";
                    if (X[6] == 1) J2 = "LU7  BL40  ";
                    if (X[7] == 1) J3 = "PC4  PC8  ";
                    if (X[8] == 1) J4 = "BL37  BL60  ";
                    if (X[9] == 1) J5 = "SP6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaofeng San";
                    CM2 = "Dang-gui 12  Sheng-di-huang 12  Fang-feng 09  Chan-tui 09  Zhi-mu 09  Ku-shen 09  Hu-ma 09  Jing-jie 09  Cang-zhu 09  Niu-bang-zi 09  Shi-gao 30  Gan-cao 06  Mu-tong 09  ";
                    break;
                case "DF2":
                    BZ = "Wind-dry due to deficiency of blood";
                    ZF = "Enriching the blood and moistening dryness";
                    CF = "LI11  SP10  SP6  BL17  Ashixue  ";
                    if (X[4] == 1) J1 = "KI6  HT7  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Siwu Tang";
                    CM2 = "Shu-di-huang 15  Dang-gui 12  Bai-shao 12  Chuan-xiong 09  ";
                    break;
            }
            break;
        case "w109": //脱骨疽Gangrene of Finger or Toe
            Y[1] = 3 * X[0] + 3 * X[2] + 3 * X[3] + 3 * X[5] + X[6] - 2 * X[7] + X[15];
            Y[2] = 3 * X[1] + X[4] + 5 * X[7] + 2 * X[8] + X[9] + 2 * X[10] + X[11] + X[12] + X[13] + X[16];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnancy of qi and blood stasis";
                    ZF = "Promoting blood circulation and removing obstruction in the channels";
                    CF = "BL17  BL26  CV6  ST36  SP6  SP5  GB40  KI6  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Tao Hong Siwu Tang";
                    CM2 = "Shu-di-huang 15  Dang-gui 12  Bai-shao 12  Chuan-xiong 09  Tao-ren 09  Hong-hua 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of both qi and yin";
                    ZF = "Supplementing qi and nourishing yin";
                    CF = "CV4  KI3  ST36  LU9  SP10  HT8  ";
                    if (X[12] == 1) J1 = "KI6  ";
                    if (X[14] == 1) J2 = "GV12  ";
                    if (X[10] == 1) J3 = "CV23  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Shiquan Dabu Tang";
                    CM2 = "Dang-shen 15  Bai-zhu 09  Fu-ling 12  Zhi-gan-cao 06  Dang-gui 12  Chuan-xiong 09  Shu-di-huang 15  Bai-shao 12  Huang-qi 15  Rou-gui 09  ";
                    break;
            }
            break;
        case "w110": //痔疮Hemorrhoid
            Y[1] = 2 * X[1] + 3 * X[2] + 2 * X[3] - X[6] + 3 * X[8] + 2 * X[9] + X[12] + X[14];
            Y[2] = 5 * X[0] + 2 * X[6] + 2 * X[7] + 2 * X[10] + X[11] + X[13];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Accumulation of damp-heat and blood stasis";
                    ZF = "Clearing away damp-heat and removing blood stasis";
                    CF = "BL32  GV1  BL35  BL57  Erbar  ";
                    if (X[1] == 1) J1 = "BL54  BL2  ";
                    if (X[4] == 1) J2 = "BL25  ST37  ";
                    if (X[5] == 1) J3 = "SP10  BL24  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Bixie Huadu Tang and Huoxue Sanyu Tang";
                    CM2 = "Bi-xie 09  Dang-gui-wei 09  Mu-dan-pi 09  Niu-xi 09  Fang-ji 09  Mu-gua 09  Yi-yi-ren 09  Qin-jiu 09  Chi-shao 09  Tao-ren 09  Dai-huang 06  Chuan-xiong 09  Su-mu 09  Zhi-ke 09  Gua-lou-ren 09  Bing-lang 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of qi";
                    ZF = "Supplementing qi";
                    CF = "GV20  CV8  BL26  BL46  ";
                    if (X[1] == 1) J1 = "BL58  ";
                    if (X[1] == 1 && X[2] == 1) J2 = "PC8  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Buzhong Yiqi Tang";
                    CM2 = "Ren-shen 15  Huang-qi 12  Bai-zhu 09  Gan-cao 06  Dang-gui 12  Chen-pi 09  Sheng-ma 09  Chai-hu 09  ";
                    break;
            }
            break;
        case "w111": //斑秃Alopecia Areata
            Y[1] = X[0] + X[1] + X[2];
            if (Y[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-dry due to deficiency of blood";
                    ZF = "Nourishing the blood to expel wind and promoting blood circulation to remove blood stasis";
                    CF = "Ashixue  GV20  GB20  BL17  ST36  SP6  ";
                    if (X[1] == 1) J1 = "GV23  ";
                    if (X[2] == 1) J2 = "PC6  HT7  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Shenying Yangzhen Wan";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Bai-shao 12  Tian-ma 09  Qiang-huo 09  Shu-di-huang 12  Mu-gua 09  Tu-si-zi 09  ";
                    break;
            }
            break;
        case "w112": //扭伤Sprain
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7] + X[8];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnancy of qi and blood stasis due to injury";
                    ZF = "Dredging the channel and promoting flow of qi and blood";
                    if (X[1] == 1) CF = "GB20  BL10  BL11  SI3  ";
                    if (X[2] == 1) CF = "LI15  TE14  SI9  ";
                    if (X[3] == 1) CF = "LI11  SI8  TE10  ";
                    if (X[4] == 1) CF = "TE4  LI5  SI5  ";
                    if (X[5] == 1) CF = "BL23  GB33  BL40  ";
                    if (X[6] == 1) CF = "GB30  BL54  BL36  ";
                    if (X[7] == 1) CF = "Xiyan  ST34  GB33  ";
                    if (X[8] == 1) CF = "ST41  BL60  GB40  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chinese Patent Medicine or External Treatment of Chinese Drugs";
                    CM2 = "Yunnan Baiyao or Shexiang Zhentong Gao  ";
                    break;
            }
            break;
        case "f101": //月经先期Preceded Menstrual Cycle
            Y[1] = 2 * X[0] + 5 * X[1] - 2 * X[4] + 3 * X[5] - X[6] + 3 * X[7] + 3 * X[14] + 2 * X[15] + 2 * X[22] + X[24] + X[26] + X[28] + X[30];
            Y[2] = 2 * X[0] + 2 * X[2] - X[4] + 3 * X[5] - X[6] + 3 * X[7] + 4 * X[12] + 3 * X[13] + X[15] + X[24] + 2 * X[25] + X[26] + X[29] + X[30];
            Y[3] = 2 * X[0] + 5 * X[1] + 4 * X[4] - 2 * X[5] - 2 * X[6] - X[7] + 2 * X[8] + 2 * X[9] - X[14] + 2 * X[19] + X[20] + 2 * X[21] + X[23] + X[31];
            Y[4] = 2 * X[0] + 3 * X[3] + 4 * X[6] + 4 * X[9] + 2 * X[11] + X[16] + 2 * X[17] + 2 * X[18] + X[27] + X[30];
            if (Y[1] > 9 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 9 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 9 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 9 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Heat of excess type";
                    ZF = "Removing pathogenic heat from blood and regulating menstruation";
                    CF = "CV4  SP10  LI11  LR3  ";
                    if (X[11] == 1) J1 = "PC5  ";
                    if (X[1] == 1) J2 = "SP1  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Qingjing San";
                    CM2 = "Mu-dan-pi 09  Di-gu-pi 09  Bai-shao 12  Sheng-di-huang 12  Qing-hao 09  Huang-bai 09  Fu-ling 12  ";
                    break;
                case "DF2":
                    BZ = "Heat of deficiency type";
                    ZF = "Nourishing yin to remove heat and regulating menstruation";
                    CF = "CV4  SP10  SP6  KI2  ";
                    if (X[12] == 1) J1 = "HT6  SI3  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Liang Di Tang";
                    CM2 = "Sheng-di-huang 12  Di-gu-pi 09  Xuan-shen 09  Mai-dong 09  E-jiao 09  Bai-shao 12  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of qi";
                    ZF = "Hemostasis by invigorating qi and regulating menstruation";
                    CF = "CV4  SP10  ST36  BL20  ";
                    if (X[1] == 1) J1 = "SP1  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Buzhong Yiqi Tang";
                    CM2 = "Ren-shen 15  Huang-qi 12  Bai-zhu 09  Gan-cao 06  Dang-gui 12  Chen-pi 09  Sheng-ma 09  Chai-hu 09  ";
                    break;
                case "DF4":
                    BZ = "Stagnation of the liver-qi become heat";
                    ZF = "Clearing away the liver-heat and regulating menstruation";
                    CF = "CV4  SP10  LR2  ST4  ";
                    if (X[17] == 1) J1 = "PC6  LR14  ";
                    if (X[18] == 1) J2 = "CV6  KI13  ";
                    if (X[9] == 1) J3 = "CV3  KI14  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Dan Zhi Xiaoyao San";
                    CM2 = "Mu-dan-pi 09  Zhi-zi 09  Dang-gui 12  Bai-shao 12  Chai-hu 09  Bai-zhu 09  Fu-ling 12  Gan-cao 06  ";
                    break;
            }
            break;
        case "f102": //月经后期Delay Menstrual Cycle
            Y[1] = 2 * X[0] - 2 * X[1] + 5 * X[2] + 2 * X[3] + 3 * X[5] + 3 * X[6] + 3 * X[9] + 2 * X[14] + X[21];
            Y[2] = 2 * X[0] + 5 * X[1] - 2 * X[2] - X[3] + 3 * X[4] - 2 * X[5] + X[9] + 2 * X[10] + 2 * X[15] + 2 * X[16] + X[17] + X[20] + X[22] + X[23];
            Y[3] = 2 * X[0] + 5 * X[1] - 2 * X[2] - X[3] + 3 * X[4] - 2 * X[5] + 2 * X[10] + 2 * X[12] + 3 * X[13] + 2 * X[18] + X[20] + X[23];
            Y[4] = 2 * X[0] - 2 * X[1] + 5 * X[2] + 2 * X[3] + 3 * X[5] + 3 * X[7] + 3 * X[11] + X[19] + X[24];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 8 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Cold of excess type";
                    ZF = "Warming the channels and dispelling cold, regulating menstruation";
                    CF = "CV6  KI13  SP6  ST29  ST25  ";
                    if (X[6] == 1) J1 = "CV4  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Wenjing Tang";
                    CM2 = "Ren-shen 15  Dang-gui 12  Chuan-xiong 09  Bai-shao 12  Gui-xin 09  E-zhu 09  Mu-dan-pi 09  Gan-cao 06  Niu-xi 09  ";
                    break;
                case "DF2":
                    BZ = "Cold of deficiency type";
                    ZF = "Restoring yang and dispelling cold, regulating menstruation";
                    CF = "CV6  KI13  SP6  GV4  KI3  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Ai Fu Nuangong Wan";
                    CM2 = "Ai-ye 09  Xiang-fu 09  Dang-gui 12  Xu-duan 09  Wu-zhu-yu 09  Chuan-xiong 09  Bai-shao 12  Huang-qi 12  Sheng-di-huang 12  Rou-gui 09  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of blood";
                    ZF = "Tonifying the blood and regulating menstruation";
                    CF = "CV6  SP6  ST36  BL20  BL17  ";
                    if (X[13] == 1) J1 = "HT7  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Dabuyuan Jian";
                    CM2 = "Ren-shen 15  Shan-yao 15  Shu-di-huang 12  Du-zhong 09  Dang-gui 12  Shan-zhu-yu 12  Gou-qi-zi 09  Zhi-gan-cao 06  ";
                    break;
                case "DF4":
                    BZ = "Stagnation of qi";
                    ZF = "Regulating the flow of qi and regulating menstruation";
                    CF = "CV6  KI13  SP6  LR5  ";
                    if (X[5] == 1 || X[7] == 1) J1 = "CV3  KI14  ";
                    ZJF = "Uniform reinforcing-reducing method";
                    CM1 = "Wuyao Tang";
                    CM2 = "Wu-yao 09  Xiang-fu 09  Mu-xiang 09  Dang-gui 12  Gan-cao 06  ";
                    break;
            }
            break;
        case "f103": //月经先后不定期Irregular Menstrual Cycle
            Y[1] = 2 * X[0] - X[1] + 4 * X[2] + 3 * X[3] + 2 * X[5] + 2 * X[6] + 2 * X[7] + X[8] - X[9] + X[12];
            Y[2] = 2 * X[0] + 4 * X[1] - X[2] - X[3] + 3 * X[4] - X[6] + 4 * X[9] + 2 * X[10] + 3 * X[11] + X[13];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver and regulating menstruation";
                    CF = "CV4  SP6  LR3  BL18  LR14  ";
                    if (X[5] == 1) J1 = "LR5  ";
                    if (X[6] == 1) J2 = "TE6  ";
                    ZJF = "Uniform reinforcing-reducing method";
                    CM1 = "Xiaoyao San";
                    CM2 = "Chai-hu 09  Dang-gui 12  Bai-shao 12  Bai-zhu 09  Fu-ling 12  Gan-cao 06  Bo-he 06  Sheng-jiang 03  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the kidney";
                    ZF = "Tonifying the kidney and regulating menstruation";
                    CF = "CV4  SP6  BL23  KI3  KI5  ";
                    if (X[9] == 1) J1 = "LR8  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Guyin Jian";
                    CM2 = "Ren-shen 15  Shu-di-huang 12  Shan-yao 15  Shan-zhu-yu 12  Tu-si-zi 12  Yuan-zhi 09  Wu-wei-zi 09  Zhi-gan-cao 06  ";
                    break;
            }
            break;
        case "f104": //痛经Dysmenorrhea
            Y[1] = 5 * X[0] - 2 * X[1] - 2 * X[2] + 2 * X[3] - X[4] + 5 * X[6] + 3 * X[7] - 2 * X[8] + 2 * X[9] + X[16] + X[19];
            Y[2] = -2 * X[0] + 4 * X[1] - 2 * X[2] + 3 * X[3] - X[4] + 3 * X[5] + 2 * X[7] - 2 * X[8] + 4 * X[9] + X[11] + 2 * X[12] + X[18] + X[20];
            Y[3] = -2 * X[0] - 2 * X[1] + 5 * X[2] + 2 * X[4] - 2 * X[7] + 3 * X[8] - 2 * X[9] + 2 * X[10] + 3 * X[13] + 2 * X[14] + 2 * X[15] + X[17] + X[21];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Menorrhalgia due to cold and dampness";
                    ZF = "Expelling cold and dampness, warming the channels and stopping pain";
                    CF = "CV3  ST28  SP8  ";
                    if (X[3] == 1) J1 = "BL32  ST29  ";
                    if (X[13] == 1) J2 = "GV4  BL23  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Shaofu Zhuyu Tang";
                    CM2 = "Xiao-hui-xiang 09  Gan-jiang 09  Yan-hu-suo 09  Mo-yao 09  Dang-gui 12  Chuan-xiong 09  Rou-gui 09  Chi-shao 09  Pu-huang 09  Wu-ling-zhi 09  Cang-zhu 09  Fu-ling 12  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver and regulating menstruation";
                    CF = "CV6  LR3  SP6  ";
                    if (X[5] == 1) J1 = "ST25  KI13  SP8  ";
                    if (X[12] == 1) J2 = "GB34  GB37  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Gexia Zhuyu Tang";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Chi-shao 09  Tao-ren 09  Hong-hua 09  Zhi-ke 09  Yan-hu-suo 09  Wu-ling-zhi 09  Mu-dan-pi 09  Wu-yao 09  Xiang-fu 09  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of liver and kidney";
                    ZF = "Tonifying the liver and kidney";
                    CF = "BL18  BL23  CV4  ST36  KI6  ";
                    if (X[14] == 1 || X[15] == 1) J1 = "GB39  KI3  ";
                    if (X[5] == 1) J2 = "KI12  KI13  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Tiaogan Tang";
                    CM2 = "Dang-gui 12  Bai-shao 12  Shan-zhu-yu 12  Ba-ji-tian 09  E-jiao 09  Shan-yao 15  Gan-cao 06  ";
                    break;
            }
            break;
        case "f105": //绝经前后诸症Menopausal Period Symptoms
            Y[1] = 6 * X[0] - 2 * X[2] + 5 * X[3] + 3 * X[5] + 2 * X[13] - X[16] + 2 * X[17] + X[20] + X[22] + X[24];
            Y[2] = 5 * X[1] + 4 * X[4] + 4 * X[6] + X[10] - X[16] + 2 * X[17] - X[18] + 2 * X[19] + X[22] + X[24];
            Y[3] = 4 * X[2] - 2 * X[4] + 4 * X[11] + 3 * X[12] + 2 * X[14] + 4 * X[15] + 2 * X[16] + X[22] + X[23];
            Y[4] = -X[6] + 4 * X[7] + 2 * X[8] + 2 * X[9] + 3 * X[11] + 5 * X[12] + 2 * X[15] + 2 * X[18] + X[21];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 8 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Hyperactivity of the liver-yang";
                    ZF = "Calming the liver and nourishing the liver and kidney";
                    CF = "LR3  KI3  GV20  GB20  ";
                    if (X[3] == 1) J1 = "PC7  ";
                    if (X[5] == 1) J2 = "KI1  KI2  ";
                    if (X[13] == 1) J3 = "BL23  Yaoyan  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Modified of Zuogui Yin & Erzhi Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Gou-qi-zi 12  Shan-zhu-yu 12  Fu-ling 12  Zhi-gan-cao 06  Nu-zhen-zi 09  Han-lian-cao 09  Gui-ban 12  Yu-jin 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the heart blood";
                    ZF = "Tonifying heart blood restoring normal coordination between the heart and the kidney";
                    CF = "BL15  BL20  BL23  SP6  ";
                    if (X[4] == 1) J1 = "HT7  Sishencong  ";
                    if (X[1] == 1) J2 = "HT5  ";
                    if (X[6] == 1) J3 = "PC8  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Buxin Dan";
                    CM2 = "Sheng-di-huang 12  Xuan-shen 09  Mai-dong 09  Tian-dong 09  Dang-shen 12  Dan-shen 09  Fu-shen 12  Suan-zao-ren 09  Yuan-zhi 09  Wu-wei-zi 09  Bai-zi-ren 09  Jie-geng 09  Dang-gui 12  ";
                    break;
                case "DF3":
                    BZ = "Weakness of the spleen and the stomach";
                    ZF = "Tonifying the spleen and the stomach";
                    CF = "BL20  BL21  CV12  LR13  ST36  ";
                    if (X[14] == 1) J1 = "CV10  CV6  ";
                    if (X[15] == 1) J2 = "ST25  SP9  ";
                    if (X[11] == 1) J3 = "CV4  CV9  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Shen Ling Baizhu San";
                    CM2 = "Ren-shen 12  Fu-ling 15  Bai-zhu 09  Jie-geng 09  Shan-yao 15  Gan-cao 06  Bai-bian-dou 09  Lian-zi-rou 12  Sha-ren 06  Yi-yi-ren 09  ";
                    break;
                case "DF4":
                    BZ = "Stagnation of phlegm and qi";
                    ZF = "Regulating the flow of qi and resolving phlegm";
                    CF = "CV17  CV12  CV6  TE6  ST40  SP6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Erchen Tang";
                    CM2 = "Ban-xia 09  Chen-pi 09  Fu-ling 12  Gan-cao 06  ";
                    break;
            }
            break;
        case "f106": //崩漏Metrorrhagia and Metrostaxis
            Y[1] = -2 * X[2] + 5 * X[4] + 4 * X[6] - 2 * X[7] + 4 * X[12] - 2 * X[13] + X[14] + 2 * X[15] + 2 * X[21] + X[25];
            Y[2] = 4 * X[3] + 4 * X[6] - 2 * X[7] + 4 * X[9] + 3 * X[10] - 2 * X[13] + X[14] + X[16] + X[22] + X[27] + X[28];
            Y[3] = 5 * X[2] - 2 * X[4] - 2 * X[5] - 2 * X[6] + 4 * X[7] - X[8] + 3 * X[10] + 4 * X[13] - X[14] - X[16] + 2 * X[19] + X[23] + X[26] + X[27];
            Y[4] = 5 * X[2] - 2 * X[4] - 2 * X[5] - 2 * X[6] + 4 * X[7] - X[8] + 4 * X[11] + X[13] + 4 * X[20] - X[21] + X[23] + X[26];
            Y[5] = -2 * X[2] - 2 * X[3] + 5 * X[5] + 4 * X[8] + 4 * X[17] + 3 * X[18] + 2 * X[24] + X[29];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5]) diff = "DF3";
            if (Y[4] > 8 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5]) diff = "DF4";
            if (Y[5] > 8 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4]) diff = "DF5";
            switch (diff) {
                case "DF1":
                    BZ = "Heat of the blood";
                    ZF = "Removing pathogenic heat from blood and arresting bleeding";
                    CF = "CV6  SP6  SP1  ";
                    if (X[15] == 1) J1 = "GV14  LI11  ";
                    if (X[14] == 1) J2 = "PC5  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Qingre Gujing Tang";
                    CM2 = "Huang-qin 12  Zhi-zi 09  Sheng-di-huang 12  Di-gu-pi 09  Di-yu 09  E-jiao 09  Ou-jie 09  Chen-zong-tan 09  Gui-ban 09  Mu-li 09  Gan-cao 06  Sha-shen 12  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the kidney-yin";
                    ZF = "Nourishing the kidney-yin and arresting bleeding";
                    CF = "CV4  SP6  BL23  KI8  KI2  KI10  ";
                    if (X[16] == 1) J1 = "HT6  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Zuogui Yin & Erzhi Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Gou-qi-zi 12  Shan-zhu-yu 12  Tu-si-zi 09  Lu-jiao-jiao 09  Gui-ban-jiao 09  Chuan-niu-xi 09  Nu-zhen-zi 09  Han-lian-cao 09  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of the kidney-yang";
                    ZF = "Reinforcing the kidney, supporting yang and arresting bleeding";
                    CF = "CV4  SP6  BL23  KI8  CV6  GV4  ";
                    if (X[10] == 1) J1 = "Yaoyan  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Yougui Wan";
                    CM2 = "Zhi-fu-zi 06  Shu-di-huang 12  Shan-yao 15  Shan-zhu-yu 12  Gou-qi-zi 12  Tu-si-zi 09  Lu-jiao-jiao 09  Du-zhong 09  Huang-qi 15  Fu-pen-zi 09  Chi-shi-zhi 09  ";
                    break;
                case "DF4":
                    BZ = "Insufficiency of the spleen-qi";
                    ZF = "Hemostasis by invigorating qi";
                    CF = "CV4 ST36  SP6  BL20  BL23  ";
                    if (X[20] == 1) J1 = "ST25  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Guben Zhibeng Tang";
                    CM2 = "Ren-shen 12  Huang-qi 15  Bai-zhu 09  Shu-di-huang 12  Hei-jiang 09  Sheng-ma 09  Shan-yao 15  Da-zao 06  Wu-zei-gu 09  ";
                    break;
                case "DF5":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove the blood stasis and arresting bleeding";
                    CF = "CV6  SP6  SP1  SP8  ST30  ";
                    if (X[17] == 1) J1 = "LI4  CV3  ";
                    if (X[14] == 1) J2 = "PC5  ";
                    ZJF = "Uniform reinforcing-reducing method and moxibustion";
                    CM1 = "Modified of Siwu Tang & Shixiao San";
                    CM2 = "Shu-di-huang 12  Dang-gui 12  Chuan-xiong 09  Bai-shao 12  Pu-huang 09  Wu-ling-zhi 09  San-qi 09  Qian-cao-tan 09  Wu-zei-gu 09  ";
                    break;
            }
            break;
        case "f107": //闭经Amenorrhea
            Y[1] = 2 * X[0] + 2 * X[1] + 3 * X[4] + 2 * X[5] + 4 * X[6] + 3 * X[9] + 3 * X[10] + 3 * X[11] + 2 * X[12] + X[15];
            Y[2] = 2 * X[0] + 2 * X[1] + 4 * X[2] + 4 * X[3] + 4 * X[7] + 4 * X[8] + 2 * X[13] + X[14];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of blood";
                    ZF = "Invigorating qi and enriching blood";
                    CF = "BL18  BL20  BL17  BL23  CV4  ST36  SP6  ";
                    if (X[4] == 1) J1 = "BL43  ";
                    if (X[6] == 1) J2 = "PC6  ";
                    if (X[9] == 1) J3 = "GV4  ";
                    if (X[10] == 1 && X[11] == 1) J4 = "ST25  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Renshen Yangrong Tang";
                    CM2 = "Ren-shen 15  Huang-qi 15  Bai-zhu 09  Fu-ling 12  Yuan-zhi 09  Chen-pi 09  Wu-wei-zi 09  Dang-gui 12  Bai-shao 12  Shu-di-huang 12  Gui-xin 09  Zhi-Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of blood";
                    ZF = "Regulating the flow of qi and warming the channels,strengthening the spleen and reducing phlegm";
                    CF = "CV3  SP8  LI4  SP6  LR3  ST40  ";
                    if (X[7] == 1) J1 = "LR14  TE6  ";
                    if (X[8] == 1) J2 = "CV4  CV6  KI14  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Xuefu Zhuyu Tang";
                    CM2 = "Dang-gui 12  Sheng-di-huang 12  Tao-ren 09  Hong-hua 09  Zhi-ke 09  Chi-shao 09  Chai-hu 09  Gan-cao 06  Jie-geng 09  Chuan-xiong 09  Niu-xi 09  ";
                    break;
            }
            break;
        case "f2": //带下病Leukorrhea Disease
            Y[1] = 5 * X[0] + 5 * X[1] - 2 * X[2] + 3 * X[4] - 2 * X[5] + 2 * X[6] + X[8] + 2 * X[9] + 2 * X[11] + 2 * X[14] - X[16] + X[17] + X[20] + X[22];
            Y[2] = 5 * X[0] + 2 * X[3] + 3 * X[4] - 2 * X[5] - X[6] + 2 * X[7] + X[8] + 2 * X[12] + X[14] + 3 * X[15] - X[16] + X[17] + X[19] + X[23];
            Y[3] = -2 * X[0] - 2 * X[1] + 6 * X[2] + 2 * X[3] - 2 * X[4] + 4 * X[5] + 3 * X[10] - X[12] + 3 * X[13] + 4 * X[16] + X[18] + X[21] + X[24];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of the spleen";
                    ZF = "Strengthening the spleen, replenishing qi and removing dampness";
                    CF = "CV6  GB26  BL30  SP6  ST36  ";
                    if (X[8] == 1) J1 = "SP12  ST30  CV3  ";
                    if (X[11] == 1 || X[14] == 1) J2 = "CV12  ST25  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Wandai Tang";
                    CM2 = "Bai-zhu 12  Shan-yao 15  Ren-shen 15  Bai-shao 12  Cang-zhu 09  Gan-cao 06  Chen-pi 09  Hei-jie-sui 09  Chai-hu 09  Che-qian-zi 09  ";
                case "DF2":
                    BZ = "Deficiency of the kidney";
                    ZF = "Warming the kidney to invigorate yang and arresting leukorrhagia";
                    CF = "CV4  GB26  BL23  BL32  KI6  ";
                    if (X[3] == 1) J1 = "KI12  KI13  ";
                    if (X[15] == 1) J2 = "Yaoyan  BL27  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Neibu Wan";
                    CM2 = "Lu-rong 09  Tu-si-zi 12  Tong-ji-li 09  Huang-qi 15  Rou-gui 09  Sang-piao-xiao 09  Rou-cong-rong 09  Zhi-fi-zi 06  Bai-ji-li 09  Zi-yuan 09  ";
                    break;
                case "DF3":
                    BZ = "Noxious dampness";
                    ZF = "Clearing away heat and toxic material, removing dampness by diuresis";
                    CF = "GB26  CV3  SP9  BL34  LR2  ";
                    if (X[16] == 1 || X[15] == 1) J1 = "LR5  LR3  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Zhidai Fang";
                    CM2 = "Zhu-ling 09  Fu-ling 12  Che-qian-zi 09  Ze-xie 09  Yin-chen 09  Chi-shao 09  Mu-dan-pi 09  Huang-bai 09  Zhi-zi 09  Niu-xi 09  ";
                    break;
            }
            break;
        case "f301": //妊娠恶阻Pernicious Vomiting
            Y[1] = 2 * X[0] + 6 * X[1] - 2 * X[2] - X[5] + 2 * X[7] + 3 * X[9] + 3 * X[13] - X[14] + 2 * X[18];
            Y[2] = 2 * X[0] - 2 * X[1] + 5 * X[2] + 3 * X[5] + 2 * X[6] + 3 * X[10] + X[11] + 3 * X[12] + X[14] + X[16];
            Y[3] = 2 * X[0] - 2 * X[2] + 5 * X[3] + 2 * X[4] - X[5] + 4 * X[7] + 2 * X[8] + X[13] + 2 * X[15] + X[17];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of the stomach";
                    ZF = "Arresting vomiting by strengthening the function of the stomach";
                    CF = "ST36  CV13  CV12  SP4  ";
                    if (X[1] == 1 && X[18] == 1) J1 = "PC6  ";
                    if (X[9] == 1) J2 = "CV10  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Xiang Sha Liujunzi Tang";
                    CM2 = "Dang-shen 15  Bai-zhu 09  Fu-ling 12  Gan-cao 09  Ban-xia 09  Chen-pi 09  Mu-xiang 09  Sha-ren 06  Sheng-jiang 03  ";
                    break;
                case "DF2":
                    BZ = "Heat in the liver";
                    ZF = "Removing intensive heat from the liver and strengthening the stomach";
                    CF = "PC6  LR3  CV12  ST36  ";
                    if (X[2] == 1) J1 = "GB34  ";
                    if (X[10] == 1) J2 = "CV17  GB24  ";
                    if (X[11] == 1) J3 = "GV20  Yintang  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Suye Huanglian Tang";
                    CM2 = "Su-ye 12  Huang-lian 06  Ban-xia 09  Chen-pi 09  Zhu-li 09  Wu-mei 09  ";
                    break;
                case "DF3":
                    BZ = "Stagnation of phlegm";
                    ZF = "Strengthening the spleen and reducing phlegm, arresting vomiting";
                    CF = "SP9  ST40  ST36  CV12  KI21  ";
                    if (X[7] == 1) J1 = "CV17  ";
                    if (X[8] == 1) J2 = "PC6  ";
                    ZJF = "Uniform reinforcing-reducing method";
                    CM1 = "Modified of Xiao Banxia Jia Fuling Tang";
                    CM2 = "Ban-xia 09  Sheng-jiang 09  Fu-ling 12  Bai-zhu 09  Sha-ren 06  Chen-pi 09  ";
                    break;
            }
            break;
        case "f302": //妊娠痫证Eclampsia Gravidarum
            Y[1] = X[0] + X[1] + X[2];
            if (Y[1] > 1) diff = "DF1"
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of liver-yin and kidney-yin, up-stirring of liver";
                    ZF = "Nourishing yin and suppressing the excessive yang, calming the liver to stop the wind";
                    CF = "GV20  GB20  PC6  LR3  SP6  KI3  ";
                    if (X[3] == 1) J1 = "GV26  ";
                    if (X[2] == 1) J2 = "ST7  ST6  ";
                    if (X[4] == 1) J3 = "Yintang  ";
                    if (X[1] == 1) J4 = "GB34  ";
                    if (X[5] == 1) J5 = "ST40  ";
                    ZJF = "Uniform reinforcing-reducing method";
                    CM1 = "Lingyang Gouteng Tang";
                    CM2 = "Ling-yang-jiao 15  Gou-teng 09  Sang-ye 09  Ju-hua 09  Bei-mu 09  Zhu-li 09  Sheng-di-huang 12  Bai-shao 12  Fu-shen 09  Gan-cao 06  ";
                    break;
            }
            break;
        case "f303": //滞产Difficult Labor
            Y[1] = 2 * X[0] + 4 * X[1] - 2 * X[2] + 3 * X[3] - 2 * X[4] + 3 * X[5] - X[6] + 2 * X[7] + 2 * X[9] + 3 * X[11] + X[15] + X[17];
            Y[2] = 2 * X[0] - 2 * X[1] + 4 * X[2] - 2 * X[3] + 3 * X[4] - X[5] + 3 * X[6] + 2 * X[8] + 2 * X[10] + 2 * X[12] + X[13] + X[14] + X[16] + X[18];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi and blood";
                    ZF = "Induction of labor by invigorating qi and enriching blood";
                    CF = "ST36  SP6  KI7  BL67  ";
                    if (X[9] == 1) J1 = "CV4  CV6  ";
                    if (X[11] == 1) J2 = "PC6  KI3  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Caisongting Nanchan Fang";
                    CM2 = "Huang-qi 15  Dang-gui 12  Fu-shen 12  Dang-shen 12  Gui-ban 09  Chuan-xiong 09  Bai-shao 12  Gou-qi-zi 09  ";
                    break;
                case "DF2":
                    BZ = "Stagnancy of qi and blood stasis";
                    ZF = "Induction of labor by prompting flow of qi and blood circulation";
                    CF = "LI4  SP6  ";
                    if (X[14] == 1) J1 = "LR3  ";
                    if (X[13] == 1) J2 = "PC6  GB21  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Cuisheng Yin";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Da-fu-pi 09  Zhi-ke 09  Bai-zhi 09  Yi-mu-cao 12  ";
                    break;
            }
            break;
        case "f304": //胞衣不下Retention of Placenta
            Y[1] = 2 * X[0] + 3 * X[1] - X[2] + 3 * X[3] - 2 * X[4] + 2 * X[5] + 3 * X[7] + 3 * X[8] - X[9] + 2 * X[10] + X[11] + X[12] + X[13] + X[15];
            Y[2] = 2 * X[0] - X[1] + 3 * X[2] - 2 * X[3] + 4 * X[4] + 3 * X[6] - X[7] - X[8] + 4 * X[9] + 2 * X[14] + X[16];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi";
                    ZF = "Invigorating qi and enriching blood";
                    CF = "CV4  SP6  ";
                    if (X[7] == 1) J1 = "SP1  ";
                    if (X[11] == 1 && X[12] == 1) J2 = "CV8  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Jiumu Dan";
                    CM2 = "Ren-shen 15  Dang-gui 12  Chuan-xiong 09  Yi-mu-cao 15  Chi-shi-zhi 09  Hei-jie-sui 09  ";
                    break;
                case "DF2":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove blood stasis";
                    CF = "CV3  CV6  LI4  SP6  GB21  ";
                    if (X[9] == 1) J1 = "CV7  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Modified of Tuohua Jian";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Rou-gui 09  Che-qian-zi 09  Niu-xi 09  Hong-hua 09  Mang-xiao 09  ";
                    break;
            }
            break;
        case "f305": //产后腹痛Abdominal Pain after Delivery
            Y[1] = 2 * X[0] + 5 * X[1] - 2 * X[2] - X[4] - X[5] + 2 * X[6] + 3 * X[7] - 2 * X[8] + 2 * X[9] + X[11] + X[12] + X[15];
            Y[2] = 2 * X[0] - 2 * X[1] + 5 * X[2] + 4 * X[3] - X[4] - X[5] - X[7] - X[8] + 4 * X[10] + X[13] + X[16];
            Y[3] = 2 * X[0] - X[1] - X[2] + 4 * X[4] + 2 * X[5] + 2 * X[6] - 2 * X[7] + 4 * X[8] + X[14] + X[17];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of blood";
                    ZF = "Invigorating qi and enriching blood, replenishing and strengthening the Chong and Ren channel";
                    CF = "CV4  CV6  BL17  ST36  SP6  ";
                    if (X[9] == 1) J1 = "GV20  Sishencong  ";
                    if (X[11] == 1) J2 = "KI6  TE6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Changning Tang";
                    CM2 = "Dang-gui 12  Shu-di-huang 12  E-jiao 09  Ren-shen 12  Shan-yao 15  Xu-duan 09  Mai-dong 09  Rou-gui 09  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Accumulation of cold";
                    ZF = "Restoring yang and expelling cold, warming the uterine collaterals";
                    CF = "CV4  CV6  BL23  SP6  ";
                    if (X[10] == 1) J1 = "CV8  CV7  ";
                    if (X[2] == 1) J2 = "GV4  BL32  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Danggui Jianzhong Tang";
                    CM2 = "Dang-gui 12  Gui-xin 09  Bai-shao 12  Gan-cao 06  Sheng-jiang 03  Da-zao 06  Yi-tang 15  ";
                    break;
                case "DF3":
                    BZ = "Stagnancy of qi and blood stasis";
                    ZF = "Promoting flow of qi and blood circulation, removing obstruction in the channels to relieve pain";
                    CF = "CV3  ST29  BL17  SP10  LR3  ";
                    if (X[5] == 1) J1 = "LR14  CV17  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Shenghua Tang";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Tao-ren 09  Pao-jiang 06  Gan-cao 06  Yi-mu-cao 12  ";
                    break;
            }
            break;
        case "f306": //恶露不下Lochiostasis
            Y[1] = 2 * X[0] + 3 * X[1] - 2 * X[2] + 4 * X[3] - 2 * X[4] - 2 * X[5] + 3 * X[6] - X[7] + X[8] + X[9];
            Y[2] = 2 * X[0] - X[1] + 4 * X[2] - X[3] + 3 * X[4] + 3 * X[5] + X[7] + X[10];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of qi";
                    ZF = "Promoting flow of qi and removing stagnancy";
                    CF = "LR3  PC5  CV6  CV4  ";
                    if (X[3] == 1) J1 = "ST30  ";
                    if (X[6] == 1) J2 = "LR14  CV17  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaoyao San";
                    CM2 = "Chai-hu 09  Dang-gui 12  Bai-shao 12  Bai-zhu 09  Fu-ling 12  Gan-cao 06  Bo-he 06  Sheng-jiang 03  ";
                    break;
                case "DF2":
                    BZ = "Blood stasis";
                    ZF = "Promoting blood circulation to remove blood stasis";
                    CF = "CV3  ST30  SP8  ";
                    if (X[4] == 1) J1 = "KI14  CV7  KI18  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Shaofu Zhuyu Tang";
                    CM2 = "Xiao-hui-xiang 09  Gan-jiang 09  Yan-hu-suo 09  Mo-yao 09  Dang-gui 12  Chuan-xiong 09  Rou-gui 09  Chi-shao 09  Pu-huang 09  Wu-ling-zhi 09  ";
                    break;
            }
            break;
        case "f307": //恶露不绝Lochiorrhea
            Y[1] = 3 * X[1] - X[2] + 2 * X[3] - X[5] + 3 * X[6] - X[8] + 2 * X[9] + X[10] + 2 * X[12] + 2 * X[15] - X[16] + X[18] + X[21];
            Y[2] = 3 * X[1] - X[2] + 2 * X[4] - X[5] - X[6] + 3 * X[7] + 3 * X[8] - X[9] + 2 * X[11] + 2 * X[13] + X[14] + X[19] + X[22];
            Y[3] = -X[1] + 3 * X[2] + 5 * X[5] + 5 * X[16] + 2 * X[17] + 2 * X[20] + X[23];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi";
                    ZF = "Invigorating qi and arresting bleeding";
                    CF = "CV4  ST36  SP6  ";
                    if (X[1] == 1) J1 = "CV6  BL20  ";
                    if (X[15] == 1) J2 = "GV20  CV12  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Buzhong Yiqi Tang";
                    CM2 = "Ren-shen 15  Huang-qi 12  Bai-zhu 09  Gan-cao 06  Dang-gui 12  Chen-pi 09  Sheng-ma 09  Chai-hu 09  Lu-jiao-jiao 09  Ai-ye-tan 09  ";
                    break;
                case "DF2":
                    BZ = "Bleeding due to blood-heat";
                    ZF = "Nourishing yin and clearing away the heat from blood";
                    CF = "CV6  CV3  SP10  LR6  KI10  ";
                    if (X[11] == 1) J1 = "LR2  ";
                    if (X[13] == 1) J2 = "KI3  ";
                    if (X[14] == 1) J3 = "KI6  ";
                    ZJF = "Reinforcement and reduction in acupuncture";
                    CM1 = "Modified of Baoyin Jian";
                    CM2 = "Sheng-di-huang 12  Shu-di-huang 12  Huang-qin 09  Huang-bai 09  Bai-shao 12  Shan-yao 15  Xu-duan 09  Gan-cao 06  E-jiao 09  Han-lian-cao 09  Wu-zei-gu 09  ";
                    break;
                case "DF3":
                    BZ = "Blood stasis in the uterine collaterals";
                    ZF = "Promoting flow of qi and blood circulation";
                    CF = "CV3  CV5  SP8  ";
                    if (X[16] == 1) J1 = "CV6  ST29  ";
                    if (X[17] == 1) J2 = "CV8  CV7  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Shenghua Tang";
                    CM2 = "Dang-gui 12  Chuan-xiong 09  Tao-ren 09  Pao-jiang 06  Gan-cao 06  Pu-huang 09  ";
                    break;
            }
            break;
        case "f308": //产后血晕Syncope after Delivery
            Y[1] = 2 * X[0] + 4 * X[1] + 3 * X[3] - X[4] + 3 * X[6] + 5 * X[10] + X[13] + X[14];
            Y[2] = 2 * X[0] + 3 * X[2] - X[3] + 2 * X[4] + 3 * X[5] + 2 * X[7] + 3 * X[8] + 3 * X[11] + X[12];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Exhaustion of qi resulting from hemorrhea";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse, invigorating qi and enriching the blood";
                    CF = "CV4  CV6  SP6  ST36  ";
                    if (X[10] == 1) J1 = "SP1  LR1  ";
                    if (X[6] == 1) J2 = "HT7  PC4  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Dushen Tang";
                    CM2 = "Ren-shen 30  ";
                    break;
                case "DF2":
                    BZ = "Blood stasis due to cold";
                    ZF = "Warming the channels and expelling cold, promoting blood circulation to remove blood stasis";
                    CF = "CV3  CV7  SP6  TE6  SP4  ";
                    if (X[0] == 1) J1 = "GV26  GV20  ";
                    if (X[8] == 1) J2 = "ST29  ";
                    if (X[7] == 1) J3 = "KI21  KI18  ";
                    if (X[9] == 1) J4 = "LR3  LI4  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Duoming San";
                    CM2 = "Mo-yao 09  Xue-jie 09  Dang-gui 12  Chuan-xiong 09  ";
                    break;
            }
            break;
        case "f309": //产后乳少Hypogalactia
            Y[1] = 2 * X[0] - 2 * X[1] + 4 * X[2] + 2 * X[4] + 2 * X[5] + 2 * X[6] + 3 * X[9] + 3 * X[10] + X[11];
            Y[2] = 2 * X[0] + 5 * X[1] - 2 * X[2] + 4 * X[3] + 3 * X[7] + 2 * X[8] - X[10] + X[12];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of qi and blood";
                    ZF = "Invigorating qi and enriching blood";
                    CF = "CV17  ST18  BL20  ST36  ";
                    if (X[9] == 1) J1 = "CV12  ST25  ";
                    if (X[10] == 1) J2 = "BL18  BL17  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Tongru Dan";
                    CM2 = "Ren-shen 12  Huang-qi 15  Dang-gui 12  Mai-dong 09  Tong-cao 09  Jie-geng 09  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "CV17  ST18  SI1  PC6  LR3  ";
                    if (X[7] == 1) J1 = "LR14  ";
                    if (X[8] == 1) J2 = "CV12  ST36  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaru Yongquan San";
                    CM2 = "Dang-gui 12  Bai-shao 12  Chuan-xiong 09  Sheng-di-huang 12  Chai-hu 09  Qing-pi 09  Tian-hua-fen 09  Lou-lu 09  Tong-cao 09  Jie-geng 09  Bai-zhi 09  Chuan-shan-jia 09  Wang-bu-liu-xing 09  Gan-cao 06  ";
                    break;
            }
            break;
        case "f401": //乳痈Acute Mastitis
            Y[1] = 3 * X[0] + 2 * X[1] + 3 * X[3] + 3 * X[4] - 2 * X[5] + 2 * X[9] + X[11];
            Y[2] = 3 * X[0] + 3 * X[2] - X[3] - X[4] + 5 * X[5] + X[8] + X[10];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Excessiveness of the stomach-heat";
                    ZF = "Clearing away heat and dispersing accumulation of pathogen";
                    CF = "ST16  ST39  ST40  LI7  ";
                    if (X[6] == 1) J1 = "CV17  SI1  ";
                    if (X[7] == 1) J2 = "LI4  GB20  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Tounong San";
                    CM2 = "Dang-gui 12  Sheng-huang-qi 15  Chuan-shan-jia 09  Chuan-xiong 09  Zao-jiao-ci 09  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "LR14  LR2  PC6  PC1  GB21  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Gualou Niubang Tang";
                    CM2 = "Gua-lou 09  Niu-bang-zi 09  Tian-hua-fen 12  Huang-qin 12  Zhi-zi 09  Zao-jiao-ci 09  Jin-yin-hua 12  Qing-pi 09  Chai-hu 09  Gan-cao 06  Lian-qiao 09  ";
                    break;
            }
            break;
        case "f402": //乳癖Nodules of Breast
            Y[1] = 3 * X[0] + 3 * X[3] + 2 * X[4] + 3 * X[12] + 2 * X[13] + X[14];
            Y[2] = 3 * X[0] + 2 * X[2] + 2 * X[6] + 3 * X[7] + 2 * X[10] + 2 * X[11] + X[15];
            Y[3] = 3 * X[0] + 3 * X[1] + 3 * X[5] + 2 * X[8] + 3 * X[9] + X[16];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of the liver-qi";
                    ZF = "Relieving the depressed liver";
                    CF = "ST15  LR2  PC6  CV17  ";
                    if (X[13] == 1) J1 = "SP6  CV4  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Kaiyu San";
                    CM2 = "Chai-hu 09  Dang-gui 12  Bai-shao 12  Bai-zhu 09  Fu-ling 12  Xiang-fu 09  Yu-jin 09  Tian-gui-zi 09  Quan-xie 09  Bai-jie-zi 09  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Stagnation of phlegm";
                    ZF = "Reducing phlegm and resolving masses";
                    CF = "ST16  ST40  CV17  BL20  CV12  ";
                    if (X[1] == 1) J1 = "Yintang  Sishencong  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xiaoyao Lou Bei San";
                    CM2 = "Chai-hu 09  Bai-shao 12  Dang-gui 12  Bai-zhu 09  Fu-ling 12  Gua-lou 09  Bei-mu 09  Ban-xia 09  Dan-nan-xing 09  Mu-li 09  Shan-ci-gu 09  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of liver-yin and kidney-yin";
                    ZF = "Tonifying the liver and kidney";
                    CF = "KI5  LR5  ST18  BL23  ";
                    if (X[9] == 1) J1 = "Jingbailao  BL43  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Liuwei Dihuang Wan";
                    CM2 = "Shu-di-huang 12  Shan-yao 15  Fu-ling 12  Mu-dan-pi 09  Ze-xie 09  Shan-zhu-yu 09  ";
                    break;
            }
            break;
        case "f403": //阴挺Prolapse of Uterus
            Y[1] = 2 * X[0] + 4 * X[1] + 2 * X[2] + 2 * X[3] + 4 * X[7] - X[8] - X[9] + X[10] + X[12];
            Y[2] = 2 * X[0] + 3 * X[4] + 3 * X[5] + 2 * X[6] + 2 * X[8] + 2 * X[9] + X[11] + X[13];
            if (Y[1] > 8 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of the spleen";
                    ZF = "Invigorating qi and elevating the spleen-yang";
                    CF = "GV20  CV6  GB28  ST36  SP6  ";
                    if (X[1] == 1) J1 = "CV12  BL20  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Buzhong Yiqi Tang";
                    CM2 = "Ren-shen 15  Huang-qi 12  Bai-zhu 09  Gan-cao 06  Dang-gui 12  Chen-pi 09  Sheng-ma 09  Chai-hu 09  Xu-duan 09  Jin-ying-zi 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of the kidney";
                    ZF = "Tonifying the kidney-qi";
                    CF = "CV4  Zigong  KI12  KI6  ";
                    if (X[5] == 1) J1 = "BL23  LR8  ";
                    if (X[4] == 1) J2 = "GV20  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Dabuyuan Jian";
                    CM2 = "Ren-shen 15  Shan-yao 15  Shu-di-huang 12  Du-zhong 09  Dang-gui 12  Shan-zhu-yu 12  Gou-qi-zi 09  Zhi-gan-cao 06  Jin-ying-zi 09  Qian-shi 09  Lu-jiao-jiao 09  Zi-he-che 09  ";
                    break;
            }
            break;
        case "f404": //阴痒Pruritus Vulvae
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7] + X[8] + X[9];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Retention of damp-heat";
                    ZF = "Clearing away heat and promoting diuresis";
                    CF = "CV3  BL34  SP10  SP6  LR5  ";
                    if (X[1] == 1) J1 = "CV2  LR1  ";
                    if (X[2] == 1) J2 = "PC5  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Bixie Shenshi Tang";
                    CM2 = "Bi-xie 09  Yi-yi-ren 09  Huang-bai 09  Chi-fu-ling 09  Mu-dan-pi 09  Ze-xie 09  Tong-cao 09  Hua-shi 12  Cang-zhu 09  Ku-shen 09  Bai-xian-pi 09  ";
                    break;
            }
            break;
        case "f405": //不孕"Sterility
            Y[1] = 3 * X[1] - 2 * X[3] + 3 * X[4] + 3 * X[5] - X[6] + 2 * X[9] + 2 * X[10] + 2 * X[14] + X[17] + X[23] + 2 * X[25];
            Y[2] = -2 * X[3] + 3 * X[4] + 3 * X[5] - X[6] + 2 * X[9] + 3 * X[11] + X[15] + X[17] + X[19] + X[20] + X[23] + X[25] + X[26];
            Y[3] = X[3] - X[5] + 3 * X[6] + 4 * X[13] + 2 * X[14] - 2 * X[15] + 3 * X[16] + 2 * X[22] + X[23] + X[25] + X[27];
            Y[4] = 2 * X[2] - X[5] + 2 * X[6] + 2 * X[7] + 3 * X[8] + 2 * X[9] + 2 * X[12] + 2 * X[18] - X[20] + X[21] + 2 * X[24] + X[28] + X[29];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4]) diff = "DF3";
            if (Y[4] > 8 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3]) diff = "DF4";
            switch (diff) {
                case "DF1":
                    BZ = "Deficiency of the kidney";
                    ZF = "Tonifying the kidney-qi, replenishing and strengthening the Chong and Ren Channels";
                    CF = "BL23  KI13  KI2  ";
                    if (X[9] == 1 || X[10] == 1) J1 = "GV20  KI3  ";
                    if (X[14] == 1) J2 = "Yaoyan  KI10  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Yulin Zhu";
                    CM2 = "Ren-shen 15  Bai-zhu 09  Fu-ling 12  Bai-shao 12  Chuan-xiong 09  Zhi-gan-cao 06  Dang-gui 12  Shu-di-huang 12  Tu-si-zi 12  Du-zhong 09  Lu-jiao-shuang 09  Chuan-jiao 09  Zi-he-che 09  Dan-shen 09  Xiang-fu 09  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of blood";
                    ZF = "Enriching the blood, replenishing and strengthening the Chong and Ren Channels";
                    CF = "CV4  ST13  Zigong  SP6  ST36  ";
                    if (X[15] == 1) J1 = "SP10  ";
                    if (X[9] == 1) J2 = "GV20  ";
                    if (X[10] == 1) J3 = "HT7  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Yangjing Zhongyu Tang & Erzhi Wan";
                    CM2 = "Dang-gui 12  Bai-shao 12  Shu-di-huang 12  Shan-zhu-yu 12  Nu-zhen-zi 09  Han-lian-cao 09  ";
                    break;
                case "DF3":
                    BZ = "Retention of cold in the uterus";
                    ZF = "Warming the uterus and expelling cold";
                    CF = "CV7  CV2  GV4  CV6  ";
                    if (X[1] == 1) J1 = "ST25  ST29  ";
                    if (X[14] == 1) J2 = "BL23  Yaoyan  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Ai Fu Nuangong Wan";
                    CM2 = "Ai-ye 09  Xiang-fu 09  Dang-gui 12  Xu-duan 09  Wu-zhu-yu 09  Chuan-xiong 09  Bai-shao 12  Huang-qi 12  Sheng-di-huang 12  Rou-gui 09  ";
                    break;
                case "DF4":
                    BZ = "Stagnation of phlegm and blood stasis";
                    ZF = "Reducing phlegm and promoting blood circulation to remove blood stasis";
                    CF = "CV3  ST30  KI14  SP6  ST40  ";
                    if (X[2] == 1) J1 = "SP8  ";
                    if (X[12] == 1) J2 = "LR3  PC6  ";
                    if (X[18] == 1) J3 = "BL33  ";
                    ZJF = "Acupuncture and moxibustion";
                    CM1 = "Modified of Qigong Wan";
                    CM2 = "Ban-xia 09  Cang-zhu 09  Xiang-fu 09  Shen-qu 09  Fu-ling 12  Chen-pi 09  Chuan-xiong 09  Shi-chang-pu 09  ";
                    break
            }
            break;
        case "e101": //顿咳Whooping Cough
            Y[1] = 10 * X[0] + 3 * X[1] + 2 * X[2] + 3 * X[3] + X[4] + X[5] - 5 * X[6] - 3 * X[7] - 5 * X[14];
            Y[2] = -5 * X[0] + 6 * X[6] + 6 * X[7] + 5 * X[8] + 3 * X[9] + X[10] + X[11] + X[12] + X[13] - 5 * X[14];
            Y[3] = -5 * X[0] + 6 * X[6] - 5 * X[7] + 6 * X[14] + 3 * X[15] + 2 * X[16] + X[17] + X[18] + X[19];
            if (Y[1] > 10 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 10 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 10 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Initial stage of cough";
                    ZF = "Ventilating the lung, relieving exterior syndrome and cough";
                    CF = "BL12  LU7  LI4  ";
                    if (X[1] == 1) J1 = "BL11  GV14  ";
                    if (X[2] == 1) J2 = "LU11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xing Su San";
                    CM2 = "Xing-ren 06  Su-ye 06  Ju-hong 06  Ban-xia 06  Jie-geng 06  Zhi-ke 06  Qian-hu 06  Fu-ling 09  Gan-cao 03  Da-zao 03  Sheng-jiang 03  ";
                    break;
                case "DF2":
                    BZ = "Stage of spasmodic cough";
                    ZF = "Clearing away heat, relieving cough and reducing sputum";
                    CF = "GV14  GV12  LU5  ST40  ";
                    if (X[9] == 1) J1 = "LI11  ";
                    if (X[10] == 1 || X[11] == 1) J2 = "LU3  GV23  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Sangbaipi Tang";
                    CM2 = "Sang-bai-pi 06  Ban-xia 06  Su-zi 06  Xing-ren 06  Bei-mu 03  Huang-qin 09  Huang-lian 03  Zhi-zi 06  ";
                    break;
                case "DF3":
                    BZ = "Remission stage of cough";
                    ZF = "Strengthening the spleen and invigorating the lung";
                    CF = "BL13  BL20  LU9  ST36  ";
                    if (X[15] == 1) J1 = "BL43  ";
                    if (X[16] == 1) J2 = "ST25  CV6  ";
                    if (X[17] == 1) J3 = "CV4  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Shashen Maidong Tang & Renshen Wuweizi Tang";
                    CM2 = "Sha-shen 09  Mai-dong 06  Yu-zhu 06  Gan-cao 03  Sang-ye 06  Bai-bian-dou 06  Tian-hua-fen 06  Dang-shen 09  Bai-zhu 06  Fu-ling 09  Wu-wei-zi 06  Sheng-jiang 03  Da-zao 03  ";
                    break
            }
            break;
        case "e102": //小儿泄泻Infantile Diarrhea
            Y[1] = 3 * X[0] - X[1] - X[2] + 2 * X[4] - 2 * X[6] + 3 * X[8] - 2 * X[13] + 3 * X[14] + 2 * X[15] + 2 * X[17] + X[19] + X[21];
            Y[2] = 4 * X[2] + X[4] + 3 * X[5] - 2 * X[6] + 3 * X[7] + 2 * X[9] + 2 * X[10] + X[17] + X[18] + X[19] + X[20];
            Y[3] = 4 * X[1] - X[2] + X[3] + 5 * X[6] - X[8] + X[11] + X[12] + 2 * X[13] - X[14] - X[15] + X[16] + 2 * X[22];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Damp-heat";
                    ZF = "Clearing away heat and promoting diuresis";
                    CF = "CV12  ST25  ST36  LI11  ST44  ";
                    if (X[8] == 1) J1 = "LI4  GV14  ";
                    if (X[15] == 1) J2 = "SP9  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Gegen Huangqin Huanglian Tang";
                    CM2 = "Ge-gen 06  Huang-qin 09  Huang-lian 06  Gan-cao 03  ";
                    break;
                case "DF2":
                    BZ = "Impairment by overeating";
                    ZF = "Promoting digestion and removing stagnated food";
                    CF = "CV12  CV11  ST25  CV6  ST36  ";
                    if (X[10] == 1) J1 = "PC6  CV13  ";
                    if (X[3] == 1 || X[4] == 1) J2 = "CV10  LI4  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Baohe Wan";
                    CM2 = "Shan-zha 06  Shen-qu 06  Ban-xia 06  Fu-ling 09  Chen-pi 06  Lian-qiao 06  Lai-fu-zi 06  ";
                    break;
                case "DF3":
                    BZ = "Deficiency of yang";
                    ZF = "Strengthening the spleen and warming the kidney";
                    CF = "BL20  BL23  ST36  LR13  ";
                    if (X[3] == 1) J1 = "CV6  SP4  ";
                    if (X[4] == 1) J2 = "CV8  ";
                    if (X[13] == 1) J3 = "CV4  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Fuzi Lizhong Tang";
                    CM2 = "Ren-shen 09  Bai-zhu 06  Pao-jiang 06  Gan-cao 03  Fu-zi 03  ";
                    break
            }
            break;
        case "e103": //疳疾Infantile Malnutrition
            Y[1] = 2 * X[0] - X[1] - X[2] - X[3] + 3 * X[4] + 4 * X[6] + 3 * X[7] + X[8] + X[9] + 2 * X[12] + X[13] + X[15];
            Y[2] = 2 * X[0] + 3 * X[1] + 3 * X[2] + 2 * X[3] - X[4] + 2 * X[5] + X[8] + 2 * X[10] + X[11] + X[12] + X[13] + X[14];
            if (Y[1] > 7 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Weakness of the spleen and the stomach";
                    ZF = "Regulating the function of the spleen and the stomach";
                    CF = "CV12  LR13  BL20  BL21  ST36  SP4  Sifeng  ";
                    if (X[6] == 1) J1 = "CV10  ST25  CV6  ";
                    if (X[6] == 0 && X[7] == 1) J2 = "CV6  ";
                    if (X[9] == 1) J3 = "PC5  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Zisheng Jianpi Wan";
                    CM2 = "Bai-zhu 06  Yi-yi-ren 06  Ren-shen 09  Jie-geng 06  Shan-zha 06  Shen-qu 06  Shan-yao 09  Mai-ya 06  Zhi-shi 06  Fu-ling 09  Huang-lian 03  Dou-kou-ren 06  Ze-xie 06  Zhi-ke 03  Huo-xiang 06  Lian-zi-rou 06  Bian-dou 07  Gan-cao 03  ";
                    break;
                case "DF2":
                    BZ = "Parasitosis";
                    ZF = "Eliminating stagnated food and destroying intestinal worms";
                    CF = "CV14  CV12  ST25  Baichongwo  ST36  ";
                    if (X[3] == 1) J1 = "LR13  CV6  ";
                    if (X[11] == 1) J2 = "LR2  GB34  ";
                    ZJF = "Reinforcement after reduction in acupuncture";
                    CM1 = "Shijunzi San";
                    CM2 = "Shi-jun-zi 09  Chuan-lian-zi 06  Wu-yi 03  Gan-cao 03  ";
                    break
            }
            break;
        case "e104": //急惊风Acute Infantile Convulsion
            Y[1] = 3 * X[3] - X[4] + 2 * X[5] + 3 * X[6] + 2 * X[7] + 2 * X[8] + 2 * X[10] + X[11] + X[19] + X[21];
            Y[2] = X[2] + 3 * X[3] - X[4] + 2 * X[8] + 4 * X[9] + 3 * X[15] + 2 * X[16] + 3 * X[17] + 2 * X[20] + X[22];
            Y[3] = -2 * X[3] + 3 * X[4] + 3 * X[12] + 2 * X[13] + 3 * X[14] + 5 * X[18] + X[19] + X[23];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Affection by exopathogen";
                    ZF = "Clearing away heat and inducing resuscitation to stop wind";
                    CF = "GV14  LI4  LR3  GB34  Shierjingxue  ";
                    if (X[3] == 1) J1 = "LI11  ";
                    if (X[8] == 1) J2 = "CV12  PC6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Yin Qiao San";
                    CM2 = "Jin-yin-hua 09  Lian-qiao 06  Dan-dou-chi 06  Niu-bang-zi 06  Jing-jie 06  Bo-he 03  Jie-geng 06  Gan-cao 03  Zhu-ye 06  Lu-gen 06  Gou-teng 06  Jiang-can 06  Ju-hua 06  Shi-jue-ming 06  ";
                    break;
                case "DF2":
                    BZ = "Phlegm-heat";
                    ZF = "Removing heat-phlegm and inducing resuscitation to stop wind";
                    CF = "GV26  TE19  CV12  ST40  HT7  LR3  ";
                    if (X[2] == 1) J1 = "GV24  GV22  ";
                    if (X[1] == 1) J2 = "ST6  LI4  ";
                    if (X[15] == 1) J3 = "ST25  CV6  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Huanglian Jiedu Tang";
                    CM2 = "Huang-qin 06  Huang-lian 06  Huang-bai 06  Zhi-zi 06  Gou-teng 06  Quan-xie 06  ";
                    break
                case "DF3":
                    BZ = "Fright";
                    ZF = "Relieving convulsion and tranquilizing the mind";
                    CF = "GV21  Yintang  HT7  KI1  ";
                    if (X[0] == 1) J1 = "TE19  GV22  ";
                    if (X[13] == 1) J2 = "GV26  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Zhusha Anshen Wan";
                    CM2 = "Zhu-sha 06  Gan-cao 03  Huang-lian 03  Dang-gui 09  Sheng-di-huang 06  ";
                    break
            }
            break;
        case "e105": //遗尿Enuresis
            Y[1] = 3 * X[0] + 2 * X[1] + 3 * X[2] + 4 * X[3] + X[8] + X[9] + X[10];
            Y[2] = 3 * X[0] + 2 * X[1] - X[3] + 3 * X[4] + 2 * X[6] + 3 * X[7] + X[8] + X[9] + X[11];
            if (Y[1] > 6 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Insufficiency of the kidney-yang";
                    ZF = "Warming and recuperating the kidney-yang";
                    CF = "CV4  CV3  BL23  BL28  KI3  ";
                    if (X[5] == 1) J1 = "GV20  HT7  ";
                    if (X[1] == 0) J2 = "LR1  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Tusizi San";
                    CM2 = "Tu-si-zi 09  Rou-cong-rong 06  Fu-zi 03  Wu-wei-zi 03  Mu-li 06  ";
                    break;
                case "DF2":
                    BZ = "Deficiency of lung-qi and spleen-qi";
                    ZF = "Invigorating lung-qi and spleen-qi";
                    CF = "CV6  LU9  ST36  SP6  ";
                    if (X[7] == 1) J1 = "BL20  BL23  ";
                    if (X[1] == 1) J2 = "GV20  BL32  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Buzhong Yiqi Tang & Suoquan Wan";
                    CM2 = "Ren-shen 09  Huang-qi 09  Bai-zhu 06  Shan-yao 09  Zhi-gan-cao 06  Sheng-ma 06  Chai-hu 06  Yi-zhi-ren 06  Wu-yao 06  ";
                    break
            }
            break;
        case "e106": //痄腮Mumps
            Y[1] = 4 * X[0] - X[1] + 2 * X[2] + X[3] + X[4] + X[6] - X[11] - X[12] + X[13] + X[15];
            Y[2] = 2 * X[0] + 5 * X[1] + 2 * X[2] + 2 * X[5] + X[6] + X[7] + X[8] + X[9] + X[11] + 3 * X[12] + X[13] + X[14] + X[16];
            if (Y[1] > 4 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Slight syndrome";
                    ZF = "Dispelling wind and clearing away heat and toxic material";
                    CF = "ST6  TE17  TE5  LI4  ";
                    if (X[5] == 1) J1 = "GV14  LI1  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yin Qiao San";
                    CM2 = "Jin-yin-hua 09  Lian-qiao 06  Dan-dou-chi 06  Niu-bang-zi 06  Jing-jie 06  Jie-geng 06  Gan-cao 03  Dan-zhu-ye 06  Lu-gen 15  ";
                    break;
                case "DF2":
                    BZ = "Severe syndrome";
                    ZF = "Clearing away heat and toxic material, subduing swelling and removing obstruction in the channels";
                    CF = "LI19  TE5  TE1  LI4  LI11  LU11  ST40  ";
                    if (X[5] == 1) J1 = "GV14  Shierjingxue  ";
                    if (X[11] == 1) J2 = "LR3  LR8  ";
                    if (X[12] == 1) J3 = "GV26  ";
                    if (X[6] == 1) J4 = "GB43  GB20  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Puji Xiaodu Yin";
                    CM2 = "Huang-qin 09  Huang-lian 06  Lian-qiao 06  Xuan-shen 06  Ban-lan-gen 09  Ma-bo 06  Niu-bang-zi 06  Jiang-can 06  Sheng-ma 06  Chen-pi 06  Jie-geng 06  Gan-cao 03  Bo-he 03  ";
                    break
            }
            break;
        case "o101": //牙痛Toothache
            Y[1] = 3 * X[0] - X[1] + 2 * X[3] + 4 * X[4] - X[6] + X[8] + X[11];
            Y[2] = 3 * X[0] - X[1] + 3 * X[5] + 4 * X[6] + X[7] + X[9] + X[12];
            Y[3] = -X[0] + 6 * X[1] + 3 * X[2] - X[5] - 2 * X[6] + X[10] + X[13];
            if (Y[1] > 6 && Y[1] > Y[2] && Y[1] > Y[3]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1] && Y[2] > Y[3]) diff = "DF2";
            if (Y[3] > 6 && Y[3] > Y[1] && Y[3] > Y[2]) diff = "DF3";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-fire";
                    ZF = "Dispelling wind and clearing away heat to alleviate pain";
                    CF = "LI4  ST7  ST6  TE5  GB20  ";
                    if (X[3] == 1) J1 = "TE20  SI8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Bohe Lianqiao Fang";
                    CM2 = "Bo-he 06  Niu-bang-zi 09  Jin-yin-hua 09  Lian-qiao 09  Zhu-ye 09  Lu-dou-yi 09  Zhi-mu 09  Sheng-di-huang 12  ";
                    break;
                case "DF2":
                    BZ = "Fire of excess type";
                    ZF = "Purging intense heat and alleviating pain";
                    CF = "LI4  ST7  ST6  ST44  PC8  ";
                    if (X[3] == 1) J1 = "TE20  SI8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Qingwei San";
                    CM2 = "Huang-lian 09  Sheng-di-huang 12  Mu-dan-pi 09  Sheng-ma 09  Dang-gui 12  ";
                    break;
                case "DF3":
                    BZ = "Fire of insufficiency type";
                    ZF = "Nourishing yin to reduce pathogenic fire and alleviating pain";
                    CF = "LI4  ST7  ST6  KI3  LR2  ";
                    if (X[3] == 1) J1 = "TE20  SI8  ";
                    ZJF = "Reinforcement in acupuncture";
                    CM1 = "Modified of Zhi Bai Dihuang Wan";
                    CM2 = "Zhi-mu 09  Huang-bai 09  Shan-zhu-yu 12  Shan-yao 12  Fu-ling 12  Ze-xie 09  Mu-dan-pi 09  Shu-di-huang 12  Gou-ji 09  ";
                    break;
            }
            break;
        case "o102": //心剧痛Acute Precordial Pain
            Y[1] = X[0] + X[1] + X[2];
            if (X[0] + X[1] > 0) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Insufficency of heart-yang,stagnancy of qi and blood stasis";
                    ZF = "Promoting flow of qi, yang and blood circulation to stop pain";
                    CF = "CV17  PC6  BL15  ST36  ";
                    if (X[1] == 1) J1 = "BL17  BL14  ";
                    if (X[2] == 1) J2 = "CV4  CV6  ";
                    ZJF = "Reduction in acupuncture and moxibustion";
                    CM1 = "Guanxin Suhe Wan";
                    CM2 = "Chinese Patent Medicine";
                    break;
            }
            break;
        case "o103": //胆剧痛Acute Cholecystalgia
            Y[1] = X[0] + X[1] + X[2] + X[3];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of qi of the liver and gallbladder";
                    ZF = "Soothing the liver and gallbladder and promoting circulation of qi to stop pain";
                    CF = "GB24  CV12  GB34  ST36  LR3  ST21  ";
                    if (X[2] == 1) J1 = "PC6  ";
                    if (X[3] == 1) J2 = "TE6  TE5  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Dandao Paishi Tang";
                    CM2 = "Jin-qing-cao 30  Yin-chen 12  Yu-jin 09  Zhi-shi 09  Mu-xiang 09  Dai-huang 09  ";
                    break;
            }
            break;
        case "o104": //胃剧痛Acute Epigastralgia
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6] + X[7];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of qi";
                    if (X[4] == 1) BZ = "stagnation of qi and blood stasis";
                    ZF = "Regulation the stomach and qi to alleviate pain";
                    CF = "CV12  ST36  ";
                    if (X[5] == 1) J1 = "CV10  CV11  ";
                    if (X[2] == 1) J2 = "GB34  ";
                    if (X[4] == 1) J3 = "BL17  ";
                    if (X[6] == 1) J4 = "PC6  PC3  BL40  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Yunnan Baiyao with Bleeding Patient";
                    CM2 = "Chinese Patent Medicine";
                    break;
            }
            break;
        case "o105": //腹剧痛Acute Abdominal Pain
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Stagnation of qi and retention of dampness";
                    ZF = "Removing stagnancy and obstruction of fu-organs, promoting circulation of qi to relieve pain";
                    CF = "CV12  ST25  CV6  LI4  ST36  ";
                    if (X[3] == 1) J1 = "LI11  GV14  ";
                    if (X[6] == 1) J2 = "PC6  ";
                    if (X[4] == 1 && X[5] == 1) J3 = "CV8  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Chaihu Shugan San & Xiao Chengqi Tang";
                    CM2 = "Chai-hu 09  Zhi-ke 09  Bai-shao 12  Gan-cao 06  Xiang-fu 09  Chuan-xiong 09  Dai-huang 09  Hou-po 09  Zhi-shi 09  ";
                    break;
            }
            break;
        case "o106": //肾剧痛Renal Colic
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + X[6];
            if (X[0] == 1) diff = "DF1";
            switch (diff) {
                case "DF1":
                    BZ = "Downward flow of damp-heat and urethral stone";
                    ZF = "Supplementing kidney and regulating the flow of qi to alleviate pain";
                    CF = "BL23  KI6  CV3  BL39  SP6  ";
                    if (X[2] == 1) J1 = "KI2  ";
                    if (X[6] == 1) J2 = "SP10  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Modified of Shiwei San";
                    CM2 = "Shi-wei 12  Dong-kui-zi 09  Qu-mai 09  Hua-shi 09  Che-qian-zi 09  Jin-qian-cao 15  Hai-jin-sha 15  Ji-nei-jin 09  ";
                    break;
            }
            break;
        case "o107": //厥证Syncope
            Y[1] = X[0] + 3 * X[1] - 2 * X[2] + 4 * X[3] + 3 * X[6] + X[8] + 3 * X[10] - 2 * X[15] + 2 * X[26] + X[31];
            Y[2] = X[0] - 2 * X[1] + 3 * X[2] + 2 * X[4] + 3 * X[7] + 2 * X[11] + 4 * X[15] + 3 * X[24] + X[28];
            Y[3] = X[0] + 3 * X[1] - 2 * X[2] + 3 * X[3] + 2 * X[10] + 5 * X[13] + 3 * X[25] + X[31];
            Y[4] = X[0] + 6 * X[5] + 3 * X[7] + 2 * X[11] + 2 * X[15] + 3 * X[24] + X[29];
            Y[5] = X[0] + 2 * X[11] - 2 * X[12] + 6 * X[14] - 2 * X[18] - 2 * X[19] + 4 * X[20] + 4 * X[24] + X[31];
            Y[6] = X[0] + X[6] + 3 * X[12] - 2 * X[14] + 2 * X[16] + 2 * X[17] + 3 * X[18] + 2 * X[19] - 2 * X[20] + X[21] + 3 * X[25] + X[32];
            Y[7] = X[0] + 2 * X[1] + 3 * X[3] + 2 * X[6] + 4 * X[8] + 2 * X[9] + 3 * X[27] + X[30];
            if (Y[1] > 7 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5] && Y[1] > Y[6] && Y[1] > Y[7]) diff = "DF1";
            if (Y[2] > 7 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5] && Y[2] > Y[6] && Y[2] > Y[7]) diff = "DF2";
            if (Y[3] > 7 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5] && Y[3] > Y[6] && Y[3] > Y[7]) diff = "DF3";
            if (Y[4] > 7 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5] && Y[4] > Y[6] && Y[4] > Y[7]) diff = "DF4";
            if (Y[5] > 7 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4] && Y[5] > Y[6] && Y[5] > Y[7]) diff = "DF5";
            if (Y[6] > 7 && Y[6] > Y[1] && Y[6] > Y[2] && Y[6] > Y[3] && Y[6] > Y[4] && Y[6] > Y[5] && Y[6] > Y[7]) diff = "DF6";
            if (Y[7] > 7 && Y[7] > Y[1] && Y[7] > Y[2] && Y[7] > Y[3] && Y[7] > Y[4] && Y[7] > Y[5] && Y[7] > Y[6]) diff = "DF7";
            switch (diff) {
                case "DF1":
                    BZ = "Syncope resulting from disorder of qi[Excess syndrome]";
                    ZF = "Inducing resuscitation";
                    CF = "GV26  PC6  LR3  ";
                    if (X[10] == 1) J1 = "ST6  LI4  ";
                    if (X[23] == 1) J2 = "GB43  ";
                    if (X[23] == 1 && X[10] == 0) J2 = "LI4  GB43  ";
                    if (X[8] == 1) J3 = "CV22  ";
                    if (X[16] == 1) J4 = "GV14  LI11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Wumo Yinzi";
                    CM2 = "Wu-yao 12  Chen-xiang 06  Bing-lang 09  Zhi-shi 09  Mu-xiang 09  ";
                    break;
                case "DF2":
                    BZ = "Syncope resulting from disorder of qi[Deficiency syndrome]";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "GV20  CV6  ST36  ";
                    if (X[20] == 1) J1 = "ST25  ";
                    if (X[15] == 1) J2 = "KI7  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Siwei Huiyang Yin";
                    CM2 = "Ren-shen 15  Fu-zi 06  Pao-jiang 09  Gan-cao 06  ";
                    break;
                case "DF3":
                    BZ = "Syncope due to excessive bleeding[Excess syndrome]";
                    ZF = "Inducing resuscitation";
                    CF = "GV26  PC6  LR2  KI1  ";
                    if (X[10] == 1) J1 = "ST6  LI4  ";
                    if (X[23] == 1) J2 = "GB43  ";
                    if (X[23] == 1 && X[10] == 0) J2 = "LI4  GB43  ";
                    if (X[8] == 1) J3 = "CV22  ";
                    if (X[16] == 1) J4 = "GV14  LI11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Tongyi Jiang";
                    CM2 = "Dang-gui-wei 09  Shan-zha 09  Xiang-fu 09  Hong-hua 09  Wu-yao 09  Qing-pi 09  Mu-xiang 06  Ze-xie 09  ";
                    break;
                case "DF4":
                    BZ = "Syncope due to excessive bleeding[Deficiency syndrome]";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "GV20  CV6  CV4  ";
                    if (X[20] == 1) J1 = "ST25  ";
                    if (X[15] == 1) J2 = "KI7  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Renshen Yangying Tang after take Dushen Tang";
                    CM2 = "Ren-shen 15  Gan-cao 09  Dang-gui 12  Bai-shao 12  Shu-di-huang 15  Rou-gui 09  Da-zao 06  Huang-qi 15  Bai-zhu 09  Fu-ling 12  Wu-wei-zi 06  Yuan-zhi 09  Chen-pi 09  Sheng-jiang 03  ";
                    break;
                case "DF5":
                    BZ = "syncope due to cold";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "GV20  CV6  CV8  ";
                    if (X[20] == 1) J1 = "ST25  ";
                    if (X[15] == 1) J2 = "KI7  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Sini Tang";
                    CM2 = "Zhi-gan-cao 30  Gan-jiang 12  Fu-zi 06  ";
                    break;
                case "DF6":
                    BZ = "syncope due to heat";
                    ZF = "Inducing resuscitation";
                    CF = "GV26  PC6  Shierjingxue  ";
                    if (X[10] == 1) J1 = "ST6  LI4  ";
                    if (X[23] == 1) J2 = "GB43  ";
                    if (X[23] == 1 && X[10] == 0) J2 = "LI4  GB43  ";
                    if (X[8] == 1) J3 = "CV22  ";
                    if (X[16] == 1) J4 = "GV14  LI11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Baihu Tang";
                    CM2 = "Zhi-mu 09  Shi-gao 30  Gan-cao 09  Geng-mi 12  ";
                    break;
                case "DF7":
                    BZ = "Phlegm syncope";
                    ZF = "Eliminating phlegm for resuscitation";
                    CF = "GV26  PC6  CV14  ST40  ";
                    if (X[10] == 1) J1 = "ST6  LI4  ";
                    if (X[23] == 1) J2 = "GB43  ";
                    if (X[23] == 1 && X[10] == 0) J2 = "LI4  GB43  ";
                    if (X[8] == 1) J3 = "CV22  ";
                    if (X[16] == 1) J4 = "CV14  LI11  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Daotan Tang";
                    CM2 = "Ban-xia 09  chen-pi 09  Zhi-shi 09  Fu-ling 12  Gan-cao 06  Tian-nan-xing 09  ";
                    break;
            }
            break;
        case "o108": //痉证Convulsion
            Y[1] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + 4 * X[6] - 3 * X[7] + 2 * X[8] + 4 * X[9] + 2 * X[11] + X[14] + X[15];
            Y[2] = X[0] + X[1] + X[2] + X[3] + X[4] + X[5] + 2 * X[6] + 6 * X[7] - 2 * X[9] + 2 * X[10] + 2 * X[12] + X[13] + X[16];
            if (Y[1] > 6 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Damaged yin by high fever";
                    ZF = "Purging intense heat and calming the liver to stop the wind";
                    CF = "GV20  GV16  GV14  LI11  KI1  LR3  Shierjingxue  ";
                    if (X[1] == 1) J1 = "ST6  TE6  ";
                    if (X[3] == 1) J2 = "PC7  LI4  ";
                    if (X[4] == 1) J3 = "GB34  BL57  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Zengye Chengqi Tang";
                    CM2 = "Dai-huang 12  Mang-xiao 09  Xuan-shen 12  Mai-dong 09  Sheng-di-huang 12  ";
                    break;
                case "DF2":
                    BZ = "Invasion of ying and blood system by heat";
                    ZF = "Clearing up the ying and blood system";
                    CF = "PC3  PC8  BL40  LR2  Shixuan  ";
                    if (X[6] == 1) J1 = "GV14  ";
                    if (X[7] == 1) J2 = "GV26  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Lingyang Gouteng Tang";
                    CM2 = "Ling-yang-jiao 30  Sang-ye 09  Chuan-bei-mu 09  Sheng-di 12  Gou-teng 09  Ju-hua 09  Bai-shao 12  Gan-cao 06  Zhu-li 09  Fu-shen 09  ";
                    break;
            }
            break;
        case "o109": //脱证Collapse
            Y[1] = 3 * X[0] + 3 * X[1] - X[2] + 3 * X[3] - X[4] + 3 * X[5] - X[6] + X[7];
            Y[2] = 3 * X[0] - X[1] + 3 * X[2] - X[3] + 3 * X[4] - X[5] + 3 * X[6] + X[8];
            if (Y[1] > 6 && Y[1] > Y[2]) diff = "DF1";
            if (Y[2] > 6 && Y[2] > Y[1]) diff = "DF2";
            switch (diff) {
                case "DF1":
                    BZ = "Yin depletion";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "GV26  GV25  CV8  CV4  KI1  ST36  KI9  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Modified of Shengmai San";
                    CM2 = "Ren-shen 15  Mai-dong 12  Wu-wei-zi 06  Shan-Zhu-yu 12  Huang-jing 09  Long-gu 12  Mu-li 12  ";
                    break;
                case "DF2":
                    BZ = "Yang depletion";
                    ZF = "Recuperating depleted yang and rescuing the patient from collapse";
                    CF = "GV26  GV25  CV8  CV4  KI1  ST36  CV6 ";
                    if (X[8] == 1) J1 = "PC6  ";
                    ZJF = "Reinforcement in acupuncture and moxibustion";
                    CM1 = "Shen Fu Tang";
                    CM2 = "Ren-shen 30  Fu-zi 15  ";
                    break;
            }
            break;
        case "o110": //高热High Fever
            Y[1] = 2 * X[0] + 4 * X[2] - 2 * X[3] + 3 * X[4] + 2 * X[6] + X[8] + 2 * X[10] + 2 * X[11] - 4 * X[15] - 4 * X[19] + 2 * X[22] + 2 * X[24] + X[27];
            Y[2] = 2 * X[0] - X[2] + 3 * X[3] + 2 * X[8] + X[10] + 2 * X[12] - 4 * X[15] + 3 * X[17] + 3 * X[18] - 4 * X[19] + 2 * X[20] + X[23] + X[26] + X[27];
            Y[3] = 2 * X[0] + 2 * X[1] - X[2] + X[9] + 2 * X[12] + 2 * X[14] + 4 * X[15] - 2 * X[16] + 4 * X[19] + 2 * X[21] + X[25] + X[27];
            Y[4] = 2 * X[0] - X[2] + 2 * X[3] + X[8] + 12 * X[13] + X[14] + X[20];
            Y[5] = 2 * X[0] + 4 * X[5] + 2 * X[4] + 2 * X[6] + 4 * X[7] + 2 * X[12] - 4 * X[15] + 4 * X[16] - 4 * X[19] + X[20] + X[27];
            if (Y[1] > 8 && Y[1] > Y[2] && Y[1] > Y[3] && Y[1] > Y[4] && Y[1] > Y[5]) diff = "DF1";
            if (Y[2] > 8 && Y[2] > Y[1] && Y[2] > Y[3] && Y[2] > Y[4] && Y[2] > Y[5]) diff = "DF2";
            if (Y[3] > 8 && Y[3] > Y[1] && Y[3] > Y[2] && Y[3] > Y[4] && Y[3] > Y[5]) diff = "DF3";
            if (Y[4] > 8 && Y[4] > Y[1] && Y[4] > Y[2] && Y[4] > Y[3] && Y[4] > Y[5]) diff = "DF4";
            if (Y[5] > 8 && Y[5] > Y[1] && Y[5] > Y[2] && Y[5] > Y[3] && Y[5] > Y[4]) diff = "DF5";
            switch (diff) {
                case "DF1":
                    BZ = "Wind-heat syndrome";
                    ZF = "Dispelling wind-heat";
                    CF = "GV14  LI11  LI4  LU10  TE5  ";
                    if (X[6] == 1) J1 = "LU11  ";
                    if (X[10] == 1) J2 = "LU7  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Sang Ju Yin";
                    CM2 = "Sang-ye 09  Ju-hua 09  Lian-qiao 09  Bo-he 06  Jie-geng 09  Xin-ren 09  Lu-gen 09  Gan-cao 06  ";
                    break;
                case "DF2":
                    BZ = "Attach of pathogenic warm in qi system";
                    ZF = "Removing heat to eliminating the pathogenic factor";
                    CF = "GV14  LI11  LI1  ST44  TE1  ";
                    if (X[0] == 1) J1 = "Shixuan  ";
                    if (X[10] == 1) J2 = "LU1  LU5  LU11  ";
                    if (X[8] == 1 && X[10] == 0) J3 = "LU5  ";
                    if (X[17] == 1 && X[18] == 1) J4 = "LI4  ST25  ST37  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Ma Xin Shi Gan Tang & Zhizi Chi Tang";
                    CM2 = "Ma-huang 09  Xin-ren 12  Shi-gao 30  Gan-cao 06  Zhi-zi 12  Dan-dou-chi 09  ";
                    break;
                case "DF3":
                    BZ = "Attach of pathogenic warm in blood system";
                    ZF = "Removing pathogenic heat from blood";
                    CF = "PC3  PC9  HT9  BL40  LI11  ";
                    if (X[13] == 1) J1 = "Shixuan  GV26  ";
                    if (X[15] == 1) J2 = "SP10  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Xijiao Dihuang Tang";
                    CM2 = "Xi-jiao 15  Sheng-di 30  Bai-shao 09  Mu-dan-pi 09  ";
                    break;
                case "DF4":
                    BZ = "Attack of pericardium by summer-heat";
                    ZF = "Clearing away the summer-heat";
                    CF = "GV14  LI11 PC3  Shierjingxue  ";
                    if (X[13] == 1) J1 = "GV26  GV20  ";
                    if (X[8] == 1) J2 = "Jinjin  Yuye  ";
                    ZJF = "Reduction in acupuncture";
                    CM1 = "Angong Niuhuang Wan or Zixue Dan";
                    CM2 = "Chinese Patent Medicine";
                    break;
                case "DF5":
                    BZ = "Fumigation and steaming by epidemic pathogenic factor";
                    ZF = "Clearing away heat and toxic material";
                    CF = "LI11  LI4  TE5  BL40  ST43  ";
                    if (X[6] == 1) J1 = "SI17  LU11  ";
                    if (X[12] == 1) J2 = "PC3  ";
                    if (X[16] == 1) J3 = "SP10  ";
                    if (X[16] == 1 && X[12] == 0) J3 = "PC3  SP10  ";
                    ZJF = "Reduction in acupunctore";
                    CM1 = "Ganlu Xiaodu Dan and Zixue Dan";
                    CM2 = "Chinese Patent Medicine";
                    break;
            }
            break;

        default:
            $(popupInfotitle).html("Diagnosis")
            $(popupInfotext).html("<h3 class='ui-title'>抱歉，现在还不能进行施治！</h3><p/>");
            $(popupInfo).find("#popupInfobtn").html("<a href='#' data-role='button' data-rel='back' data-theme='" + sysTheme + "'>OK</a>").trigger("create")
            $(popupInfo).popup("open");
            $(popupInfoFX).hide();
            return;
            break;
    }

    function resAcuArr(v) {
        //var arrt = v.split(" "), d = "";
        //for (var key in arrt) {
        //            for (var k in AcuArr) {
        //                if (AcuArr[k] == arrt[key]) {
        //                    d += "<a data-role='button' data-theme='f' data-mini='true' data-inline='true' onclick='setPointsInfo(\""+ AcuArr[k] + "\")'>" + AcuArr[k] + "</a>"
        //                }
        //            }
        //        }
        for (var k in AcuArr) {
            v = replaceEx(v, AcuArr[k] + " ", "<a data-role='button' data-theme='a' data-mini='true' data-inline='true' onclick='setPointsInfo(\"" + AcuArr[k] + "\")'>" + AcuArr[k] + "</a>")
        }

        return v;
    }

    $(popupInfotitle).html("AcuHerb");
    if (diff != "" && CF != "") {
        var JJ = J1 + J2 + J3 + J4 + J5 + J6 + J7 + J8 + J9;
        CF = CF + JJ;
        CF = resAcuArr(CF);

        text = "<h3 style='text-align:center:'>AcuHerb System</h3><b>Symptom：</b><br>" + SymptomTitle + "<br><b>Diagnosis：</b><br>" + title + "<br><b>Differentiation：</b><br>" + BZ + "<br><b>Treatment：</b><br>" + ZF + "<hr size=1><b>Herbal Formula：</b><br>" + CM1 + "<br>" + CM2 + "<hr size=1><b>Acupuncture and Acupressure：</b><br>" + CF + "<br><b>Manipulation：</b><br>" + ZJF + QT + "<br><br>";
        textFX = "AcuHerb System\nSymptom：" + SymptomTitle + "\nDiagnosis：" + title + "\nDifferentiation：" + BZ + "\nTreatment：" + ZF + "\nHerbal Formula：" + CM1 + "\n" + CM2 + "\nAcupuncture：" + CF + "\nManipulation：" + ZJF + replaceEx(replaceEx(replaceEx(QT, "<b>", ""), "</b>", ""), "<br>", "\n");
        $(popupInfotext).html(text).trigger("create");
        var _w = 50, _h = 50;
        var param = {
            url: location.href,
            type: '1',
            count: '', /**是否显示分享数，1显示(可选)*/
            appkey: '', /**您申请的应用appkey,显示分享来源(可选)*/
            title: textFX, /**分享的文字内容(可选，默认为所在页面的title)*/
            pic: '', /**分享图片的路径(可选)*/
            ralateUid: '', /**关联用户的UID，分享微博会@该用户(可选)*/
            language: 'zh_cn', /**设置语言，zh_cn|zh_tw(可选)*/
            rnd: new Date().valueOf()
        }
        var temp = [];
        for (var p in param) {
            temp.push(p + '=' + encodeURIComponent(param[p] || ''))
        }
        $(popupInfoFX).hide().html('<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="' + _w + '" height="' + _h + '"></iframe>')

    } else if (diff != "") {
        var KK = K1 + K2 + K3 + K4 + K5 + K6 + K7 + K8 + K9;
        CM2 = CM2 + KK;
        $(popupInfotext).html("<h3 style='text-align:center:'>AcuHerb System</h3><b>Symptom：</b><br>" + SymptomTitle + "<br><b>Diagnosis：</b><br>" + title + "<br><b>Differentiation：</b><br>" + BZ + "<br><b>Treatment：</b><br>" + ZF + "<br><b>Herbal Formula：</b><hr size=1>" + CM1 + "<br>" + CM2 + "<br><br>").trigger("create");
    } else {
        $(popupInfotext).html("<h3 class='ui-title'>Not enough to differentiation, Try again!</h3><p/>");
    }
    $(popupInfo).find("#popupInfobtn").html("<a href='#' data-role='button' data-rel='back' data-theme='" + sysTheme + "'>OK</a>").trigger("create")
    $(popupInfo).popup("open");
}

function setPointsInfo(v) {
    $(popupInfo).popup("close");
    setTimeout(function() {

        $(PointsInfoTitle).html(v)
        $(PointsInfoText).html("<img src='Points/" + v + ".png' onclick='$(PointsInfo).popup(\"close\");setTimeout(function() {$(popupInfo).popup(\"open\");}, 200);'>");
        setTimeout(function() {
            $(PointsInfo).popup("open");
        }, 300);
    }, 100);
}

//2013-1-20 页面滑动特效函数，参数：o滑动目标对象，m滑动时长，callback回调函数，s延时，h高度微调
function setanimate(o, m, callback, s, h) {
    s = validInt(s, 0);
    h = validInt(h, 0);
    setTimeout(function() {
        $('html,body').animate({ scrollTop: ($(o).offset().top - $("div[data-role='header']").height() - 10 - h) }, m);
        setTimeout(function() {
            callback();
        }, m);
    }, s);
}
function validInt(i, def) { var n = parseInt(i); if (isNaN(n)) return ((def == undefined) ? 0 : def); return n; }
function replaceEx(s, r, t) { var reg = new RegExp("(" + r + ")", "g"); var str = s.replace(reg, t); return str; }