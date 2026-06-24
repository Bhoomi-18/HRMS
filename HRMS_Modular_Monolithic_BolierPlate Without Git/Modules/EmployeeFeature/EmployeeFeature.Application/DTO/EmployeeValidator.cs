using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace EmployeeFeature.Application.DTO
{
    public class CreateEmployeeValidator : AbstractValidator<CreateEmployeeRequest>
    {
        public CreateEmployeeValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new EmployeePayloadValidator<CreateEmployeeDto>());
        }
    }

    public class UpdateEmployeeValidator : AbstractValidator<UpdateEmployeeRequest>
    {
        public UpdateEmployeeValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new EmployeeUpdatePayloadValidator());
        }
    }

    public class DeleteEmployeeValidator : AbstractValidator<DeleteEmployeeRequest>
    {
        public DeleteEmployeeValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new EmployeeIdValidator<DeleteEmployeeDto>());
        }
    }

    internal class EmployeePayloadValidator<TDto> : AbstractValidator<TDto>
        where TDto : IEmployeePayloadDto
    {
        public EmployeePayloadValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateEmployeeDto.FirstName)));

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateEmployeeDto.LastName)));

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateEmployeeDto.Email)));
        }
    }

    internal class EmployeeUpdatePayloadValidator : AbstractValidator<UpdateEmployeeDto>
    {
        public EmployeeUpdatePayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateEmployeeDto.EmployeeId)));

            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateEmployeeDto.FirstName)));

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateEmployeeDto.LastName)));
        }
    }

    internal class EmployeeIdValidator<TDto> : AbstractValidator<TDto>
        where TDto : IEmployeeIdDto
    {
        public EmployeeIdValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(IEmployeeIdDto.EmployeeId)));
        }
    }
}
