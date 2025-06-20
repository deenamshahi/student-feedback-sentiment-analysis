package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.CombinedSentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.SentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.CourseFeedbackRepo;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.TeacherFeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FeedbackAnalyticsService {

    @Autowired
    private TeacherFeedbackRepo teacherFeedbackRepo;

    @Autowired
    private CourseFeedbackRepo courseFeedbackRepo;

    public CombinedSentimentCountDto getAllFeedbackSentimentCounts() {
        CombinedSentimentCountDto result = new CombinedSentimentCountDto();

        // Get teacher feedback counts
        SentimentCountDto teacherCounts = getTeacherFeedbackSentimentCounts();
        result.setTeacherFeedback(teacherCounts);

        // Get course feedback counts
        SentimentCountDto courseCounts = getCourseFeedbackSentimentCounts();
        result.setCourseFeedback(courseCounts);

        // Calculate total counts
        SentimentCountDto totalCounts = new SentimentCountDto(
                teacherCounts.getPositive() + courseCounts.getPositive(),
                teacherCounts.getNegative() + courseCounts.getNegative(),
                teacherCounts.getNeutral() + courseCounts.getNeutral()
        );
        result.setTotal(totalCounts);

        return result;
    }

    public SentimentCountDto getTeacherFeedbackSentimentCounts() {
        Long positiveCount = teacherFeedbackRepo.countBySentiment("positive");
        Long negativeCount = teacherFeedbackRepo.countBySentiment("negative");
        Long neutralCount = teacherFeedbackRepo.countBySentiment("neutral");

        return new SentimentCountDto(positiveCount, negativeCount, neutralCount);
    }

    public SentimentCountDto getCourseFeedbackSentimentCounts() {
        Long positiveCount = courseFeedbackRepo.countBySentiment("positive");
        Long negativeCount = courseFeedbackRepo.countBySentiment("negative");
        Long neutralCount = courseFeedbackRepo.countBySentiment("neutral");

        return new SentimentCountDto(positiveCount, negativeCount, neutralCount);
    }

    public SentimentCountDto getTeacherFeedbackSentimentCounts(Long teacherId) {
        Long positiveCount = teacherFeedbackRepo.countBySentimentAndTeacherId("positive", teacherId);
        Long negativeCount = teacherFeedbackRepo.countBySentimentAndTeacherId("negative", teacherId);
        Long neutralCount = teacherFeedbackRepo.countBySentimentAndTeacherId("neutral", teacherId);

        return new SentimentCountDto(positiveCount, negativeCount, neutralCount);
    }

    public SentimentCountDto getCourseFeedbackSentimentCounts(Long courseId) {
        Long positiveCount = courseFeedbackRepo.countBySentimentAndCourseId("positive", courseId);
        Long negativeCount = courseFeedbackRepo.countBySentimentAndCourseId("negative", courseId);
        Long neutralCount = courseFeedbackRepo.countBySentimentAndCourseId("neutral", courseId);

        return new SentimentCountDto(positiveCount, negativeCount, neutralCount);
    }
}