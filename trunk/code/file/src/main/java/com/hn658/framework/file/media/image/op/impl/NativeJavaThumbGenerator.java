/***************************************************************************************************
 * Copyright (c) 2013. WZITech Information Technology Co., Ltd.(Shanghai). All rights reserved.
 **************************************************************************************************/

package com.hn658.framework.file.media.image.op.impl;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Component;

import com.hn658.framework.file.media.image.ThumbGeneratorMode;

/**
 * 模    块：NativeJavaThumbGenerator
 * 包    名：com.wzitech.chaos.framework.server.common.media.image.op.impl
 * 项目名称：Gaea_Mobile_ServerEnd
 * 作    者：Shawn
 * 创建时间：8/15/13 1:30 AM
 * 描    述：
 * 更新纪录：1. Shawn 创建于 8/15/13 1:30 AM
 */
@Component("nativeJavaThumbGenerator")
public class NativeJavaThumbGenerator extends AbstractThumbGenerator {
    @Override
    protected String generate(String imageFullName, ThumbGeneratorMode mode, int width, int height) {
        try {
            File fi = new File(imageFullName); // 大图文件
            String fileSuffix = FilenameUtils.getExtension(imageFullName);

            // 如果要生成的原图的不存在则直接返回
            if (!fi.exists()) {
                logger.error("图片{}不存在，无法生成缩略图. ", imageFullName);
                return null;
            }

            BufferedImage originalImage = ImageIO.read(fi); // 读入文件
            int oWidth = originalImage.getWidth(); // 得到源图宽
            int oHeight = originalImage.getHeight(); // 得到源图长
            int scaleWidth = 0;
            int scaleHeight = 0;
            int startX = 0;
            int startY = 0;

            double scaling = (double) oWidth / (double) oHeight;

            if (mode == ThumbGeneratorMode.ScaleByWidthAndHeight) {
                double newScaling = (double) width / (double) height;

                // 根据生成图片长宽比例及原始长宽比例缩小图片，
                // 并是图片居中放置
                if (scaling >= newScaling) {
                    // 如果原始图片宽度大于长度，依据长度调整宽度
                    scaleWidth = width;
                    scaleHeight = (int) (scaleWidth / scaling);
                    startX = 0;
                    startY = (int) ((height - scaleHeight) / 2);
                } else {
                    scaleHeight = height;
                    scaleWidth = (int) (scaleHeight * scaling);
                    startX = (int) ((width - scaleWidth) / 2);
                    startY = 0;
                }
            } else if (mode == ThumbGeneratorMode.ScaleByWidth) {
                scaleWidth = width;
                scaleHeight = (int) (scaleWidth / scaling);
                height = scaleHeight;
                startX = 0;
                startY = 0;
            } else if (mode == ThumbGeneratorMode.ScaleByHeight) {
                scaleHeight = height;
                scaleWidth = (int) (scaleHeight * scaling);
                width = scaleWidth;
                startX = 0;
                startY = 0;
            }


            // 设置缩略图文件名
            // 如原图为afcdeftgh1234321.jpg
            // 则缩略图格式为afcdeftgh1234321_width*height.jpg
            String thumbFileName = FilenameUtils.getBaseName(imageFullName)
                    + "_" + width + "x" + height + "." + fileSuffix;
            // 设置缩略图带完整路径的文件名
            String thumbFullName = FilenameUtils.getFullPath(imageFullName)
                    + thumbFileName;

            logger.debug("缩略图完整文件名：{}", thumbFullName);


            File fo = new File(thumbFullName); // 将要转换出的小图文件
            // 直接返回如果缩略图已存在.
            if (fo.exists()) {
                return thumbFullName;
            }

            Image image = originalImage.getScaledInstance(scaleWidth,
                    scaleHeight, Image.SCALE_SMOOTH);
            BufferedImage tag = new BufferedImage(width, height,
                    BufferedImage.TYPE_INT_RGB);
            Graphics g = tag.getGraphics();
            g.setColor(Color.white);
            g.fillRect(0, 0, width, height);
            g.drawImage(image, startX, startY, null); // 绘制缩小后的图
            g.dispose();
            ImageIO.write(tag, fileSuffix, fo);// 输出到文件流

            logger.debug("成功为{}生成缩略图{}", new Object[]{imageFullName, thumbFullName});
            return thumbFullName;
        } catch (Exception e) {
            logger.error("为{}生成缩略图时发生错误：{}",
                    new Object[]{imageFullName, e});
            return null;
        }
    }
}
