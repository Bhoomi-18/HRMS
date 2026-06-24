using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using EmployeeFeature.Application.Repository;
using EmployeeFeature.Domain;

namespace EmployeeFeature.Application.DTO
{
    public class CreateEmployeeHandler : IRequestHandler<CreateEmployeeRequest, BaseResponse<CreateEmployeeResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;

        public CreateEmployeeHandler(IMapper mapper, IEmployeeRepository employeeRepository)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
        }

        public async Task<BaseResponse<CreateEmployeeResponse>> Handle(CreateEmployeeRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var employee = _mapper.Map<Employee>(request.RequestParam);
            employee = await _employeeRepository.AddItemAsync(employee);

            return new BaseResponse<CreateEmployeeResponse>
            {
                Data = new CreateEmployeeResponse { EmployeeId = employee.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Insert, nameof(Employee)),
                Success = true
            };
        }
    }

    public sealed class GetAllEmployeesHandler : IRequestHandler<GetAllEmployeesRequest, BaseResponsePagination<GetAllEmployeesResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;

        public GetAllEmployeesHandler(IEmployeeRepository employeeRepository, IMapper mapper)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
        }

        public async Task<BaseResponsePagination<GetAllEmployeesResponse>> Handle(GetAllEmployeesRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var response = new BaseResponsePagination<GetAllEmployeesResponse>();
            (var employees, int count) = await _employeeRepository.GetAllEmployeesWithCountAsync(request);

            if (employees != null && employees.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Employee>, IReadOnlyList<GetAllEmployeesItem>>(employees.ToList());
                response.Data = new GetAllEmployeesResponse { Employees = data.ToList() };

                if (request.PageCriteria != null && request.PageCriteria.EnablePage)
                {
                    response.Meta = new Meta
                    {
                        Skip = request.PageCriteria.Skip,
                        Take = request.PageCriteria.PageSize,
                        TotalCount = count
                    };
                }
            }

            response.Success = true;
            response.StatusCode = StatusCodes.Status200OK;
            return response;
        }
    }

    public sealed class UpdateEmployeeHandler : IRequestHandler<UpdateEmployeeRequest, BaseResponse<UpdateEmployeeResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;

        public UpdateEmployeeHandler(IMapper mapper, IEmployeeRepository employeeRepository)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
        }

        public async Task<BaseResponse<UpdateEmployeeResponse>> Handle(UpdateEmployeeRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _employeeRepository.GetEmployeeAsync(new GetAllEmployeesRequest
            {
                RequestParam = new GetAllEmployeesDto { EmployeeId = request.RequestParam.EmployeeId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Employee)));

            var employee = _mapper.Map<Employee>(request.RequestParam);
            employee.UserContext = existing.UserContext;
            employee.CreatedOn = existing.CreatedOn;
            employee.CreatedByUserId = existing.CreatedByUserId;
            employee.CreatedByUserName = existing.CreatedByUserName;

            await _employeeRepository.UpdateItemAsync(existing.Id, employee);

            return new BaseResponse<UpdateEmployeeResponse>
            {
                Data = new UpdateEmployeeResponse { EmployeeId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Employee)),
                Success = true
            };
        }
    }

    public sealed class DeleteEmployeeHandler : IRequestHandler<DeleteEmployeeRequest, BaseResponse<DeleteEmployeeResponse>>
    {
        private readonly IEmployeeRepository _employeeRepository;

        public DeleteEmployeeHandler(IEmployeeRepository employeeRepository)
        {
            _employeeRepository = employeeRepository;
        }

        public async Task<BaseResponse<DeleteEmployeeResponse>> Handle(DeleteEmployeeRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _employeeRepository.GetEmployeeAsync(new GetAllEmployeesRequest
            {
                RequestParam = new GetAllEmployeesDto { EmployeeId = request.RequestParam.EmployeeId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Employee)));

            await _employeeRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeleteEmployeeResponse>
            {
                Data = new DeleteEmployeeResponse { EmployeeId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Employee)),
                Success = true
            };
        }
    }
}
