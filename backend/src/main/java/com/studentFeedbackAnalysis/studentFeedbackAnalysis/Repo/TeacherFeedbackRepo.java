package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.TeacherFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherFeedbackRepo extends JpaRepository<TeacherFeedback, Long> {
    Long countBySentiment(String sentiment);

    @Query("SELECT COUNT(t) FROM TeacherFeedback t WHERE t.sentiment = ?1 AND t.teacher.id = ?2")
    Long countBySentimentAndTeacherId(String sentiment, Long teacherId);
}