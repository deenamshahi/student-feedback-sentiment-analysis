package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Service;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.CombinedSentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.CourseFeedbackSummaryDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.SentimentCountDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto.TeacherFeedbackSummaryDto;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.CourseFeedbackRepo;
import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo.TeacherFeedbackRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    public List<CourseFeedbackSummaryDto> getAllCoursesFeedbackSummary() {
        List<Object[]> results = courseFeedbackRepo.findCoursesWithFeedbackCounts();
        List<CourseFeedbackSummaryDto> summaries = new ArrayList<>();

        for (Object[] result : results) {
            CourseFeedbackSummaryDto summary = new CourseFeedbackSummaryDto();
            summary.setCourseId((Long) result[0]);
            summary.setCourseCode((String) result[1]);
            summary.setCourseName((String) result[2]);
            summary.setFeedbackCount(((Number) result[3]).longValue());
            summary.setPositive(result[4] != null ? ((Number) result[4]).longValue() : 0L);
            summary.setNegative(result[5] != null ? ((Number) result[5]).longValue() : 0L);
            summary.setNeutral(result[6] != null ? ((Number) result[6]).longValue() : 0L);
            summaries.add(summary);
        }

        return summaries;
    }

    public List<TeacherFeedbackSummaryDto> getAllTeachersFeedbackSummary() {
        List<Object[]> results = teacherFeedbackRepo.findTeachersWithFeedbackCounts();
        List<TeacherFeedbackSummaryDto> summaries = new ArrayList<>();

        for (Object[] result : results) {
            TeacherFeedbackSummaryDto summary = new TeacherFeedbackSummaryDto();
            summary.setTeacherId((Long) result[0]);
            summary.setTeacherCode((String) result[1]);
            summary.setFirstName((String) result[2]);
            summary.setLastName((String) result[3]);
            summary.setDepartment((String) result[4]);
            summary.setFeedbackCount(((Number) result[5]).longValue());
            summary.setPositive(result[6] != null ? ((Number) result[6]).longValue() : 0L);
            summary.setNegative(result[7] != null ? ((Number) result[7]).longValue() : 0L);
            summary.setNeutral(result[8] != null ? ((Number) result[8]).longValue() : 0L);
            summaries.add(summary);
        }

        return summaries;
    }
}