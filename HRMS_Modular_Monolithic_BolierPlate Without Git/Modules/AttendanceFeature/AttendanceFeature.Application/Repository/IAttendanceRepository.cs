using HRMS.Core.Postgres.Repositories;
using AttendanceFeature.Application.DTO;
using AttendanceFeature.Domain;

namespace AttendanceFeature.Application.Repository
{
    public interface IAttendanceRepository : IPostgresRepository<Attendance>
    {
        Task<(IEnumerable<Attendance> result, int count)> GetAllAttendanceWithCountAsync(GetAllAttendanceRequest request);
        Task<Attendance?> GetAttendanceAsync(GetAllAttendanceRequest request);
    }
}
