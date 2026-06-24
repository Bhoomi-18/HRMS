using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LeaveFeature.GraphQL
{
    public static class LeaveGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddLeaveGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<LeaveMutation>()
                .AddTypeExtension<LeaveQuery>();
        }
    }
}
