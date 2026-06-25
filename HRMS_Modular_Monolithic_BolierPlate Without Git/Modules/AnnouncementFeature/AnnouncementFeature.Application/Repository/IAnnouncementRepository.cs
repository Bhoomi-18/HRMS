using HRMS.Core.Postgres.Repositories;
using AnnouncementFeature.Application.DTO;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Application.Repository
{
    public interface IAnnouncementRepository : IPostgresRepository<Announcement>
    {
        Task<(IEnumerable<Announcement> result, int count)> GetAllAnnouncementWithCountAsync(GetAllAnnouncementRequest request);
        Task<Announcement?> GetAnnouncementAsync(GetAllAnnouncementRequest request);
    }
}
