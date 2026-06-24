using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using AttendanceFeature.Application.Repository;

namespace AttendanceFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddAttendanceDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, AttendanceEntityConfigurator>());
            services.AddScoped<IAttendanceRepository, AttendanceRepository>();
            return services;
        }
    }
}
