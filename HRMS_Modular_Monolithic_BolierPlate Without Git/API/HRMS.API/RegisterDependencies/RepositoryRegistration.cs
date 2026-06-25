using TodoFeature.Infrastructure;
using EmployeeFeature.Infrastructure;
using AttendanceFeature.Infrastructure;
using LeaveFeature.Infrastructure;
using PayrollFeature.Infrastructure;
using AnnouncementFeature.Infrastructure;

namespace HRMS.API.RegisterDependencies
{
    public static class RepositoryRegistration
    {
        public static IServiceCollection AddModulesDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddTodoDependency(configuration);
            services.AddEmployeeDependency(configuration);
            services.AddAttendanceDependency(configuration);
            services.AddLeaveDependency(configuration);
            services.AddPayrollDependency(configuration);
            services.AddAnnouncementDependency(configuration);
            return services;
        }
    }
}
