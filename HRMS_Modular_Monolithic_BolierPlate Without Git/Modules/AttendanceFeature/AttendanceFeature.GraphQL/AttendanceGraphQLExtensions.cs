using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AttendanceFeature.GraphQL
{
    public static class AttendanceGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddAttendanceGraphQL(this IRequestExecutorBuilder builder)
        {
            return builder
                .AddTypeExtension<AttendanceMutation>()
                .AddTypeExtension<AttendanceQuery>();
        }
    }
}
