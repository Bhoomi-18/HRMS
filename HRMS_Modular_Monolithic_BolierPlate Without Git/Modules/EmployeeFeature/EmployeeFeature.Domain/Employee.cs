using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace EmployeeFeature.Domain
{
    public class Employee : BaseEntity
    {
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string DocumentType { get; set; } = nameof(Employee);
        public string? Email { get; set; }
        public string? EmployeeCode { get; set; }
        public string? EmploymentType { get; set; }
        public string? FirstName { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public decimal? Salary { get; set; }
        public string? Status { get; set; }
        public UserBase? UserContext { get; set; }
    }
}
