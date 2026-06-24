using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace PayrollFeature.Domain
{
    public class Payroll : BaseEntity
    {
        public string? EmployeeId { get; set; }
        public string? Month { get; set; }
        public decimal? BasicSalary { get; set; }
        public decimal? Bonus { get; set; }
        public decimal? Deductions { get; set; }
        public decimal? NetSalary { get; set; }
        public string? PaymentStatus { get; set; }
        public new string DocumentType { get; set; } = nameof(Payroll);
        public UserBase? UserContext { get; set; }
    }
}
