using AutoMapper;
using EmployeeFeature.Domain;

namespace EmployeeFeature.Application.DTO
{
    public class CreateEmployeeMapper : Profile
    {
        public CreateEmployeeMapper()
        {
            CreateMap<CreateEmployeeDto, Employee>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public class UpdateEmployeeMapper : Profile
    {
        public UpdateEmployeeMapper()
        {
            CreateMap<UpdateEmployeeDto, Employee>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.EmployeeId))
                .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public sealed class GetAllEmployeeMapper : Profile
    {
        public GetAllEmployeeMapper()
        {
            CreateMap<Employee, GetAllEmployeesItem>()
                .ForMember(dest => dest.EmployeeId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
