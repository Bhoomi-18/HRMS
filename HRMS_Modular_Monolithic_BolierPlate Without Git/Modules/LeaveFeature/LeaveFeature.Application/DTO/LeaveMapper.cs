using AutoMapper;
using LeaveFeature.Domain;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveMapper : Profile
    {
        public CreateLeaveMapper()
        {
            CreateMap<CreateLeaveDto, Leave>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public class UpdateLeaveMapper : Profile
    {
        public UpdateLeaveMapper()
        {
            CreateMap<UpdateLeaveDto, Leave>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.LeaveId))
                .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public sealed class GetAllLeaveMapper : Profile
    {
        public GetAllLeaveMapper()
        {
            CreateMap<Leave, GetAllLeaveItem>()
                .ForMember(dest => dest.LeaveId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
