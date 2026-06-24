using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using PayrollFeature.Application.DTO;

namespace PayrollFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class PayrollMutation
    {
        public PayrollMutation() { }

        [GraphQLName("createPayroll")]
        public async Task<BaseResponse<CreatePayrollResponse>> CreatePayrollAsync(
            CreatePayrollRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("updatePayroll")]
        public async Task<BaseResponse<UpdatePayrollResponse>> UpdatePayrollAsync(
            UpdatePayrollRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("deletePayroll")]
        public async Task<BaseResponse<DeletePayrollResponse>> DeletePayrollAsync(
            DeletePayrollRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
