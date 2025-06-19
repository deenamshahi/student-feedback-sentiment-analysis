package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Repo;

import com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model.CourseFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseFeedbackRepo extends JpaRepository<CourseFeedback, Long> {
}
