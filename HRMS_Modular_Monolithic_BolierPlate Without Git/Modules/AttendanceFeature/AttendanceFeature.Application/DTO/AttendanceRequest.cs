using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace AttendanceFeature.Application.DTO
{
    public interface IAttendanceIdDto
    {
        string? AttendanceId { get; set; }
    }

    public interface IAttendancePayloadDto
    {
        string? EmployeeId { get; set; }
        DateTime? Date { get; set; }
        string? Status { get; set; }
        DateTime? CheckInTime { get; set; }
        DateTime? CheckOutTime { get; set; }
        string? Notes { get; set; }
    }

    public class CreateAttendanceDto : IAttendancePayloadDto
    {
        public string? EmployeeId { get; set; }
        public DateTime? Date { get; set; }
        public string? Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<CreateAttendanceResponse>>
    {
        public CreateAttendanceDto? RequestParam { get; set; }
    }

    public class UpdateAttendanceDto : IAttendanceIdDto, IAttendancePayloadDto
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }
        public DateTime? Date { get; set; }
        public string? Status { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<UpdateAttendanceResponse>>
    {
        public UpdateAttendanceDto? RequestParam { get; set; }
    }

    public class DeleteAttendanceDto : IAttendanceIdDto
    {
        public string? AttendanceId { get; set; }
    }

    public class DeleteAttendanceRequest : ExecutionRequest, IRequest<BaseResponse<DeleteAttendanceResponse>>
    {
        public DeleteAttendanceDto? RequestParam { get; set; }
    }

    public class GetAllAttendanceDto
    {
        public string? AttendanceId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Status { get; set; }
        public string? Keyword { get; set; }
    }

    public class GetAllAttendanceRequest : Request, IRequest<BaseResponsePagination<GetAllAttendanceResponse>>
    {
        public GetAllAttendanceDto? RequestParam { get; set; }
    }
}
