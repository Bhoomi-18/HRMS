using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace EmployeeFeature.Application.DTO
{
    public interface IEmployeeIdDto
    {
        string? EmployeeId { get; set; }
    }

    public interface IEmployeePayloadDto
    {
        string? Department { get; set; }
        string? Designation { get; set; }
        string? Email { get; set; }
        string? EmployeeCode { get; set; }
        string? EmploymentType { get; set; }
        string? FirstName { get; set; }
        DateTime? JoiningDate { get; set; }
        string? LastName { get; set; }
        string? Phone { get; set; }
        decimal? Salary { get; set; }
        string? Status { get; set; }
    }

    public class CreateEmployeeDto : IEmployeePayloadDto
    {
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string? Email { get; set; }
        public string? EmployeeCode { get; set; }
        public string? EmploymentType { get; set; }
        public string? FirstName { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public decimal? Salary { get; set; }
        public string? Status { get; set; }
    }

    public class CreateEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<CreateEmployeeResponse>>
    {
        public CreateEmployeeDto? RequestParam { get; set; }
    }

    public class UpdateEmployeeDto : IEmployeeIdDto, IEmployeePayloadDto
    {
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public string? Email { get; set; }
        public string? EmployeeCode { get; set; }
        public string? EmployeeId { get; set; }
        public string? EmploymentType { get; set; }
        public string? FirstName { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public decimal? Salary { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<UpdateEmployeeResponse>>
    {
        public UpdateEmployeeDto? RequestParam { get; set; }
    }

    public class DeleteEmployeeDto : IEmployeeIdDto
    {
        public string? EmployeeId { get; set; }
    }

    public class DeleteEmployeeRequest : ExecutionRequest, IRequest<BaseResponse<DeleteEmployeeResponse>>
    {
        public DeleteEmployeeDto? RequestParam { get; set; }
    }

    public class GetAllEmployeesDto
    {
        public string? Department { get; set; }
        public string? EmployeeId { get; set; }
        public string? Keyword { get; set; }
        public string? Status { get; set; }
    }

    public class GetAllEmployeesRequest : Request, IRequest<BaseResponsePagination<GetAllEmployeesResponse>>
    {
        public GetAllEmployeesDto? RequestParam { get; set; }
    }
}
