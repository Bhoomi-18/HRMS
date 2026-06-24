using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace LeaveFeature.Application.DTO
{
    public interface ILeaveIdDto
    {
        string? LeaveId { get; set; }
    }

    public interface ILeavePayloadDto
    {
        string? EmployeeId { get; set; }
        string? LeaveType { get; set; }
        DateTime? StartDate { get; set; }
        DateTime? EndDate { get; set; }
        string? Reason { get; set; }
        string? Status { get; set; }
    }

    public class CreateLeaveDto : ILeavePayloadDto
    {
        public string? EmployeeId { get; set; }
        public string? LeaveType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }

    public class CreateLeaveRequest : ExecutionRequest, IRequest<BaseResponse<CreateLeaveResponse>>
    {
        public CreateLeaveDto? RequestParam { get; set; }
    }

    public class UpdateLeaveDto : ILeaveIdDto, ILeavePayloadDto
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }
        public string? LeaveType { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Reason { get; set; }
        public string? Status { get; set; }
    }

    public class UpdateLeaveRequest : ExecutionRequest, IRequest<BaseResponse<UpdateLeaveResponse>>
    {
        public UpdateLeaveDto? RequestParam { get; set; }
    }

    public class DeleteLeaveDto : ILeaveIdDto
    {
        public string? LeaveId { get; set; }
    }

    public class DeleteLeaveRequest : ExecutionRequest, IRequest<BaseResponse<DeleteLeaveResponse>>
    {
        public DeleteLeaveDto? RequestParam { get; set; }
    }

    public class GetAllLeaveDto
    {
        public string? LeaveId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Status { get; set; }
        public string? LeaveType { get; set; }
        public string? Keyword { get; set; }
    }

    public class GetAllLeaveRequest : Request, IRequest<BaseResponsePagination<GetAllLeaveResponse>>
    {
        public GetAllLeaveDto? RequestParam { get; set; }
    }
}
