using HRMS.Shared.Application.DTOs;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class UpdateAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class DeleteAttendanceResponse
    {
        public string? AttendanceId { get; set; }
    }

    public class GetAllAttendanceItem
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }
        public DateTime? Date { get; set; }
        public string? Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? Notes { get; set; }
        public UserBaseItem? UserContext { get; set; }
    }

    public class GetAllAttendanceResponse
    {
        public List<GetAllAttendanceItem>? Attendance { get; set; }
    }
}
