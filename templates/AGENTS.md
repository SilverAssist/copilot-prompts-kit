# Copilot Coding Agent Instructions

> **CRITICAL**: This file contains mandatory instructions for the GitHub Copilot Coding Agent.
> The agent MUST follow these rules when working on issues in this repository.

## 🔄 Copilot Agent Workflow for Complex Tasks

When implementing new features, refactoring code, or fixing complex issues, **always follow this systematic workflow**:

### Phase 1: Initial Analysis

1. **Analyze the request** - Understand the full scope, dependencies, and potential impacts
2. **Search existing code** - Use semantic search and grep to understand current implementation
3. **Identify components** - List all files, functions, and components that need changes
4. **Review documentation** - Check existing docs for patterns and conventions

### Phase 2: Planning Documentation

1. **Create planning document** - `docs/[feature-name]-plan.md` with:
   - Problem statement and objectives
   - Current architecture analysis
   - Proposed changes with before/after code examples
   - Risk assessment and mitigation strategies
   - Phase breakdown if complex (separate into logical phases)
   - Priority assignment (HIGH/MEDIUM/LOW)
2. **Add action plan** - Detailed step-by-step implementation guide
3. **Create TODO list** - Use `manage_todo_list` tool to track all phases
4. **Commit planning** - `git commit -m "PROJECT-XXX: Add [feature] implementation plan"`

### Phase 3: Implementation by Phases

For each phase:

1. **Mark TODO as in-progress** - Update status before starting work
2. **Implement changes** - Make code changes following the plan
3. **Write/update tests** - Add unit tests, ensure regression tests pass
4. **Run tests** - `npm test` to verify no regressions
5. **Mark TODO as completed** - Update status after successful implementation
6. **Commit phase** - `git commit -m "PROJECT-XXX: Implement [feature] - Phase N"`
7. **Validate** - Check build, tests, and functionality

### Phase 4: Final Documentation

1. **Create final documentation** - `docs/[feature-name].md` with:
   - Feature overview and usage guide
   - API documentation and examples
   - Integration guide
   - Testing strategy
   - Troubleshooting section
2. **Update related docs** - Update `project-overview.md`, `readme.md`, etc.
3. **Update Copilot context** - Add patterns and conventions to instructions
4. **Delete planning docs** - Remove temporary planning documents
5. **Final commit** - `git commit -m "PROJECT-XXX: Add [feature] documentation"`

### Key Principles

- ✅ **One commit per phase** - Create clear checkpoint commits
- ✅ **Test everything** - Run full test suite after each phase
- ✅ **No breaking changes** - Ensure backward compatibility
- ✅ **Document as you go** - Update docs with each phase
- ✅ **Clean up** - Remove temporary planning files at the end
- ✅ **Type safety** - Maintain full TypeScript coverage
- ✅ **Follow patterns** - Use existing project patterns and conventions

### Example Workflow

```bash
# Phase 1: Analysis and Planning
[semantic_search, grep_search, read_file]
create_file("docs/feature-plan.md")
manage_todo_list(write, [todos])
git commit -m "PROJECT-XXX: Add feature implementation plan"

# Phase 2-N: Implementation Phases
manage_todo_list(update, phase1_in_progress)
[make changes]
npm test
manage_todo_list(update, phase1_completed)
git commit -m "PROJECT-XXX: Implement feature - Phase 1"

# Final Phase: Documentation
create_file("docs/feature.md")
update copilot-instructions.md
delete planning docs
git commit -m "PROJECT-XXX: Add feature documentation and cleanup"
```

---

## Key Conventions

### Code Style & Organization

- **Imports**: Always organize imports alphabetically within each group
- **API Functions**: Must have descriptive JSDoc comments in English
- **Types**: Define interfaces and types properly, not directly in components
- **No `any` Type**: Always define explicit types using `type` or `interface`
- **File Naming**: All files should use kebab-case (e.g., `use-hash.ts`, `contact-form.tsx`)
- **Object Destructuring**: Always use destructuring when iterating over objects
- **Error Handling**: Apply robust error handling with try/catch for async operations
- **Import Paths**: Always use absolute imports with `@/` prefix

### Component Structure & Naming

**CRITICAL: All components must follow these strict conventions:**

#### 1. Folder & File Naming

- **Folder names**: MUST use kebab-case (e.g., `user-profile/`, `checkout-wizard/`)
- **File structure**: Every component MUST be in its own folder with an `index.tsx` file
- **❌ NEVER**: Use camelCase or PascalCase for folder names
- **❌ NEVER**: Create standalone component files like `Component.tsx` at root level

```
✅ CORRECT:
src/components/user-profile/index.tsx
src/components/contact-form/index.tsx

❌ INCORRECT:
src/components/UserProfile.tsx
src/components/userProfile/index.tsx
```

#### 2. Component Export Pattern

- **Function name**: MUST use PascalCase for the exported function
- **Export statement**: MUST use named export with `export function`
- **Single responsibility**: Each file should export ONLY the component function

```typescript
// ✅ CORRECT: src/components/user-profile/index.tsx
interface UserProfileProps {
  userId: string;
  className?: string;
}

export function UserProfile({ userId, className }: UserProfileProps) {
  // Component implementation
}
```

#### 3. Props Interface Definition

- **MUST**: Define props interface INSIDE the component file
- **Interface name**: MUST match component name + "Props" suffix (PascalCase)
- **Location**: Define interface immediately BEFORE the component function

#### 4. Separation of Concerns

- **Component file**: ONLY the component function and its props interface
- **Helper functions**: Create separate `helpers.ts` or `utils.ts` in same folder
- **Types/Interfaces**: Create separate `types.ts` if multiple types are shared
- **Constants**: Create separate `constants.ts` for component-specific constants

```
✅ CORRECT Structure:
src/components/checkout-wizard/
├── index.tsx           # ONLY CheckoutWizard component
├── types.ts            # Shared types/interfaces
├── helpers.ts          # Helper functions
├── constants.ts        # Component constants
└── __tests__/
    └── checkout-wizard.test.tsx
```

---

## React Patterns

### Hook Placement Rules (CRITICAL)

**✅ Correct:** All hooks before conditional returns

```typescript
export function Component({ data }: Props) {
  const [state, setState] = useState(initialState);
  const handleClick = useCallback(() => {}, []);

  // Early returns AFTER all hooks
  if (!data) return null;
  
  return <div>...</div>;
}
```

**❌ Incorrect:** Hooks after conditional returns

```typescript
export function Component({ data }: Props) {
  if (!data) return null; // ❌ Early return before hooks
  
  const [state, setState] = useState(initialState); // ❌ Error!
  return <div>...</div>;
}
```

### When to Use Each Hook

**useState** - Simple, Independent State (1-3 values)

```typescript
const [isOpen, setIsOpen] = useState(false);
const [email, setEmail] = useState("");
```

**useReducer** - Complex State Management (4+ values or complex transitions)

```typescript
const [state, dispatch] = useReducer(componentReducer, initialState);
dispatch({ type: 'ACTION_NAME', payload: data });
```

**useCallback** - Memoized Functions

```typescript
const handleClick = useCallback((id: string) => {
  dispatch({ type: 'ITEM_CLICKED', payload: id });
}, [dispatch]);
```

**useMemo** - Memoized Values

```typescript
const filteredItems = useMemo(() => {
  return items.filter(item => item.status === 'active');
}, [items]);
```

**useActionState** - Server Actions with Forms (React 19)

```typescript
const [formState, formAction, isPending] = useActionState(
  serverAction,
  initialState
);

<form action={formAction}>
  <button disabled={isPending}>
    {isPending ? "Submitting..." : "Submit"}
  </button>
</form>
```

---

## Server Actions Pattern

```typescript
"use server";

import type { ActionState } from "@/types";

/**
 * Server action for form submission
 * @param prevState - Previous action state (required for useActionState)
 * @param formData - Form data from the submitted form
 * @returns Promise<ActionState> - Result with success, message, timestamp
 */
export async function submitForm(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Extract and validate form data
    const email = formData.get("email") as string;
    
    // Process form...
    
    return {
      success: true,
      message: "Form submitted successfully!",
      timestamp: Date.now(), // Triggers useEffect for resets
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      timestamp: Date.now(),
    };
  }
}
```

---

## Testing Requirements

### Test File Location

- Tests live in `__tests__/` subfolders within each component/domain folder
- Test file naming: `[component-name].test.tsx` or `[feature].test.ts`

### Test Coverage Requirements

- All server actions must have unit tests
- All reducers must have 100% test coverage
- All utility functions must have unit tests

### Mock Setup Order (CRITICAL)

```typescript
// ✅ CORRECT: Mock first, then import
const mockFunction = jest.fn();

jest.mock('@/lib/api', () => ({
  apiClient: mockFunction,
}));

// THEN import
import { myFunction } from '@/lib/my-module';
```

---

## Git Commit Guidelines

### Commit Message Format

```
TYPE-XXX: Brief description

- Detailed change 1
- Detailed change 2
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Branch Naming

- `feature/TYPE-XXX-brief-description`
- `bugfix/TYPE-XXX-brief-description`
- `hotfix/TYPE-XXX-brief-description`
