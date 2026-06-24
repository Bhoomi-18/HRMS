using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using AttendanceFeature.Application.DTO;
using AttendanceFeature.Application.Repository;
using AttendanceFeature.Domain;

namespace AttendanceFeature.Infrastructure
{
    public class AttendanceEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Attendance>(entity =>
            {
                entity.ToTable("Attendance");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(128);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.Date);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class AttendanceRepository : PostgresDbRepository<Attendance>, IAttendanceRepository
    {
        public AttendanceRepository(
            PostgresDbContext context,
            ILogger<AttendanceRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        { }

        public override string TableName { get; } = nameof(Attendance);
        public override string GenerateId(Attendance entity) => Guid.NewGuid().ToString();

        private Expression<Func<Attendance, bool>> BuildQuery(GetAllAttendanceRequest request)
        {
            Expression<Func<Attendance, bool>> filter = x => x.DocumentType == nameof(Attendance);

            if (request.RequestParam == null)
                return filter;

            var param = request.RequestParam;

            if (!string.IsNullOrEmpty(param.AttendanceId))
                filter = filter.And(x => x.Id == param.AttendanceId);

            if (!string.IsNullOrEmpty(param.EmployeeId))
                filter = filter.And(x => x.EmployeeId == param.EmployeeId);

            if (!string.IsNullOrEmpty(param.Status))
                filter = filter.And(x => x.Status == param.Status);

            if (!string.IsNullOrEmpty(param.Keyword))
            {
                var kw = param.Keyword.ToLower().Trim();
                Expression<Func<Attendance, bool>> kf = n => false;
                kf = kf
                    .Or(a => a.Notes != null && a.Notes.ToLower().Contains(kw));
                filter = filter.And(kf);
            }

            return filter;
        }

        public async Task<(IEnumerable<Attendance> result, int count)> GetAllAttendanceWithCountAsync(GetAllAttendanceRequest request)
        {
            var orderBy = request.OrderByCriteria != null ? OrderBy(request) : x => x.ModifiedOn;
            return await GetItemsWithCountAsync(BuildQuery(request), request, orderBy);
        }

        public async Task<Attendance?> GetAttendanceAsync(GetAllAttendanceRequest request)
        {
            return (await GetItemAsync(BuildQuery(request)))!;
        }
    }
}
