using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using PayrollFeature.Application.DTO;

namespace PayrollFeature.GraphQL
{
    [ExtendObjectType(typeof(Query))]
    public class PayrollQuery
    {
        public PayrollQuery() { }

        [GraphQLName("getAllPayroll")]
        public async Task<BaseResponsePagination<GetAllPayrollResponse>> GetAllPayrollAsync(
            GetAllPayrollRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
