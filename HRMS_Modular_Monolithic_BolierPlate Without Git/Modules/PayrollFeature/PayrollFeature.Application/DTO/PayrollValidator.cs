using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace PayrollFeature.Application.DTO
{
    public class CreatePayrollValidator : AbstractValidator<CreatePayrollRequest>
    {
        public CreatePayrollValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new PayrollPayloadValidator<CreatePayrollDto>());
        }
    }

    public class UpdatePayrollValidator : AbstractValidator<UpdatePayrollRequest>
    {
        public UpdatePayrollValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new PayrollUpdatePayloadValidator());
        }
    }

    public class DeletePayrollValidator : AbstractValidator<DeletePayrollRequest>
    {
        public DeletePayrollValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new PayrollIdValidator<DeletePayrollDto>());
        }
    }

    internal class PayrollPayloadValidator<TDto> : AbstractValidator<TDto>
        where TDto : IPayrollPayloadDto
    {
        public PayrollPayloadValidator()
        {
            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreatePayrollDto.EmployeeId)));

            RuleFor(x => x.Month)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreatePayrollDto.Month)));

            RuleFor(x => x.BasicSalary)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreatePayrollDto.BasicSalary)));

            RuleFor(x => x.NetSalary)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreatePayrollDto.NetSalary)));
                
            RuleFor(x => x.PaymentStatus)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreatePayrollDto.PaymentStatus)));
        }
    }

    internal class PayrollUpdatePayloadValidator : AbstractValidator<UpdatePayrollDto>
    {
        public PayrollUpdatePayloadValidator()
        {
            RuleFor(x => x.PayrollId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.PayrollId)));

            RuleFor(x => x.EmployeeId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.EmployeeId)));

            RuleFor(x => x.Month)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.Month)));

            RuleFor(x => x.BasicSalary)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.BasicSalary)));

            RuleFor(x => x.NetSalary)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.NetSalary)));

            RuleFor(x => x.PaymentStatus)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdatePayrollDto.PaymentStatus)));
        }
    }

    internal class PayrollIdValidator<TDto> : AbstractValidator<TDto>
        where TDto : IPayrollIdDto
    {
        public PayrollIdValidator()
        {
            RuleFor(x => x.PayrollId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(IPayrollIdDto.PayrollId)));
        }
    }
}
