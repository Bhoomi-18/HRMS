using HotChocolate;
using HotChocolate.Types;
using MediatR;
using AnnouncementFeature.Application.DTO;
using HRMS.Shared.Application.DTOs;

namespace AnnouncementFeature.GraphQL
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AnnouncementQuery
    {
        public async Task<BaseResponsePagination<GetAllAnnouncementResponse>> GetAllAnnouncementAsync([Service] IMediator mediator, GetAllAnnouncementRequest request)
        {
            return await mediator.Send(request);
        }
    }
}
