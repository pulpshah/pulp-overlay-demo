# Content Bridge

## Overview

The Content Bridge Project is a web application that analyzes textual content from a user-provided URL, identifies claims within the text, and highlights them with colors corresponding to their types. The application utilizes OpenAI's API to process text and categorize claims into the following types:

- **Fact**: Highlighted in yellow
- **Value**: Highlighted in light blue
- **Policy**: Highlighted in light green

The application also features an overlay that allows users to manually trigger the highlighting process. Each highlighted claim provides a tooltip displaying its type for better context.

---

## Features

- **URL-based Content Analysis**: Users can provide any valid URL, and the app will replicate the content for analysis.
- **Claim Identification**: The app identifies claims in the text, categorizing them into facts, values, and policies.
- **Color-Coded Highlights**: Claims are visually distinguished using specific background colors.
- **Tooltips for Context**: Hovering over a highlighted claim reveals its type.

---

## How It Works

1. **Input URL**: The user provides a URL containing the text to be analyzed.
2. **Fetch and Render Content**: The app fetches the HTML content from the provided URL and renders it within the app.
3. **Analyze Claims**: When the user clicks the "Highlight Claims" button, the app sends the content to OpenAI's API for claim analysis.
### Note: Please wait for it to load, it can take a while to get it to work
4. **Highlight Claims**: Identified claims are highlighted in the text with tooltips showing the claim type.

---

## Next Steps

### Right-Click Menu on Highlighted Claims
Introduce a context menu for each highlighted claim that offers additional actions. The menu will vary depending on the claim type:

#### General Options:
- **Ask AI**: Query AI for further information or clarification about the claim.
- **See Related**: Display related claims or context.
- **Flag**: Allow users to flag claims for review.
- **Add Comment**: Provide users the ability to comment on a claim.

#### Additional Menu Items Based on Claim Type:
1. **Claim of Fact**:
   - **Fact Check**: Verify the claim with external sources or AI.

2. **Claim of Value**:
   - **See Pros/Cons**: Display a bullet list or table with three pros and three cons.

3. **Claim of Policy**:
   - **See Pros/Cons**: Display a bullet list or table with three pros and three cons.

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/claim-highlighter.git
   ```
2. Navigate to the project directory:
   ```bash
   cd claim-highlighter
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser:
   ```
   http://localhost:3000
   ```