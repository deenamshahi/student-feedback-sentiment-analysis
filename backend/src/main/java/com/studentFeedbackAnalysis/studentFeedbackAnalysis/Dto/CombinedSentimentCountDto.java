package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto;

public class CombinedSentimentCountDto {
    private SentimentCountDto teacherFeedback;
    private SentimentCountDto courseFeedback;
    private SentimentCountDto total;

    public CombinedSentimentCountDto() {
        this.teacherFeedback = new SentimentCountDto();
        this.courseFeedback = new SentimentCountDto();
        this.total = new SentimentCountDto();
    }

    public SentimentCountDto getTeacherFeedback() {
        return teacherFeedback;
    }

    public void setTeacherFeedback(SentimentCountDto teacherFeedback) {
        this.teacherFeedback = teacherFeedback;
    }

    public SentimentCountDto getCourseFeedback() {
        return courseFeedback;
    }

    public void setCourseFeedback(SentimentCountDto courseFeedback) {
        this.courseFeedback = courseFeedback;
    }

    public SentimentCountDto getTotal() {
        return total;
    }

    public void setTotal(SentimentCountDto total) {
        this.total = total;
    }
}