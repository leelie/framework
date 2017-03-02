/**
 * 系统通用配置
 */
Ext.define('Common.config', {
	statics: {
		//登录
		LOGIN_URL: 'http://ula.658.com/ula/login',
		getLoginUrl: function(){
			return Common.config.LOGIN_URL +"?returnUrl=" + escape(window.location.href);
		},
		//退出登录
		LOGOUT_URL: 'http://ula.658.com/ula/rs/login/logout'
	}
});

var SystemErrorCode = {
	"Success" : "00",
	"Error" : "01",
	"UserNotLogin" : "11",
	"AccessNotAllow" : "12",
	"UnKnownError" : "X00",
	"AccessItfError" : "X01",
	"TimeOut" : "X02",

	getCode : function(value) {
		for ( var p in SystemErrorCode) {
			if (value == p) {
				return SystemErrorCode[p];
			}
		}
		return value;
	}
};

// ************************************** 处理浏览器兼容性问题
// ************************************* //
/**
 * String对象的split方法在某些版本浏览器下不兼容
 */
var split;
// Avoid running twice; that would break the `nativeSplit` reference
split = split || function(undef) {

	var nativeSplit = String.prototype.split, compliantExecNpcg = /()??/
			.exec("")[1] === undef, // NPCG: nonparticipating capturing group
	self;

	self = function(str, separator, limit) {
		// If `separator` is not a regex, use `nativeSplit`
		if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
			return nativeSplit.call(str, separator, limit);
		}
		var output = [], flags = (separator.ignoreCase ? "i" : "")
				+ (separator.multiline ? "m" : "")
				+ (separator.extended ? "x" : "") + // Proposed for ES6
				(separator.sticky ? "y" : ""), // Firefox 3+
		lastLastIndex = 0,
		// Make `global` and avoid `lastIndex` issues by working with a copy
		separator = new RegExp(separator.source, flags + "g"), separator2, match, lastIndex, lastLength;
		str += ""; // Type-convert
		if (!compliantExecNpcg) {
			// Doesn't need flags gy, but they don't hurt
			separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
		}
		/*
		 * Values for `limit`, per the spec: If undefined: 4294967295 //
		 * Math.pow(2, 32) - 1 If 0, Infinity, or NaN: 0 If positive number:
		 * limit = Math.floor(limit); if (limit > 4294967295) limit -=
		 * 4294967296; If negative number: 4294967296 -
		 * Math.floor(Math.abs(limit)) If other: Type-convert, then use the
		 * above rules
		 */
		limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
				limit >>> 0; // ToUint32(limit)
		while (match = separator.exec(str)) {
			// `separator.lastIndex` is not reliable cross-browser
			lastIndex = match.index + match[0].length;
			if (lastIndex > lastLastIndex) {
				output.push(str.slice(lastLastIndex, match.index));
				// Fix browsers whose `exec` methods don't consistently return
				// `undefined` for
				// nonparticipating capturing groups
				if (!compliantExecNpcg && match.length > 1) {
					match[0].replace(separator2, function() {
								for (var i = 1; i < arguments.length - 2; i++) {
									if (arguments[i] === undef) {
										match[i] = undef;
									}
								}
							});
				}
				if (match.length > 1 && match.index < str.length) {
					Array.prototype.push.apply(output, match.slice(1));
				}
				lastLength = match[0].length;
				lastLastIndex = lastIndex;
				if (output.length >= limit) {
					break;
				}
			}
			if (separator.lastIndex === match.index) {
				separator.lastIndex++; // Avoid an infinite loop
			}
		}
		if (lastLastIndex === str.length) {
			if (lastLength || !separator.test("")) {
				output.push("");
			}
		} else {
			output.push(str.slice(lastLastIndex));
		}
		return output.length > limit ? output.slice(0, limit) : output;
	};

	// For convenience
	String.prototype.split = function(separator, limit) {
		return self(this, separator, limit);
	};

	return self;
}();

/**
 * String对象的trim方法在某些版本浏览器下不兼容
 */
if (typeof String.prototype.trim !== "function") {
	String.prototype.trim = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	}
}
/**
 * Array对象的indexOf方法在某些版本浏览器下不兼容
 */
if (typeof Array.prototype.indexOf !== "function") {
	Array.prototype.indexOf = function(obj) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	}
}

// **************************************** Override
// **************************************** //
/**
 * 设置EXTJS请求超时时间为300秒
 */
Ext.Ajax.timeout = 300000;// 300秒

/**
 * 设置系统中window位置默认限制在它的父元素内
 */
Ext.override(Ext.window.Window, {
			constrain : true
		});

/**
 *
 */
Ext.override(Ext.data.Model, {
    isEqual: function(a, b) {
        // instanceof is ~10 times faster then Ext.isDate. Values here will not be cross-document objects
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() === b.getTime();
        }
        var className = Ext.getClassName(this);
        if(!Ext.isEmpty(className)&& className==='MyApp.model.DataDictionaryModel'){
            return a == b;
        }
        return a === b;
    }
});

/**
 * 设置系统中rownumberer的宽度为50
 */
Ext.override(Ext.grid.RowNumberer, {
			width : 50
		});

/**
 * 设置系统中表格内的内容都可选择
 */
Ext.override(Ext.view.Table, {
			enableTextSelection : true
		});

/**
 * 修改fieldcontainer及其子类的beforeLabelTextTpl，并增加allowBlank属性，用以显示必填符号
 */
Ext.override(Ext.form.FieldContainer, {
			allowBlank : true,
			beforeLabelTextTpl : new Ext.XTemplate('<tpl if="!allowBlank">',
					'<font color="red">*</font>', '</tpl>',
					'<tpl if="allowBlank">', '&nbsp;&nbsp;', '</tpl>')
		});

/**
 * 修改fieldcontainer及其子类的beforeLabelTextTpl，并增加allowBlank属性，用以显示必填符号
 */
Ext.override(Ext.form.field.File, {
			allowBlank : true,
			beforeLabelTextTpl : new Ext.XTemplate('<tpl if="!allowBlank">',
					'<font color="red">*</font>', '</tpl>',
					'<tpl if="allowBlank">', '&nbsp;&nbsp;', '</tpl>')
		});

/**
 * 修复grid中设置loadMask无法正常显示的bug
 */
Ext.override(Ext.view.AbstractView, {
			onRender : function() {
				var me = this;
				me.callParent();
				if (me.mask && Ext.isObject(me.store)) {
					me.setMaskBind(me.store);
				}
			}
		});

/**
 * 修改textfield，使之值为空格时进行空值错误提醒
 */
Ext.override(Ext.form.field.Text, {
	getErrors : function(value) {
		var me = this, errors = [], validator = me.validator, emptyText = me.emptyText, allowBlank = me.allowBlank, vtype = me.vtype, vtypes = Ext.form.field.VTypes, regex = me.regex, format = Ext.String.format, msg;
		value = value || me.processRawValue(me.getRawValue());
		if (Ext.isFunction(validator)) {
			msg = validator.call(me, value);
			if (msg !== true) {
				errors.push(msg);
			}
		}
		// ******************** Start ******************** //
		var trimValue = value.toString().trim();
		if (trimValue.length < 1 || trimValue === emptyText) {
			if (!allowBlank) {
				errors.push(me.blankText);
			}
			return errors;
		}
		// ********************* End ********************* //
		if (value.length < me.minLength) {
			errors.push(format(me.minLengthText, me.minLength));
		}
		if (value.length > me.maxLength) {
			errors.push(format(me.maxLengthText, me.maxLength));
		}
		if (vtype) {
			if (!vtypes[vtype](value, me)) {
				errors.push(me.vtypeText || vtypes[vtype + 'Text']);
			}
		}
		if (regex && !regex.test(value)) {
			errors.push(me.regexText || me.invalidText);
		}
		return errors;
	}
});

/**
 * 修改Trigger及其子类使用setReadOnly时的样式，并解决设某些情况下，trigger没有隐藏显示的问题
 */
Ext.override(Ext.form.field.Trigger, {
	setReadOnly : function(readOnly) {
		var me = this, hideTrigger = me.hideTrigger, inputEl = me.inputEl;
		readOnly = !!readOnly;
		if (readOnly == me.readOnly) {
			return;
		}
		me[readOnly ? 'addCls' : 'removeCls'](me.readOnlyCls);
		// ******************** Start ******************** //
		// 解决组件默认非只读状态，在调用setReadOnly方法设置只读时，trigger没有隐藏显示的问题
		if (!hideTrigger && me.triggerEl && me.triggerEl.elements) {
			var len = me.triggerEl.elements.length, i, el, parentEl;
			if (readOnly) {
				for (i = 0; i < len; i++) {
					el = me.triggerEl.elements[i];
					parentEl = el.dom.parentElement;
					parentEl.style.display = "none";
					el.dom.style.display = "none";
				}
			} else {
				for (i = 0; i < len; i++) {
					el = me.triggerEl.elements[i];
					parentEl = el.dom.parentElement;
					parentEl.style.display = "block";
					el.dom.style.display = "block";
				}
			}
		}
		// ********************* End ********************* //
		if (inputEl) {
			inputEl.dom.readOnly = readOnly;
			if (readOnly) {
				inputEl.dom.style.cursor = 'default';
				if (Ext.fly(inputEl.id + '-prefix')
						&& Ext.fly(inputEl.id + '-prefix').dom) {
					Ext.fly(inputEl.id + '-prefix').dom.innerHTML = '&nbsp;&nbsp;';
				}
				if (Ext.fly(me.id + '-errorEl')
						&& Ext.fly(me.id + '-errorEl').dom) {
					Ext.fly(me.id + '-errorEl').dom.style.visibility = 'hidden';
				}
			} else {
				inputEl.dom.style.cursor = 'text';
				if (!me.allowBlank && Ext.fly(inputEl.id + '-prefix')
						&& Ext.fly(inputEl.id + '-prefix').dom) {
					Ext.fly(inputEl.id + '-prefix').dom.innerHTML = '*';
				}
				if (Ext.fly(me.id + '-errorEl')
						&& Ext.fly(me.id + '-errorEl').dom) {
					Ext.fly(me.id + '-errorEl').dom.style.visibility = 'visible';
				}
			}
		} else if (me.rendering) {
			me.setReadOnlyOnBoxReady = true;
		}
		if (readOnly != me.readOnly) {
			me.readOnly = readOnly;
			me.updateLayout();
		}
	}
});

/**
 * 修改Ext.form.field.Base及其子类的必填样式、只读样式；增加提示功能(通过配置tipConfig)
 */
Ext.override(Ext.form.field.Base, {
	msgTarget : 'side',
	tipConfig : '',
	labelableRenderProps : 'readOnly,allowBlank,labelAlign,fieldBodyCls,baseBodyCls,clearCls,labelSeparator,msgTarget',
	beforeLabelTextTpl : new Ext.XTemplate(
			'<tpl if="!allowBlank">',
			'<tpl if="!readOnly">',
			'<label id="{inputId}-prefix" style="color:red">*</label>',
			'</tpl>',
			'<tpl if="readOnly">',
			'<label id="{inputId}-prefix" style="color:red">&nbsp;&nbsp;</label>',
			'</tpl>',
			'</tpl>',
			'<tpl if="allowBlank">',
			'<label id="{inputId}-prefix" style="color:red">&nbsp;&nbsp;</label>',
			'</tpl>'),
	setReadOnly : function(readOnly) {
		var me = this, inputEl = me.inputEl;
		readOnly = !!readOnly;
		me[readOnly ? 'addCls' : 'removeCls'](me.readOnlyCls);
		me.readOnly = readOnly;
		if (inputEl) {
			inputEl.dom.readOnly = readOnly;
			if (me.readOnly) {
				Ext.fly(inputEl.id + '-prefix').dom.innerHTML = '&nbsp;&nbsp;';
				if (Ext.fly(me.id + '-errorEl')) {
					Ext.fly(me.id + '-errorEl').dom.style.visibility = 'hidden';
				}
			} else {
				if (!me.allowBlank) {
					Ext.fly(inputEl.id + '-prefix').dom.innerHTML = '*';
				}
				Ext.fly(me.id + '-errorEl').dom.style.visibility = 'visible';
			}
		} else if (me.rendering) {
			me.setReadOnlyOnBoxReady = true;
		}
		me.fireEvent('writeablechange', me, readOnly);
	}
});

Ext.override(Ext.selection.RowModel, {
			onRowClick : function(view, record, item, index, e) {
				if (item.parentElement.id.search(view.id) < 0) {
					this.mousedownAction = true;
					return;
				}
				if (this.mousedownAction) {
					this.mousedownAction = false;
				} else {
					this.processSelection(view, record, item, index, e);
				}
			},
			onRowMouseDown : function(view, record, item, index, e) {
				var me = this;

				if (item.parentElement.id.search(view.id) < 0) {
					this.mousedownAction = true;
					return;
				}
				// Record index will be -1 if the clicked record is a metadata
				// record and not selectable
				if (index !== -1) {
					if (!me.allowRightMouseSelection(e)) {
						return;
					}
					if (!me.isSelected(record)) {
						me.mousedownAction = true;
						me.processSelection(view, record, item, index, e);
					} else {
						me.mousedownAction = false;
					}
				}
			}
		});

Ext.define('Error.errorMessage.Window', {
	extend : 'Ext.window.Window',
	title : "服务器异常",
	eTitle : "未知异常",
	eDetailTitle : "异常详细信息",
	resizable : false,
	modal : true,
	width : 550,
	defaults : {
		anchor : '100%',
		padding : '5 5 5 5'
	},
	message : null,
	buttons : [{
		text : '确定',
		handler : function(button, even) {
			button.up('window').destroy();
		}
	}],
	constructor : function(config) {
		var me = this, cfg = Ext.apply({}, config);
		me.message = config.message;
		me.stackTrace = config.stackTrace;
		me.items = [{
					title : me.eTitle,
					html : me.message
				}, {
					title : me.eDetailTitle,
					collapsible : true,
					collapsed : true,
					items : [{
								autoScroll : true,
								height : 200,
								html : me.stackTrace
							}]
				}];
		me.callParent([cfg]);
	}
});
Ext.define('Error.errorMessage.Box', {
			statics : {
				title : "系统提示",
				msg : "连接异常,稍后重试。",
				timedout : "连接超时,稍后重试。",
				goLoginMsg : "会话失效，请重新登录！",
				showGoLoginWin : function() {
					if(Ext.getDom()==null){
						window.location = Common.config.getLoginUrl();
					}
					Ext.MessageBox.show({
						title : Error.errorMessage.Box.title,
						msg : Error.errorMessage.Box.goLoginMsg,
						buttons : Ext.MessageBox.OK,
						fn : function(btn) {
							window.location = Common.config.getLoginUrl();
						},
						icon : Ext.MessageBox.WARNING
					});
				}
			}
		});

/**
 * 重写EXTJS 4.1中的conection类中onComplete方法，使架构异常得到解决
 * 重写onUploadComplete解决文件上传时候可以以JSON返回结果 增加onJsonResponse方法，进行JSON返回结果的处理
 */
Ext.override(Ext.data.Connection, {
	timeout : 300000,
	onJsonResponse : function(contentType, response, options) {
		var json = Ext.decode(response.responseText);
		if (contentType.indexOf('application/json') != -1) {
			if (json) {
				// 业务执行成功
				if (json.success && !json.isException) {
					Ext.callback(options.success, options.scope, [response,
									options]);
					// 业务异常
				} else if (!json.success && !json.isException) {
					Ext.callback(options.exception, options.scope, [response,
									options]);
					// 未知异常
				} else if (!json.success && json.isException) {
					if (SystemErrorCode.UserNotLogin == json.responseStatus.code) {
						Error.errorMessage.Box.showGoLoginWin();
						return;
					}else if (json.responseStatus.code == SystemErrorCode.AccessNotAllow) {
						Ext.ux.Toast.msg('温馨提示', json.responseStatus.message, 'error');
					} else {
						var ErrorMessageWindow = Ext.create(
								'Error.errorMessage.Window', {
									message : json.responseStatus.message,
									stackTrace : json.stackTrace
								});
						ErrorMessageWindow.show();
					}
					Ext.callback(options.unknownException, options.scope, [
									response, options]);
				}
			}
		} else {
			if (response.responseText != null) {
				if (response.responseText.indexOf('<meta content="LOGIN_JSP">') > 0) {
					Error.errorMessage.Box.showGoLoginWin();
					return;
				}
			}
			Ext.callback(options.success, options.scope, [response, options]);
		}
	},
	onUploadComplete : function(frame, options) {
		var me = this, response = {
			responseText : '',
			responseXML : null
		}, contentType, doc, firstChild;
		try {
			doc = frame.contentWindow.document || frame.contentDocument
					|| window.frames[frame.id].document;
			if (doc) {
				if (doc.body) {
					// 更新textarea为pre
					if (/pre/i
							.test((firstChild = doc.body.firstChild || {}).tagName)) { // json
																						// response
																						// wrapped
																						// in
																						// pre
						response.responseText = firstChild.innerHTML;
						contentType = 'application/json;charset=utf-8';
					} else {
						response.responseText = doc.body.innerHTML;
						contentType = 'text/html'
					}
				}
				response.responseXML = doc.XMLDocument || doc;
			}
		} catch (e) {
		}
		me.fireEvent('requestcomplete', me, response, options);
		me.onJsonResponse(contentType, response, options);
		Ext.callback(options.callback, options.scope, [options, true,
								response]);
		setTimeout(function() {
					Ext.removeNode(frame);
				}, 100);
	},
	onComplete : function(request) {
		var me = this, options = request.options, result, success, response;
		try {
			result = me.parseStatus(request.xhr.status);
		} catch (e) {
			result = {
				success : false,
				isException : false
			};
		}
		success = result.success;
		if (success) {
			response = me.createResponse(request);
			me.fireEvent('requestcomplete', me, response, options);
			// ******************** Start ******************** //
			me.onJsonResponse(response.getResponseHeader('Content-Type'),
					response, options);
			// ********************* End ********************* //
		} else {
			if (result.isException || request.aborted || request.timedout) {
				response = me.createException(request);
			} else {
				response = me.createResponse(request);
			}
			me.fireEvent('requestexception', me, response, options);
			Ext.callback(options.failure, options.scope, [response, options]);
			//如果不是自动取消的请求，也不是超时的请求，要报服务端异常的提示
			if(!request.aborted && !request.timedout){
				// ******************** Start ******************** //
				// 服务端异常提示
				Ext.MessageBox.show({
					title : Error.errorMessage.Box.title,
					msg : Error.errorMessage.Box.msg,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
				// ********************* End ********************* //				
			}
			if(request.timedout){
				// ******************** Start ******************** //
				// 服务端异常提示
				Ext.MessageBox.show({
					title : Error.errorMessage.Box.title,
					msg : Error.errorMessage.Box.timedout,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
				// ********************* End ********************* //				
			}
		}
		Ext.callback(options.callback, options.scope, [options, success,
						response]);
		delete me.requests[request.id];
		return response;
	}
});

/**
 * 重写EXTJS 4.1中的Action类中createCallback方法，使form submit提交的时候，如果出现架构异常，可以在页面上得到解决
 */
Ext.override(Ext.form.action.Action, {
	createCallback : function() {
		var me = this, undef, form = me.form;
		return {
			success : me.onSuccess,
			failure : me.onFailure,
			exception : me.onSuccess,
			unknownException : me.onSuccess,
			scope : me,
			timeout : (this.timeout * 1000) || (form.timeout * 1000)
					|| 300000,
			upload : form.fileUpload ? me.onSuccess : undef
		};
	}
});
/**
 * 重写EXTJS 4.1中的Basic类中afterAction方法，使form submit提交的时候，如果出现架构异常，可以在页面上得到解决
 */
Ext.override(Ext.form.Basic, {
	afterAction : function(action, success) {
		var json = {};
		if (action.waitMsg) {
			var MessageBox = Ext.MessageBox, waitMsgTarget = this.waitMsgTarget;
			if (waitMsgTarget === true) {
				this.owner.el.unmask();
			} else if (waitMsgTarget) {
				waitMsgTarget.unmask();
			} else {
				MessageBox.updateProgress(1);
				MessageBox.hide();
			}
		}
		if (success) {
			if (action.reset) {
				this.reset();
			}
			if (!Ext.isEmpty(action) && !Ext.isEmpty(action.response)
					&& !Ext.isEmpty(action.response.responseText)) {
				json = Ext.decode(action.response.responseText);
			}
			Ext.callback(action.success, action.scope || action, [this, action,
							json]);
			this.fireEvent('actioncomplete', this, action);
		} else {
			if (!Ext.isEmpty(action) && !Ext.isEmpty(action.response)
					&& !Ext.isEmpty(action.response.responseText)) {
				json = Ext.decode(action.response.responseText);
				// 业务异常
				if (!json.isException) {
					Ext.callback(action.exception, action.scope || action, [
									this, action, json]);
					// 未知异常
				} else if (json.isException) {
					Ext.callback(action.unknownException, action.scope
									|| action, [this, action, json]);
				}
			} else {
				Ext.callback(action.failure, action.scope || action, [this,
								action]);
			}
			this.fireEvent('actionfailed', this, action);
		}
	}
});
/**
 * 解决表格头点击之后，没有获得焦点的问题
 */
Ext.override(Ext.grid.header.Container, {
	onHeaderClick : function(header, e, t) {
		header.focus();
		header.fireEvent('headerclick', this, header, e, t);
		this.fireEvent("headerclick", this, header, e, t);
	}
});

/*******************************************************************************
 * 公共方法
 */
/** ******************************************************************* */
/**
 * 修改date对象的编码方法，使之返回date的时间戳
 */
Ext.JSON.encodeDate = function(date) {
	var dateTime = date.getTime();
	return dateTime;
};

Ext.define('CommonFunction', {
	singleton : true,
	/**
	 * 表格显示是否启用
	 */
	rendererEnable : function(value) {
		/**
		 * 是否是否已经身份证认证过，是否已经手机认证，是否已经绑定过银行卡
		 */
		if (value === false || value === 1) {
			return '<input type="checkbox" Checked onclick="return false" />';
		} else {
			return '<input type="checkbox" unChecked onclick="return false" />';
		}
	}
});
/*******************************************************************************
 * 组件
 ******************************************************************************/
Ext.apply(Ext.form.VTypes, {
	image : function(val, field) {
		var fileName = /^.*\.(jpg|gif|bmp|png)$/i;
		return fileName.test(val);
	},
	imageText : '上传的图片文件必须是.(jpg|gif|bmp|png)结尾',
	excel : function(val, field) {
		var fileName = /^.*\.(xlsx|xls)$/i;
		return fileName.test(val);
	},
	excelText : '上传的excel文件必须是.(xlsx|xls)结尾',
	cardid: function(val, field){
		var cardIdTest = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
		return cardIdTest.test(val);
	},
	cardidText : '输入的身份证格式不正确'
});

/**
 * 悬浮提示
 */
Ext.ux.Toast = function() {
	var msgCt;

	function createBox(t, s) {
		return [
				'<div class="msg">',
				'<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
				'<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>',
				t,
				'</h3>',
				s,
				'</div></div></div>',
				'<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
				'</div>'].join('');
	}

	return {
		msg : function(title, content, delay) {
			if (!msgCt) {
				msgCt = Ext.DomHelper.insertFirst(document.body, {
							id : 'msg-div'
						}, true);
			}
			if (Ext.isEmpty(delay))
				delay = 5000;
			var m = Ext.DomHelper.append(msgCt, {
						html : createBox(title, content)
					}, true);
			m.hide();
			m.slideIn('t').ghost('t', {
						delay : delay,
						remove : true
					});
		}
	}

}();

Ext.define('Hn658.form.MonthField', {
	extend : 'Ext.form.field.Picker',
	alias : 'widget.monthfield',

	format : "Y-m",

	altFormats : "m/y|m/Y|m-y|m-Y|my|mY|y/m|Y/m|y-m|Y-m|ym|Ym",

	triggerCls : Ext.baseCSSPrefix + 'form-date-trigger',

	matchFieldWidth : false,

	startDay : new Date(),

	initComponent : function() {
		var me = this;

		me.disabledDatesRE = null;

		me.callParent();
	},

	initValue : function() {
		var me = this, value = me.value;

		if (Ext.isString(value)) {
			me.value = Ext.Date.parse(value, this.format);
		}
		if (me.value)
			me.startDay = me.value;
		me.callParent();
	},

	rawToValue : function(rawValue) {
		return Ext.Date.parse(rawValue, this.format) || rawValue || null;
	},

	valueToRaw : function(value) {
		return this.formatDate(value);
	},

	formatDate : function(date) {
		return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
	},
	createPicker : function() {
		var me = this, format = Ext.String.format;

		return Ext.create('Ext.picker.Month', {
					cls : 'c-monthpicker',
					pickerField : me,
					ownerCt : me.ownerCt,
					renderTo : document.body,
					floating : true,
					shadow : false,
					focusOnShow : true,
					listeners : {
						scope : me,
						cancelclick : me.onCancelClick,
						okclick : me.onOkClick,
						yeardblclick : me.onOkClick,
						monthdblclick : me.onOkClick
					}
				});
	},

	onExpand : function() {
		// this.picker.show();
		this.picker.setValue(this.startDay);
		//

	},

	onOkClick : function(picker, value) {
		var me = this, month = value[0], year = value[1], date = new Date(year,
				month, 1);
		me.startDay = date;
		me.setValue(date);
		this.picker.hide();
		// this.blur();
	},

	onCancelClick : function() {
		this.picker.hide();
		// this.blur();
	}

});

Ext.define('Hn658.form.field.DateField', {
	extend : 'Ext.form.field.Date',
	alias : 'widget.hn658datefield',
	otherFieldName : '',
	onTriggerClick : function() {
		var me = this, value = me.up().getComponent(me.otherFieldName)
				.getValue();
		if (value == null) {
			me.setMaxValue(null);
			me.setMinValue(null);
		}
		me.callParent();
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});
Ext.define('Hn658.form.field.timefield', {
	extend : 'Ext.form.field.Time',
	alias : 'widget.hn658timefield',
	otherFieldName : '',
	onTriggerClick : function() {
		var me = this, value = me.up().getComponent(me.otherFieldName)
				.getValue();
		if (value == null) {
			me.setMaxValue("23:59:59");
			me.setMinValue("00:00:00");
		}
		me.callParent();
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});
Ext.define('Hn658.form.field.RangeTimeField', {
	extend : 'Ext.form.FieldContainer',
	alias : ['widget.rangeTimeField', 'widget.rangeTimeField'],
	alternateClassName : ['Hn658.form.RangeTimeField'],
	dateType : 'hn658timefield',
	fromName : '',
	toName : '',
	fromValue : '',
	toValue : '',
	increment : 30,
	minValue : '00:00:00',
	maxValue : '23:59:59',
	format : 'H:i:s',
	fieldId : '',
	allowFromBlank : false,
	allowToBlank : false,
	disallowBlank : false,
	fromEditable : true,
	toEditable : true,
	editable : true,
	rangeFlag : '&nbsp;&nbsp;至&nbsp;&nbsp;',
	/**
	 * @private 组件初始化方法。
	 */
	initComponent : function() {
		var me = this;
		me.layout = 'column';
		me.initContainer();
		me.callParent(arguments);
	},
	initContainer : function() {
		var me = this, fristField, toField, secondField, firstDateConfig, secondDateConfig, hasDateRange;
		if (me.disallowBlank) {
			me.allowFromBlank = false;
			me.allowToBlank = false;
		}
		if (!me.editable) {
			me.fromEditable = false;
			me.toEditable = false;
		}
		fristField = {
			itemId : 'firstTime',
			xtype : "hn658timefield",
			name : me.fromName,
			allowBlank : me.allowFromBlank,
			editable : me.fromEditable,
			columnWidth : .5,
			otherFieldName : 'secondTime'
		};
		toField = {
			xtype : 'label',
			html : me.rangeFlag,
			style : {
				textAlign : 'center',
				marginTop : '5px'
			}
		};
		secondField = {
			itemId : 'secondTime',
			xtype : "hn658timefield",
			name : me.toName,
			allowBlank : me.allowToBlank,
			editable : me.toEditable,
			columnWidth : .5,
			maxValue : me.maxValue,
			otherFieldName : 'firstTime'
		};
		me.format = me.format || 'H:i:s';
		Ext.apply(fristField, {
			format : me.format,
			minValue : me.minValue,
			maxValue : me.maxValue,
			value : me.fromValue,
			increment : me.increment,
			listeners : {
				select : {
					fn : function(field, value) {
						field.up().child('#secondTime')
								.setMinValue(value);
						field.up().child('#secondTime')
								.setMaxValue(me.maxValue);
					}
				},
				scope : me
			}
		});
		Ext.apply(secondField, {
			format : me.format,
			value : me.toValue,
			increment : me.increment,
			minValue : me.minValue,
			maxValue : me.maxValue,
			listeners : {
				select : {
					fn : function(field, value) {
						field.up().child('#firstTime').setMaxValue(value);
						field.up().child('#firstTime').setMinValue(me.minValue);
					}
				}
			}
		});
		me.items = [fristField, toField, secondField];
	}

});

Ext.define('Hn658.form.field.RangeDateField', {
	extend : 'Ext.form.FieldContainer',
	alias : ['widget.rangeDateField', 'widget.rangedatefield'],
	alternateClassName : ['Hn658.form.RangeDateField'],
	/**
	 * @cfg {String} dateType 区间段组件的子组件的类型，默认为Extjs框架原生DateField组件。
	 */
	dateType : 'hn658datefield',
	/**
	 * @cfg {String} fromName 起始日期组件name属性。
	 */
	fromName : '',
	/**
	 * @cfg {String} toName 终止日期组件name属性。
	 */
	toName : '',
	/**
	 * @cfg {String} fromValue 起始日期组件初始值。
	 */
	fromValue : '',
	/**
	 * @cfg {String} toValue 终止日期组件初始值。
	 */
	toValue : '',
	/**
	 * @cfg {Number} dateRange 起始日期和终止日期的间隔。单位：天。
	 */
	dateRange : 0,
	/**
	 * @cfg {Boolean} time 是否提供时间选择功能。
	 */
	time : true,
	/**
	 * @cfg {Number} increment 区间段类型为TimeField时，时间的增量，以分为单位。
	 */
	increment : 30,
	/**
	 * @cfg {String} fieldId 当区间段类型为my97datetimefield组件时，需配置此属性。
	 * 
	 * 此属性为my97datetimefield组件渲染的Dom ID属性，建议配置成复杂的字符串。
	 */
	fieldId : '',
	/**
	 * @cfg {Boolean} allowFromBlank 起始日期组件非空标识。true不显示非空标识，false显示非空标识。
	 *      系统中，非空标识为组件前端的红色*号。
	 */
	allowFromBlank : true,
	/**
	 * @cfg {Boolean} allowToBlank 终止日期组件非空标识。true不显示非空标识，false显示非空标识。
	 *      系统中，非空标识为组件前端的红色*号。
	 */
	allowToBlank : true,
	/**
	 * @cfg {Boolean} disallowBlank 是否允许值为空，默认允许为空。
	 */
	disallowBlank : false,
	/**
	 * @cfg {Boolean} fromEditable 起始日期组件是否允许编辑，默认允许编辑。
	 */
	fromEditable : true,
	/**
	 * @cfg {Boolean} toEditable 终止日期组件是否允许编辑，默认允许编辑。
	 */
	toEditable : true,
	/**
	 * @cfg {Boolean} editable 是否允许编辑，默认允许编辑。
	 *      此属性使起始日期组件和终止日期组件都为可编辑的。可以被单独的可编辑配置fromEditable和toEditable覆盖。
	 */
	editable : true,
	/**
	 * @cfg {String} rangeFlag 起始日期组件和终止日期组件间隔Text。
	 */
	rangeFlag : '&nbsp;&nbsp;至&nbsp;&nbsp;',
	/**
	 * @private 组件初始化方法。
	 */
	initComponent : function() {
		var me = this;
		me.layout = 'column';
		me.initContainer();
		me.callParent(arguments);
	},
	/**
	 * @private 初始化区间容器。
	 */
	initContainer : function() {
		var me = this, fristField, toField, secondField, firstDateConfig, secondDateConfig, hasDateRange;
		if (me.disallowBlank) {
			me.allowFromBlank = false;
			me.allowToBlank = false;
		}
		if (!me.editable) {
			me.fromEditable = false;
			me.toEditable = false;
		}
		fristField = {
			itemId : 'first',
			xtype : "hn658datefield",
			name : me.fromName,
			allowBlank : me.allowFromBlank,
			editable : me.fromEditable,
			columnWidth : .5,
			otherFieldName : 'second'
		};
		toField = {
			xtype : 'label',
			html : me.rangeFlag,
			style : {
				textAlign : 'center',
				marginTop : '5px'
			}
		};
		secondField = {
			itemId : 'second',
			xtype : "hn658datefield",
			name : me.toName,
			allowBlank : me.allowToBlank,
			editable : me.toEditable,
			columnWidth : .5,
			otherFieldName : 'first'
		};
		hasDateRange = typeof(me.dateRange) == 'number' && me.dateRange != 0;
		me.format = me.format || 'Y-m-d';
		Ext.apply(fristField, {
					format : me.format,
					value : me.fromValue,
					listeners : {
						select : {
							fn : function(field, value) {
								field.up().child('#second').setMinValue(value);
								if (hasDateRange) {
									var maxValue = Ext.Date.add(value,
											Ext.Date.DAY, me.dateRange);
									field.up().child('#second')
											.setMaxValue(maxValue);
								}
							}
						},
						scope : me
					}
				});
		Ext.apply(secondField, {
					format : me.format,
					value : me.toValue,
					listeners : {
						select : {
							fn : function(field, value) {
								field.up().child('#first').setMaxValue(value);
								if (hasDateRange) {
									var minValue = Ext.Date.add(value,
											Ext.Date.DAY, me.dateRange);
									field.up().child('#first')
											.setMaxValue(minValue);
								}
							}
						}
					}
				});
		me.items = [fristField, toField, secondField];
	}
});

Ext.define('Hn658.grid.column.LineBreak', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.linebreakcolumn',
	alternateClassName : ['Hn658.grid.LineBreakColumn'],
	initComponent : function() {
		var me = this, customerRenderer = me.renderer;
		if (customerRenderer) {
			me.renderer = function(value, metadata, record, rowIndex,
					columnIndex, store) {
				value = customerRenderer(value, metadata, record, rowIndex,
						columnIndex, store);
				value = me.defaultRenderer(value, metadata, record, rowIndex,
						columnIndex, store);
				return value;
			};
		}
		me.callParent(arguments);
	},
	defaultRenderer : function(value, metadata, record, rowIndex, columnIndex,
			store) {
		// 增加word-break: break-all; CSS实现单词也实现换行
		metadata.style = 'white-space: normal; overflow: visible; word-break: break-all;';
		return value;
	}
});

Ext.define('Hn658.grid.column.Ellipsis', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.ellipsiscolumn',
	initComponent : function() {
		var me = this, customerRenderer = me.renderer;
		if (customerRenderer) {
			me.renderer = function(value, metadata, record, rowIndex,
					columnIndex, store) {
				value = customerRenderer(value, metadata, record,
						rowIndex, columnIndex, store);
				value = me.defaultRenderer(value, metadata, record,
						rowIndex, columnIndex, store);
				return value;
			};
		}
		me.callParent(arguments);
	},

	defaultRenderer : function(value, metadata, record, rowIndex,
			columnIndex, store) {
		var me = this, metaValue = record.get(me.dataIndex);
		metadata.tdAttr = 'data-qtip="' + value + '"';
		return value;
	}
});

Ext.define('Hn658.grid.column.TipColumn', {
	extend : 'Ext.grid.column.Column',
	alias : ['widget.tipcolumn'],

	/**
	 * @cfg {String} tipBodyElement 设置Tip的Body中显示的组件类名
	 *      为了实现tip内组件数据的动态绑定，在Grid的信息预览的数据时，一般由某一行的record对象，在执行binData方法的时候，有以下参数可以使用(和grid的Column的renderer属性的参数相同)</br>
	 *      a) record 当前行的record对象</br> b) value 当前单元格的值</br> c) metadata
	 *      当前单元格的元数据</br> d) store 当前grid的store对象</br> e) view 当前view
	 */
	tipBodyElement : null,

	/**
	 * @cfg {Ext.tip.Tooltip} tipConfig Tip的具体配置: trackMouse: 是否随着鼠标移动
	 *      hideDelay: Tip的隐藏延迟时间(单位:ms)
	 */
	tipConfig : null,

	/**
	 * @private
	 * @cfg tipBody tip内显示的对象
	 */
	tipBody : null,

	/**
	 * @private
	 * @cfg tip tip显示框对象
	 */
	tip : null,
	tipContent : null,

	/**
	 * @private
	 * @cfg hasListener 是否已经绑定事件
	 */
	hasListener : false,

	columnIndexMap : new Ext.util.HashMap(),

	addMouseOverLis : function(value, metadata, record, store, view,
			columnIndex) {
		var me = this;

		store.each(function(record, index, length) {

			var td = Ext.get(record.internalId + '-td-' + index + columnIndex);
			if (td == null) {
				return;
			}
			td.on('mouseover', function(e, element, eOpts) {
				if (me.tipBody && (typeof me.tipBody.bindData) != 'undefined') {
					var result = me.tipBody.bindData(record, value, metadata,
							store, view);

					if (!Ext.isEmpty(result)) {
						Ext.create(me.tipBodyElement);
						if (!result) {
							return;
						}
					}
				}
				var x = e.browserEvent.clientX | e.browserEvent.pageX, y = e.browserEvent.clientY
						| e.browserEvent.pageY;
				me.tip.showAt([x + 10, y + 10]);
			});
		});
	},

	initComponent : function() {
		var me = this, customerRenderer = me.renderer;
		if (customerRenderer) {
			me.renderer = function(value, metadata, record, rowIndex,
					columnIndex, store, view) {
				value = customerRenderer(value, metadata, record, rowIndex,
						columnIndex, store, view);
				value = me.defaultRenderer(value, metadata, record, rowIndex,
						columnIndex, store, view);
				return value;
			};
		};
		me.defaultRenderer = function(value, metadata, record, rowIndex,
				columnIndex, store, view) {
			var tdId = record.internalId + '-td-' + rowIndex + columnIndex;

			me.columnIndexMap.add(columnIndex, columnIndex);
			me.tipContent = value;
			if (Ext.isEmpty(me.tipBody)) {
				if (!Ext.isEmpty(me.tipBodyElement)) {
					me.tipBody = Ext.create(me.tipBodyElement);
				}
			}
			if (me.tip == null) {
				if (me.tipConfig == null) {
					me.tipConfig = {};
				}
				if (!Ext.isEmpty(me.tipBody)) {
					me.tipConfig.items = [me.tipBody];
				}
				me.tip = Ext.create('Ext.tip.ToolTip', me.tipConfig);
			}
			metadata.tdAttr = "id=" + '"' + tdId + '"';
			if (!me.hasListener) {
				var evenObject, evenName;
				if (store.getProxy().type == 'ajax'
						|| store.getProxy().type == 'jsonp'
						|| store.getProxy().type == 'direct') {
					evenObject = store;
					evenName = 'load';
				} else {
					// 修改之前view的事件 'viewready' 为 'refresh'
					evenObject = view;
					evenName = 'refresh';
				}
				evenObject.on(evenName, function() {
							me.addMouseOverLis(value, metadata, record, store,
									view, columnIndex);
						});
				view.up('grid').on('sortchange', function() {
					me.addMouseOverLis(value, metadata, record, store, view,
							columnIndex);
				});
				store.on('datachanged', function() {
							me.addMouseOverLis(value, metadata, record, store,
									view, columnIndex);
						});
				me.hasListener = true;
			}
			return value;
		};
		me.callParent(arguments);
	}
});

Ext.define('Hn658.ux.ClearValuePlugin', {
	alias : 'plugin.clearvalueplugin',
	/**
	 * @cfg {String} trigger1Cls 清除按钮的样式。
	 */
	trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
	/**
	 * @cfg {String} trigger2Cls 查询按钮的样式。
	 */
	trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
	/**
	 * @private 构造函数，初始化此插件的配置项。
	 */
	constructor : function(config) {
		Ext.apply(this, config);
	},
	/**
	 * @private 插件初始化方法，适用于combobox组件上。在组件的initComponent方法执行完毕后调用。
	 */
	init : function(combo) {
		var me = this;
		me.pluginId = 'clearvalueplugin';
		combo.hasSearch = false;
		combo.trigger1Cls = me.trigger1Cls;
		combo.trigger2Cls = me.trigger2Cls;
		combo.onTrigger1Click = me.onTrigger1Click;
		combo.onTrigger2Click = me.onTrigger2Click;
		combo.on('afterrender', me.afterRender, combo);
	},
	/**
	 * @private combobox组件afterrender监听事件，用于使清除按钮在渲染后处于隐藏状态。
	 */
	afterRender : function() {
		this.triggerCell.item(0).setDisplayed(false);
	},
	/**
	 * @protected 清除按钮的点击事件。
	 */
	onTrigger1Click : function() {
		var me = this;
		if (me.hasSearch) {
			me.setValue('');
			me.hasSearch = false;
			me.triggerCell.item(0).setDisplayed(false);
			me.updateLayout();
		}
	},
	/**
	 * @protected 查询按钮的点击事件。
	 */
	onTrigger2Click : function() {
		var me = this;
		me.onTriggerClick();
		me.hasSearch = true;
		me.triggerCell.item(0).setDisplayed(true);
	}
});

Ext.define('Gamemobile.grid.plugin.RowExpander', {
    extend: 'Ext.AbstractPlugin',
    lockableScope: 'normal',

    requires: [
        'Ext.grid.feature.RowBody',
        'Ext.grid.feature.RowWrap'
    ],

    alias: 'plugin.hn658rowexpander',

    rowBodyTpl: null,
    
    rowBodyElement: null,
    
    elementIdMap: null,
    
    beforeRowIndex: null,
    
    rowsExpander: false,
    
    header: false,

    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter: true,

    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick: true,

    /**
     * @cfg {Boolean} selectRowOnExpand
     * <tt>true</tt> to select a row when clicking on the expander icon
     * (defaults to <tt>false</tt>).
     */
    selectRowOnExpand: false,

    rowBodyTrSelector: '.x-grid-rowbody-tr',
    rowBodyHiddenCls: 'x-grid-row-body-hidden',
    rowCollapsedCls: 'x-grid-row-collapsed',

    addCollapsedCls: {
        before: function(values, out) {
            var me = this.rowExpander;
            if (!me.recordsExpanded[values.record.internalId]) {
                values.itemClasses.push(me.rowCollapsedCls);
            }
        },
        priority: 500
    },

    /**
     * @event expandbody
     * **Fired through the grid's View**
     * @param {HTMLElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HTMLElement} expandRow The &lt;tr> element containing the expanded data.
     */
    /**
     * @event collapsebody
     * **Fired through the grid's View.**
     * @param {HTMLElement} rowNode The &lt;tr> element which owns the expanded row.
     * @param {Ext.data.Model} record The record providing the data.
     * @param {HTMLElement} expandRow The &lt;tr> element containing the expanded data.
     */

    setCmp: function(grid) {
        var me = this,
            features;

        me.callParent(arguments);
        
        ////
        me.elementIdMap = new Ext.util.HashMap();

        me.recordsExpanded = {};
        // <debug>
        if (!me.rowBodyTpl && !me.rowBodyElement) {
			Ext.Error.raise("'rowBodyTpl' and 'rowBodyElement' of A property must configuration.");
		}
        // </debug>
        if (me.rowBodyTpl) {
			me.rowBodyTpl = Ext.XTemplate.getTpl(me, 'rowBodyTpl');
	        rowBodyTpl = me.rowBodyTpl;
	        features = [{
	            ftype: 'rowbody',
	            lockableScope: 'normal',
	            rowBodyTpl: me.rowBodyTpl,
	            recordsExpanded: me.recordsExpanded,
	            rowBodyHiddenCls: me.rowBodyHiddenCls,
	            rowCollapsedCls: me.rowCollapsedCls,
	            setupRowData: me.getRowBodyFeatureData,
	            setup: me.setup,
	            getRowBodyContents: function(record) {
	                return rowBodyTpl.applyTemplate(record.getData());
	            }
	        },{
	            ftype: 'rowwrap',
	            lockableScope: 'normal'
	        }];
		}
		if (me.rowBodyElement) {
			rowBodyElement = me.rowBodyElement;
			features = [{
				ftype: 'rowbody',
	            lockableScope: 'normal',
	            rowBodyElement: me.rowBodyElement,
	            recordsExpanded: me.recordsExpanded,
	            rowBodyHiddenCls: me.rowBodyHiddenCls,
	            rowCollapsedCls: me.rowCollapsedCls,
	            setupRowData: me.getRowBodyFeatureData,
	            setup: me.setup,
				getRowBodyContents: function (data) {
					return "<div id='" + data + "' class='x-row-embedded'></div>";
				}
			}, {
				ftype: 'rowwrap',
				lockableScope: 'normal'
			}];
		} 
        if (grid.features) {
            grid.features = Ext.Array.push(features, grid.features);
        } else {
            grid.features = features;
        }
        // NOTE: features have to be added before init (before Table.initComponent)
    },

    init: function(grid) {
        var me = this,
            reconfigurable = grid,
            view, lockedView;

        me.callParent(arguments);
        me.grid = grid;
        view = me.view = grid.getView();
        // Columns have to be added in init (after columns has been used to create the headerCt).
        // Otherwise, shared column configs get corrupted, e.g., if put in the prototype.
        if(me.header){
        	me.addExpander();        	
        }
        
        // Bind to view for key and mouse events
        // Add row processor which adds collapsed class
        me.bindView(view);
        view.addRowTpl(me.addCollapsedCls).rowExpander = me;

        // If the owning grid is lockable, then disable row height syncing - we do it here.
        // Also ensure the collapsed class is applied to the locked side by adding a row processor.
        if (grid.ownerLockable) {
            // If our client grid is the normal side of a lockable grid, we listen to its lockable owner's beforereconfigure
            reconfigurable = grid.ownerLockable;
            reconfigurable.syncRowHeight = false;
            lockedView = reconfigurable.lockedGrid.getView();

            // Bind to locked view for key and mouse events
            // Add row processor which adds collapsed class
            me.bindView(lockedView);
            lockedView.addRowTpl(me.addCollapsedCls).rowExpander = me;

            // Refresh row heights of expended rows on the locked (non body containing) side upon lock & unlock.
            // The locked side's expanded rows will collapse back because there's no body there
            reconfigurable.mon(reconfigurable, 'columnschanged', me.refreshRowHeights, me);
            reconfigurable.mon(reconfigurable.store, 'datachanged', me.refreshRowHeights, me);
        }
        reconfigurable.on('beforereconfigure', me.beforeReconfigure, me);

        if (grid.ownerLockable && !grid.rowLines) {
            // grids without row lines can gain a border when focused.  When they do, the
            // stylesheet adjusts the padding of the cells so that the height of the row
            // does not change. It is necessary to refresh the row heights for lockable
            // grids on focus to keep the height of the expander cells in sync.
            view.on('rowfocus', me.refreshRowHeights, me);
        }
        
        if(me.rowBodyElement!=null){
        	view.on('refresh', function (store, eOpts) {
        		me.cleanElementIdMap();
        	}, this);        	
        }
    },
    
    beforeReconfigure: function(grid, store, columns, oldStore, oldColumns) {
        var expander = this.getHeaderConfig();
        expander.locked = true;
        columns.unshift(expander);
    },

    /**
     * @private
     * Inject the expander column into the correct grid.
     * 
     * If we are expanding the normal side of a lockable grid, poke the column into the locked side
     */
    addExpander: function() {
        var me = this,
            expanderGrid = me.grid,
            expanderHeader = me.getHeaderConfig();

        // If this is the normal side of a lockable grid, find the other side.
    	if (expanderGrid.ownerLockable) {
    		expanderGrid = expanderGrid.ownerLockable.lockedGrid;
    		expanderGrid.width += expanderHeader.width;
    	}
    	expanderGrid.headerCt.insert(0, expanderHeader);
    },

    getRowBodyFeatureData: function(record, idx, rowValues) {
        var me = this
        me.self.prototype.setupRowData.apply(me, arguments);

        if (me.rowBodyTpl) {
        	rowValues.rowBody = me.getRowBodyContents(record);
		}
		if (me.rowBodyElement) {	
			rowValues.rowBody = me.getRowBodyContents(record.internalId + "-rowbody");
		}
		rowValues.rowBodyCls = me.recordsExpanded[record.internalId] ? '' : me.rowBodyHiddenCls;
    },
    
    setup: function(rows, rowValues){
        var me = this;
        me.self.prototype.setup.apply(me, arguments);
        // If we are lockable, the expander column is moved into the locked side, so we don't have to span it
        if (!me.grid.ownerLockable) {
            rowValues.rowBodyColspan -= 1;
        }
        ////ztjie 增加头的话增加一列
    	rowValues.rowBodyColspan += 1;
    },

    bindView: function(view) {
        if (this.expandOnEnter) {
            view.on('itemkeydown', this.onKeyDown, this);
        }
        if (this.expandOnDblClick) {
            view.on('itemdblclick', this.onDblClick, this);
        }
    },

    onKeyDown: function(view, record, row, rowIdx, e) {
        if (e.getKey() == e.ENTER) {
            var ds   = view.store,
                sels = view.getSelectionModel().getSelection(),
                ln   = sels.length,
                i = 0;

            for (; i < ln; i++) {
                rowIdx = ds.indexOf(sels[i]);
                this.toggleRow(rowIdx, sels[i]);
            }
        }
    },

    onDblClick: function(view, record, row, rowIdx, e) {
    	if(row.parentElement.id.search(view.id)<0){
	    	return;
	    }
        this.toggleRow(rowIdx, record);
    },

    toggleRow: function(rowIdx, record) {
        var me = this,
            view = me.view,
            rowNode = view.getNode(rowIdx),
            row = Ext.fly(rowNode, '_rowExpander'),
            nextBd = row.down(me.rowBodyTrSelector, true),
            isCollapsed = row.hasCls(me.rowCollapsedCls),
            addOrRemoveCls = isCollapsed ? 'removeCls' : 'addCls',
            ownerLock, rowHeight, fireView;
        
        // Suspend layouts because of possible TWO views having their height change
        Ext.suspendLayouts();
        row[addOrRemoveCls](me.rowCollapsedCls);
        Ext.fly(nextBd)[addOrRemoveCls](me.rowBodyHiddenCls);
        me.recordsExpanded[record.internalId] = isCollapsed;
                
        if(isCollapsed&&me.rowBodyElement!=null){
        	rowBodyId = record.internalId + '-rowbody',
        	rowBodyElementId = record.internalId + '-rowbody-element';
        	if (me.rowBodyElement && !me.elementIdMap.containsKey(rowBodyElementId)) {
    			var rowBodyElement = Ext.create(me.rowBodyElement, {
    				id: rowBodyElementId
    			});
    			rowBodyElement.on('boxready',function(){
					view.refreshSize();
				});
    			rowBodyElement.render(rowBodyId);
    			this.elementIdMap.add(rowBodyElement.id, rowBodyElement);
    		}
    		var rowBodyElement = this.elementIdMap.get(rowBodyElementId);
    		//在定义行体的时候，装入的对象要如果要进行数据的bind，可以通过实现这个方法，进行实现
    		if (rowBodyElement && (typeof rowBodyElement.bindData) != 'undefined') {
    			rowBodyElement.bindData(record, me.grid, rowBodyElement);
    		}
        }
        view.refreshSize();
        if (!me.rowsExpander) {
        	if (me.beforeRowIndex != null && me.beforeRowIndex != rowIdx) {
        		Ext.resumeLayouts(true);
        		var beforeRowNode = view.getNode(me.beforeRowIndex),
        			beforeRecord = view.getRecord(beforeRowNode),
	        		beforeRow = Ext.fly(beforeRowNode, '_rowExpander'),
	        		beforeNextBd = row.down(me.rowBodyTrSelector, true);
        		Ext.suspendLayouts();
                row['addCls'](me.rowCollapsedCls);
                Ext.fly(beforeNextBd)['addCls'](me.rowBodyHiddenCls);
                me.recordsExpanded[beforeRecord.internalId] = false;
                view.refreshSize();
        	}
        	me.beforeRowIndex = rowIdx;
        }

        // Sync the height and class of the row on the locked side
        if (me.grid.ownerLockable) {
            ownerLock = me.grid.ownerLockable;
            fireView = ownerLock.getView();
            view = ownerLock.lockedGrid.view;
            rowHeight = row.getHeight();
            row = Ext.fly(view.getNode(rowIdx), '_rowExpander');
            row.setHeight(rowHeight);
            row[addOrRemoveCls](me.rowCollapsedCls);
            view.refreshSize();
        } else {
            fireView = view;
        }
        fireView.fireEvent(isCollapsed ? 'expandbody' : 'collapsebody', row.dom, record, nextBd);
        // Coalesce laying out due to view size changes
        Ext.resumeLayouts(true);
    },
    
    cleanElementIdMap: function () {
    	var me = this,
    		view = me.view,
    		rowNodes = view.getNodes(),
    		elementIdMap = me.elementIdMap;
		if (elementIdMap == null) {
			return;
		}
		Ext.Array.each(rowNodes, function(rowNode, index, rowNodes) {
			var record = view.getRecord(rowNode),
	            row = Ext.fly(rowNode, '_rowExpander'),
	            nextBd = row.down(me.rowBodyTrSelector, true);
			if (row != null && !row.hasCls(me.rowCollapsedCls)) {
				Ext.suspendLayouts();
				row['addCls'](me.rowCollapsedCls);
				if(nextBd!=null){
					Ext.fly(nextBd)['addCls'](me.rowBodyHiddenCls);					
				}
				me.recordsExpanded[record.internalId] = false;
				Ext.resumeLayouts(true);
			}
		});
		for (var i = 0; i < elementIdMap.getKeys().length; i++) {
			me.cleanComponent(elementIdMap.getValues()[i]);
			var header = Ext.ComponentManager.get(elementIdMap.getKeys()[i] + '_header');
			this.cleanComponent(header);
			Ext.ComponentManager.unregister(header);
			header = null;
		}
		elementIdMap.clear();
		me.beforeRowIndex = null;
	},

    cleanComponent: function(cmp){
    	if(typeof cmp=="undefined"){
    		return;
    	}
    	if(typeof cmp=="string"){
    		cmp = Ext.ComponentManager.get(cmp);
    		if(!cmp){
    			//如果在DOM树上有该节点，进行DOM树节点的删除
    			if(cmp!=null){
    				var cmpDom = Ext.getDom(cmp);
    				Ext.removeNode(cmpDom);
    			}
    			return;
    		}
    	}
    	//清空ComponentManager内的注册项
    	var cmpArray = cmp.removeAll();
    	//清空store
    	for(var i=0;i<cmpArray.length;i++){
    		if(cmpArray[i].store){
    			cmpArray[i].store.removeAll();
    			Ext.data.StoreManager.unregister(cmpArray[i].store);
    		}
    	}
    	cmpArray = null;
    	Ext.ComponentManager.unregister(cmp);
    	//如果在DOM树上有该节点，进行DOM树节点的删除
    	if(cmp.id!=null){
    		var cmpDom = Ext.getDom(cmp.id);
    		Ext.removeNode(cmpDom);
    	}
    },
	
    // refreshRowHeights often gets called in the middle of some complex processing.
    // For example, it's called on the store's datachanged event, but it must execute
    // *after* other objects interested in datachanged have done their job.
    // Or it's called on column lock/unlock, but that could be just the start of a cross-container
    // drag/drop of column headers which then moves the column into its final place.
    // So this throws execution forwards until the idle event.
    refreshRowHeights: function() {
        Ext.globalEvents.on({
            idle: this.doRefreshRowHeights,
            scope: this,
            single: true
        });
    },

    doRefreshRowHeights: function() {
        var me = this,
            recordsExpanded = me.recordsExpanded,
            key, record,
            lockedView = me.grid.ownerLockable.lockedGrid.view,
            normalView = me.grid.ownerLockable.normalGrid.view,
            normalRow,
            lockedRow,
            lockedHeight,
            normalHeight;

        for (key in recordsExpanded) {
            if (recordsExpanded.hasOwnProperty(key)) {
                record = this.view.store.data.get(key);
                lockedRow = lockedView.getNode(record, false);
                normalRow = normalView.getNode(record, false);
                lockedRow.style.height = normalRow.style.height = '';
                lockedHeight = lockedRow.offsetHeight;
                normalHeight = normalRow.offsetHeight;
                if (normalHeight > lockedHeight) {
                    lockedRow.style.height = normalHeight + 'px';
                } else if (lockedHeight > normalHeight) {
                    normalRow.style.height = lockedHeight + 'px';
                }
            }
        }
    },

    getHeaderConfig: function() {
        var me = this;

        return {
            width: 24,
            lockable: false,
            sortable: false,
            resizable: false,
            draggable: false,
            hideable: false,
            menuDisabled: true,
            tdCls: Ext.baseCSSPrefix + 'grid-cell-special',
            innerCls: Ext.baseCSSPrefix + 'grid-cell-inner-row-expander',
            renderer: function(value, metadata) {
                // Only has to span 2 rows if it is not in a lockable grid.
                if (!me.grid.ownerLockable) {
                    metadata.tdAttr += ' rowspan="2"';
                }
                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander"></div>';
            },
            processEvent: function(type, view, cell, rowIndex, cellIndex, e, record) {
                if (type == "mousedown" && e.getTarget('.x-grid-row-expander')) {
                    me.toggleRow(rowIndex, record);
                    return me.selectRowOnExpand;
                }
            }
        };
    }
});

if (Hn658 === undefined) {
	Ext.ns('Hn658');
};
Hn658.JsLoader = function() {
	this.load = function(url) {
		var me = this, scripts = document.getElementsByTagName("script"), len = scripts.length, i, script, head;
		for (i = 0; i < len; i++) {
			if (scripts[i].src && scripts[i].src.indexOf(url) != -1) {
				me.onSuccess();
				return;
			}
		}
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		head = document.getElementsByTagName("head")[0];
		try {
			head.appendChild(script);
			script.onload = script.onreadystatechange = function() {
				if (script.readyState && script.readyState != 'loaded'
						&& script.readyState != 'complete')
					return;
				script.onreadystatechange = script.onload = null;
				me.onSuccess();
			}
		} catch (e) {
			if (typeof(me.onFailure) == 'function') {
				me.onFailure();
			} else {
				throw "Failed to load javaScript file dynamical!";
			}
		}
	}
};

Ext.define('Hn658.ux.ZeroClipboardPlugin', {
	alias : 'plugin.zeroclipboardplugin',
	/**
	 * @cfg {Oject} targetCmpName
	 *      如果复制内容为表单域的value，且绑定ZeroClipboard的元素位于form内，则配置此属性为表单域的name属性即可。
	 */
	targetCmpName : null,
	/**
	 * @cfg {Function} targetFun 如果复制内容为function返回的值，则配置此属性为function对象。
	 */
	targetFun : null,
	/**
	 * @cfg {String} targetValue 如果复制内容为指定文本，则配置此属性为指定文本。
	 */
	targetValue : null,
	/**
	 * @private 构造函数，初始化此插件的配置项。
	 */
	constructor : function(config) {
		var me = this;
		Ext.apply(me, config);
	},

	/**
	 * @private 插件初始化方法，适用于Button组件上。在组件的initComponent方法执行完毕后调用。
	 */
	init : function(component) {
		var me = this;
		me.component = component;
		me.component.on('boxready', function() {
					me.initZeroClipboard(component);
				});
	},

	/**
	 * @method 初始化ZeroClipboard。
	 * @return {Object} ZeroClipboard对象。
	 */
	initZeroClipboard : function(component) {
		var me = this;
		me.clip = new ZeroClipboard(component.getEl().dom, {
					moviePath : "./lib/components/zeroclipboard/ZeroClipboard.swf",
					cacheBust : false
				});
		me.clip.setHandCursor(true);
		me.clip.addEventListener("mouseOver", Ext.bind(me.onMouseOver, me));
		me.clip.addEventListener('complete', function(client, text) {
					Ext.ux.Toast.msg("提示", "内容已经复制至剪切板");
				});
	},

	/**
	 * @method 绑定ZeroClipboard于组件的Element对象上。
	 * @return {Object} ZeroClipboard对象。
	 */
	/*
	 * glueZeroClipboard: function() { var me = this; if(me.clip) {
	 * me.clip.destroy(); me.clip.clip(me.component.getEl().dom); } return
	 * me.clip; },
	 */
	/**
	 * @private ZeroClipboard对象的mouseOver监听事件。鼠标移动时初始化ZeroClipboard对象的复制文本。
	 */
	onMouseOver : function() {
		var me = this, value;
		if (me.targetCmpName) {
			var targetCmp = me.component.up('form').getForm()
					.findField(me.targetCmpName);
			value = targetCmp.getValue();
		} else if (me.targetFun) {
			value = me.targetFun(me.component);
		} else if (me.targetValue) {
			value = me.targetValue;
		}
		me.clip.setText(value);
	},
	/**
	 * @private 销毁插件相关的属性和对象。该方法会在组件销毁的时候自动调用。
	 */
	destroy : function() {
		var me = this;
		me.component.clearListeners();
		me.clip.destroy();

		delete me.component;
		delete me.clip;
	}
});

/**
 * @docauthor ztjie
 * 
 * 此插件使用于按钮上，使按钮在点击后一定时间内处于不可用状态（disabled），从而防止用户连续点击按钮。
 * 
 * 通常可以用来防止用户连续提交而造成的服务器性能问题。
 * 
 * 此插件的功能和设计参考12306订票查询按钮。
 *  # 插件示例
 * <pre><code>
 * @example
 * Ext.create('Ext.button.Button', {		
 * 	frame: true,
 * 	text: '阻止按钮连续点击插件',
 * 	maxWidth: 200,
 * 	height: 30,
 * 	//插件配置代码
 * 	plugins: {
 * 		ptype: 'buttondisabledplugin',
 * 		seconds: 5
 * 	},
 * 	renderTo : Ext.getBody()
 * });
 * </code></pre>
 */
Ext.define('Hn658.button.ButtonDisabledPlugin', {
	alias : ['plugin.buttonlimitingplugin',
			'plugin.buttondisabledplugin'],
	/**
	 * @cfg {Number} seconds 设置按钮不可用状态持续的时间（单位：秒）。
	 */
	seconds : 2,
	/**
	 * @private 构造函数，初始化此插件的配置项。
	 */
	constructor : function(config) {
		Ext.apply(this, config);
	},
	/**
	 * @private 插件初始化方法，适用于Button组件上。在组件的initComponent方法执行完毕后调用。
	 */
	init : function(button) {
		var me = this;
		me.button = button;
		me.getDelayedTask();
		button.on('click', me.onClickButton, me);
	},
	/**
	 * @private 按钮上的click监听事件，点击后按钮变成不可用状态，利用延迟任务组件，一定时间后恢复可用状态。
	 * @return {Boolean} 返回true，继续执行其他的click监听事件。
	 */
	onClickButton : function() {
		var me = this, button = me.button;
		button.setDisabled(true);
		me.task.delay(me.seconds * 1000);
		return true;
	},
	/**
	 * @method 设置按钮disabled状态。
	 * @param {Boolean}
	 *            传入false设置按钮可用，传入true设置按钮不可用。
	 * @return {Ext.button.Button} 设置插件的按钮对象。
	 */
	setButtonDisabled : function(disabled) {
		var me = this, button = me.button;
		disabled = disabled || false;
		button.setDisabled(disabled);
		return button;
	},
	/**
	 * @method 获取插件的任务延迟对象。该方法在插件初始化时调用。
	 * @return {Ext.util.DelayedTask} 插件的任务延迟（Ext.util.DelayedTask）对象。
	 */
	getDelayedTask : function() {
		var me = this;
		if (!me.task) {
			me.task = new Ext.util.DelayedTask(me.setButtonDisabled, me);
		}
		return me.task;
	},
	/**
	 * @private 销毁插件相关的属性和对象。该方法会在组件销毁的时候自动调用。
	 */
	destory : function() {
		var me = this, button = me.button;
		Ext.destroy(me.task);
		delete me.button;
		delete me.task;
	}
});

/**
 * @docauthor ztjie
 * 
 * 单选选择器，公共选择器之一。
 * 
 * 封装combobox，提供触发按钮查询、回车查询、分页栏、条目模板自定义、查询参数定义等配置功能。
 * 
 */
Ext.define('Hn658.selector.SingleSelector', {
	extend : 'Ext.form.ComboBox',
	alias : ['widget.singleselector', 'widget.dynamiccomboselector'],
	alternateClassName : ['Hn658.commonselector.DynamicComboSelector'],
	/**
     * @cfg {String} triggerCls
     * 触发按钮样式。
     */
	triggerCls: Ext.baseCSSPrefix + 'form-search-trigger',
	/**
     * @cfg {Number} listWidth
     * 下拉列表宽度。
     */
	listWidth: this.width,
	/**
     * @cfg {Boolean} multiSelect
     * 是否支持多选。
     */
	multiSelect: false,
	/**
     * @cfg {Boolean} isPaging
     * 是否支持分页。
     */
	isPaging: false,
	/**
     * @cfg {Boolean} isEnterQuery
     * 是否支持回车查询。
     */
	isEnterQuery: false,
	/**
     * @cfg {String} displayField
     * 显示的字段。
     */
	displayField: null,
	/**
     * @cfg {String} valueField
     * 显示字段对应的关键字。
     */
	valueField: null,
	/**
     * @cfg {String} showContent
     * 下拉条目的显示模板。
     */
	showContent: null,
	/**
     * @cfg {Object} queryParam
     * 查询参数。
     */
	queryParam: null,
	/**
     * @cfg {String} triggerAction
     * 触发动作。
     */
	triggerAction: 'query',
	/**
     * @cfg {Number} minChars
     * 查询条件显示结果的最小字符数。
     */
	minChars: 0,
	/**
     * @cfg {Boolean} hideTrigger
     * 是否隐藏触发按钮。
     */
	hideTrigger: false,
	/**
     * @cfg {Object/String} plugins
     * 插件对象或者ptype。
     */
	plugins: 'clearvalueplugin',
	/**
     * @cfg {Boolean} queryAllFlag
     * 是否支持查询全部。
     */
	queryAllFlag: true,
	/**
     * @cfg {Number} validValueLength
     * 查询条件的最小字符串长度。
     */
	validValueLength: 0,
	/**
     * @cfg {Object} listConfig
     * 下拉列表的配置对象。
	 *   - {@link Ext.view.BoundList#cls} - 默认为空。
     *   - {@link Ext.view.BoundList#emptyText} - 默认为空字符串。
     *   - {@link Ext.view.BoundList#itemSelector} - 默认为BoundList定义的字符串。
     *   - {@link Ext.view.BoundList#loadingText} - 默认为 "Loading..."
     *   - {@link Ext.view.BoundList#minWidth} - 默认为 70
     *   - {@link Ext.view.BoundList#maxWidth} - 默认为 `undefined`
     *   - {@link Ext.view.BoundList#maxHeight} - 默认为 `300`
     *   - {@link Ext.view.BoundList#resizable} - 默认为 `false`
     *   - {@link Ext.view.BoundList#shadow} - 默认为 `'sides'`
     *   - {@link Ext.view.BoundList#width} - 默认为 `undefined` （自动匹配宽度，如果combobox的{@link #matchFieldWidth}属性设置为true）
     */
	listConfig: {
		getInnerTpl: function () {
			var comboObj = this.up('combo'),
				content = comboObj.showContent,
				keyArr = comboObj.getKeyWords(content);
			if(keyArr.length == 2) {
				return Ext.String.format('<div class="common-combo-item"><span>{{1}}</span><span>{{0}}</span></div>', keyArr[0], keyArr[1]);
			} else {
				return this.up('combo').showContent;
			}
		}
	},
	/**
	 * @method
     * 获取下拉条目模板中的关键字。
	 * @param {String} 下拉条目模板。
     * @return {Array} 关键字数组。
     */
	getKeyWords: function(content) {
		var conArr = content.split("}"),
			conEle, result = [],
			conIndex;
		for(var i=0, len=conArr.length; i<len; i++) {
			conEle = conArr[i];
			conIndex = conEle.indexOf("{");
			if(conIndex != -1) {
				result.push(conEle.substring(conEle.indexOf("{") + 1, conEle.length));
			}
		}
		return result;
	},
	getValueModel: function () {
		var models = this.valueModels;
		if (!Ext.isEmpty(models) && models.length > 0) {
			return models[0];
		} else {
			return null;
		}
	},
	/**
	 * @private
     * combobox的change监听事件。
     */
	getChange: function (combo, newValue, oldValue) {
		if (combo.isExpanded == true) {
			combo.collapse();
		}
	},
	/**
	 * @private
     * combobox的keypress监听事件。
     */
	getKeyPress: function (combo, event, eOpts) {
		var me = this;
		if (event.getKey() == event.ENTER ) {
			if(me.queryAllFlag) {
				me.enterQueryAction();
			} else {
				if(Ext.isEmpty(me.getValue())) {
					me.setActiveErrors(["请输入查询条件!"]);
					this.doComponentLayout();
				} else {
					me.enterQueryAction();
				}
			}
		}
	},
	/**
	 * @private
     * combobox的store对象的beforeLoad监听事件。
     */
	getBeforeLoad: function (st, operation, e) {
		var me = this,
			searchParams = operation.params;
		if (Ext.isEmpty(searchParams)) {
			searchParams = {};
			Ext.apply(operation, {
				params: searchParams
			});
		}
		searchParams[me.queryParam] = me.rawValue;
	},
	/**
	 * @protected
     * 初始化监听事件方法。
     */
	initEvents: function () {
		var me = this;
		me.callParent(arguments);
		if (me.isEnterQuery == true) {
			me.mon(me, 'change', me.getChange, me);
			me.mon(me, 'keypress', me.getKeyPress, me);
		}
		me.mon(me.store, 'beforeLoad', me.getBeforeLoad, me);
	},
	/**
	 * @private
     * 组件初始化方法。
     */
	initComponent: function () {
		var me = this;
		me.on('expand', function (combo, eOpts) {
			combo.getPicker().minWidth = me.listWidth;
			combo.getPicker().setWidth(me.listWidth);
		});
		if (me.isPaging == true) {
			me.pageSize = me.store.pageSize;
		}
		if (me.showContent == null) {
			me.showContent = '{' + me.displayField + '}';
		}
		if (me.isEnterQuery == true) {
			me.enableKeyEvents = true;
			me.queryDelay = 1000000;
		}
		this.callParent(arguments);
	},
	/**
	 * @method
     * combobox触发按钮的绑定事件。
     */
	onTriggerClick: function() {
		var me = this;
		if(me.queryAllFlag) {
			me.queryAction();
		} else {
			if(Ext.isEmpty(me.getValue())) {
				me.setActiveErrors(["请输入查询条件!"]);
				this.doComponentLayout();
			} else {
				me.queryAction();
			}
		}
    },
	/**
	 * @method
     * combobox回车键的监听事件。
     * @param {Ext.form.ComboBox} combobox组件。
     */
	enterQueryAction: function() {
		var me = this,
			clearvalueplugin = me.getPlugin('clearvalueplugin'),
			value = me.getValue();
		if(me.validValueLength != 0 && (!Ext.isEmpty(value) && value.length < me.validValueLength)) {
			me.setActiveErrors(["请输入至少" + me.validValueLength + "个字符!"]);
			me.doComponentLayout();
			return;
		}
		me.store.loadPage(1, {
			scope: this,
			callback: function (records, operation, success) {
				if (records.length > 0) {
					me.expand();
				} else {
					operation.params[me.queryParam] = "";
					me.lastQuery = undefined;
				}
			}
		});
		if(!Ext.isEmpty(clearvalueplugin)){
			me.hasSearch = true;
			me.triggerCell.item(0).setDisplayed(true);
		}
	},
	/**
	 * @method
     * combobox查询事件。
     */
	queryAction: function() {
		var me = this,
			value;
		if (!me.readOnly && !me.disabled) {
			if (me.isExpanded) {
				me.collapse();
			} else {
				me.onFocus({});
				value = me.getValue();
				if(me.validValueLength != 0 && (!Ext.isEmpty(value) && value.length < me.validValueLength)) {
					me.setActiveErrors(["请输入至少" + me.validValueLength + "个字符!"]);
					me.doComponentLayout();
					return;
				}
				if (me.triggerAction === 'all') {
					me.doQuery(me.allQuery, true);
				} else {
					me.doQuery(me.getRawValue(), false, true);
				}
			}
			me.inputEl.focus();
		}
	}
});

Ext.define('Hn658.selector.LinkedSelector', {
	extend : 'Hn658.selector.SingleSelector',
	alias : ['widget.linkedselector'],
	/**
	 * @cfg {Object} parentParamsAndItemIds 参数和项目Id。
	 */
	parentParamsAndItemIds : null,
	/**
	 * @cfg {Array} eventType 事件类型。
	 */
	eventType : ['callparent'],
	/**
	 * @method 获取焦点并加载数据源。
	 */
	getFocus : function() {
		var me = this;
		me.on('focus', function() {
			me.setValue(null);
			me.store.loadPage(1, {
				scope : this,
				callback : function(records, operation, success) {
					if (records.length > 0) {
						me.expand();
					}
				}
			});
		});
	},
	/**
	 * @method 依据父类选择器数据加载数据源。
	 */
	getCallParent : function() {
		var me = this, cmp;
		if (!Ext.isEmpty(me.parentParamsAndItemIds)) {
			Ext.Object.each(me.parentParamsAndItemIds, function(queryParam, itemId, parentParamsAndItemIds) {
				cmp = me.up().items.get(itemId);
				if (!cmp.hasListener('select')) {
					cmp.on('select', function(combo) {
						me.setValue(null);
						me.store.loadPage(1, {
							scope : this,
							callback : function(
									records, operation,
									success) {
								me.focus(false, 100);
								me.expand();
							}
						});
					});
				}
			});
		}
	},
	/**
	 * @private 组件初始化方法。
	 */
	initComponent : function() {
		var me = this;
		me.on('boxready', function() {
			var callparent = null;
			for (var i = 0; i < me.eventType.length; i++) {
				if (me.eventType[i] == 'focus') {
					me.getFocus();
				} else if (me.eventType[i] == 'callparent') {
					callparent = 'callparent';
					me.getCallParent();
				}
			}
			if (callparent == 'callparent') {
				me.un('focus');
			}
		});
		this.callParent(arguments);
		me.store.on('beforeLoad', function(st, operation, e) {
			var cmp = null, searchParams = operation.params;
			if (Ext.isEmpty(searchParams)) {
				searchParams = {};
			}
			if (!Ext.isEmpty(me.queryParam)) {
				searchParams[me.queryParam] = me.rawValue;
			}
			if (!Ext.isEmpty(me.parentParamsAndItemIds)) {
				Ext.Object.each(me.parentParamsAndItemIds, function(
								queryParam, itemId,
								parentParamsAndItemIds) {
					cmp = me.up().items.get(itemId);
					searchParams[queryParam] = cmp.getValue();
				});
			}
			Ext.apply(operation, {
				params : searchParams
			});
		});
	}
});

Ext.define('Hn658.selector.LinkedContainer', {
	extend : 'Ext.form.FieldContainer',
	alias : 'widget.linkedcontainer',

	/**
	 * @cfg {String} triggerCls 定义级联选择器内的选择器类型，默认类型是linkedselector。
	 */
	defaultType : 'linkedselector',

	/**
	 * @method 通过itemId得到级联选择器内的选择器的值。
	 * @param {String}
	 *            itemId
	 * @return {Object} itemValue
	 */
	getItemValue : function(itemId) {
		var me = this, item = me.items.get(itemId);
		if (item != null) {
			return item.getValue();
		}
		return null;
	},

	/**
	 * @method 通过级联选择器内的所有选择器的值，并以数组的方式返回。
	 * @param {String}
	 *            itemId
	 * @return {Array} itemValues
	 */
	getValue : function() {
		var me = this, values = new Array();
		for (var i = 0; i < me.items.length; i++) {
			values[i] = me.getItemValue(me.items.items[i].itemId);
		}
		return values;
	}
});

// 数据字典
/*******************************************************************************
 * 业务字典提供方法
 */
/** ******************************************************************* */
var dataDictionary = new Ext.util.HashMap();

Ext.define('MyApp.model.DataDictionaryModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name:'value'
    },{
        name:'display'
    }]
});

//
/** ******************************************************************* */
// 业务字典信息类
Ext.define('DataDictionary', {
	singleton : true,
    /**
     * 通过类型请求服务端加载字典数据
     * @param dictType
     */
    loadDictDataByType: function(dictType) {
        Ext.Ajax.request({
            url: './rs/dictionary/loadDictionaryByType',
            method: 'POST',
            jsonData: {
                type: dictType
            },
            async: false,
            success: function(response){
                var josn = Ext.decode(response.responseText),
                    dictionaryjson = josn.jsonData,dictionaryList;
                if(Ext.isEmpty(dictionaryjson)) {
                    dictionaryjson = "[]";
                }
                dictionaryList = Ext.decode(dictionaryjson);
                dataDictionary.add(dictType, dictionaryList);
            }
        });
    },
    /**
     * 通过类型加载字典数据
     * @param dictType
     * @returns {*}
     */
    getDictDataByType: function(dictType) {
        if(Ext.isEmpty(dictType)) {
            return;
        }
        var dictData = dataDictionary.get(dictType);
        if(Ext.isEmpty(dictData)) {
            DataDictionary.loadDictDataByType(dictType);
            dictData = dataDictionary.get(dictType);
        }
        return Ext.clone(dictData);
    },
	/**
	 * 通过词条代码获得业务字典数据
	 * 
	 * @param termsCode
	 *            词条代码
	 * @param valueCodes
	 *            条目编码数组
	 * @returns 业务字典数据
	 */
	getDataByTermsCode : function(termsCode, valueCodes) {
		if (termsCode != null) {
			var data = DataDictionary.getDictDataByType(termsCode);
			if (!Ext.isEmpty(valueCodes)) {
				var reslutArray = new Array();
				if (Ext.isArray(valueCodes)) {
					for (var i = 0; i < data.length; i++) {
						if (Ext.Array.contains(valueCodes,
								data[i].value)) {
							reslutArray.push(data[i]);
						}
					}
				} else {
					for (var i = 0; i < data.length; i++) {
						if (valueCodes == data[i].value) {
							reslutArray.push(data[i]);
						}
					}
				}
				// 此处当valueCodes为数组，但是内容无法识别(undefined)时，返回全部数据
				if (reslutArray != null && reslutArray.length > 0) {
					return reslutArray;
				} else {
					return data;
				}
				// return reslutArray;
			}
			return data;
		}
		return null;
	},
	/**
	 * 通过多个词条代码获得业务字典数据数组
	 * 
	 * @param termsCodes
	 *            词条代码数组
	 * @returns 业务字典数据数组
	 */
	getDataByTermsCodes : function(termsCodes) {
		if (termsCodes == null) {
			return null;
		}
		var data = new Array();
		for (var i = 0; i < termsCodes.length; i++) {
			data.push(DataDictionary.getDataByTermsCode(termsCodes[i]));
		}
		return data;
	},
	/**
	 * 根据数据字典名称获取对应的store,如果没有则返回[],不影响整个页面的渲染
	 * 
	 * @param termsCode
	 *            词条代码
	 * @param id
	 *            如果想要通过store id 查询store的话就传id,否则可以不用传
	 * @param anyRecords
	 *            如果想增加一些记录到这个数据字典中，可以通过这个参数传入， 些参数可以是一个数据数组，也可以是一个数据
	 * @param valueCodes
	 *            条目编码数组
	 * @returns
	 */
	getDataDictionaryStore : function(termsCode, id, anyRecords,
			valueCodes) {
		var data = DataDictionary.getDataByTermsCode(termsCode,
				valueCodes);
		if (!Ext.isEmpty(data)) {
			if (!Ext.isEmpty(anyRecords)) {
				if (Ext.isArray(anyRecords)) {
					for (var i = 0; i < anyRecords.length; i++) {
						data.unshift(anyRecords[i]);
					}
				} else {
					data.unshift(anyRecords);
				}
			}
			var json = {
                model: 'MyApp.model.DataDictionaryModel',
				data : {'data': data},
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'data'
                    }
                }
			};
			if (!Ext.isEmpty(id)) {
				json["id"] = id;
			}
			return Ext.create('Ext.data.Store', json);
		} else {
			return [];
		}
	},
	/**
	 * 根据数据字典名称获取对应的combo组件
	 * 
	 * @param termsCode
	 *            词条代码
	 * @param config
	 *            combo的一些配置信息
	 * @param anyRecords
	 *            如果想增加一些记录到这个数据字典中，可以通过这个参数传入， 些参数可以是一个数据数组，也可以是一个数据
	 * @param id
	 *            如果想要通过store id 查询store的话就传id,否则可以不用传
	 * @returns
	 */
	getDataDictionaryCombo : function(termsCode, config, anyRecords,
			id, valueCodes) {
		if (Ext.isEmpty(config)) {
			config = {};
		}
		var store = DataDictionary.getDataDictionaryStore(termsCode,
				id, anyRecords, valueCodes);
        var cfg = Ext.apply({
					store : store,
					displayField : 'display',
					valueField : 'value'
				}, config);
        var comboBox = Ext.create('Ext.form.ComboBox', cfg);
		return comboBox;

	},
	/**
	 * 将业务字典的displayValue（数据字典显示值）转换成描述submitValue（提交值）
	 * 使用方法rendererDictionary(displayValue,’abc’);
	 * 
	 * @param value
	 *            所要转换的值
	 * @param termsCode
	 *            词条代码
	 */
	rendererDisplayToSubmit : function(displayValue, termsCode) {
		var data = DataDictionary.getDataByTermsCode(termsCode);
		if (!Ext.isEmpty(displayValue) && !Ext.isEmpty(data)) {
			for (var i = 0; i < data.length; i++) {
				if (displayValue == data[i].display) {
					return data[i].value;
				}
			}
		}
		return displayValue;
	},
	/**
	 * 将业务字典的submitValue（提交值）转换成描述displayValue（数据字典显示值）
	 * 使用方法rendererDictionary(value,’abc’);
	 * 
	 * @param value
	 *            所要转换的值
	 * @param termsCode
	 *            词条代码
	 */
	rendererSubmitToDisplay : function(submitValue, termsCode) {
		var data = DataDictionary.getDataByTermsCode(termsCode);
		if (!Ext.isEmpty(submitValue) && !Ext.isEmpty(data)) {
			for (var i = 0; i < data.length; i++) {
				if (submitValue == data[i].value) {
					return data[i].display;
				}
			}
		}
		return submitValue;
	}
});
/** ******************************************************************* */

// 下拉单选框
Ext.define('Hn658.commonSelector.CommonCombSelector', {
	extend : 'Hn658.selector.SingleSelector',
	minChars : 0,
	isPaging : true,// 分页
	isEnterQuery : true,// 回车查询
	listWidth : 330,// 设置下拉框宽度
	record : null,
	displayField : null,
	valueField : null,
	displayField : null,// 显示名称
	valueField : null,// 值
	queryParam : null,// 查询参数
	setCombValue : function(displayText, valueText) {
		var me = this, key = me.displayField + '', value = me.valueField
				+ '';
		var m = Ext.create(me.store.model.modelName);
		m.set(key, displayText);
		m.set(value, valueText);
		me.store.loadRecords([m]);
		me.setValue(valueText);
	},
	getBlur : function(ths, the, eOpts) {
		if (Ext.isEmpty(ths.value)) {
			ths.setRawValue(null);
		}
	},
	constructor : function(config) {
		var me = this, cfg = Ext.apply({}, config);
		me.active = config.active;
		me.callParent([cfg]);
		me.addListener('select', function(comb, records, obs) {
			me.record = records[0];
		});
		me.on('blur', me.getBlur, me);
	},
	getRecord : function() {
		var me = this;
		return me.record;
	}
});

/*
 * 用户信息选择器
 */
Ext.define('Hn658.commonSelector.CommonUserSelector', {
	extend : 'Hn658.commonSelector.CommonCombSelector',
	alias : 'widget.commonuserselector',
	listWidth : 400,
	displayField : 'loginAccount',// 显示名称
	valueField : 'id',// 值
	queryParam : 'loginAccount',// 查询参数
	showContent : '{loginAccount}&nbsp;&nbsp;&nbsp;{realName}',// 显示表格列
	constructor : function(config) {
		var me = this, cfg = Ext.apply({}, config);
		me.store = Ext.create('MyApp.store.UserStore');
		me.callParent([cfg]);
	}
});

/*
 * app信息选择器
 */
Ext.define('Hn658.commonSelector.CommonAppInfoSelector', {
	extend : 'Hn658.commonSelector.CommonCombSelector',
	alias : 'widget.commonappinfoselector',
	listWidth : 400,
	displayField : 'appId',// 显示名称
	valueField : 'appId',// 值
	queryParam : 'appName',// 查询参数
	showContent : '{appName}&nbsp;&nbsp;&nbsp;{appId}',// 显示表格列
	constructor : function(config) {
		var me = this, cfg = Ext.apply({}, config);
		me.store = Ext.create('MyApp.store.AppIdStore');
		me.callParent([cfg]);
	}
});
