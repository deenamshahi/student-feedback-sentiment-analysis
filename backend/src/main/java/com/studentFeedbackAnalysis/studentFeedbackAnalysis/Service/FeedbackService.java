package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.Course;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.CourseFeedback;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.Teacher;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.TeacherFeedback;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.CourseFeedbackRepo;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.TeacherFeedbackRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FeedbackService {

    private final CourseFeedbackRepo courseFeedbackRepository;
    private final TeacherFeedbackRepo teacherFeedbackRepository;
    private final SentimentAnalysisService sentimentAnalysisService;

    public FeedbackService(CourseFeedbackRepo courseFeedbackRepository,
                           TeacherFeedbackRepo teacherFeedbackRepository,
                           SentimentAnalysisService sentimentAnalysisService) {
        this.courseFeedbackRepository = courseFeedbackRepository;
        this.teacherFeedbackRepository = teacherFeedbackRepository;
        this.sentimentAnalysisService = sentimentAnalysisService;
    }

    public CourseFeedback saveCourseFeedback(String feedbackText, Course course) {
        String sentiment = sentimentAnalysisService.analyzeSentiment(feedbackText);

        CourseFeedback feedback = new CourseFeedback();
        feedback.setFeedbackText(feedbackText);
        feedback.setSentiment(sentiment);
        feedback.setSubmittedAt(LocalDateTime.now());
        feedback.setCourse(course);

        return courseFeedbackRepository.save(feedback);
    }

    public TeacherFeedback saveTeacherFeedback(String feedbackText, Teacher teacher) {
        String sentiment = sentimentAnalysisService.analyzeSentiment(feedbackText);

        TeacherFeedback feedback = new TeacherFeedback();
        feedback.setFeedbackText(feedbackText);
        feedback.setSentiment(sentiment);
        feedback.setSubmittedAt(LocalDateTime.now());
        feedback.setTeacher(teacher);

        return teacherFeedbackRepository.save(feedback);
    }
}
