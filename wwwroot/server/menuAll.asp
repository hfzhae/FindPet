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
    }],
    varieties:[
        '<%=escape("�����̩�ϣ�/����") %>',
        '<%=escape("��ë") %>',
        '<%=escape("��������") %>',
        '<%=escape("��ʿ��") %>',
        '<%=escape("�߾�����Ȯ") %>',
        '<%=escape("��ĦҮ") %>',
        '<%=escape("��Ȯ") %>',
        '<%=escape("����˹��ѩ��Ȯ") %>',
        '<%=escape("������") %>',
        '<%=escape("����") %>',
        '<%=escape("������ţȮ") %>',
        '<%=escape("�ȸ�") %>',
        '<%=escape("Լ����") %>',
        '<%=escape("�»�") %>',
        '<%=escape("ѩ����") %>',
        '<%=escape("����") %>',
        '<%=escape("����") %>'
    ]
})
