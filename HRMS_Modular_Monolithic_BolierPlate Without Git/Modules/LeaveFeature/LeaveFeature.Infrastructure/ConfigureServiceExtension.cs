using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using LeaveFeature.Application.Repository;

namespace LeaveFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddLeaveDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, LeaveEntityConfigurator>());
            services.AddScoped<ILeaveRepository, LeaveRepository>();
            return services;
        }
    }
}
