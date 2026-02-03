export const DEFAULT_REQUIREMENT_TEMPLATE = `## Technology Stack

- Typescript
- Latest Stable Version of ReactJS
- Package Manager
- No mandatory libraries required

**All the above are mandatory and not open to interpretation**

## Context

Everyone loves dogs, but choosing the most suitable breed for you and your family from hundreds of beautiful options can be daunting.

Enter **DogFinder**, an easy-to-use, intuitive web application with precise information to help you narrow down your favourite breeds!

Swap and choose your next best friend!

## Functionalities

### Authentication

No authentication is expected; simply use the API key (yours or ours) and begin using your application. A configuration file for easy switching between users is anticipated.

### Main Page

This page is the core of the application, housing most of the features.

- As a user, I want to load breeds and view information as depicted in the mock-ups below.
  - The design can be adapted to adhere to best practices
  - Images should be displayed in the background without being stretched
- As a user, I can reject a breed by:
  - Swiping left
  - Clicking on a ❌ button
  - Making an API call with value = -1
  - It allows me to move to the next breed
- As a user, I can like a breed by:
  - Swiping right
  - Clicking on a ✅ button
  - Making an API call with value = 1
  - It allows me to move to the next breed
- As a user, I can access the details page by:
  - Tapping or clicking anywhere on the image or text
- As a user, I want my swiping progress saved if I reload the page, so the application should smartly know the last id loaded and continue from the next one.

### Details Page

This page will display comprehensive information about the dog as illustrated in the mock-ups below.

- As a user, I want to learn more about a breed, including:
  - weight.metric
  - height.metric
  - name
  - bred_for
  - breed_group
  - life_span
  - temperament

### Technical Details

This section introduces additional expectations for this assessment that are not directly linked to any specific page. The points beginning with "As a technical reviewer" can be addressed after the code submission, although we expect them to be completed within the homework timeline.

- As a user, I expect the application to be usable on both my mobile device and computer (responsive design)
- As a technical reviewer, I expect the source code to be thoroughly tested with unit tests
- As a technical reviewer, I am looking for tools that ensure the code's stability and consistency (e.g., linting, pre-commit hooks)
- As a technical reviewer, I value clear, meaningful, and frequent commit messages
- As a technical reviewer, I expect a README.md file that provides comprehensive information about the project, including:
  - Instructions for setting up the project
  - Reasons for selecting certain libraries over others
  - Explanations of other technical decisions, as necessary
- As a technical reviewer, I expect proper security practices:
  - Environment files (.env, .env.local) are in .gitignore
  - No API keys, secrets, or credentials hardcoded in source code
  - Sensitive values are properly configured via environment variables
  - .env.example file provided with placeholder values (not real secrets)
- As a technical reviewer, I expect robust error handling:
  - API errors are caught and handled gracefully
  - User-friendly error messages are displayed (not raw error dumps)
  - Network failures don't crash the application
  - Loading and error states are properly managed

### Bonus

Please be aware that all the bonus tasks listed below are **optional**. You should only undertake them after completing all the mandatory tasks mentioned above.

Note that non-functional bonus features will be regarded in the same way as non-functional mandatory features.

We encourage you to focus on quality over quantity. It is better to do less work thoroughly than to attempt more in a superficial manner.

- As a user, I can "super like" a breed by:
  - Swiping up
  - Clicking on a ⭐ button
  - Making an API call with value = 2
- As a user, I can view a page that displays my likes, dislikes, and (if applicable) super likes by:
  - Clicking on a button to access this page
  - Making an API call to get votes
- As a user, I can filter between my likes, dislikes, and super likes, based on the functionality mentioned above
- As a developer, I may add any feature I consider meaningful for the project, whether it be technical or business-oriented
- As a technical reviewer, I appreciate proper accessibility:
  - Semantic HTML elements used appropriately (button, nav, main, etc.)
  - ARIA labels and attributes where needed (aria-label, role, etc.)
  - Keyboard navigation works for interactive elements
  - Images have meaningful alt text
  - Color contrast meets WCAG standards

---

## Source Code

### Do's

- Ensure the code is well-structured
- Use naming conventions that align with the programming language
- Maintain a consistent coding style throughout (linter, my dear friend)
- Comment on your code for clarity
- Cite your sources if you replicate an algorithm or a significant piece of code
- Use meaningful commit messages
- Document your work

### Don'ts

- Avoid copying and pasting without understanding the code
- Do not over-complicate the project
`;
