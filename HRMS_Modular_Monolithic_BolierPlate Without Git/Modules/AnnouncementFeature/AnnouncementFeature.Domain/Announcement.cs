using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace AnnouncementFeature.Domain
{
    public class Announcement : BaseEntity
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
        public string DocumentType { get; set; } = nameof(Announcement);
        public UserBase? UserContext { get; set; }
    }
}
