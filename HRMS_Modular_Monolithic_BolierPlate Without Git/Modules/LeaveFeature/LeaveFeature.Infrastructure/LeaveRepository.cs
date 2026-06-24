using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using LeaveFeature.Application.DTO;
using LeaveFeature.Application.Repository;
using LeaveFeature.Domain;

namespace LeaveFeature.Infrastructure
{
    public class LeaveEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Leave>(entity =>
            {
                entity.ToTable("Leave");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(128);
                entity.Property(e => e.LeaveType).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.Reason).HasMaxLength(1000);
                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.LeaveType);
                entity.HasIndex(e => e.Status);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class LeaveRepository : PostgresDbRepository<Leave>, ILeaveRepository
    {
        public LeaveRepository(
            PostgresDbContext context,
            ILogger<LeaveRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        { }

        public override string TableName { get; } = nameof(Leave);
        public override string GenerateId(Leave entity) => Guid.NewGuid().ToString();

        private Expression<Func<Leave, bool>> BuildQuery(GetAllLeaveRequest request)
        {
            Expression<Func<Leave, bool>> filter = x => x.DocumentType == nameof(Leave);

            if (request.RequestParam == null)
                return filter;

            var param = request.RequestParam;

            if (!string.IsNullOrEmpty(param.LeaveId))
                filter = filter.And(x => x.Id == param.LeaveId);

            if (!string.IsNullOrEmpty(param.EmployeeId))
                filter = filter.And(x => x.EmployeeId == param.EmployeeId);

            if (!string.IsNullOrEmpty(param.LeaveType))
                filter = filter.And(x => x.LeaveType == param.LeaveType);

            if (!string.IsNullOrEmpty(param.Status))
                filter = filter.And(x => x.Status == param.Status);

            if (!string.IsNullOrEmpty(param.Keyword))
            {
                var kw = param.Keyword.ToLower().Trim();
                Expression<Func<Leave, bool>> kf = n => false;
                kf = kf
                    .Or(a => a.Reason != null && a.Reason.ToLower().Contains(kw));
                filter = filter.And(kf);
            }

            return filter;
        }

        public async Task<(IEnumerable<Leave> result, int count)> GetAllLeaveWithCountAsync(GetAllLeaveRequest request)
        {
            var orderBy = request.OrderByCriteria != null ? OrderBy(request) : x => x.ModifiedOn;
            return await GetItemsWithCountAsync(BuildQuery(request), request, orderBy);
        }

        public async Task<Leave?> GetLeaveAsync(GetAllLeaveRequest request)
        {
            return (await GetItemAsync(BuildQuery(request)))!;
        }
    }
}
