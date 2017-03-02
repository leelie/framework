Ext.define('MyApp.view.Viewport', {
    id:'Viewport',
    extend: 'Ext.container.Viewport',
    layout: {
        type: 'border'
    },
    loginUserLabel: null,
    getLoginUserLable: function(){
    	if(this.loginUserLabel==null){
    		this.loginUserLabel = Ext.widget({
				xtype: 'label'
			});
    	}
    	return this.loginUserLabel;
    },
    menuStore: null,
    getMenuStore: function(){
    	var me = this;
    	if(me.menuStore==null){
    		me.menuStore = Ext.create('MyApp.store.MenuTreeStore',{
    			root: {
                    expanded: true,
                    children: CurrentUser.getUserMenus()
                }
    		});
    	}
    	return me.menuStore;
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [{
				xtype: 'toolbar',
				region: 'north',
				height: 43,
				items: [{
					xtype: 'label',
					html: '<font size=5 face="微软雅黑" style="margin:0px 20px">基础消息管理平台</font>'
				},'->',{
					xtype: 'label',
					text: '欢迎：'
				},me.getLoginUserLable(),{
					xtype: 'label',
					width: 10
				},{
					xtype: 'button',
					iconAlign: 'right',
					text: '退出',
					textAlign: 'right',
					listeners: {
						click: {
							fn: me.logoutHandler,
							scope: me
						}
					}
				}]
			},{
				region: 'west',
				width: 170,
				title: '菜单列表',
				xtype: 'treepanel',
//                bodyStyle:{
//                    background: '#2B2B2B'
//                },
				collapsible: true,
				syncRowHeight: false,
				store: me.getMenuStore(),
				folderSort: false,
				lines: false,
				rootVisible: false,
				useArrows: true,
				viewConfig: {
					enableTextSelection: false
				},
				listeners: {
					itemclick: {
						fn: me.onTreepanelItemClick,
						scope: me
					}
				}
			},{
				region: 'center',
				xtype: 'tabpanel',
				autoScroll: true,
				defaults: {
				    autoScroll: true
				},
				id: 'centerTabPanel'
			},{
				xtype: 'container',
				region: 'south',
				height: 28
			}]
        });
        me.listeners = {
			'boxready': function(_this,_width,_height,_eOpts){
				_this.getLoginUserLable().setText(CurrentUser.getLoginAccount());
			}
		};
        me.callParent(arguments);
    },
	logoutHandler: function(){
		Ext.MessageBox.confirm('温馨提示', '你确认退出登录吗?',function(btn){
			if(btn=='yes'){
				Ext.data.JsonP.request({
					url: Common.config.LOGOUT_URL,
					success: function(response, opts) {
						window.location = Common.config.getLoginUrl();
					},
					exception: function(response, opts) {
						var result = Ext.decode(response.responseText);
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
			                msg: result.message,
			                title: '温馨提示',
			                icon: Ext.MessageBox.ERROR
			            });
					}
				});
			}
		});
	},
    onTreepanelItemClick: function(dataview, record, item, index, e, eOpts) {
        if(record == null || record.raw == null){
            return;
        }
        var value = record.raw.uri;
        if(value == null){
            return;
        }
        var panel = Ext.getCmp(value) ;
        if(panel == null){
        	panel = Ext.create('MyApp.view.'+value,{
        		tabConfig:{width:150}
        	});
            Ext.getCmp('centerTabPanel').add(panel);
        }
        Ext.getCmp('centerTabPanel').setActiveTab(panel);
        return panel;
    },
    renderTo: Ext.getBody()
});