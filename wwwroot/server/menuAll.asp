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
        desc:'<%=escape("����ʵ��д��Ϣ����ʵ����Ϣ����Ѱ�ҳ�������������Ҫ�����ã�") %>',
        item:[]
    },{
        dataid:'Pick up',
        icon:'',
        iconimg:'icon_findmaster.png',
        title:'<%=escape("��") %>',
        desc:'<%=escape("��л��Ĳ��룬����ʵ��д��Ϣ����ʵ����Ϣ����Ѱ�ҳ�������������Ҫ�����ã�") %>',
        item:[]
    }]
})
