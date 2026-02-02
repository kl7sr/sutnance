# SEAAL UI Components

Reusable styled components following SEAAL brand guidelines.

## Components

### Button Components

#### PrimaryButton
Primary action button using seaal-dark (#003366) with smooth hover effects.

```jsx
import { PrimaryButton } from './components/ui';

<PrimaryButton onClick={handleClick} type="submit">
  Submit
</PrimaryButton>
```

#### SuccessButton
Success/confirm button using seaal-green (#8CC63F) for publishing/confirming actions.

```jsx
import { SuccessButton } from './components/ui';

<SuccessButton onClick={handlePublish} type="submit">
  Publish
</SuccessButton>
```

### Form Components

#### Input
Styled input field with rounded-lg and focus ring matching seaal-light (#00AEEF).

```jsx
import { Input } from './components/ui';

<Input
  label="Email"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  placeholder="Enter your email"
  required
  error={errors.email}
/>
```

#### Textarea
Styled textarea with the same styling as Input.

```jsx
import { Textarea } from './components/ui';

<Textarea
  label="Message"
  name="message"
  value={formData.message}
  onChange={handleChange}
  placeholder="Enter your message"
  rows={4}
  required
  error={errors.message}
/>
```

## Features

- ✅ Follows SEAAL brand color palette
- ✅ Smooth hover and transition effects
- ✅ Accessible with proper labels and error handling
- ✅ Fully customizable with className prop
- ✅ TypeScript-friendly props
