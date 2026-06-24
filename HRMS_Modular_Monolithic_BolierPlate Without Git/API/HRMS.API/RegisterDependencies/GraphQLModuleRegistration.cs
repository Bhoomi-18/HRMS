using HotChocolate.Execution.Configuration;
using TodoFeature.GraphQL;
using EmployeeFeature.GraphQL;
using AttendanceFeature.GraphQL;
using LeaveFeature.GraphQL;
using PayrollFeature.GraphQL;

namespace HRMS.API.RegisterDependencies
{
    public static class GraphQLModuleRegistration
    {
        public static IRequestExecutorBuilder AddGraphQLModules(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTodosGraphQL()
                .AddEmployeesGraphQL()
                .AddAttendanceGraphQL()
                .AddLeaveGraphQL()
                .AddPayrollGraphQL();
        }
    }
}
