# Buildwell: Phase 3 prototype

A clickable prototype of Buildwell, a made-to-order furniture system, following Maria's scenario: she orders a desk that fits a 48-inch space on her tablet.

- **Open it locally:** double-click `index.html` (Chrome).
- **Live link:** `https://<username>.github.io/buildwell/` (updates a minute or two after each Sync)
- **Demo panel:** press **D** (or open `index.html?demo`) to jump to a screen, change what the scan returns, create an order, advance its stage, or reset.

---

## How we work together (3 rules)

1. **Sync before you start.** Click **Sync Changes** in VS Code's Source Control panel to get everyone's latest work.
2. **Only edit your own files.** Each area owns its own files (table below). If you need a change in someone else's file (for example, a new state field), ask the owner in the chat.
3. **Test, then Commit and Sync when you finish.** Open `index.html`, check your screen works and Chrome's console (F12) shows no red errors, then Commit and Sync.

That's it. No branches or pull requests.

### First-time setup

1. Accept the GitHub invitation from your email.
2. Install [Git](https://git-scm.com) (default options) and VS Code. Restart VS Code after installing Git.
3. Get your private GitHub email: github.com → **Settings → Emails** → tick **Keep my email addresses private** → copy the address that looks like `12345678+yourname@users.noreply.github.com`.
4. In VS Code, open a terminal (`` Ctrl+` ``) and run these three lines (with your own name and that address):
   ```
   git config --global user.name "Your Name"
   git config --global user.email "12345678+yourname@users.noreply.github.com"
   git config --global pull.rebase false
   ```
   Without these, your first commit or sync will fail.
5. In VS Code, open the **Source Control** panel (branch icon on the left) → **Clone Repository** → sign in with GitHub when asked → pick `Buildwell` → choose a folder → **Open**.
6. Always open the folder that contains the hidden `.git` folder (File → Open Folder).

**Never edit files on the github.com website.** Make every change in VS Code, so changes only arrive one way.

### Every work session

1. Source Control panel → **Sync Changes** (or the circular arrows at the bottom-left).
2. Edit your files. Test by double-clicking `index.html` (refresh Chrome after each save).
3. In Source Control, **type a short message first** ("Fit check: add warning colours") in the box above Changes → **Commit** → **Sync Changes**.
   - Commit = save a checkpoint on your computer. Sync = download others' work, then upload yours.
   - If a `COMMIT_EDITMSG` tab opens, you left the message empty: type it on the first line, then click the ✓ at the top-right.
   - If a `MERGE_MSG` tab opens after syncing, just click the ✓. Git is combining your work with someone else's.

### If something goes wrong

- **"Git not found":** install Git, then restart VS Code.
- **"Make sure you configure your user.name and user.email":** do setup step 4.
- **"Push declined due to email privacy restrictions":** set your no-reply email (setup steps 3–4), then run `git commit --amend --reset-author --no-edit` and `git push`.
- **"Can't push refs… try running pull first":** run `git pull` in the terminal, then `git push` (or Sync again).
- **A conflict message:** two people edited the same file. Don't guess. Post in the chat.
- **The live link looks old:** wait two minutes and hard-refresh (`Ctrl+Shift+R`).
- **Videos:** never put them in the repo (GitHub has a 100 MB limit). Send them through Google Drive.

---

## The four areas (claim one in the chat)

The shared parts already work: moving between screens, Back, Undo, A+ text, the price calculation, the price bar, toast messages, confirm dialogs, the voice mock and the demo panel. **Home is fully built as a worked example.** Every other screen is a placeholder with dashed boxes showing what goes where, and a temporary button so Maria's path still clicks through.

Open your screen file: the top lists **exactly what to build**, which state values to read and save, and code patterns to copy.

| Area | What you build | Your files | Must save to state |
|---|---|---|---|
| **A: (Michael)** | Help screen; Home polish; keeping everyone's screens consistent; merging and final checks | `js/screens/home.js`, `js/screens/help.js`, `css/home.css`, `css/help.css` + all shared files | `mode`, `lang`, `textSize` |
| **B: Style and fit** | Category row and style picture cards; simulated camera scan; confirm or enter your own width (in/cm); true-scale drawing with a person and the old desk; too-wide warning with Make it fit, Keep anyway (asks to confirm) and Re-measure | `js/screens/style.js`, `js/screens/fit.js`, `css/style.css`, `css/fit.css` | `style`, `deskWidth`, `roomWidth`, `roomConfirmed`, `keepAnyway` |
| **C: Customize** | Desk preview with a drag handle; Narrower/Wider buttons; finish and handle choices; close-up and side-by-side finish comparison; voice phrases; the agreed price numbers | `js/screens/customize.js`, `css/customize.css`, prices in `js/price.js` | `deskWidth`, `finish`, `handles` |
| **D: Order** | Review summary with Change links; delivery form, mock payment and "sent to the factory" confirmation; order timeline, notification toggle and cancel window | `js/screens/review.js`, `js/screens/checkout.js`, `js/screens/orders.js`, `css/review.css`, `css/checkout.css`, `css/orders.css` | `customer`, `order` |

**Why "Must save to state" matters:** it's how the screens connect without anyone waiting on anyone. B's fit check saves `roomWidth`; C's customize screen reads it. D's review reads everything B and C saved.

**Testing your screen on its own:** state starts with realistic values (48 in space, 44 in desk, oak, brushed metal), so press **D** → **Jump to** your screen and start. D can use **Create sample order** and **Advance order stage** to test My Orders.

**When your screen is real:** delete the `B.ui.placeholder(...)` call and the temporary button. Keep `B.ui.toolbar(container)` as the first line of `render()`.

---

## How the code fits together

```
index.html            loads every CSS and JS file, in order
css/base.css          colours, text sizes, buttons, shared pieces
css/<screen>.css      layout for one screen only
js/state.js           shared data (width, finish, order, ...)
js/router.js          moving between screens, Back, Undo
js/price.js           price and delivery table
js/i18n.js            Home screen text in English and Spanish
js/components/        toolbar, toast + confirm dialog, price bar, voice mock, placeholder boxes
js/screens/           one file per screen
js/demo.js            hidden demo panel
js/main.js            starts the app (loads last)
```

Everything hangs off one global object, `Buildwell`. There are no modules or `fetch()`, so the prototype runs from a double-clicked file.

### Functions you can use

| Function | What it does |
|---|---|
| `Buildwell.state.get('deskWidth')` | Read a shared value |
| `Buildwell.state.set('deskWidth', 46)` | Change a value (Undo can reverse it). Add `{ undo: false }` for settings. |
| `Buildwell.router.go('fit')` | Open a screen. Any button with `data-go="fit"` does the same. |
| `Buildwell.router.back()` / `undo()` | Previous screen / reverse the last change |
| `Buildwell.router.refresh()` | Redraw the current screen after changing state |
| `Buildwell.price.calc(state)` | Returns `{ total, weeks }` |
| `Buildwell.ui.toolbar(container)` | Back, Undo and A+ bar (every screen calls this first) |
| `Buildwell.ui.toast('Width: 46 in')` | Short feedback message |
| `Buildwell.ui.confirm('Sure?', onYes)` | Yes / Cancel dialog |
| `Buildwell.ui.priceBar(container, { label, go })` | Live price and delivery bar |
| `Buildwell.ui.voice(container, [{ label, action }])` | "Say it" mock panel |
| `Buildwell.t('title')` | Home screen text in the current language |
| `Buildwell.orderStages` | The six order stages, from "Order confirmed" to "Delivered" |
| `Buildwell.ui.placeholder(...)` | Temporary dashed boxes (delete once your screen is built) |

**State fields:** `mode, lang, textSize, furniture, style, measuredWidth, roomWidth, roomConfirmed, deskWidth, keepAnyway, finish, handles, price, delivery, customer, order`. To add one, ask A to add it to `defaults()` in `state.js`.

**Screen names:** `home, style, fit, customize, review, checkout, orders, help`.

### Every screen file looks like this

```js
// js/screens/fit.js  |  Owner: B  |  Wireframes 2 and 4  |  SR4, UR2, UR4
(function (B) {
  'use strict';

  B.screens.fit = {
    render: function (container) {
      B.ui.toolbar(container);
      // build the screen inside container
    },
    onEnter: function () {}
  };
})(window.Buildwell);
```

---

## Coding standards

- Start every file with a header comment: file, owner, wireframe, requirements covered.
- CSS classes start with your screen name (`.fit-...`, `.customize-...`) so styles never clash. Shared styles live only in `base.css`.
- Use `rem` for sizes and the colour variables from `base.css` (`var(--accent)`, `var(--text)`, ...). No typed colours, no inline styles except wood colours via `var(--wood-oak)` etc.
- Lowercase file names.
- Use real `<button>` elements with visible text (or an `aria-label`). Don't make anything smaller than the shared `.btn` size.
- No timers that limit the user (UR6). Every action shows a visible change or toast within 1 second (UR3).
- Check your screen at **A+ 200%** and in **Guided** mode before you Sync.

### Your screen is done when

- [ ] It matches its wireframe (in a plain, consistent light style)
- [ ] Back and Undo work
- [ ] Text scales cleanly up to 200% with A+
- [ ] It works at tablet size (Chrome DevTools device mode, about 1024x768)
- [ ] Chrome's console shows no red errors

---

## Recording your segment (3–4 minutes, .mp4)

1. Chrome DevTools device mode at about 1024x768. Press **D** → **Reset everything** before you start.
2. Say what your part does and which requirements it covers.
3. Do a live run of your part of Maria's path and show that it works.
4. Walk through your code and explain what each part does.
5. Send the .mp4 to Mizo by **Thursday evening**.
