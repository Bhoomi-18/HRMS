using HotChocolate.Execution.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AnnouncementFeature.GraphQL
{
    public static class AnnouncementGraphQLExtensions
    {
        public static IRequestExecutorBuilder AddAnnouncementGraphQL(this IRequestExecutorBuilder builder)
        {
            builder.AddTypeExtension<AnnouncementQuery>()
                   .AddTypeExtension<AnnouncementMutation>();
            return builder;
        }
    }
}
