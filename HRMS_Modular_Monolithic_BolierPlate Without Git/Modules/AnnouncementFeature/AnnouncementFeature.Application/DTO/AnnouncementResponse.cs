using HRMS.Shared.Application.DTOs;

namespace AnnouncementFeature.Application.DTO
{
    public class CreateAnnouncementResponse
    {
        public string? AnnouncementId { get; set; }
    }

    public class UpdateAnnouncementResponse
    {
        public string? AnnouncementId { get; set; }
    }

    public class DeleteAnnouncementResponse
    {
        public string? AnnouncementId { get; set; }
    }

    public class GetAllAnnouncementItem
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
        public UserBaseItem? UserContext { get; set; }
    }

    public class GetAllAnnouncementResponse
    {
        public List<GetAllAnnouncementItem>? Announcement { get; set; }
    }
}
