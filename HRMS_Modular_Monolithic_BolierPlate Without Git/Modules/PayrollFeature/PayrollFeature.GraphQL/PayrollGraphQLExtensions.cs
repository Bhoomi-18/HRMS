using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace PayrollFeature.GraphQL
{
    public static class PayrollGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddPayrollGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<PayrollMutation>()
                .AddTypeExtension<PayrollQuery>();
        }
    }
}
