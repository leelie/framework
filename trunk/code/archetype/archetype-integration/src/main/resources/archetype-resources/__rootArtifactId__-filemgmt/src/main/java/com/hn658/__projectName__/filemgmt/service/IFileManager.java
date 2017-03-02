/************************************************************************************
 *  Copyright 2013 WZITech Corporation. All rights reserved.
 *	
 *	模	块：		IFileManager
 *	包	名：		com.wzitech.gamegold.filemgmt.business
 *	项目名称：	gamegold-filemgmt
 *	作	者：		HeJian
 *	创建时间：	2014-1-14
 *	描	述：		
 *	更新纪录：	1. HeJian 创建于 2014-1-14 下午2:06:27
 * 				
 ************************************************************************************/
package com.hn658.${projectName}.filemgmt.service;

/**
 * 文件操作
 * @author HeJian
 *
 */

public interface IFileManager {

	/**
	 * 用户头像地址
	 * @param image
	 * @param uid
	 * @return
	 */
	String saveBackendFileAvatar(byte[] image, String uid);

}
