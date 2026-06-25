using AutoMapper;
using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Application.DTO
{
    public class CreateAnnouncementMapper : Profile
    {
        public CreateAnnouncementMapper()
        {
            CreateMap<CreateAnnouncementDto, Announcement>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public class UpdateAnnouncementMapper : Profile
    {
        public UpdateAnnouncementMapper()
        {
            CreateMap<UpdateAnnouncementDto, Announcement>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AnnouncementId))
                .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public sealed class GetAllAnnouncementMapper : Profile
    {
        public GetAllAnnouncementMapper()
        {
            CreateMap<Announcement, GetAllAnnouncementItem>()
                .ForMember(dest => dest.AnnouncementId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
