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
    }]
})
