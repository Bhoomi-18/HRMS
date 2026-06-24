using HRMS.Shared.Application.DTOs;
using HRMS.Shared.Application.GraphQL;
using HotChocolate;
using HotChocolate.Types;
using MediatR;
using EmployeeFeature.Application.DTO;

namespace EmployeeFeature.GraphQL
{
    [ExtendObjectType(typeof(Mutation))]
    public class EmployeeMutation
    {
        public EmployeeMutation() { }

        [GraphQLName("createEmployee")]
        public async Task<BaseResponse<CreateEmployeeResponse>> CreateEmployeeAsync(
            CreateEmployeeRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("updateEmployee")]
        public async Task<BaseResponse<UpdateEmployeeResponse>> UpdateEmployeeAsync(
            UpdateEmployeeRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }

        [GraphQLName("deleteEmployee")]
        public async Task<BaseResponse<DeleteEmployeeResponse>> DeleteEmployeeAsync(
            DeleteEmployeeRequest request, [Service] IMediator mediator)
        {
            return await mediator.Send(request);
        }
    }
}
