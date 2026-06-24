using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using PayrollFeature.Application.Repository;

namespace PayrollFeature.Infrastructure
{
    public static class ConfigureServiceExtension
    {
        public static IServiceCollection AddPayrollDependency(this IServiceCollection services, IConfiguration configuration)
        {
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, PayrollEntityConfigurator>());
            services.AddScoped<IPayrollRepository, PayrollRepository>();
            return services;
        }
    }
}
