using AutoMapper;
using PayrollFeature.Domain;

namespace PayrollFeature.Application.DTO
{
    public class CreatePayrollMapper : Profile
    {
        public CreatePayrollMapper()
        {
            CreateMap<CreatePayrollDto, Payroll>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public class UpdatePayrollMapper : Profile
    {
        public UpdatePayrollMapper()
        {
            CreateMap<UpdatePayrollDto, Payroll>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PayrollId))
                .ForMember(dest => dest.ModifiedOn, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }

    public sealed class GetAllPayrollMapper : Profile
    {
        public GetAllPayrollMapper()
        {
            CreateMap<Payroll, GetAllPayrollItem>()
                .ForMember(dest => dest.PayrollId, opt => opt.MapFrom(src => src.Id));
        }
    }
}
