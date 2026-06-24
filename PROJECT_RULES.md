# HRMS Assessment Rules

## Architecture Rules

1. Never rewrite existing architecture.
2. Never rename folders.
3. Never move files.
4. Never delete files.
5. Never upgrade dependencies.
6. Never replace the boilerplate.

## Frontend Rules

1. Reuse Apollo Client.
2. Reuse SessionContext.
3. Reuse Redux.
4. Reuse Zustand.
5. Reuse middleware.
6. Reuse existing Tailwind configuration.
7. Reuse DataTable component.

## Backend Rules

1. Follow the existing modular monolithic architecture.
2. Use TodoFeature as the reference pattern.
3. New features must follow:
   Domain → Application → Infrastructure → GraphQL

## Development Rules

1. Implement one module at a time.
2. Show files to be modified before generating code.
3. Stop after each module.
4. Never generate code for unrelated modules.

## Priority Modules

1. Employee Management
2. Dashboard
3. Attendance
4. Leave Management
5. Payroll
6. Documents
7. Announcements
8. Analytics