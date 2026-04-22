# Code Quality & Architecture Rules

## Mode Control
- Start in Plan Mode
- No file edits during analysis

## Approval Gate
- Refactoring ONLY after explicit approval

## Architecture Goals
- Clean Architecture
- Separation of concerns
- Maintainable structure

## Stack Constraints
- React (Vite)
- TypeScript
- Supabase

## Code Quality Rules
- Small, focused functions
- Clear naming
- No duplicated logic
- Strong typing

## Forbidden During Analysis
- File creation
- Refactors
- Dependency changes

## Testing Rules

### Before Approval
- No test creation
- No test modification

### After Approval
- Follow Jest + Testing Library best practices
- Prefer behavior over implementation
- Avoid excessive mocking
- Ensure test readability

### Structure
- Separate unit and integration tests
- Reusable test utilities
- Consistent naming

### Supabase Testing
- Prefer real integration when possible
- Use isolated test data
