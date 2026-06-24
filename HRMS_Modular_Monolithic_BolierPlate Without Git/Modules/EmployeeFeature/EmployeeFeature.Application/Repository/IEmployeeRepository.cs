using HRMS.Core.Postgres.Repositories;
using EmployeeFeature.Application.DTO;
using EmployeeFeature.Domain;

namespace EmployeeFeature.Application.Repository
{
    public interface IEmployeeRepository : IPostgresRepository<Employee>
    {
        Task<(IEnumerable<Employee> result, int count)> GetAllEmployeesWithCountAsync(GetAllEmployeesRequest request);
        Task<Employee?> GetEmployeeAsync(GetAllEmployeesRequest request);
    }
}
