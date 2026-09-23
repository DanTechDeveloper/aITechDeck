# DESIGN.md

## Purpose

This document defines the project's frontend design principles and quality standards.

Its purpose is **not** to prescribe a specific visual style.

The project may be a dashboard, SaaS application, e-commerce system, educational platform, game, portfolio, internal tool, mobile application, marketing site, or another type of product.

The design must therefore be derived from:

1. The product's purpose
2. The target users
3. The actual user workflows
4. The information architecture
5. The platform and device constraints
6. The project's existing visual identity
7. Accessibility and usability requirements

The primary rule is:

> **Design the interface for the product. Do not design it according to whatever visual style an AI model happens to prefer.**

---

# 1. Core Design Principles

## 1.1 Product First

The interface must reflect the actual product.

Prioritize:

* User goals
* Core workflows
* Information hierarchy
* Task completion
* Readability
* Navigation
* Feedback
* Accessibility
* Consistency

Visual decoration is secondary to usability.

---

## 1.2 Do Not Invent a Design Language Without Reason

Before introducing a visual pattern, determine whether it serves a legitimate purpose.

Ask:

* What problem does this solve?
* What information does this communicate?
* Does it improve usability?
* Does it reinforce the product's identity?
* Is it consistent with the rest of the application?

If the answer is no, the element is probably unnecessary.

---

## 1.3 Existing Design Takes Priority

If the project already has an established design system, preserve it.

Before creating new styles:

1. Inspect existing components.
2. Inspect existing tokens.
3. Inspect existing layouts.
4. Inspect existing typography.
5. Inspect existing interaction patterns.
6. Reuse them when appropriate.

Do not redesign an existing product merely because a new page is being implemented.

---

## 1.4 Do Not Introduce AI-Generated Aesthetics by Default

AI-generated frontend implementations frequently converge on the same visual patterns.

Do not introduce these patterns merely because they are popular or visually impressive:

* Purple/blue gradients
* Gradient headline text
* Glassmorphism
* Excessive blur
* Bento grids
* Decorative feature cards
* Neon accents
* Excessively rounded cards
* Decorative grain
* Radial gradient orbs
* Dot-grid backgrounds
* Sparkle icons
* Cursor-following effects
* Decorative beams
* Excessive floating elements
* Excessive hover animations
* Generic terminal windows
* Fake dashboards
* Decorative badges
* Unnecessary three-column layouts
* Generic SaaS hero sections
* Generic pricing sections
* Generic testimonial sections
* Decorative icon boxes
* Buzzword-heavy copy

These patterns are **not prohibited**.

They are prohibited only when they are introduced without a product-specific reason.

A legitimate product requirement overrides this warning.

---

# 2. Design Direction

## 2.1 Every Project Needs a Deliberate Visual Direction

The project should have a coherent visual language.

This may be:

* Minimal
* Editorial
* Corporate
* Playful
* Educational
* Technical
* Industrial
* Game-like
* Luxury
* Governmental
* Utility-focused
* Brand-driven
* Data-dense
* Experimental

Do not assume that every project should look like a SaaS landing page.

---

## 2.2 Do Not Force a Universal Aesthetic

Do not automatically use:

* Dark mode
* Light mode
* Gradients
* Rounded cards
* Shadows
* Borders
* Glass effects
* Animations
* Illustrations
* Icons
* Large hero sections
* Marketing layouts

Use them only when appropriate to the product.

---

# 3. Design Tokens

Where practical, centralize reusable design decisions.

Typical tokens may include:

* Colors
* Typography
* Font sizes
* Font weights
* Line heights
* Spacing
* Border radius
* Borders
* Shadows/elevation
* Breakpoints
* Motion durations
* Z-index layers

The exact token structure depends on the project's framework and architecture.

Do not create tokens for values that genuinely do not need to be reused.

---

## 3.1 Avoid Arbitrary Styling

Prefer the project's established tokens and conventions.

Avoid repeatedly creating values such as:

```text
margin: 13px
padding: 27px
border-radius: 19px
```

when equivalent project tokens already exist.

Do not create arbitrary values merely to repair a poorly structured layout.

---

# 4. Typography

## 4.1 Establish a Clear Hierarchy

Typography should communicate:

* Importance
* Structure
* Reading order
* Relationships between content
* Interaction states

Hierarchy may be established through:

* Font size
* Weight
* Line height
* Color
* Spacing
* Position
* Style

---

## 4.2 Font Selection

Use a font system appropriate to the product.

A project may use:

* One typeface
* Multiple complementary typefaces
* A system font stack
* A brand typeface
* Platform-native typography

Do not introduce multiple fashionable fonts simply because they are currently popular.

Do not automatically use Inter, Geist, Space Grotesk, or another commonly generated AI font combination.

---

## 4.3 Decorative Typography

Avoid typography that exists only to make the interface look fashionable.

Examples:

* Random serif italic words
* Oversized gradient words
* Excessive uppercase labels
* Decorative quotation marks
* Unnecessary handwritten fonts

Use these only when they fit the product's actual visual language.

---

# 5. Color

## 5.1 Color Must Have a Purpose

Colors may communicate:

* Brand identity
* Hierarchy
* Status
* Interaction
* Categorization
* Warnings
* Errors
* Success
* Information

Do not choose colors merely because they look attractive in isolation.

---

## 5.2 Color Palette

The palette should be appropriate for the product.

There is no universal requirement to use:

* Dark backgrounds
* White backgrounds
* Purple
* Blue
* Pastels
* Neon colors
* Gradients

Any of these may be valid when justified by the product.

---

## 5.3 Contrast

Ensure sufficient contrast between meaningful foreground and background elements.

Do not rely on subtle color differences when users need to distinguish important information.

---

# 6. Icons and Visual Assets

## 6.1 Icon Consistency

If icons are used:

* Use a coherent icon system.
* Keep sizing consistent.
* Keep stroke/fill treatment consistent.
* Align icons properly.
* Use icons where they improve comprehension.

Do not mix unrelated icon styles without a reason.

---

## 6.2 Decorative Icons

Do not add icons simply to fill empty space.

Avoid:

* Random sparkles
* Decorative arrows
* Generic technology icons
* Unnecessary icon boxes
* Icons beside every heading

unless they have a genuine design or informational purpose.

---

# 7. Emojis

Emojis are optional.

Use them when they are genuinely appropriate to the product's audience or content.

Do not automatically:

* Add emojis to headings
* Use emojis as icons
* Add emojis to every section
* Use emojis to compensate for weak visual hierarchy

An educational children's application may legitimately use emojis extensively.

A banking interface probably should not.

**Context determines the rule.**

---

# 8. Layout and Information Architecture

## 8.1 Layout Must Follow Information

Choose layouts based on the relationship between content and actions.

Possible structures include:

* Single-column
* Two-column
* Grid
* List
* Table
* Sidebar
* Tabs
* Split view
* Dashboard
* Feed
* Canvas
* Stepper
* Wizard

Do not force a three-column layout simply because it looks balanced.

---

## 8.2 Visual Hierarchy

Users should be able to determine:

1. Where they are
2. What the page is about
3. What information matters
4. What they can do
5. What action is most important

Hierarchy should come from structure, not decoration.

---

## 8.3 Whitespace

Whitespace should improve:

* Readability
* Grouping
* Hierarchy
* Focus
* Navigation

Do not add large empty spaces merely to make a page resemble a marketing landing page.

---

# 9. Cards and Containers

Cards are optional.

Use cards when they improve:

* Grouping
* Scannability
* Hierarchy
* Interaction
* Information separation

Do not turn every piece of content into a card.

Avoid automatically adding:

* Glass cards
* Floating cards
* Excessively rounded cards
* Excessive shadows
* Colored side borders
* Decorative cards
* Three cards in a row

unless the product's information architecture benefits from them.

---

# 10. Navigation

Navigation must reflect the application's actual information architecture.

Consider:

* Primary navigation
* Secondary navigation
* Breadcrumbs
* Tabs
* Sidebars
* Bottom navigation
* Contextual navigation
* Back navigation

Do not add navigation elements merely because they are common in templates.

The user should always have a clear understanding of where they are and how to move to relevant areas.

---

# 11. Buttons and Actions

Buttons must communicate:

* What action will occur
* Whether the action is available
* Whether the action is currently processing
* Whether the action succeeded or failed

Primary actions should be visually distinguishable from secondary and destructive actions.

Do not create excessive competing primary CTAs.

Do not make every button visually loud.

---

# 12. Forms

Forms should clearly communicate:

* Field purpose
* Required fields
* Valid input
* Invalid input
* Validation errors
* Submission state
* Loading state
* Success
* Server errors
* Network failures

Do not rely exclusively on color to communicate validation.

Use appropriate labels, descriptions, error messages, and accessible relationships.

---

# 13. Interaction States

Interactive components should intentionally support applicable states.

Depending on the component, these may include:

* Default
* Hover
* Focus
* Active
* Pressed
* Selected
* Disabled
* Loading
* Success
* Error
* Empty

Not every component requires every state.

Do not implement states that have no meaningful purpose.

---

# 14. Loading, Empty, Error, and Success States

Applications should account for asynchronous and incomplete states where applicable.

Consider:

### Loading

The interface should communicate that work is occurring.

Possible approaches:

* Skeleton
* Spinner
* Progress indicator
* Placeholder
* Optimistic UI
* Inline loading state

Choose based on the interaction.

---

### Empty

An empty state should explain:

* What is missing
* Why it may be empty
* What the user can do next, when applicable

Do not fill empty states with meaningless illustrations or marketing copy.

---

### Error

Errors should:

* Explain what went wrong when possible
* Avoid exposing unnecessary technical details
* Tell the user what they can do next when possible
* Preserve user input where practical

---

### Success

Success feedback should be proportional to the importance of the action.

Do not use large celebrations for routine actions.

Do not use subtle feedback for critical actions where confirmation matters.

---

# 15. Motion and Animation

Animation is optional.

Use motion when it improves:

1. Feedback
2. Comprehension
3. Spatial continuity
4. State communication
5. Orientation

Avoid animation that exists only to make a page look impressive.

Common examples of unnecessary motion include:

* Cursor-following beams
* Constant floating objects
* Excessive scroll reveals
* Decorative sparkle effects
* Repeated bounce animations
* Unnecessary hover transformations
* Long entrance animations
* Motion that delays interaction

---

## 15.1 Performance

Animation must not unnecessarily degrade:

* Responsiveness
* Battery usage
* Rendering performance
* Accessibility
* Task completion

Respect reduced-motion preferences where appropriate.

---

# 16. Responsive Design

Responsive behavior must be based on the actual interface.

Support the devices relevant to the project.

Depending on the product, this may include:

* Mobile
* Tablet
* Laptop
* Desktop
* Large displays

Do not blindly create breakpoints because a framework provides them.

---

## 16.1 Mobile

Mobile must not simply be a shrunken desktop layout.

Consider:

* Touch targets
* Navigation
* Content density
* Text wrapping
* Forms
* Tables
* Modals
* Dialogs
* Keyboard behavior
* Horizontal overflow
* Primary actions

Hover-only interactions must not be required for essential functionality.

---

# 17. Accessibility

Accessibility is part of interface quality.

Where applicable:

* Use semantic HTML.
* Provide accessible names.
* Support keyboard interaction.
* Maintain visible focus states.
* Provide meaningful alternative text.
* Do not rely solely on color.
* Maintain sufficient contrast.
* Respect reduced-motion preferences.
* Ensure controls are usable with assistive technologies.
* Ensure interactive targets are reasonably usable on touch devices.

Accessibility requirements should be appropriate to the platform and product.

---

# 18. Content and Copy

Interface copy should describe the actual product.

Prefer:

* Specific language
* Clear labels
* Useful instructions
* Concrete feedback
* Concise explanations

Avoid:

* Empty buzzwords
* Generic AI/SaaS terminology
* Fake claims
* Fake statistics
* Fake testimonials
* Fake customer logos
* Marketing copy unrelated to the product
* Unnecessary jargon

Do not write marketing copy when the interface needs an instruction.

Do not write instructions when the interface needs a simple label.

Use the smallest amount of copy necessary to make the user's task clear.

---

# 19. Product Authenticity

The interface must represent the actual product.

Prefer:

* Real workflows
* Real data
* Real states
* Real functionality
* Real screenshots
* Product-specific illustrations
* Meaningful empty states

Avoid:

* Fake dashboards
* Fake terminal windows
* Fake testimonials
* Fake statistics
* Fake reviews
* Fake customer logos
* Placeholder marketing sections
* Decorative UI pretending to be functionality

Do not create visual complexity to make a simple product appear more sophisticated.

---

# 20. Marketing Pages

This section applies **only if the project has marketing/public-facing pages**.

Marketing pages may use:

* Hero sections
* Feature sections
* Testimonials
* Pricing
* Social proof
* Product demonstrations
* CTAs

However, each section must have a legitimate purpose.

Do not automatically generate the standard:

```text
Badge
↓
Huge gradient headline
↓
Subtitle
↓
Two buttons
↓
Three feature cards
↓
Testimonials
↓
Pricing
↓
FAQ
↓
CTA
```

That structure is appropriate for some products and completely inappropriate for others.

---

# 21. SEO and Metadata

This section applies **only when relevant to the platform and product**.

For public/indexable web pages, consider:

* Page title
* Meta description
* Open Graph metadata
* Favicon
* Canonical URL
* robots.txt
* sitemap.xml
* Structured data where appropriate

Do not implement SEO infrastructure for private applications where it provides no meaningful benefit.

For authenticated dashboards, internal tools, and non-indexable applications, many SEO requirements may not apply.

---

# 22. Legal and Trust Requirements

Implement only requirements relevant to the project and jurisdiction.

Potential requirements include:

* Privacy policy
* Terms of service
* Cookie consent
* Data-processing notices
* Contact information
* Accessibility statement

Never create fake legal information.

---

# 23. Analytics

Analytics are optional and project-dependent.

If analytics are required:

* Use an appropriate implementation.
* Understand what data is collected.
* Respect applicable privacy requirements.
* Avoid unnecessary performance impact.
* Do not add tracking merely because analytics are common in web applications.

---

# 24. Platform-Specific Considerations

The design must respect the platform.

For web:

* Browser behavior
* Responsive layouts
* Keyboard interaction
* Browser accessibility
* URL/navigation behavior

For mobile:

* Touch interaction
* Screen sizes
* Safe areas
* Platform conventions
* Navigation patterns
* Keyboard behavior
* Gesture interaction

For desktop:

* Window sizes
* Keyboard/mouse interaction
* Dense information layouts
* Hover states where appropriate

For games:

* Game feedback
* Game loops
* Input responsiveness
* Audio/visual feedback
* Player focus
* Performance

Do not apply web-specific requirements to non-web interfaces without a reason.

---

# 25. Component Architecture

Reuse components when reuse improves consistency and maintainability.

Prefer:

* Shared components for genuinely shared behavior
* Design tokens for repeated visual decisions
* Consistent component APIs
* Clear component responsibilities

Avoid:

* Copy-pasted components
* Unnecessary abstraction
* One-off variants for trivial differences
* Giant components containing unrelated responsibilities
* Creating a component solely because a design tool or AI suggested one

Do not abstract something merely because it looks similar.

Abstract when there is meaningful shared behavior, structure, or maintenance value.

---

# 26. Existing Component Libraries

If the project uses a component library:

1. Inspect the existing components.
2. Determine whether they fit the project's design.
3. Customize them when appropriate.
4. Replace them only when there is a genuine requirement.

Do not blindly dump a component library into the application.

Do not blindly reject a component library either.

The requirement is **coherence**, not ideological purity.

---

# 27. Avoid Design Drift

When implementing a new feature, compare it against the existing application.

Check:

* Typography
* Colors
* Spacing
* Components
* Navigation
* Interaction patterns
* Feedback
* Responsive behavior

A new feature should feel like part of the same product unless the feature intentionally establishes a different visual context.

---

# 28. Design Decision Process

Before introducing a significant visual pattern, answer:

### 1. What is the user's goal?

What is the user actually trying to accomplish?

### 2. What information matters?

Identify the content and actions that deserve visual priority.

### 3. What is the appropriate interaction?

Choose the interaction based on the task, not popularity.

### 4. What visual hierarchy communicates that interaction?

Choose layout, typography, color, and components accordingly.

### 5. Does the design match the existing product?

If not, determine whether the difference is intentional.

### 6. Does the visual element serve a purpose?

If not, remove it.

---

# 29. AI Implementation Rules

When an AI agent modifies the frontend:

## Before implementing

The agent should inspect:

* Existing pages
* Existing components
* Existing styles
* Design tokens
* Routing
* Responsive behavior
* Existing interaction patterns

Do not invent a new design system without evidence that one is required.

---

## During implementation

The agent should:

* Reuse existing components where appropriate.
* Preserve existing visual language.
* Follow existing naming conventions.
* Avoid unnecessary dependencies.
* Avoid unnecessary animations.
* Avoid unnecessary decorative elements.
* Avoid unnecessary restructuring.
* Keep changes proportional to the feature.

---

## After implementation

The agent should verify:

* The feature works.
* Existing functionality still works.
* The visual language remains consistent.
* Responsive behavior remains usable.
* Accessibility has not regressed.
* Loading/error/empty states are handled where applicable.
* No unnecessary decorative patterns were introduced.

---

# 30. Anti-AI-Slop Checklist

Before accepting a frontend implementation, ask:

* [ ] Did the AI invent a visual style without inspecting the project?
* [ ] Did it add gradients without a product reason?
* [ ] Did it add glassmorphism without a product reason?
* [ ] Did it add unnecessary cards?
* [ ] Did it create a generic three-column layout?
* [ ] Did it add decorative icons?
* [ ] Did it add emojis unnecessarily?
* [ ] Did it add excessive rounded corners?
* [ ] Did it add excessive shadows?
* [ ] Did it add unnecessary animations?
* [ ] Did it add cursor-following effects?
* [ ] Did it add decorative background effects?
* [ ] Did it add a generic SaaS hero?
* [ ] Did it add fake statistics or testimonials?
* [ ] Did it add marketing sections that the product does not need?
* [ ] Did it introduce another font without justification?
* [ ] Did it create unnecessary components?
* [ ] Did it introduce unnecessary dependencies?
* [ ] Did it redesign unrelated parts of the application?

If the answer to any of these is yes, determine **why it exists** before keeping it.

A pattern is acceptable when it is justified by the product.

---

# 31. Definition of Done

A design implementation is complete when the **applicable** requirements have been satisfied.

## Visual

* [ ] Visual hierarchy is clear.
* [ ] Typography is consistent.
* [ ] Colors are intentional.
* [ ] Spacing is consistent.
* [ ] Components are visually coherent.
* [ ] Decorative elements have a purpose.

## Interaction

* [ ] Primary actions are clear.
* [ ] Applicable interaction states are implemented.
* [ ] Loading behavior is intentional.
* [ ] Error behavior is intentional.
* [ ] Empty states are handled where necessary.
* [ ] Success feedback is appropriate.
* [ ] Destructive actions are appropriately communicated.

## Responsive

* [ ] Relevant target screen sizes were tested.
* [ ] No unintended horizontal overflow exists.
* [ ] Touch interaction works where applicable.
* [ ] Essential functionality does not depend on hover.
* [ ] Content remains readable at supported sizes.

## Accessibility

* [ ] Interactive elements have accessible names.
* [ ] Keyboard interaction works where applicable.
* [ ] Focus states are visible.
* [ ] Meaningful images have appropriate alternative text.
* [ ] Color is not the only state indicator.
* [ ] Contrast is sufficient.
* [ ] Motion does not unnecessarily interfere with usability.

## Production

Where applicable:

* [ ] Page titles are appropriate.
* [ ] Metadata is appropriate.
* [ ] Error pages exist.
* [ ] Favicon/app icon exists.
* [ ] Legal/trust requirements are addressed.
* [ ] Analytics are intentionally configured.
* [ ] Performance has been considered.

## Authenticity

* [ ] The interface represents real functionality.
* [ ] No fake product claims exist.
* [ ] No fake testimonials exist.
* [ ] No fake statistics exist.
* [ ] No fake customer logos exist.
* [ ] No decorative UI is pretending to be functionality.

## AI-Slop Check

* [ ] No generic visual style was introduced without justification.
* [ ] No unnecessary trendy patterns were added.
* [ ] No unnecessary animation was added.
* [ ] No unnecessary dependencies were introduced.
* [ ] No unrelated parts of the product were redesigned.
* [ ] The final interface feels like a deliberate product rather than a generated template.

---

# 32. Core Rule

> **Do not ask, "What would make this interface look impressive?"**
>
> Ask, **"What design best serves this product and its users?"**

The project determines the design.

Not the framework.

Not the component library.

Not current design trends.

Not the AI model.

Not Dribbble.

Not whatever frontend pattern is currently being generated everywhere.

**Use visual patterns when they solve a real design problem. Remove them when they do not.**