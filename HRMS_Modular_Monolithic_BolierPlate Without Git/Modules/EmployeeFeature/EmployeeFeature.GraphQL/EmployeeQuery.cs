using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using EmployeeFeature.Application.DTO;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class EmployeeQuery
    {
        public EmployeeQuery() { }

        [GraphQLName("getAllEmployees")]
        public async Task<BaseResponsePagination<GetAllEmployeesResponse>> GetAllEmployeesAsync(
            GetAllEmployeesRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
