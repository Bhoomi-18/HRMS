using HRMS.Core.Postgres.Repositories;
using LeaveFeature.Application.DTO;
using LeaveFeature.Domain;

namespace LeaveFeature.Application.Repository
{
    public interface ILeaveRepository : IPostgresRepository<Leave>
    {
        Task<(IEnumerable<Leave> result, int count)> GetAllLeaveWithCountAsync(GetAllLeaveRequest request);
        Task<Leave?> GetLeaveAsync(GetAllLeaveRequest request);
    }
}
