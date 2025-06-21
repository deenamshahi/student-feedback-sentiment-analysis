package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Controller;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.CombinedSentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.SentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.StandardResponse;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service.FeedbackAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class FeedbackAnalyticsController {

    @Autowired
    private FeedbackAnalyticsService feedbackAnalyticsService;

    // 1. Get counts for all feedback (both teacher and course)
    @GetMapping("/feedback/sentiment")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<StandardResponse<CombinedSentimentCountDto>> getAllFeedbackSentimentCounts() {
        CombinedSentimentCountDto counts = feedbackAnalyticsService.getAllFeedbackSentimentCounts();
        StandardResponse<CombinedSentimentCountDto> response = new StandardResponse<>(
                HttpStatus.OK.value(),
                "Retrieved sentiment counts for all feedback",
                counts
        );
        return ResponseEntity.ok(response);
    }

    // 2. Get counts for all teacher feedback
    @GetMapping("/teachers/feedback/sentiment")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<StandardResponse<SentimentCountDto>> getTeacherFeedbackSentimentCounts() {
        SentimentCountDto counts = feedbackAnalyticsService.getTeacherFeedbackSentimentCounts();
        StandardResponse<SentimentCountDto> response = new StandardResponse<>(
                HttpStatus.OK.value(),
                "Retrieved sentiment counts for all teacher feedback",
                counts
        );
        return ResponseEntity.ok(response);
    }

    // 3. Get counts for all course feedback
    @GetMapping("/courses/feedback/sentiment")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<StandardResponse<SentimentCountDto>> getCourseFeedbackSentimentCounts() {
        SentimentCountDto counts = feedbackAnalyticsService.getCourseFeedbackSentimentCounts();
        StandardResponse<SentimentCountDto> response = new StandardResponse<>(
                HttpStatus.OK.value(),
                "Retrieved sentiment counts for all course feedback",
                counts
        );
        return ResponseEntity.ok(response);
    }

    // 4. Get counts for a specific course's feedback
    @GetMapping("/courses/{courseId}/feedback/sentiment")
    @PreAuthorize("hasAnyAuthority('Admin', 'Teacher')")
    public ResponseEntity<StandardResponse<SentimentCountDto>> getCourseFeedbackSentimentCounts(
            @PathVariable Long courseId) {
        SentimentCountDto counts = feedbackAnalyticsService.getCourseFeedbackSentimentCounts(courseId);
        StandardResponse<SentimentCountDto> response = new StandardResponse<>(
                HttpStatus.OK.value(),
                "Retrieved sentiment counts for course ID: " + courseId,
                counts
        );
        return ResponseEntity.ok(response);
    }

    // 5. Get counts for a specific teacher's feedback
    @GetMapping("/teachers/{teacherId}/feedback/sentiment")
    @PreAuthorize("hasAnyAuthority('Admin', 'Teacher')")
    public ResponseEntity<StandardResponse<SentimentCountDto>> getTeacherFeedbackSentimentCounts(
            @PathVariable Long teacherId) {
        SentimentCountDto counts = feedbackAnalyticsService.getTeacherFeedbackSentimentCounts(teacherId);
        StandardResponse<SentimentCountDto> response = new StandardResponse<>(
                HttpStatus.OK.value(),
                "Retrieved sentiment counts for teacher ID: " + teacherId,
                counts
        );
        return ResponseEntity.ok(response);
    }
}