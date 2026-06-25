using HotChocolate;
using HotChocolate.Types;
using MediatR;
using AnnouncementFeature.Application.DTO;
using HRMS.Shared.Application.DTOs;

namespace AnnouncementFeature.GraphQL
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AnnouncementMutation
    {
        public async Task<BaseResponse<CreateAnnouncementResponse>> CreateAnnouncementAsync([Service] IMediator mediator, CreateAnnouncementRequest request)
        {
            return await mediator.Send(request);
        }

        public async Task<BaseResponse<UpdateAnnouncementResponse>> UpdateAnnouncementAsync([Service] IMediator mediator, UpdateAnnouncementRequest request)
        {
            return await mediator.Send(request);
        }

        public async Task<BaseResponse<DeleteAnnouncementResponse>> DeleteAnnouncementAsync([Service] IMediator mediator, DeleteAnnouncementRequest request)
        {
            return await mediator.Send(request);
        }
    }
}
