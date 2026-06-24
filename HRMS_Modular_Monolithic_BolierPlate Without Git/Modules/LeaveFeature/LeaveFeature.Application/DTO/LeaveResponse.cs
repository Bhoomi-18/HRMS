using HRMS.Shared.Application.DTOs;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class UpdateLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class DeleteLeaveResponse
    {
        public string? LeaveId { get; set; }
    }

    public class GetAllLeaveItem
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }
        public string? LeaveType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
        public UserBaseItem? UserContext { get; set; }
    }

    public class GetAllLeaveResponse
    {
        public List<GetAllLeaveItem>? Leave { get; set; }
    }
}
