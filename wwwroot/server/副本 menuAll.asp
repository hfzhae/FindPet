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
        title:'<%=escape("Ѱ��") %>',
        desc:'',
        item:[]
    },{
        dataid:'setup',
        icon:'',
        iconimg:'icon_nav_nav.png',
        title:'<%=escape("����") %>',
        desc:'',
        item:[]
    }]
})
