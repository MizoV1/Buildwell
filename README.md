# Buildwell: Phase 3 prototype

A clickable prototype of Buildwell, a made-to-order furniture system, following Maria's scenario: she orders a desk that fits a 48-inch space on her tablet.

> **To see the prototype:** open `index.html` in VS Code, then click **Go Live** at the **bottom-right** of VS Code. It opens in your browser and updates every time you save. Click the same button (now showing "Port: 5500") to stop it.

- **Live link:** https://mizov1.github.io/Buildwell/ (updates a minute or two after each Sync)
- **Demo panel:** press **D** (or open `index.html?demo`) to jump to any screen, change what the scan returns, create an order, advance its stage, or reset.

To read everything better in the top right, swap from text editor to markdown editor.

---

## How we work together

### The 3 rules

1. **Sync before you start.** Get everyone's latest work first.
2. **Only edit your own files.** Your files are listed in the area table below. Need a change in someone else's file (for example, a new state field)? Ask the owner in the chat.
3. **Test, then Commit and Sync when you finish.** Check your screen works and Chrome's console (F12) shows no red errors, then Commit and Sync.

No branches or pull requests. Everyone works on `main`.

### Saved, committed, synced: three different things

| Step | What it does | How | How you know it worked |
|---|---|---|---|
| **Save** | Writes the file to your computer | `Ctrl+S` | The white dot on the file's tab disappears |
| **Commit** | Makes a checkpoint you can go back to (still only on your computer) | Type a message in Source Control, click **Commit** | The file leaves the **Changes** list; the Sync button shows ↑1 |
| **Sync** | Downloads others' work, then uploads yours to GitHub | Click **Sync Changes** | The number on the button disappears; your change shows on GitHub and the live link |

Your teammates only see your work after **Sync**. Saving alone isn't enough.

**Tip:** turn on **File → Auto Save** in VS Code so you never lose an edit.

### Where to edit, and where to look at old versions

| You want to | Go to | Notes |
|---|---|---|
| **Edit a file** | **Explorer** (top icon on the left, or `Ctrl+Shift+E`) → click the file | The tab title is just the file name, e.g. `fit.js`. Only edits made here are saved and committed. |
| **See what you've changed** | **Source Control** (`Ctrl+Shift+G`) → click a file under **Changes** | Shows old on the left, yours on the right |
| **Look at an old version** | **Source Control** → **Graph** (bottom of the panel) → click a commit, then a file | **View only.** The tab shows a commit code, e.g. `fit.js (a1b2c3d)`. Typing there changes nothing. |

If you edit something and it never appears under **Changes**, check the tab title: you're probably in a Graph or comparison view. Close it and open the file from the Explorer.

### Every work session

1. Open the project folder in VS Code. Click **Sync Changes** (or the circular arrows at the bottom-left).
2. Open `index.html` and click **Go Live** (bottom-right) to see the prototype. Edit your files and save; the browser tab updates by itself.
3. When a piece works, open **Source Control** (`Ctrl+Shift+G`):
    1. Look at the **Changes** list. It should only show your files. Click a file to see exactly what changed.
    2. Type a short message **first**, in the box above Changes. Start with your screen: `Fit: add too-wide warning`.
    3. Click **Commit**, then **Sync Changes**.
4. Before you stop for the day, make sure the Sync button shows no numbers.

### Good habits

- **Commit small and often.** "Add finish buttons", then "Add drag handle" beats one giant commit at the end. Each commit is a checkpoint.
- **Sync at least at the start and end of every session.** The longer you wait, the more likely you'll clash with someone.
- **Always commit before syncing.** Git won't download others' changes over your unsaved work.
- **Check the Changes list before committing.** If a file you didn't mean to touch is there, click the **↶** arrow next to it to undo your edits to it.
- **Never edit files on the github.com website,** and don't rename, move or delete shared files.
- **Test at A+ 200% and in Guided mode** before you Sync. Both are graded.
- **Stuck for more than 30 minutes?** Post in the chat with a screenshot of the error.

### Source Control panel, quick reference

| You see | It means |
|---|---|
| **U** next to a file | New file |
| **M** next to a file | Modified file |
| **D** next to a file | Deleted file |
| **↶** next to a file | Discard your changes to that file (permanent) |
| **Graph** (bottom of the panel) | History of every commit. Click one to view old versions (view only, not for editing). |
| **Commit ▾** | The arrow has **Commit & Sync**, which does both in one click |
| **Sync Changes ↓2 ↑1** | 2 commits to download, 1 to upload |
| `COMMIT_EDITMSG` tab opens | You left the message empty. Type it on the first line, then click ✓ at the top-right. |
| `MERGE_MSG` tab opens | Git combined your work with someone else's. Just click ✓. |

### If something goes wrong

- **"Can't push refs… try running pull first":** open the terminal (`` Ctrl+` ``), run `git pull`, then `git push` (or Sync again).
- **"Please commit your changes before you pull":** commit first, then sync.
- **A conflict** (a file shows both versions with Accept Current / Incoming / Both buttons): two people changed the same lines. Don't guess. Post in the chat.
- **The page doesn't change after you save:** check the bottom-right of VS Code says "Port: 5500" (Live Server is running). If it says "Go Live", click it. Still old? Press `Ctrl+Shift+R` in the browser.
- **The live link looks old:** wait two minutes and hard-refresh (`Ctrl+Shift+R`).
- **Videos:** never put them in the repo (GitHub has a 100 MB limit). Just email me them: michael.glenn@ace.tamut.edu, and if the file size is too large just lmk and we'll figure it out.

---

## The four areas

The shared parts already work: moving between screens, Back, Undo, A+ text, the price calculation, the price bar, toast messages, confirm dialogs, the voice mock and the demo panel. **Home is fully built as a worked example.** Every other screen is a placeholder with dashed boxes showing what goes where, and a temporary button so Maria's path still clicks through.

Each screen file starts with a checklist: **what to build**, which state values to read and save, and patterns to copy.

| Area | What you build | Your files | Must save to state |
|---|---|---|---|
| **A: Michael** | Help screen; Home polish; keeping everyone's screens consistent; merging and final checks | `js/screens/home.js`, `js/screens/help.js`, `css/home.css`, `css/help.css` + all shared files | `mode`, `lang`, `textSize` |
| **B: Style and fit** | Category row and style picture cards; simulated camera scan; confirm or enter your own width (in/cm); true-scale drawing with a person and the old desk; too-wide warning with Make it fit, Keep anyway (asks to confirm) and Re-measure | `js/screens/style.js`, `js/screens/fit.js`, `css/style.css`, `css/fit.css` | `style`, `deskWidth`, `roomWidth`, `roomConfirmed`, `keepAnyway` |
| **C: Customize** | Desk preview with a drag handle; Narrower/Wider buttons; finish and handle choices; close-up and side-by-side finish comparison; voice phrases; the agreed price numbers | `js/screens/customize.js`, `css/customize.css`, prices in `js/price.js` | `deskWidth`, `finish`, `handles` |
| **D: Order** | Review summary with Change links; delivery form, mock payment and "sent to the factory" confirmation; order timeline, notification toggle and cancel window | `js/screens/review.js`, `js/screens/checkout.js`, `js/screens/orders.js`, `css/review.css`, `css/checkout.css`, `css/orders.css` | `customer`, `order` |

**Why "Must save to state" matters:** it's how the screens connect without anyone waiting on anyone. B's fit check saves `roomWidth`; C's customize screen reads it. D's review reads everything B and C saved.

**Testing your screen on its own:** state starts with realistic values (48 in space, 44 in desk, oak, brushed metal), so press **D** → **Jump to** your screen. D can use **Create sample order** and **Advance order stage** to test My Orders.

**When your screen is real:** delete the `B.ui.placeholder(...)` call. Keep `B.ui.toolbar(container)` as the first line of `render()`.

---

## Ideas for each screen

These are suggestions for what each screen *could* look like, not instructions to copy. Your wireframe is the main reference, and the checklist at the top of your file says what it must include. Open `js/screens/home.js` to see how a finished screen is put together.

### The basic shape of every screen

```js
render: function (container) {
  B.ui.toolbar(container);                     // keep this first
  const section = document.createElement('section');
  section.className = 'fit';                   // your screen name
  container.appendChild(section);
  // build your screen inside section
}
```

### A: Help (`help.js`)

A simple page of cards: one for accessibility settings (text size buttons from 100% to 200%, and a Guided / Standard switch), one with a few tape-measure steps, one describing the three woods in plain words, and one with demo contact details. The settings should change the whole app straight away, so the user sees the effect.

### B: Style picker (`style.js`)

A row of category buttons at the top, with Desks selected and the rest greyed out as "coming soon." Below that, two or three large picture cards, each showing a simple drawing of the desk, its name and its width. Tapping a card highlights it, and a Continue button underneath only becomes active once a style is chosen. One style should be wider than 48 in, so the fit check can show the warning.

### B: Fit check (`fit.js`)

This screen has two steps. First, a dark box pretending to be the camera view, with "We measured 48 in. Is that right?" and a big Yes button beside it, plus a small form underneath for typing your own measurement in inches or cm. After confirming, it switches to a true-scale drawing: the new desk next to a person silhouette and a dashed outline of the old desk, with a banner showing the maximum width. If the desk is too wide, the banner turns orange, the part past the limit is shaded, and the buttons become Make it fit, Keep anyway (which asks "are you sure?") and Re-measure.

### C: Customize (`customize.js`)

On the left, a drawing of the desk in the chosen wood colour, with a circle on its right edge that you drag to change the width, a label showing the current width, and Narrower / Wider buttons for people who find dragging hard. On the right, rows of buttons for the finish (Oak, Walnut, Maple) and handles (Brushed metal, Black), with the chosen one highlighted. A Close-up button could open a larger swatch, or two swatches side by side to compare finishes. The price bar at the bottom already works and updates on its own.

### D: Review (`review.js`)

A card listing each choice on its own line (style, width, finish, handles, and whether it fits the space), with a small "Change" link at the end of each line that jumps back to the right screen. Below the list, the price, the delivery estimate and a dashed box saying the order can be cancelled before production starts. On the right, a big "Confirm and go to payment" button and a smaller "Back to edit."

### D: Checkout (`checkout.js`)

Two cards side by side: delivery details (name, address, city, postal code, optional phone) and a payment card clearly labelled "Demo only." If the user tries to place the order with a field missing, a short message appears under that field. Once placed, the form is replaced by a confirmation: "Your order has been sent to the factory," with an order number, the delivery estimate and a button to My Orders.

### D: My Orders (`orders.js`)

On the left, a vertical timeline like a delivery tracker: six circles joined by a line, completed stages ticked, and the current one highlighted with a "You are here" label. On the right, the order number, a one-line desk summary, the estimated delivery, a notification on/off button, and a Cancel button that only works before production starts. Once production starts, it greys out and explains why.

### CSS (every area, in your own `.css` file)

```css
/* Start every class with your screen name, and use the shared variables */
.fit-warning {
  padding: var(--space-2);
  border: 2px solid var(--warning);
  border-radius: var(--radius);
  background: var(--warning-soft);
}
```

Shared colours: `--accent`, `--accent-soft`, `--text`, `--text-muted`, `--border`, `--surface`, `--warning`, `--warning-soft`, `--ok`, `--ok-soft`, `--wood-oak`, `--wood-walnut`, `--wood-maple`. Shared classes: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-chip`, `.btn-link`, `.btn-block`, `.card`, `.banner`, `.banner-ok`, `.banner-warning`, `.note`, `.guided-hint`, `.two-col`, `.field`, `.field-error`.

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

Everything hangs off one global object, `Buildwell`. There are no modules or `fetch()`, so the prototype runs with Live Server or straight from the file.

### Functions you can use

| Function | What it does |
|---|---|
| `B.state.get('deskWidth')` | Read one value |
| `B.state.all()` | Read every value at once (`s.deskWidth`, `s.finish`, ...) |
| `B.state.set('deskWidth', 46)` | Save a value (Undo can reverse it). Add `{ undo: false }` for settings. |
| `B.router.go('fit')` | Open a screen. Any button with `data-go="fit"` does the same. |
| `B.router.back()` / `B.router.undo()` | Previous screen / reverse the last change |
| `B.router.refresh()` | Redraw the current screen after saving something |
| `B.router.pushUndo('deskWidth', oldValue)` | Add one Undo step yourself (after a drag) |
| `B.price.calc(state)` / `B.price.format(493)` | Price and weeks / "$493" |
| `B.ui.toolbar(container)` | Back, Undo and A+ bar (first line of every screen) |
| `B.ui.toast('Width: 46 in')` | Short feedback message |
| `B.ui.confirm('Sure?', onYes, { yes, no })` | Yes / Cancel dialog |
| `B.ui.priceBar(container, { label, go })` | Live price and delivery bar |
| `B.ui.voice(container, [{ label, action }])` | "Say it" mock panel |
| `B.ui.applyTextSize()` / `B.ui.applyMode()` | Apply text size / Guided mode after changing them |
| `B.orderStages` | The six order stages, "Order confirmed" to "Delivered" |
| `B.t('title')` | Home screen text in the current language |

**State fields:** `mode, lang, textSize, furniture, style, measuredWidth, roomWidth, roomConfirmed, deskWidth, keepAnyway, finish, handles, price, delivery, customer, order`. To add one, ask Michael to add it in `state.js`.

**Screen names:** `home, style, fit, customize, review, checkout, orders, help`.

---

## Coding standards

- Keep the header comment at the top of your file (file, owner, wireframe, requirements).
- CSS classes start with your screen name (`.fit-...`, `.customize-...`). Shared styles live only in `base.css`.
- Use `rem` for sizes and the shared colour variables. No typed colours.
- Use real `<button>` elements with visible text (or an `aria-label`), no smaller than the shared `.btn` size.
- No timers that limit the user (UR6). Every action shows a visible change or toast within 1 second (UR3).

### Your screen is done when

- [ ] It matches its wireframe, in the same plain light style as the rest
- [ ] Back and Undo work
- [ ] Text scales cleanly up to 200% with A+, and Guided mode shows your hints
- [ ] It works at tablet size (Chrome DevTools device mode, 1024x768)
- [ ] Chrome's console shows no red errors
- [ ] It's committed and synced, and it works on the live link

---

## Recording your segment (3–4 minutes, .mp4)

1. Chrome DevTools device mode at 1024x768. Press **D** → **Reset everything** before you start.
2. Say what your part does and which requirements it covers.
3. Do a live run of your part of Maria's path and show that it works.
4. Walk through your code and explain what each part does.
5. Send the .mp4 to Michael by **Thursday evening**.