package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.TeacherFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherFeedbackRepo extends JpaRepository<TeacherFeedback, Long> {
}
