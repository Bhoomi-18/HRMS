using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using LeaveFeature.Application.Repository;
using LeaveFeature.Domain;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveHandler : IRequestHandler<CreateLeaveRequest, BaseResponse<CreateLeaveResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public CreateLeaveHandler(IMapper mapper, ILeaveRepository leaveRepository)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<CreateLeaveResponse>> Handle(CreateLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var leave = _mapper.Map<Leave>(request.RequestParam);
            leave = await _leaveRepository.AddItemAsync(leave);

            return new BaseResponse<CreateLeaveResponse>
            {
                Data = new CreateLeaveResponse { LeaveId = leave.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Insert, nameof(Leave)),
                Success = true
            };
        }
    }

    public sealed class GetAllLeaveHandler : IRequestHandler<GetAllLeaveRequest, BaseResponsePagination<GetAllLeaveResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public GetAllLeaveHandler(ILeaveRepository leaveRepository, IMapper mapper)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponsePagination<GetAllLeaveResponse>> Handle(GetAllLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var response = new BaseResponsePagination<GetAllLeaveResponse>();
            (var leaves, int count) = await _leaveRepository.GetAllLeaveWithCountAsync(request);

            if (leaves != null && leaves.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Leave>, IReadOnlyList<GetAllLeaveItem>>(leaves.ToList());
                response.Data = new GetAllLeaveResponse { Leave = data.ToList() };

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

    public sealed class UpdateLeaveHandler : IRequestHandler<UpdateLeaveRequest, BaseResponse<UpdateLeaveResponse>>
    {
        private readonly IMapper _mapper;
        private readonly ILeaveRepository _leaveRepository;

        public UpdateLeaveHandler(IMapper mapper, ILeaveRepository leaveRepository)
        {
            _mapper = mapper;
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<UpdateLeaveResponse>> Handle(UpdateLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _leaveRepository.GetLeaveAsync(new GetAllLeaveRequest
            {
                RequestParam = new GetAllLeaveDto { LeaveId = request.RequestParam.LeaveId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Leave)));

            var leave = _mapper.Map<Leave>(request.RequestParam);
            leave.UserContext = existing.UserContext;
            leave.CreatedOn = existing.CreatedOn;
            leave.CreatedByUserId = existing.CreatedByUserId;
            leave.CreatedByUserName = existing.CreatedByUserName;

            await _leaveRepository.UpdateItemAsync(existing.Id, leave);

            return new BaseResponse<UpdateLeaveResponse>
            {
                Data = new UpdateLeaveResponse { LeaveId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Leave)),
                Success = true
            };
        }
    }

    public sealed class DeleteLeaveHandler : IRequestHandler<DeleteLeaveRequest, BaseResponse<DeleteLeaveResponse>>
    {
        private readonly ILeaveRepository _leaveRepository;

        public DeleteLeaveHandler(ILeaveRepository leaveRepository)
        {
            _leaveRepository = leaveRepository;
        }

        public async Task<BaseResponse<DeleteLeaveResponse>> Handle(DeleteLeaveRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _leaveRepository.GetLeaveAsync(new GetAllLeaveRequest
            {
                RequestParam = new GetAllLeaveDto { LeaveId = request.RequestParam.LeaveId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Leave)));

            await _leaveRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeleteLeaveResponse>
            {
                Data = new DeleteLeaveResponse { LeaveId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Leave)),
                Success = true
            };
        }
    }
}
