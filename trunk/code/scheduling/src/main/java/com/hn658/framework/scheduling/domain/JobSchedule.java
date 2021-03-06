package com.hn658.framework.scheduling.domain;

import java.io.Serializable;
/**
 * 
 * 作业对象
 * <p style="display:none">modifyRecord</p>
 * <p style="display:none">version:V1.0,author:平台开发小组,date:2013-1-22 上午9:24:13,content:TODO </p>
 * @author 平台开发小组
 * @date 2013-1-22 上午9:24:13
 * @since
 * @version
 */
public class JobSchedule implements Serializable {

	private static final long serialVersionUID = -8438781827087639905L;
	
	/**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.ID
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String id;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.TRIGGER_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String triggerGroup;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.TRIGGER_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String triggerName;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.JOB_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String jobGroup;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.JOB_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String jobName;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.DESCRIPTION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String description;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.TRIGGER_TYPE
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private Integer triggerType;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.TRIGGER_EXPRESSION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String triggerExpression;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.JOB_CLASS
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String jobClass;
    /**
     * This field was generated by MyBatis Generator. This field corresponds to the database column quartz..job_schedule.JOB_DATA
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    private String jobData;

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.ID
     * @return  the value of quartz..job_schedule.ID
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getId() {
        return id;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.ID
     * @param id  the value for quartz..job_schedule.ID
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.TRIGGER_GROUP
     * @return  the value of quartz..job_schedule.TRIGGER_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getTriggerGroup() {
        return triggerGroup;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.TRIGGER_GROUP
     * @param triggerGroup  the value for quartz..job_schedule.TRIGGER_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setTriggerGroup(String triggerGroup) {
        this.triggerGroup = triggerGroup;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.TRIGGER_NAME
     * @return  the value of quartz..job_schedule.TRIGGER_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getTriggerName() {
        return triggerName;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.TRIGGER_NAME
     * @param triggerName  the value for quartz..job_schedule.TRIGGER_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setTriggerName(String triggerName) {
        this.triggerName = triggerName;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.JOB_GROUP
     * @return  the value of quartz..job_schedule.JOB_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getJobGroup() {
        return jobGroup;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.JOB_GROUP
     * @param jobGroup  the value for quartz..job_schedule.JOB_GROUP
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setJobGroup(String jobGroup) {
        this.jobGroup = jobGroup;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.JOB_NAME
     * @return  the value of quartz..job_schedule.JOB_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getJobName() {
        return jobName;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.JOB_NAME
     * @param jobName  the value for quartz..job_schedule.JOB_NAME
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.DESCRIPTION
     * @return  the value of quartz..job_schedule.DESCRIPTION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getDescription() {
        return description;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.DESCRIPTION
     * @param description  the value for quartz..job_schedule.DESCRIPTION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.TRIGGER_TYPE
     * @return  the value of quartz..job_schedule.TRIGGER_TYPE
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public Integer getTriggerType() {
        return triggerType;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.TRIGGER_TYPE
     * @param triggerType  the value for quartz..job_schedule.TRIGGER_TYPE
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setTriggerType(Integer triggerType) {
        this.triggerType = triggerType;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.TRIGGER_EXPRESSION
     * @return  the value of quartz..job_schedule.TRIGGER_EXPRESSION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getTriggerExpression() {
        return triggerExpression;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.TRIGGER_EXPRESSION
     * @param triggerExpression  the value for quartz..job_schedule.TRIGGER_EXPRESSION
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setTriggerExpression(String triggerExpression) {
        this.triggerExpression = triggerExpression;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.JOB_CLASS
     * @return  the value of quartz..job_schedule.JOB_CLASS
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getJobClass() {
        return jobClass;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.JOB_CLASS
     * @param jobClass  the value for quartz..job_schedule.JOB_CLASS
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setJobClass(String jobClass) {
        this.jobClass = jobClass;
    }

    /**
     * This method was generated by MyBatis Generator. This method returns the value of the database column quartz..job_schedule.JOB_DATA
     * @return  the value of quartz..job_schedule.JOB_DATA
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public String getJobData() {
        return jobData;
    }

    /**
     * This method was generated by MyBatis Generator. This method sets the value of the database column quartz..job_schedule.JOB_DATA
     * @param jobData  the value for quartz..job_schedule.JOB_DATA
     * @mbggenerated  Tue Oct 23 11:43:38 CST 2012
     */
    public void setJobData(String jobData) {
        this.jobData = jobData;
    }

}
