using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace LeaveFeature.Domain
{
    public class Leave : BaseEntity
    {
        public string? EmployeeId { get; set; }
        public string? LeaveType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
        public new string DocumentType { get; set; } = nameof(Leave);
        public UserBase? UserContext { get; set; }
    }
}
