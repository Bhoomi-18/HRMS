using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Helper;
using HRMS.Core.Postgres.Interfaces;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;
using AnnouncementFeature.Application.DTO;
using AnnouncementFeature.Application.Repository;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Infrastructure
{
    public class AnnouncementEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.ToTable("Announcement");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasMaxLength(128);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(128);
                entity.Property(e => e.Title).HasMaxLength(200);
                entity.Property(e => e.Category).HasMaxLength(100);
                entity.Property(e => e.Priority).HasMaxLength(50);
                entity.Property(e => e.VisibilityScope).HasMaxLength(50);
                entity.HasIndex(e => e.DocumentType);
                entity.HasIndex(e => e.Category);
                entity.HasIndex(e => e.Priority);
                entity.OwnsOne(e => e.UserContext);
            });
        }
    }

    public class AnnouncementRepository : PostgresDbRepository<Announcement>, IAnnouncementRepository
    {
        public AnnouncementRepository(
            PostgresDbContext context,
            ILogger<AnnouncementRepository> logger,
            ITelemetryService telemetryService,
            IHttpContextAccessor httpContextAccessor)
            : base(context, logger, telemetryService, httpContextAccessor)
        { }

        public override string TableName { get; } = nameof(Announcement);
        public override string GenerateId(Announcement entity) => Guid.NewGuid().ToString();

        private Expression<Func<Announcement, bool>> BuildQuery(GetAllAnnouncementRequest request)
        {
            Expression<Func<Announcement, bool>> filter = x => x.DocumentType == nameof(Announcement);

            if (request.RequestParam == null)
                return filter;

            var param = request.RequestParam;

            if (!string.IsNullOrEmpty(param.AnnouncementId))
                filter = filter.And(x => x.Id == param.AnnouncementId);

            if (!string.IsNullOrEmpty(param.Category))
                filter = filter.And(x => x.Category == param.Category);

            if (!string.IsNullOrEmpty(param.Priority))
                filter = filter.And(x => x.Priority == param.Priority);

            if (!string.IsNullOrEmpty(param.Keyword))
            {
                var kw = param.Keyword.ToLower().Trim();
                Expression<Func<Announcement, bool>> kf = n => false;
                kf = kf
                    .Or(a => a.Title != null && a.Title.ToLower().Contains(kw))
                    .Or(a => a.Content != null && a.Content.ToLower().Contains(kw));
                filter = filter.And(kf);
            }

            return filter;
        }

        public async Task<(IEnumerable<Announcement> result, int count)> GetAllAnnouncementWithCountAsync(GetAllAnnouncementRequest request)
        {
            var orderBy = request.OrderByCriteria != null ? OrderBy(request) : x => x.ModifiedOn;
            return await GetItemsWithCountAsync(BuildQuery(request), request, orderBy);
        }

        public async Task<Announcement?> GetAnnouncementAsync(GetAllAnnouncementRequest request)
        {
            return await GetItemAsync(BuildQuery(request));
        }
    }
}
