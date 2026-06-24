using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using EmployeeFeature.Application.Repository;

namespace EmployeeFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddEmployeeDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, EmployeeEntityConfigurator>());
            services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            return services;
        }
    }
}
