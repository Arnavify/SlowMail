Build a **simple, polished “slow messaging” web app** where messages are delivered according to **real-world time rather than instantly**.

### Core concept

The app should feel intentionally slow and calm. When a user sends a message, it should not necessarily appear immediately for the recipient. The delivery time should be based on real-world time.

For the MVP, implement a simple rule such as:

* Messages sent during the day are delivered after a short real-time delay.
* Alternatively, allow messages to be scheduled for a specific future time.
* The important part is that **messages should genuinely respect real elapsed time**, rather than faking the delay with an animation.

### Authentication

Create a very simple login/signup experience:

* Username
* Password
* Login
* Sign up
* Logout
* Keep the authentication system lightweight.
* For a static/demo deployment, provide a sensible local/demo authentication fallback using browser storage.
* Do not introduce unnecessary authentication complexity.

### Messaging UI

Create a minimal messaging interface containing:

* Conversation list/sidebar
* Current conversation
* Message bubbles
* Text input
* Send button
* Message timestamp
* Delivery status such as:

  * Sending
  * Waiting
  * Delivered
  * Read

Show pending messages clearly without making the interface feel cluttered.

### Visual design

Keep the entire interface **extremely simple, modern, and premium**.

Think:

* Minimal typography
* Generous whitespace
* Subtle borders
* Soft surfaces
* Restrained colour palette
* Excellent spacing
* No unnecessary gradients or decorative UI
* No excessive cards
* No dashboard-like visual clutter

The app should feel like a deliberately designed product, not a generic AI-generated messaging template.

### Animations

Add **slick, subtle animations throughout the application**.

Use animations for:

* Page transitions
* Login/signup transitions
* Opening conversations
* Sending a message
* Messages entering the conversation
* Delivery-state changes
* Typing indicator
* Sidebar interactions
* Buttons and hover states
* Loading states

Animations should be:

* Smooth
* Fast enough to remain usable
* Physically believable
* Subtle rather than flashy

Use transforms and opacity where possible instead of expensive animations. Respect `prefers-reduced-motion`.

### Real-time behaviour

The slow-delivery mechanism must be based on actual timestamps.

Do NOT simply use:

`setTimeout(() => showMessage(), ...)`

as the underlying delivery mechanism.

Instead:

1. Store the message's creation timestamp.
2. Store its intended delivery timestamp.
3. Calculate the current time against the delivery timestamp.
4. Determine whether the message should currently be visible/delivered.
5. Persist this state so refreshing the page does not reset the timer.

This means a user can close the browser, reopen it later, and the message will still have the correct delivery state.

### Data persistence

For the static version, use browser-based persistence such as:

* `localStorage`
* IndexedDB where appropriate

Structure the application so the data layer can later be replaced by a real backend without rewriting the UI.

Create clean abstractions for:

* Users
* Conversations
* Messages
* Delivery timestamps
* Message status

### Demo experience

Include realistic demo data so the application does not look empty on first launch.

Provide:

* A demo account
* A few conversations
* Example delivered messages
* Example waiting messages
* Example scheduled messages

Make the demo immediately understandable without requiring setup.

### Responsive design

The app must work properly on:

* Desktop
* Tablet
* Mobile

On mobile, transform the conversation list into a navigable screen rather than trying to squeeze the desktop layout onto a small display.

### Technical requirements

Build this as a clean modern frontend suitable for deployment on **Cloudflare Pages**.

Prefer a lightweight stack such as:

* React
* Vite
* TypeScript
* CSS or a lightweight styling solution

Avoid unnecessary dependencies.

The application should:

* Build successfully with a standard production build command.
* Work correctly as a static site.
* Have no hard dependency on a development server.
* Avoid server-side functionality unless absolutely necessary.
* Use relative/static assets.
* Be compatible with Cloudflare Pages.

### Static export

This is important:

Create the project so it can be exported as a **self-contained static HTML/CSS/JS website**.

After building:

* Generate the production `dist` output.
* Ensure the output contains everything required to run the frontend.
* Do not require a Node.js server to serve application logic.
* Do not depend on environment variables for the basic demo.
* Make the exported version usable as a static website.

Also create a **ZIP archive of the complete deployable project/static export**.

The ZIP should contain the necessary files to:

1. Upload/deploy to Cloudflare Pages.
2. Run locally as a static website.
3. Inspect and modify the source code.

Include a concise `README.md` explaining:

* How to run locally.
* How to build.
* How to deploy to Cloudflare Pages.
* Where the static production output is located.
* How the demo authentication works.
* How the slow-message timing system works.

### Code quality

Keep the implementation clean and understandable.

Use:

* Reusable components
* Clear naming
* Logical folder structure
* TypeScript types/interfaces
* Centralised message/timing logic
* Minimal dependencies
* No unnecessary abstractions

Do not over-engineer the MVP.

### Final deliverables

The final result should include:

1. A fully functional slow-messaging web app.
2. A polished responsive UI.
3. Slick but restrained animations.
4. Real timestamp-based delayed message delivery.
5. Persistent browser-based data.
6. Demo login and sample conversations.
7. Cloudflare Pages-compatible production build.
8. Static HTML/CSS/JS export.
9. A ZIP file containing the complete project/export.
10. A README with deployment instructions.

Before considering the task complete, test the application by:

* Logging in.
* Opening a conversation.
* Sending a message.
* Confirming the message enters the waiting state.
* Refreshing the page.
* Confirming its delivery timing has not reset.
* Confirming the message eventually becomes delivered according to its stored timestamp.
* Testing the responsive layout.
* Running the production build.
* Verifying that the resulting static output can be served without the development server.

Prioritize **simplicity, polish, genuine time-based behaviour, and deployability** over adding lots of features.
