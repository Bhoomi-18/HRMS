using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace PayrollFeature.Application.DTO
{
    public interface IPayrollIdDto
    {
        string? PayrollId { get; set; }
    }

    public interface IPayrollPayloadDto
    {
        string? EmployeeId { get; set; }
        string? Month { get; set; }
        decimal? BasicSalary { get; set; }
        decimal? Bonus { get; set; }
        decimal? Deductions { get; set; }
        decimal? NetSalary { get; set; }
        string? PaymentStatus { get; set; }
    }

    public class CreatePayrollDto : IPayrollPayloadDto
    {
        public string? EmployeeId { get; set; }
        public string? Month { get; set; }
        public decimal? BasicSalary { get; set; }
        public decimal? Bonus { get; set; }
        public decimal? Deductions { get; set; }
        public decimal? NetSalary { get; set; }
        public string? PaymentStatus { get; set; }
    }

    public class CreatePayrollRequest : ExecutionRequest, IRequest<BaseResponse<CreatePayrollResponse>>
    {
        public CreatePayrollDto? RequestParam { get; set; }
    }

    public class UpdatePayrollDto : IPayrollIdDto, IPayrollPayloadDto
    {
        public string? PayrollId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Month { get; set; }
        public decimal? BasicSalary { get; set; }
        public decimal? Bonus { get; set; }
        public decimal? Deductions { get; set; }
        public decimal? NetSalary { get; set; }
        public string? PaymentStatus { get; set; }
    }

    public class UpdatePayrollRequest : ExecutionRequest, IRequest<BaseResponse<UpdatePayrollResponse>>
    {
        public UpdatePayrollDto? RequestParam { get; set; }
    }

    public class DeletePayrollDto : IPayrollIdDto
    {
        public string? PayrollId { get; set; }
    }

    public class DeletePayrollRequest : ExecutionRequest, IRequest<BaseResponse<DeletePayrollResponse>>
    {
        public DeletePayrollDto? RequestParam { get; set; }
    }

    public class GetAllPayrollDto
    {
        public string? PayrollId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Month { get; set; }
        public string? PaymentStatus { get; set; }
        public string? Keyword { get; set; }
    }

    public class GetAllPayrollRequest : Request, IRequest<BaseResponsePagination<GetAllPayrollResponse>>
    {
        public GetAllPayrollDto? RequestParam { get; set; }
    }
}
