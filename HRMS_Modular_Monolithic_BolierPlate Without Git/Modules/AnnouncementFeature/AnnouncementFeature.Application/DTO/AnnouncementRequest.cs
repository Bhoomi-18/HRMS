using HRMS.Core.Postgres.Common;
using HRMS.Shared.Application.DTOs;
using MediatR;

namespace AnnouncementFeature.Application.DTO
{
    public interface IAnnouncementIdDto
    {
        string? AnnouncementId { get; set; }
    }

    public interface IAnnouncementPayloadDto
    {
        string? Title { get; set; }
        string? Category { get; set; }
        string? Priority { get; set; }
        string? Content { get; set; }
        string? VisibilityScope { get; set; }
        DateTime? ExpiryDate { get; set; }
        int? Views { get; set; }
        int? Acknowledgements { get; set; }
        string? CreatedBy { get; set; }
        DateTime? CreatedAt { get; set; }
    }

    public class CreateAnnouncementDto : IAnnouncementPayloadDto
    {
        public string? Title { get; set; }
        public string? Category { get; set; }
        public string? Priority { get; set; }
        public string? Content { get; set; }
        public string? VisibilityScope { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? Views { get; set; }
        public int? Acknowledgements { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class CreateAnnouncementRequest : ExecutionRequest, IRequest<BaseResponse<CreateAnnouncementResponse>>
    {
        public CreateAnnouncementDto? RequestParam { get; set; }
    }

    public class UpdateAnnouncementDto : IAnnouncementIdDto, IAnnouncementPayloadDto
    {
        public string? AnnouncementId { get; set; }
        public string? Title { get; set; }
        public string? Category { get; set; }
        public string? Priority { get; set; }
        public string? Content { get; set; }
        public string? VisibilityScope { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int? Views { get; set; }
        public int? Acknowledgements { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class UpdateAnnouncementRequest : ExecutionRequest, IRequest<BaseResponse<UpdateAnnouncementResponse>>
    {
        public UpdateAnnouncementDto? RequestParam { get; set; }
    }

    public class DeleteAnnouncementDto : IAnnouncementIdDto
    {
        public string? AnnouncementId { get; set; }
    }

    public class DeleteAnnouncementRequest : ExecutionRequest, IRequest<BaseResponse<DeleteAnnouncementResponse>>
    {
        public DeleteAnnouncementDto? RequestParam { get; set; }
    }

    public class GetAllAnnouncementDto
    {
        public string? AnnouncementId { get; set; }
        public string? Category { get; set; }
        public string? Priority { get; set; }
        public string? VisibilityScope { get; set; }
        public string? Keyword { get; set; }
    }

    public class GetAllAnnouncementRequest : Request, IRequest<BaseResponsePagination<GetAllAnnouncementResponse>>
    {
        public GetAllAnnouncementDto? RequestParam { get; set; }
    }
}
