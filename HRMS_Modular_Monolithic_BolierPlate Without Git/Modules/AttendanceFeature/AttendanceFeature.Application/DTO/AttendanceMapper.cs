using AutoMapper;
using AttendanceFeature.Domain;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceMapper : Profile
    {
        public CreateAttendanceMapper()
        {
            CreateMap<CreateAttendanceDto, Attendance>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public class UpdateAttendanceMapper : Profile
    {
        public UpdateAttendanceMapper()
        {
            CreateMap<UpdateAttendanceDto, Attendance>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.AttendanceId))
                .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public sealed class GetAllAttendanceMapper : Profile
    {
        public GetAllAttendanceMapper()
        {
            CreateMap<Attendance, GetAllAttendanceItem>()
                .ForMember(dest => dest.AttendanceId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
