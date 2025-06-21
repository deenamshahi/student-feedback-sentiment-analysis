package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto;

import java.util.List;

public class CourseWithTeachersDto extends CourseDto {
    private List<TeacherInfoDto> teachers;

    public List<TeacherInfoDto> getTeachers() {
        return teachers;
    }

    public void setTeachers(List<TeacherInfoDto> teachers) {
        this.teachers = teachers;
    }
}