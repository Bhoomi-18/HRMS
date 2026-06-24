using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using PayrollFeature.Application.DTO;
using PayrollFeature.Application.Repository;
using PayrollFeature.Domain;

namespace PayrollFeature.Infrastructure
{
    public class PayrollEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payroll>(entity =>
            {
                entity.ToTable("Payroll");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.Property(e => e.EmployeeId).IsRequired().HasMaxLength(128);
                entity.Property(e => e.Month).HasMaxLength(50);
                entity.Property(e => e.PaymentStatus).HasMaxLength(50);
                entity.Property(e => e.BasicSalary).HasColumnType("numeric(18,2)");
                entity.Property(e => e.Bonus).HasColumnType("numeric(18,2)");
                entity.Property(e => e.Deductions).HasColumnType("numeric(18,2)");
                entity.Property(e => e.NetSalary).HasColumnType("numeric(18,2)");
                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Month);
                entity.HasIndex(e => e.PaymentStatus);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class PayrollRepository : PostgresDbRepository<Payroll>, IPayrollRepository
    {
        public PayrollRepository(
            PostgresDbContext context,
            ILogger<PayrollRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        { }

        public override string TableName { get; } = nameof(Payroll);
        public override string GenerateId(Payroll entity) => Guid.NewGuid().ToString();

        private Expression<Func<Payroll, bool>> BuildQuery(GetAllPayrollRequest request)
        {
            Expression<Func<Payroll, bool>> filter = x => x.DocumentType == nameof(Payroll);

            if (request.RequestParam == null)
                return filter;

            var param = request.RequestParam;

            if (!string.IsNullOrEmpty(param.PayrollId))
                filter = filter.And(x => x.Id == param.PayrollId);

            if (!string.IsNullOrEmpty(param.EmployeeId))
                filter = filter.And(x => x.EmployeeId == param.EmployeeId);

            if (!string.IsNullOrEmpty(param.Month))
                filter = filter.And(x => x.Month == param.Month);

            if (!string.IsNullOrEmpty(param.PaymentStatus))
                filter = filter.And(x => x.PaymentStatus == param.PaymentStatus);

            if (!string.IsNullOrEmpty(param.Keyword))
            {
                var kw = param.Keyword.ToLower().Trim();
                Expression<Func<Payroll, bool>> kf = n => false;
                kf = kf
                    .Or(a => a.EmployeeId != null && a.EmployeeId.ToLower().Contains(kw))
                    .Or(a => a.Month != null && a.Month.ToLower().Contains(kw));
                filter = filter.And(kf);
            }

            return filter;
        }

        public async Task<(IEnumerable<Payroll> result, int count)> GetAllPayrollWithCountAsync(GetAllPayrollRequest request)
        {
            var orderBy = request.OrderByCriteria != null ? OrderBy(request) : x => x.ModifiedOn;
            return await GetItemsWithCountAsync(BuildQuery(request), request, orderBy);
        }

        public async Task<Payroll?> GetPayrollAsync(GetAllPayrollRequest request)
        {
            return (await GetItemAsync(BuildQuery(request)))!;
        }
    }
}
