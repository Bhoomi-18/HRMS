using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using PayrollFeature.Application.Repository;
using PayrollFeature.Domain;

namespace PayrollFeature.Application.DTO
{
    public class CreatePayrollHandler : IRequestHandler<CreatePayrollRequest, BaseResponse<CreatePayrollResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPayrollRepository _payrollRepository;

        public CreatePayrollHandler(IMapper mapper, IPayrollRepository payrollRepository)
        {
            _mapper = mapper;
            _payrollRepository = payrollRepository;
        }

        public async Task<BaseResponse<CreatePayrollResponse>> Handle(CreatePayrollRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var payroll = _mapper.Map<Payroll>(request.RequestParam);
            payroll = await _payrollRepository.AddItemAsync(payroll);

            return new BaseResponse<CreatePayrollResponse>
            {
                Data = new CreatePayrollResponse { PayrollId = payroll.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Insert, nameof(Payroll)),
                Success = true
            };
        }
    }

    public sealed class GetAllPayrollHandler : IRequestHandler<GetAllPayrollRequest, BaseResponsePagination<GetAllPayrollResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPayrollRepository _payrollRepository;

        public GetAllPayrollHandler(IPayrollRepository payrollRepository, IMapper mapper)
        {
            _mapper = mapper;
            _payrollRepository = payrollRepository;
        }

        public async Task<BaseResponsePagination<GetAllPayrollResponse>> Handle(GetAllPayrollRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var response = new BaseResponsePagination<GetAllPayrollResponse>();
            (var payrolls, int count) = await _payrollRepository.GetAllPayrollWithCountAsync(request);

            if (payrolls != null && payrolls.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Payroll>, IReadOnlyList<GetAllPayrollItem>>(payrolls.ToList());
                response.Data = new GetAllPayrollResponse { Payroll = data.ToList() };

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

    public sealed class UpdatePayrollHandler : IRequestHandler<UpdatePayrollRequest, BaseResponse<UpdatePayrollResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IPayrollRepository _payrollRepository;

        public UpdatePayrollHandler(IMapper mapper, IPayrollRepository payrollRepository)
        {
            _mapper = mapper;
            _payrollRepository = payrollRepository;
        }

        public async Task<BaseResponse<UpdatePayrollResponse>> Handle(UpdatePayrollRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _payrollRepository.GetPayrollAsync(new GetAllPayrollRequest
            {
                RequestParam = new GetAllPayrollDto { PayrollId = request.RequestParam.PayrollId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Payroll)));

            var payroll = _mapper.Map<Payroll>(request.RequestParam);
            payroll.UserContext = existing.UserContext;
            payroll.CreatedOn = existing.CreatedOn;
            payroll.CreatedByUserId = existing.CreatedByUserId;
            payroll.CreatedByUserName = existing.CreatedByUserName;

            await _payrollRepository.UpdateItemAsync(existing.Id, payroll);

            return new BaseResponse<UpdatePayrollResponse>
            {
                Data = new UpdatePayrollResponse { PayrollId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Payroll)),
                Success = true
            };
        }
    }

    public sealed class DeletePayrollHandler : IRequestHandler<DeletePayrollRequest, BaseResponse<DeletePayrollResponse>>
    {
        private readonly IPayrollRepository _payrollRepository;

        public DeletePayrollHandler(IPayrollRepository payrollRepository)
        {
            _payrollRepository = payrollRepository;
        }

        public async Task<BaseResponse<DeletePayrollResponse>> Handle(DeletePayrollRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _payrollRepository.GetPayrollAsync(new GetAllPayrollRequest
            {
                RequestParam = new GetAllPayrollDto { PayrollId = request.RequestParam.PayrollId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Payroll)));

            await _payrollRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeletePayrollResponse>
            {
                Data = new DeletePayrollResponse { PayrollId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Payroll)),
                Success = true
            };
        }
    }
}
