using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace LeaveFeature.Application.DTO
{
    public class CreateLeaveValidator : AbstractValidator<CreateLeaveRequest>
    {
        public CreateLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new LeavePayloadValidator<CreateLeaveDto>());
        }
    }

    public class UpdateLeaveValidator : AbstractValidator<UpdateLeaveRequest>
    {
        public UpdateLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new LeaveUpdatePayloadValidator());
        }
    }

    public class DeleteLeaveValidator : AbstractValidator<DeleteLeaveRequest>
    {
        public DeleteLeaveValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new LeaveIdValidator<DeleteLeaveDto>());
        }
    }

    internal class LeavePayloadValidator<TDto> : AbstractValidator<TDto>
        where TDto : ILeavePayloadDto
    {
        public LeavePayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.EmployeeId)));

            RuleFor(x => x.LeaveType)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.LeaveType)));

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.StartDate)));

            RuleFor(x => x.EndDate)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.EndDate)));

            RuleFor(x => x.Status)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateLeaveDto.Status)));
        }
    }

    internal class LeaveUpdatePayloadValidator : AbstractValidator<UpdateLeaveDto>
    {
        public LeaveUpdatePayloadValidator()
        {
            RuleFor(x => x.LeaveId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.LeaveId)));

            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.EmployeeId)));

            RuleFor(x => x.LeaveType)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.LeaveType)));

            RuleFor(x => x.StartDate)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.StartDate)));

            RuleFor(x => x.EndDate)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.EndDate)));

            RuleFor(x => x.Status)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateLeaveDto.Status)));
        }
    }

    internal class LeaveIdValidator<TDto> : AbstractValidator<TDto>
        where TDto : ILeaveIdDto
    {
        public LeaveIdValidator()
        {
            RuleFor(x => x.LeaveId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(ILeaveIdDto.LeaveId)));
        }
    }
}
