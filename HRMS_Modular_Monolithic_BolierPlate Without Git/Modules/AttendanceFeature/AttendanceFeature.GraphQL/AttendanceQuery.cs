using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using AttendanceFeature.Application.DTO;

namespace AttendanceFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class AttendanceQuery
    {
        public AttendanceQuery() { }

        [GraphQLName("getAllAttendance")]
        public async Task<BaseResponsePagination<GetAllAttendanceResponse>> GetAllAttendanceAsync(
            GetAllAttendanceRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
