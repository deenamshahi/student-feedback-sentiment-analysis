package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto;

public class SentimentCountDto {
    private Long positive;
    private Long negative;
    private Long neutral;

    public SentimentCountDto() {
        this.positive = 0L;
        this.negative = 0L;
        this.neutral = 0L;
    }

    public SentimentCountDto(Long positive, Long negative, Long neutral) {
        this.positive = positive;
        this.negative = negative;
        this.neutral = neutral;
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