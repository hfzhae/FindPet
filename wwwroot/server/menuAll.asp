<% 
dim s, strSale
s = request("callback")
%>
<%=s%>({
    phone:'',
    item:[{
        dataid:'find pet',
        icon:'',
        iconimg:'icon_find_Footprint.png',
        title:'<%=escape("寻宠") %>',
        desc:'<%=escape("请如实填写信息，详实的信息对于寻找宠物起着至关重要的作用！") %>',
        item:[]
    },{
        dataid:'Pick up',
        icon:'',
        iconimg:'icon_findmaster.png',
        title:'<%=escape("捡到") %>',
        desc:'<%=escape("感谢你的参与，请如实填写信息，详实的信息对于寻找宠物起着至关重要的作用！") %>',
        item:[]
    }],
    varieties:[
        '<%=escape("贵宾（泰迪）/比熊") %>',
        '<%=escape("金毛") %>',
        '<%=escape("拉布拉多") %>',
        '<%=escape("哈士奇") %>',
        '<%=escape("边境牧羊犬") %>',
        '<%=escape("萨摩耶") %>',
        '<%=escape("柴犬") %>',
        '<%=escape("阿拉斯加雪橇犬") %>',
        '<%=escape("吉娃娃") %>',
        '<%=escape("博美") %>',
        '<%=escape("法国斗牛犬") %>',
        '<%=escape("比格") %>',
        '<%=escape("约克夏") %>',
        '<%=escape("柯基") %>',
        '<%=escape("雪纳瑞") %>',
        '<%=escape("串串") %>',
        '<%=escape("其他") %>'
    ]
})
