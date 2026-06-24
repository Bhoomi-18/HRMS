using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeFeature.GraphQL
{
    public static class EmployeesGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddEmployeesGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<EmployeeMutation>()
                .AddTypeExtension<EmployeeQuery>();
        }
    }
}
