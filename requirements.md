✅ FULL STRUCTURE DESCRIPTION (HTML + CSS + JS)
Project: PromptBrary

This document defines the layout, components, and interactions needed to build the basic structure of the app.

1️⃣ Page Layout Overview

The app layout is divided into three main sections:

A. Left Sidebar

A vertical navigation sidebar.

B. Center Panel

Contains the user input field (raw prompt).

C. Right Panel

Displays the enhanced / optimized prompt output.

The layout is a three-column flexbox, with the sidebar having a fixed width and the other two panels expanding fluidly.

2️⃣ Left Sidebar Structure
Purpose

Navigation and app organization.

Content

App Name / Logo area (top)

Navigation Items

Prompt Enhancer

Social Media Content

History

Saved

Footer Logo / Branding (bottom)

Behavior

Clicking a navigation item switches the center+right panel content.

Active item is highlighted.

Sidebar styling

Fixed width (250px recommended).

Full height (100vh).

Light background (#f7f7f7 or white).

Icons optional.

3️⃣ Center Panel Structure (User Input Panel)
Purpose

User enters their raw text that needs enhancement.

Content

Title: “What would you like to enhance?”

A large textarea for input.

Dropdown: “Choose Model” (ChatGPT, Claude, Generic)

Button: Enhance Prompt (primary action)

Behavior

Clicking Enhance sends the text for processing (handled by JS or later API).

After enhancement, the right panel updates.

Styling

White card/container.

Rounded corners & subtle shadows.

Padding ~ 24px.

Vertical spacing between elements.

4️⃣ Right Panel Structure (Output Panel)
Purpose

Displays the optimized / enhanced prompt.

Content

Title: “Your Enhanced Prompt”

Output area (scrollable)

Buttons:

Copy

Save

Re-Enhance (optional)

Behavior

Copy: Copies enhanced prompt to clipboard.

Save: Stores to LocalStorage → appears under “Saved”.

Re-enhance: Sends the enhanced prompt back into the center panel’s textarea for another pass.

Styling

White card.

Scrollable content.

Buttons at top-right.

5️⃣ Navigation Pages

The four pages in sidebar should switch only the content inside the center and right panels.

Page 1: Prompt Enhancer (default)

Center: input textarea

Right: enhanced output

Page 2: Social Media Content

Center:

Options such as: Instagram caption, X post, LinkedIn post

Input fields based on selection

Right:

Generated social content

Page 3: History

Shows a list of previously generated content
(stored in LocalStorage)

Page 4: Saved

Shows saved enhanced prompts
(stored in LocalStorage)

6️⃣ JavaScript Basic Logic
A. Navigation Switching

Add event listeners to sidebar items.

When clicked → hide other panels, show correct panel content.

B. Prompt Enhancement Logic

For now, dummy function:

function enhancePrompt(rawText) {
   return "Enhanced version: " + rawText;
}


Later you will replace with AI API calls.

C. Copy Function

Use navigator.clipboard.writeText().

D. Save Function

Save enhanced prompt to LocalStorage array named savedPrompts.

E. History System

Every enhancement → save input + output + timestamp to history.

7️⃣ Recommended CSS Structure

Use:

Flexbox for layout

Grid inside cards if needed

CSS variables for theme

Layout Example
.container {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
}

.main {
  flex: 1;
  display: flex;
}

.center-panel {
  flex: 1;
}
.right-panel {
  flex: 1;
}