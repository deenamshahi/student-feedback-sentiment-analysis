package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.TeacherFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherFeedbackRepo extends JpaRepository<TeacherFeedback, Long> {
    Long countBySentiment(String sentiment);

    @Query("SELECT COUNT(t) FROM TeacherFeedback t WHERE t.sentiment = ?1 AND t.teacher.id = ?2")
    Long countBySentimentAndTeacherId(String sentiment, Long teacherId);

    @Query("SELECT t.id, t.teacherId, t.user.firstName, t.user.lastName, t.department, " +
            "COUNT(tf), " +
            "SUM(CASE WHEN tf.sentiment = 'positive' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN tf.sentiment = 'negative' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN tf.sentiment = 'neutral' THEN 1 ELSE 0 END) " +
            "FROM Teacher t LEFT JOIN TeacherFeedback tf ON t.id = tf.teacher.id " +
            "GROUP BY t.id, t.teacherId, t.user.firstName, t.user.lastName, t.department")
    List<Object[]> findTeachersWithFeedbackCounts();
}