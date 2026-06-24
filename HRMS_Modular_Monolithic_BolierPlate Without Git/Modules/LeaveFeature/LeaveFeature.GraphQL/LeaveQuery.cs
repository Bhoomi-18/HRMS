using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using LeaveFeature.Application.DTO;

namespace LeaveFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class LeaveQuery
    {
        public LeaveQuery() { }

        [GraphQLName("getAllLeave")]
        public async Task<BaseResponsePagination<GetAllLeaveResponse>> GetAllLeaveAsync(
            GetAllLeaveRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
