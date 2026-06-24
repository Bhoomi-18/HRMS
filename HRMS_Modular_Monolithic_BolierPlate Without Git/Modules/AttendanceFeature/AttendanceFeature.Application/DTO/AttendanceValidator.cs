using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace AttendanceFeature.Application.DTO
{
    public class CreateAttendanceValidator : AbstractValidator<CreateAttendanceRequest>
    {
        public CreateAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AttendancePayloadValidator<CreateAttendanceDto>());
        }
    }

    public class UpdateAttendanceValidator : AbstractValidator<UpdateAttendanceRequest>
    {
        public UpdateAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AttendanceUpdatePayloadValidator());
        }
    }

    public class DeleteAttendanceValidator : AbstractValidator<DeleteAttendanceRequest>
    {
        public DeleteAttendanceValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AttendanceIdValidator<DeleteAttendanceDto>());
        }
    }

    internal class AttendancePayloadValidator<TDto> : AbstractValidator<TDto>
        where TDto : IAttendancePayloadDto
    {
        public AttendancePayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAttendanceDto.EmployeeId)));

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAttendanceDto.Date)));

            RuleFor(x => x.Status)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAttendanceDto.Status)));
        }
    }

    internal class AttendanceUpdatePayloadValidator : AbstractValidator<UpdateAttendanceDto>
    {
        public AttendanceUpdatePayloadValidator()
        {
            RuleFor(x => x.AttendanceId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.AttendanceId)));

            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.EmployeeId)));

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.Date)));
                
            RuleFor(x => x.Status)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAttendanceDto.Status)));
        }
    }

    internal class AttendanceIdValidator<TDto> : AbstractValidator<TDto>
        where TDto : IAttendanceIdDto
    {
        public AttendanceIdValidator()
        {
            RuleFor(x => x.AttendanceId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(IAttendanceIdDto.AttendanceId)));
        }
    }
}
