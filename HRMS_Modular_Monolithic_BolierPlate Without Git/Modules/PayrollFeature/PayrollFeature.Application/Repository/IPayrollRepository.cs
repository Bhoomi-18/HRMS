using HRMS.Core.Postgres.Repositories;
using PayrollFeature.Application.DTO;
using PayrollFeature.Domain;

namespace PayrollFeature.Application.Repository
{
    public interface IPayrollRepository : IPostgresRepository<Payroll>
    {
        Task<(IEnumerable<Payroll> result, int count)> GetAllPayrollWithCountAsync(GetAllPayrollRequest request);
        Task<Payroll?> GetPayrollAsync(GetAllPayrollRequest request);
    }
}
