package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseFeedbackRepo extends JpaRepository<CourseFeedback, Long> {
    Long countBySentiment(String sentiment);

    @Query("SELECT COUNT(c) FROM CourseFeedback c WHERE c.sentiment = ?1 AND c.course.id = ?2")
    Long countBySentimentAndCourseId(String sentiment, Long courseId);
}