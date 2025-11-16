// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/admin/AdminLogin";
import AdminRegister from "./components/admin/AdminRegister";
import AdminDashboard from "./components/admin/AdminDashboard"; // Protected route example
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import StudentRegister from "./components/student/StudentRegister";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentLogin from "./components/student/StudentLogin";
import TeacherRegister from "./components/teacher/TeacherRegister";
import TeacherLogin from "./components/teacher/TeacherLogin";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import CreateSession from "./components/admin/CreateSession";
import ViewSessions from "./components/admin/ViewSessions";
import EditSession from "./components/admin/EditSession";
import SidebarLayout from "./components/admin/SidebarLayout";
import CreateSemester from "./components/admin/CreateSemester";
import ViewSemesters from "./components/admin/ViewSemesters";
import EditSemester from "./components/admin/EditSemester";
import ViewSections from "./components/admin/ViewSections";
import EditSection from "./components/admin/EditSection";
import CreateSection from "./components/admin/CreateSection";
import CreateSubject from "./components/admin/CreateSubject";
import ViewSubjects from "./components/admin/ViewSubjects";
import EditSubject from "./components/admin/EditSubject";
import ViewAdminList from "./components/admin/ViewAdminList";
import EditAdmin from "./components/admin/EditAdmin";
import EditTeacher from "./components/admin/EditTeacher";
import ViewTeacherList from "./components/admin/ViewTeacherList";
import ViewStudentList from "./components/admin/ViewStudentList";
import EditStudent from "./components/admin/EditStudent";
import ViewCTExams from "./components/teacher/ViewCTExams";
import EditCTExam from "./components/teacher/EditCTExam";
import EditTeacherSchedule from "./components/admin/EditTeacherSchedule";
import CreateTeacherSchedule from "./components/admin/CreateTeacherSchedule";
import ViewTeacherSchedules from "./components/admin/ViewTeacherSchedules";
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import CreateCTExam from "./components/teacher/CreateCTExam";
import TeacherSidebarLayout from "./components/teacher/TeacherSidebarLayout";
import ViewClassSchedule from "./components/teacher/ViewClassSchedule";
import CreateAssignment from "./components/teacher/CreateAssignment";
import ViewAssignments from "./components/teacher/ViewAssignments";
import EditAssignment from "./components/teacher/EditAssignment";
import StudentSidebarLayout from "./components/student/StudentSidebarLayout";
import EnrollSubject from "./components/student/EnrollSubject";
import ViewEnrollments from "./components/admin/ViewEnrollments";
import ViewEnrolledSubjects from "./components/student/ViewEnrolledSubjects";
import ViewStudentSchedule from "./components/student/ViewStudentSchedule";
import SubmitAssignments from "./components/student/SubmitAssignments";
import ViewSubmittedAssignments from "./components/student/ViewSubmittedAssignments";
import ViewAllAssignmentsWithSubmissions from "./components/teacher/ViewAllAssignmentsWithSubmissions";
import GradeAssignment from "./components/teacher/GradeAssignment";
import MarkAttendance from "./components/teacher/MarkAttendance";
import ViewStudentCTExams from "./components/student/ViewStudentCTExams";
import CTExamMarks from "./components/teacher/CTExamMarks";
import ViewStudentCTExamMarks from "./components/student/ViewStudentCTExamMarks";
import ViewAttendance from "./components/teacher/ViewAttendance";
import ViewStudentAttendance from "./components/student/ViewStudentAttendance";
import ViewResults from "./components/teacher/ViewResults";
import GradeStudent from "./components/teacher/GradeStudent";
import ViewGrades from "./components/teacher/ViewGrades";
import EditGrade from "./components/teacher/EditGrade";
import ViewStudentGrades from "./components/student/ViewStudentGrades";
import ViewMarks from "./components/student/ViewMarks";
import ViewResultsBySemester from "./components/student/ViewResultsBySemester";
import AdminViewResults from "./components/admin/AdminViewResults";
import AdminGradeDetails from "./components/admin/AdminGradeDetails";
import AdminEditGrade from "./components/admin/AdminEditGrade";
import ViewOverallResult from "./components/admin/ViewOverallResult";
import ViewSemesterWiseResult from "./components/admin/ViewSemesterWiseResult";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        {/* Public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected Admin route */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route
            path="/admin/dashboard"
            element={
              <SidebarLayout>
                <AdminDashboard /> {/* Only shows on this route */}
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/create-session"
            element={
              <SidebarLayout>
                <CreateSession />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-sessions"
            element={
              <SidebarLayout>
                <ViewSessions />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-session/:id"
            element={
              <SidebarLayout>
                <EditSession />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/create-semester"
            element={
              <SidebarLayout>
                <CreateSemester />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-semesters"
            element={
              <SidebarLayout>
                <ViewSemesters />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-semester/:id"
            element={
              <SidebarLayout>
                <EditSemester />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/create-section"
            element={
              <SidebarLayout>
                <CreateSection />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-sections"
            element={
              <SidebarLayout>
                <ViewSections />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-section/:id"
            element={
              <SidebarLayout>
                <EditSection />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/create-subject"
            element={
              <SidebarLayout>
                <CreateSubject />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-subjects"
            element={
              <SidebarLayout>
                <ViewSubjects />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-subject/:id"
            element={
              <SidebarLayout>
                <EditSubject />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-admins"
            element={
              <SidebarLayout>
                <ViewAdminList />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-admin/:id"
            element={
              <SidebarLayout>
                <EditAdmin />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-teachers"
            element={
              <SidebarLayout>
                <ViewTeacherList />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-teacher/:id"
            element={
              <SidebarLayout>
                <EditTeacher />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-students"
            element={
              <SidebarLayout>
                <ViewStudentList />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-student/:id"
            element={
              <SidebarLayout>
                <EditStudent />
              </SidebarLayout>
            }
          />

          <Route
            path="/admin/create-teacher-schedule"
            element={
              <SidebarLayout>
                <CreateTeacherSchedule />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-overall-result"
            element={
              <SidebarLayout>
                <ViewOverallResult />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-semesterwise-result/:studentId"
            element={
              <SidebarLayout>
                <ViewSemesterWiseResult />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/edit-grade/:gradeId"
            element={
              <SidebarLayout>
                <AdminEditGrade />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-results"
            element={
              <SidebarLayout>
                <AdminViewResults />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-grades/:studentId/:sessionId"
            element={
              <SidebarLayout>
                <AdminGradeDetails />
              </SidebarLayout>
            }
          />

          <Route
            path="/admin/view-teacher-schedules"
            element={
              <SidebarLayout>
                <ViewTeacherSchedules />
              </SidebarLayout>
            }
          />

          <Route
            path="/admin/edit-teacher-schedule/:id"
            element={
              <SidebarLayout>
                <EditTeacherSchedule />
              </SidebarLayout>
            }
          />
          <Route
            path="/teacher/register"
            element={
              <SidebarLayout>
                <TeacherRegister />
              </SidebarLayout>
            }
          />
          <Route
            path="/admin/view-enrollments"
            element={
              <SidebarLayout>
                <ViewEnrollments />
              </SidebarLayout>
            }
          />
        </Route>
        {/* Public Student routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* Protected Student route */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route
            path="/student/dashboard"
            element={
              <StudentSidebarLayout>
                <StudentDashboard />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/enroll-subject"
            element={
              <StudentSidebarLayout>
                <EnrollSubject />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-enrolled-subjects"
            element={
              <StudentSidebarLayout>
                <ViewEnrolledSubjects />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-attendance"
            element={
              <StudentSidebarLayout>
                <ViewStudentAttendance />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-class-schedule"
            element={
              <StudentSidebarLayout>
                <ViewStudentSchedule />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-ct-exams"
            element={
              <StudentSidebarLayout>
                <ViewStudentCTExams />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-ct-exam-marks"
            element={
              <StudentSidebarLayout>
                <ViewStudentCTExamMarks />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/submit-assignments"
            element={
              <StudentSidebarLayout>
                <SubmitAssignments />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-submitted/:studentId"
            element={
              <StudentSidebarLayout>
                <ViewSubmittedAssignments />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-grades"
            element={
              <StudentSidebarLayout>
                <ViewStudentGrades />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/results-by-semester"
            element={
              <StudentSidebarLayout>
                <ViewResultsBySemester />
              </StudentSidebarLayout>
            }
          />
          <Route
            path="/student/view-marks/:gradeId"
            element={
              <StudentSidebarLayout>
                <ViewMarks />
              </StudentSidebarLayout>
            }
          />
        </Route>

        {/* Public Teacher routes */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        {/* Protected Teacher routes */}
        <Route element={<ProtectedRoute role="teacher" />}>
          <Route
            path="/teacher/dashboard"
            element={
              <TeacherSidebarLayout>
                <TeacherDashboard /> {/* Only shows on this route */}
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/view-class-schedule"
            element={
              <TeacherSidebarLayout>
                <ViewClassSchedule />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/view-submitted-assignments"
            element={
              <TeacherSidebarLayout>
                <ViewAllAssignmentsWithSubmissions />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/create-assignment"
            element={
              <TeacherSidebarLayout>
                <CreateAssignment />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/view-assignments"
            element={
              <TeacherSidebarLayout>
                <ViewAssignments />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/grade-assignments"
            element={
              <TeacherSidebarLayout>
                <GradeAssignment />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/grade-student"
            element={
              <TeacherSidebarLayout>
                <GradeStudent />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/view-results"
            element={
              <TeacherSidebarLayout>
                <ViewResults />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/edit-grade"
            element={
              <TeacherSidebarLayout>
                <EditGrade />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/view-grades"
            element={
              <TeacherSidebarLayout>
                <ViewGrades />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/mark-attendance"
            element={
              <TeacherSidebarLayout>
                <MarkAttendance />
              </TeacherSidebarLayout>
            }
          />
          <Route
            path="/teacher/mark-ct-exams"
            element={
              <TeacherSidebarLayout>
                <CTExamMarks />
              </TeacherSidebarLayout>
            }
          />

          <Route
            path="/teacher/edit-assignment/:id"
            element={
              <TeacherSidebarLayout>
                <EditAssignment />
              </TeacherSidebarLayout>
            }
          />
        </Route>
        <Route
          path="/teacher/create-ct-exam"
          element={
            <TeacherSidebarLayout>
              <CreateCTExam />
            </TeacherSidebarLayout>
          }
        />
        <Route
          path="/teacher/view-attendance"
          element={
            <TeacherSidebarLayout>
              <ViewAttendance />
            </TeacherSidebarLayout>
          }
        />

        <Route
          path="/teacher/view-ct-exams"
          element={
            <TeacherSidebarLayout>
              <ViewCTExams />
            </TeacherSidebarLayout>
          }
        />
        <Route
          path="/teacher/edit-ct-exam/:id"
          element={
            <TeacherSidebarLayout>
              <EditCTExam />
            </TeacherSidebarLayout>
          }
        />

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
