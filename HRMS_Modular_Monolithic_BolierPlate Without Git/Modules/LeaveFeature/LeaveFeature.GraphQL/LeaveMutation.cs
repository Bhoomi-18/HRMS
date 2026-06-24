using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using LeaveFeature.Application.DTO;

namespace LeaveFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class LeaveMutation
    {
        public LeaveMutation() { }

        [GraphQLName("createLeave")]
        public async Task<BaseResponse<CreateLeaveResponse>> CreateLeaveAsync(
            CreateLeaveRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("updateLeave")]
        public async Task<BaseResponse<UpdateLeaveResponse>> UpdateLeaveAsync(
            UpdateLeaveRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("deleteLeave")]
        public async Task<BaseResponse<DeleteLeaveResponse>> DeleteLeaveAsync(
            DeleteLeaveRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
