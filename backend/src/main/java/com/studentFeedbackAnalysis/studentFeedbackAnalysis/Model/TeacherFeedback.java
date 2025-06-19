package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeacherFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String feedbackText;

    private String sentiment;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
