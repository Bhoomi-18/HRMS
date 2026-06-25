using AutoMapper;
using HRMS.Core.Telemetry.Exceptions;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using AnnouncementFeature.Application.Repository;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Application.DTO
{
    public class CreateAnnouncementHandler : IRequestHandler<CreateAnnouncementRequest, BaseResponse<CreateAnnouncementResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAnnouncementRepository _announcementRepository;

        public CreateAnnouncementHandler(IMapper mapper, IAnnouncementRepository announcementRepository)
        {
            _mapper = mapper;
            _announcementRepository = announcementRepository;
        }

        public async Task<BaseResponse<CreateAnnouncementResponse>> Handle(CreateAnnouncementRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var announcement = _mapper.Map<Announcement>(request.RequestParam);
            announcement = await _announcementRepository.AddItemAsync(announcement);

            return new BaseResponse<CreateAnnouncementResponse>
            {
                Data = new CreateAnnouncementResponse { AnnouncementId = announcement.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Insert, nameof(Announcement)),
                Success = true
            };
        }
    }

    public sealed class GetAllAnnouncementHandler : IRequestHandler<GetAllAnnouncementRequest, BaseResponsePagination<GetAllAnnouncementResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAnnouncementRepository _announcementRepository;

        public GetAllAnnouncementHandler(IAnnouncementRepository announcementRepository, IMapper mapper)
        {
            _mapper = mapper;
            _announcementRepository = announcementRepository;
        }

        public async Task<BaseResponsePagination<GetAllAnnouncementResponse>> Handle(GetAllAnnouncementRequest request, CancellationToken cancellationToken)
        {
            if (request == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var response = new BaseResponsePagination<GetAllAnnouncementResponse>();
            (var announcements, int count) = await _announcementRepository.GetAllAnnouncementWithCountAsync(request);

            if (announcements != null && announcements.Any())
            {
                var data = _mapper.Map<IReadOnlyList<Announcement>, IReadOnlyList<GetAllAnnouncementItem>>(announcements.ToList());
                response.Data = new GetAllAnnouncementResponse { Announcement = data.ToList() };

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

    public sealed class UpdateAnnouncementHandler : IRequestHandler<UpdateAnnouncementRequest, BaseResponse<UpdateAnnouncementResponse>>
    {
        private readonly IMapper _mapper;
        private readonly IAnnouncementRepository _announcementRepository;

        public UpdateAnnouncementHandler(IMapper mapper, IAnnouncementRepository announcementRepository)
        {
            _mapper = mapper;
            _announcementRepository = announcementRepository;
        }

        public async Task<BaseResponse<UpdateAnnouncementResponse>> Handle(UpdateAnnouncementRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _announcementRepository.GetAnnouncementAsync(new GetAllAnnouncementRequest
            {
                RequestParam = new GetAllAnnouncementDto { AnnouncementId = request.RequestParam.AnnouncementId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Announcement)));

            var announcement = _mapper.Map<Announcement>(request.RequestParam);
            announcement.UserContext = existing.UserContext;
            announcement.CreatedOn = existing.CreatedOn;
            announcement.CreatedByUserId = existing.CreatedByUserId;
            announcement.CreatedByUserName = existing.CreatedByUserName;

            await _announcementRepository.UpdateItemAsync(existing.Id, announcement);

            return new BaseResponse<UpdateAnnouncementResponse>
            {
                Data = new UpdateAnnouncementResponse { AnnouncementId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Update, nameof(Announcement)),
                Success = true
            };
        }
    }

    public sealed class DeleteAnnouncementHandler : IRequestHandler<DeleteAnnouncementRequest, BaseResponse<DeleteAnnouncementResponse>>
    {
        private readonly IAnnouncementRepository _announcementRepository;

        public DeleteAnnouncementHandler(IAnnouncementRepository announcementRepository)
        {
            _announcementRepository = announcementRepository;
        }

        public async Task<BaseResponse<DeleteAnnouncementResponse>> Handle(DeleteAnnouncementRequest request, CancellationToken cancellationToken)
        {
            if (request?.RequestParam == null)
                throw new BadRequestException(Messaging.InvalidRequest);

            var existing = await _announcementRepository.GetAnnouncementAsync(new GetAllAnnouncementRequest
            {
                RequestParam = new GetAllAnnouncementDto { AnnouncementId = request.RequestParam.AnnouncementId }
            });

            if (existing == null)
                throw new NotFoundException(string.Format(Messaging.NotFound, nameof(Announcement)));

            await _announcementRepository.DeleteItemAsync(existing.Id);

            return new BaseResponse<DeleteAnnouncementResponse>
            {
                Data = new DeleteAnnouncementResponse { AnnouncementId = existing.Id },
                StatusCode = StatusCodes.Status200OK,
                Message = string.Format(Messaging.Delete, nameof(Announcement)),
                Success = true
            };
        }
    }
}
