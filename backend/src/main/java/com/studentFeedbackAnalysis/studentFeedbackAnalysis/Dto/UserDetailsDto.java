package com.studentFeedbackAnalysis.studentFeedbackAnalysis.Dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserDetailsDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String roleName;
    private LocalDateTime createdAt;

    // Student-specific fields
    private Long studentDbId;
    private String studentId;
    private String intakeYear;
    private String programme;
    private List<CourseWithTeachersDto> enrolledCourses;

    // Teacher-specific fields
    private Long teacherDbId;
    private String teacherId;
    private String department;
    private List<CourseDto> teachingCourses;

    // Admin-specific fields
    private Long adminDbId;
    private String adminId;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getStudentDbId() {
        return studentDbId;
    }

    public void setStudentDbId(Long studentDbId) {
        this.studentDbId = studentDbId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getIntakeYear() {
        return intakeYear;
    }

    public void setIntakeYear(String intakeYear) {
        this.intakeYear = intakeYear;
    }

    public String getProgramme() {
        return programme;
    }

    public void setProgramme(String programme) {
        this.programme = programme;
    }

    public List<CourseWithTeachersDto> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<CourseWithTeachersDto> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }

    public Long getTeacherDbId() {
        return teacherDbId;
    }

    public void setTeacherDbId(Long teacherDbId) {
        this.teacherDbId = teacherDbId;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public List<CourseDto> getTeachingCourses() {
        return teachingCourses;
    }

    public void setTeachingCourses(List<CourseDto> teachingCourses) {
        this.teachingCourses = teachingCourses;
    }

    public Long getAdminDbId() {
        return adminDbId;
    }

    public void setAdminDbId(Long adminDbId) {
        this.adminDbId = adminDbId;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }
}