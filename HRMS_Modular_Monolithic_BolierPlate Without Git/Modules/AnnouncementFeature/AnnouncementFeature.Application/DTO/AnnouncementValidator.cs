using FluentValidation;
using HRMS.Shared.Application.Constants;
using HRMS.Shared.Application.Extensions;

namespace AnnouncementFeature.Application.DTO
{
    public class CreateAnnouncementValidator : AbstractValidator<CreateAnnouncementRequest>
    {
        public CreateAnnouncementValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AnnouncementPayloadValidator<CreateAnnouncementDto>());
        }
    }

    public class UpdateAnnouncementValidator : AbstractValidator<UpdateAnnouncementRequest>
    {
        public UpdateAnnouncementValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AnnouncementUpdatePayloadValidator());
        }
    }

    public class DeleteAnnouncementValidator : AbstractValidator<DeleteAnnouncementRequest>
    {
        public DeleteAnnouncementValidator()
        {
            this.ValidateRequiredRequestParam(
                x => x.RequestParam!,
                new AnnouncementIdValidator<DeleteAnnouncementDto>());
        }
    }

    internal class AnnouncementPayloadValidator<TDto> : AbstractValidator<TDto>
        where TDto : IAnnouncementPayloadDto
    {
        public AnnouncementPayloadValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAnnouncementDto.Title)));

            RuleFor(x => x.Category)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAnnouncementDto.Category)));

            RuleFor(x => x.Priority)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(CreateAnnouncementDto.Priority)));
        }
    }

    internal class AnnouncementUpdatePayloadValidator : AbstractValidator<UpdateAnnouncementDto>
    {
        public AnnouncementUpdatePayloadValidator()
        {
            RuleFor(x => x.AnnouncementId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAnnouncementDto.AnnouncementId)));

            RuleFor(x => x.Title)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAnnouncementDto.Title)));

            RuleFor(x => x.Category)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAnnouncementDto.Category)));

            RuleFor(x => x.Priority)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(UpdateAnnouncementDto.Priority)));
        }
    }

    internal class AnnouncementIdValidator<TDto> : AbstractValidator<TDto>
        where TDto : IAnnouncementIdDto
    {
        public AnnouncementIdValidator()
        {
            RuleFor(x => x.AnnouncementId)
                .NotEmpty()
                .WithMessage(string.Format(Messaging.IsRequired, nameof(IAnnouncementIdDto.AnnouncementId)));
        }
    }
}
