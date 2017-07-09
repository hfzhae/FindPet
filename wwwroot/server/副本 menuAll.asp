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
        title:'<%=escape("Ñ°³è") %>',
        desc:'',
        item:[]
    },{
        dataid:'setup',
        icon:'',
        iconimg:'icon_nav_nav.png',
        title:'<%=escape("ÉèÖÃ") %>',
        desc:'',
        item:[]
    }]
})
