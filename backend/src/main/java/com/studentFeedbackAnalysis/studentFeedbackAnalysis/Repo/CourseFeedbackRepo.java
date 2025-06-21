package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseFeedbackRepo extends JpaRepository<CourseFeedback, Long> {
    Long countBySentiment(String sentiment);

    @Query("SELECT COUNT(c) FROM CourseFeedback c WHERE c.sentiment = ?1 AND c.course.id = ?2")
    Long countBySentimentAndCourseId(String sentiment, Long courseId);


    @Query("SELECT c.id, c.courseCode, c.courseName, " +
            "COUNT(cf), " +
            "SUM(CASE WHEN cf.sentiment = 'positive' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN cf.sentiment = 'negative' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN cf.sentiment = 'neutral' THEN 1 ELSE 0 END) " +
            "FROM Course c LEFT JOIN CourseFeedback cf ON c.id = cf.course.id " +
            "GROUP BY c.id, c.courseCode, c.courseName")
    List<Object[]> findCoursesWithFeedbackCounts();
}