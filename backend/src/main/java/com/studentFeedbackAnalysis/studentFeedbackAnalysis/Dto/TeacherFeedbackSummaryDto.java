package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto;

public class TeacherFeedbackSummaryDto {
    private Long teacherId;
    private String teacherCode;
    private String firstName;
    private String lastName;
    private String department;
    private Long feedbackCount;
    private Long positive;
    private Long negative;
    private Long neutral;

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherCode() {
        return teacherCode;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getFeedbackCount() {
        return feedbackCount;
    }

    public void setFeedbackCount(Long feedbackCount) {
        this.feedbackCount = feedbackCount;
    }

    public Long getPositive() {
        return positive;
    }

    public void setPositive(Long positive) {
        this.positive = positive;
    }

    public Long getNegative() {
        return negative;
    }

    public void setNegative(Long negative) {
        this.negative = negative;
    }

    public Long getNeutral() {
        return neutral;
    }

    public void setNeutral(Long neutral) {
        this.neutral = neutral;
    }
}