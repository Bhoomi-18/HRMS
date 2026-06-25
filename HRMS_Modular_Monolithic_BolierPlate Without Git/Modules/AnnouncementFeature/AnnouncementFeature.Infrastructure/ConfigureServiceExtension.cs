using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using AnnouncementFeature.Application.Repository;

namespace AnnouncementFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAnnouncementDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
            return services;
        }
    }
}
