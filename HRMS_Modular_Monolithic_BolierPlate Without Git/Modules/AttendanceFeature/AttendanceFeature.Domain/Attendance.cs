using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace AttendanceFeature.Domain
{
    public class Attendance : BaseEntity
    {
        public string? EmployeeId { get; set; }
        public DateTime? Date { get; set; }
        public string? Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? Notes { get; set; }
        public new string DocumentType { get; set; } = nameof(Attendance);
        public UserBase? UserContext { get; set; }
    }
}
