using HRMS.Shared.Application.DTOs;

namespace PayrollFeature.Application.DTO
{
    public class CreatePayrollResponse
    {
        public string? PayrollId { get; set; }
    }

    public class UpdatePayrollResponse
    {
        public string? PayrollId { get; set; }
    }

    public class DeletePayrollResponse
    {
        public string? PayrollId { get; set; }
    }

    public class GetAllPayrollItem
    {
        public string? PayrollId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Month { get; set; }
        public decimal? BasicSalary { get; set; }
        public decimal? Bonus { get; set; }
        public decimal? Deductions { get; set; }
        public decimal? NetSalary { get; set; }
        public string? PaymentStatus { get; set; }
        public UserBaseItem? UserContext { get; set; }
    }

    public class GetAllPayrollResponse
    {
        public List<GetAllPayrollItem>? Payroll { get; set; }
    }
}
