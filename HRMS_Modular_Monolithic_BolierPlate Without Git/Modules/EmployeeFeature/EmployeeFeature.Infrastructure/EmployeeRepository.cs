using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using EmployeeFeature.Application.DTO;
using EmployeeFeature.Application.Repository;
using EmployeeFeature.Domain;

namespace EmployeeFeature.Infrastructure
{
    public class EmployeeEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employee");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.Property(e => e.EmployeeCode).HasMaxLength(50);
                entity.Property(e => e.FirstName).HasMaxLength(200);
                entity.Property(e => e.LastName).HasMaxLength(200);
                entity.Property(e => e.Email).HasMaxLength(500);
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.Department).HasMaxLength(200);
                entity.Property(e => e.Designation).HasMaxLength(200);
                entity.Property(e => e.EmploymentType).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.Salary).HasPrecision(18, 2);
                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.EmployeeCode);
                entity.HasIndex(e => e.Status);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class EmployeeRepository : PostgresDbRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(
            PostgresDbContext context,
            ILogger<EmployeeRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        { }

        public override string TableName { get; } = nameof(Employee);
        public override string GenerateId(Employee entity) => Guid.NewGuid().ToString();

        private Expression<Func<Employee, bool>> BuildQuery(GetAllEmployeesRequest request)
        {
            Expression<Func<Employee, bool>> filter = x => x.DocumentType == nameof(Employee);

            if (request.RequestParam == null)
                return filter;

            var param = request.RequestParam;

            if (!string.IsNullOrEmpty(param.EmployeeId))
                filter = filter.And(x => x.Id == param.EmployeeId);

            if (!string.IsNullOrEmpty(param.Department))
                filter = filter.And(x => x.Department == param.Department);

            if (!string.IsNullOrEmpty(param.Status))
                filter = filter.And(x => x.Status == param.Status);

            if (!string.IsNullOrEmpty(param.Keyword))
            {
                var kw = param.Keyword.ToLower().Trim();
                Expression<Func<Employee, bool>> kf = n => false;
                kf = kf
                    .Or(a => a.FirstName != null && a.FirstName.ToLower().Contains(kw))
                    .Or(a => a.LastName != null && a.LastName.ToLower().Contains(kw))
                    .Or(a => a.Email != null && a.Email.ToLower().Contains(kw))
                    .Or(a => a.EmployeeCode != null && a.EmployeeCode.ToLower().Contains(kw))
                    .Or(a => a.Department != null && a.Department.ToLower().Contains(kw));
                filter = filter.And(kf);
            }

            return filter;
        }

        public async Task<(IEnumerable<Employee> result, int count)> GetAllEmployeesWithCountAsync(GetAllEmployeesRequest request)
        {
            var orderBy = request.OrderByCriteria != null ? OrderBy(request) : x => x.ModifiedOn;
            return await GetItemsWithCountAsync(BuildQuery(request), request, orderBy);
        }

        public async Task<Employee?> GetEmployeeAsync(GetAllEmployeesRequest request)
        {
            return await GetItemAsync(BuildQuery(request));
        }
    }
}
