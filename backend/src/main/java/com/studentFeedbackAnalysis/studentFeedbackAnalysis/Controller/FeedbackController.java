package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Controller;


import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.Course;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.CourseFeedback;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.Teacher;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.TeacherFeedback;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.CourseRepo;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.TeacherRepo;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final CourseRepo courseRepository;
    private final TeacherRepo teacherRepository;

    public FeedbackController(FeedbackService feedbackService,
                              CourseRepo courseRepository,
                              TeacherRepo teacherRepository) {
        this.feedbackService = feedbackService;
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> submitCourseFeedback(@PathVariable Long courseId,
                                                  @RequestBody Map<String, String> payload) {
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Course not found");
        }

        String feedbackText = payload.get("feedback");
        if (feedbackText == null || feedbackText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Feedback text is required");
        }

        CourseFeedback savedFeedback = feedbackService.saveCourseFeedback(feedbackText, courseOpt.get());
        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }

    @PostMapping("/teacher/{teacherId}")
    public ResponseEntity<?> submitTeacherFeedback(@PathVariable Long teacherId,
                                                   @RequestBody Map<String, String> payload) {
        Optional<Teacher> teacherOpt = teacherRepository.findById(teacherId);
        if (teacherOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Teacher not found");
        }

        String feedbackText = payload.get("feedback");
        if (feedbackText == null || feedbackText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Feedback text is required");
        }

        TeacherFeedback savedFeedback = feedbackService.saveTeacherFeedback(feedbackText, teacherOpt.get());
        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }
}
