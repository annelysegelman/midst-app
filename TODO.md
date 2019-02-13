# MIDST TODO

*LAST UPDATE: Jason, Feb 13, 2019

*CURRENT STAGING BUILD:

http://hem.rocks/files/midst-builds/mac-mojave/Midst_build_Midst_build_1550078015290.zip

*CURRENT PLAYER URL:

http://midst.press/sandbox/player/

---

## Notes (post-Meeting)
1. <strike>This weekend: try to fix this issue with big files + lag</strike>

1. <strike>Next week</strike> This weekend: Player stuff

1. "Take over Quill" = vacation task

1. Research how google docs keeps track of changes (how fine grained is it? what's the ux?)

---

## Ready for Review (Player)
1. Default docs should say Untitled in the header, then the name of the saved doc should show up there once saved

1. Large files can still choke the editor. Open "Big Medium.midst" and try to type in it, there is a lag between when a key is pressed and when the letter appears on the screen. BEAT THE PROBLEM!!!!!!!!!!!!!!

1. Open a new file, immediately create a new draft marker without typing or touching the timeline, then navigate to that marker using drawer: crash. (Try also with clicking timeline draft marker.)

1. Draft markers should only enter edit mode if they are active. So: Click a marker, go to that point in the timeline, click same marker again, enter edit mode for the marker.

1. Open a file, add a draft marker, re-open the file. The added draft marker is not there.

## Ready for Review (Player)

1. Put it on the web :')

1. Integrate player with entire web page

1. Timeline always visible in the player page

1. Speed controls (1x 2x 4x)

---

## To Discuss...
1. Player: M in upper left hand corner ("sticky") – Can Annelyse do this?

1. Player: Title of poem + Author will always be visible in a sidebar or header Can Annelyse do the frontend (UI) for this? (Jason will plug in the data/backend.)

---

## CRITICAL bugs
1. None.

---

## PLAYER TODOs
1. L/R arrows should control timeline nav (when paused)

1. For now, apply our super sexy Midst styling (font and font size) to all poems by default. If it's not super difficult, also add a toggle button that allows the reader to switch to the Poet's font styling instead.

1. Load .midst file on server via browser URL, and change the file when the browser URL changes.

1. Load the reader page. Press spacebar. Timeline resets to the beginning and plays again to the end (as expected). Now press spacebar again. Spacebar has the default browser behavior, which is to scroll the page down. It should reset the timeline again and start playback again.

---

## Questions for R01 User Tests (for Annelyse; Jason, feel free to add questions/concerns you want me to address with our user tests here!)
1. Is it annoying not to allow blank/null draft marker names?

1. https://testflight.apple.com/join/uHZjhXy0 ?

1. Do you like how the responsive scrolling works in playback?

---

## High-priority
1. Should the last frame scroll all the way to the top and place the cursor on the bottom? Or leave the cursor and scroll position exactly where the writer stopped writing? ___PLAYER: Last frame scrolls to top/ 'presentation view'. APP: leave cursor + scroll position exactly where the writer stopped writing.___

1. It's possible to “fight“ with responsive scrolling if a scrollbar is present in the player at all times. Should scrolling in the player immediately pause playback? Or should scrolling only be possible after pressing the pause button? ___PLAYER: Manual scrolling should override the responsive scrolling (toggling it off).___

1. Weird bug happening now: after a global font change, insert a line break after a piece of text, then type in the space above it. Font reverts to sans serif for some reason. (https://github.com/quilljs/quill/issues/2161) Solution: Fork Quill.

---

## Mid-priority
1. When opening timeline, text that gets "pushed up" needs to get "pushed up" in a smoother way. Solution: Stop repositioning cursor when entering and exiting focus mode. Detect if cursor already was below the fold, and if so, smoothly scroll the bottom of the document into view.

1. Scrub back in an existing "complete" document and start typing. Then leave a draft marker on the very last frame where the document was "complete", named "Last Complete State". Click on the "Last Complete State" marker. The document will be on the NEXT frame AFTER the actual "last complete state".

1. Draft marker alignment. Make a draft marker at the first frame. It is centered on the timeline handle, when the handle is under it, but actually hangs over the timeline progress bar. Draft markers gradually "drift" off the center of the timeline handle from left to right. Solution: Make it so Slider's progress bar completely contains the handle. Make each draft marker actually contain an invisible instance of Slider, using position: absolute to align with the visible slider.

---

## Low-priority
1. Draft marker names have too much white space around them by default; white space can be flexible?

1. Scrub into the past and create a draft marker there. Timeline should stay at that point, not jump forward to the end.

1. Previously-saved document "sometimes autoscrolls (down) right after opening, making it seem like the poem starts on a different line." All documents should open at top of stack/frame 0, scrolled all the way up.

1. Bug: Type stuff. Click draft marker icon to add marker. Then WITHOUT TYPING ANYTHING, click the draft marker icon again. You have just added 2 markers right next to each other! This is bad. Make sure flag icon can't be clicked immediately after you click it (i.e. when it is red it shouldn't be clickable).

1. In drawer, no way to navigate to Markers that have long names, because clicking anywhere on the marker name just makes me rename it instead of navigating to it. Imo a nice solution here: Add little flag icons to left of each name (like bullet points almost). Click on little flag icon @ left of marker name to navigate to marker; click on name to rename; and click on delete icon (Little red X or little trash can.. we don't need whole word "delete") to the right of the name to delete marker. Leaving a bit of white space between flag icon / marker name / delete icon.

1. Need a way to undo/redo draft marker actions (particularly deleting them by accident).

1. Bug when editing in timeline mode: Enter timeline mode; scroll back using arrow keys (not click and drag). Cursor currently defaults to right BEFORE the last character typed in any given frame. This is weird. Cursor should ideally default to remain in last position (prior to entering timeline mode), or, if this isn't possible, at least default to AFTER the last character typed (not before).

1. Right-click on a draft marker in the timeline --> Delete option

1. <strike>Timeline progress bar does not go all the way to the end when typing the first few letters/sentences, but can be scrubbed to the end by hand or with a draft marker</strike>. If using a draft marker to scrub to the end, the cursor is left at the end of the document (or last edit). If using the timeline to scrub to the end, the cursor jumps back to the beginning of the document.

1. Deleting a draft marker should not scrub the timeline to that point.

---

## Lowest priority
1. Sanitized text does not take on the formatting of neighboring text when pasted in.

1. Regression: It's now possible to paste in formatted text again.

1. Timeline handle should be all the way to the right (top of stack) when entering timeline mode.

1. When a file is opened from disk, focus/timeline/drawer mode should deactivate.

---

## Backlog (Hopefully for pilot!)
1. Open recent... menu.

1. Highest priority feature request: Allow user to have multiple Midst documents/windows (in any combination of saved & unsaved) open at the same time?

1. PC build capability? (Would be helpful for prototype testing/pilot phase)

1. Add shortcut for navigating the timeline in Replay Mode: DOWN ARROW jumps forward to NEXT draft marker sequentially; UP arrow jumps backwards to PREVIOUS draft marker.

1. Add shortcut: Command+ makes text in window bigger, command- makes it smaller (as in chrome when reading a website).

1. Edit > Insert Draft Marker menu item (Cmd+M).

1. On quit menu prompt for unsaved changes, add option to "Save and Quit" (current options are just "quit" or "cancel").

1. Adding a new draft marker: We can maybe have some little animation here, a little glow that means "something happened!"
- Draft marker flag CURRENTLY being added could be red (like the nav icon); previous markers already existing can be black/static.

1. "First time here?" first-time popup for new users who haven't opened the app before. Should link to a random youtube video (ARG will make tutorial vid later). Dismissal button says "Got it!"
- Don't worry too much about the design of this (or the hyperlink), since it will be Designed properly later once the visual ID of Midst is locked in a bit more. For now, let's just make sure it works: appears the first time you open Midst, dismisses on hitting the "Got it!" button, & doesn't keep popping up on repeated opens.

1. Allow user to adjust spacing between lines (add an item for this to the navigation bar): single-spaced, 1.5, and double-spaced options. If possible, also allow user to type a number (e.g. .86) indicating precise line spacing.

---

## To Do ARG
1. When app ready: write text for first time here prompt / make tut vid :')

---

## Add New Feature: Autosave (Not for pilot / defer plz)
1. Would be great to have an autosave function. The autosave works like this: docs that have never been saved are autosaved as temporary files that are recovered when the program restarts, with their Timelines intact (see what Word does when you've opened a new .doc, typed some shit, and force-quit, then reopen it). Docs that HAVE been saved simply continue to Autosave to their timelines. (Yes, this means that you really can't delete any history of a document from its timeline. If I open poem.mds that's already got a first draft in it, work on it for a while, and decide I don't like what I did, I can't just quit Midst and delete that progress—— it is autosaved/saved into the Timeline already.)

---

## Design To-Dos (Not for pilot / defer plz)
1. Choose icons, woooo

1. Develop moar interactions

---

## Future TODO
1. Licensing/app expiration / antipiracy stuff?

## -----------everything below this line is low priority-------------

## Add New Feature: Backwards compatibility (for around/after Issue 1 launch)
1. As it turns out, backwards-compatibility will have to be part of a larger feature scope. The developer workflow should be, 1) Introduce (or discover) a breaking change. 2) Load an old file. 3) Write some kind of parsing logic that "upgrades" that file on the fly, and at least makes it viewable. 4) Make it so users get a warning that their file will need to be upgraded and re-saved. In the case of our own testing files, I can just upgrade those files by hand. The question is when to schedule this feature for release? Seems like the app should be more stable and already have been given to a first round of testers, or even later, or else we'll be writing parsing logic for a bunch of old file formats that nobody has. (For example: The two Draft Marker issues below require the addition of a meta-field to the main "app meta" –not-breaking– _but also_ a meta-field to each draft marker itself –breaking–)

## Add New Feature: Export options
1. File-->Export As... allows user to export their current screen's text to .doc, .docx, .rtf, .txt, and .pdf. Nb this option should NOT be folded into File-->Save or the Save icon on the main screen (those things are ONLY for .mds files). It should be labeled Export as...

## Low priority UI/UX fixes (don't do these now, we're not even sure if we want them... pending user feedback)
1. Allow user to adjust margins of the entire document. This functionality should be as simple/minimal as possible – no need for a ruler, just some simple small sliding arrows.

1. Maybe?: Toolbar should fade in on hover in Focus Mode, but then fade out again (over like 700ms) if the user moves their mouse away again (after, say, changing the font or whatever). Focus mode is only actually EXITED back to type mode if the user hits Escape or clicks on the Eyeball icon. Make sure the eyeball icon is Red any time the user is in Focus Mode (so when hovering over toolbar in focus mode, & it reappears, user will see that the icon is red)

## Web features
1. Poems should integrate onto the website with the following:
- Timestamps show as the poem plays
- Draft markers are clickable
- Timeline is clickable (jump to point in time)
- Click and draggable playhead
- Play, pause, rewind/fast-forward options
- Default play speed decided by us; but a dial can determine framerate so ppl can slow it down / speed it up if they want
- Future feature: "Play with audio commentary" option?

## ARG Pilot Q's
1. Is timeline scary

1. We may want some way to enable the timeline /markers/etc. to remain visible even when the user reenters type mode... not rn tho

## Feature ideas for the future, that we are NOT implementing now
1. Moveable draft markers?

1. Export to video/youtube

1. Templates/Skins?

1. Initializing replay mode should also reveal (minimal, unobtrusive!) icons for play, pause, rewind, and fast-forward/fast-rewind.

1. Replace the gear icon for "timeline" with something that better represents what it does – maybe a clock icon?

1. Midst for mobile.

1. Allow multiple Midst documents to be open at once, in separate windows, while preventing the user from having poem.mds open in 2 windows simultaneously.

1. Add a new icon to the formatting bar for changing background color + font color (again, as minimalist/unobtrusive as possible).

## Terminology (for new developers)
1. Type Mode: the default mode of Midst. You can type, delete, etc., & Midst records your Actions.

1. Timeline Mode

1. Focus Mode

1. Action: anything that gets recorded to the Timeline. e.g. typing a letter, a space, changing the font. Things that are Not currently actions: highlighting text, simply clicking inside the document, scrolling, changing between Modes.

1. Draft Marker: versioning flags.

## Regression tests /// Requirements graveyard for future bug checks; DO NOT DELETE
1. Responsive scrolling feature needs to support asynchronous editing. Make sure it's responding to edits (& showing them on screen) no matter where in a document they are happening.

1. Formatting: Highlighted text should stay visibly highlighted while changing the font, font size, alignment, etc.

1. Drawer: Opening drawer should push long lines aside (not overlap them).

1. Drawer: Deleting all markers should automatically close the drawer.

1. Drawer: Opening drawer opens drawer & timeline.

1. Timeline: click and drag + arrow key navigation.

1. Markers: default name should appear (Highlighted please!) eg "draft 1"

1. Markers: Draft markers should be numbered in the order they were created, but, Deleting a draft marker should NEVER Change the name of any past/future Draft markers. Marker names always count up.

1. Warnings: App should give a warning if quitting with unsaved changes! (in all cases: when opening a new blank doc & when quitting app & when opening a previously saved .midst file.)

1. Formatting: When copying and pasting text from an outside source (eg a website) into Midst, Midst should only save Midst-compatible formatting.

1. State: ALL means of exiting Draft Marker creation (& going back to type mode, natch) should cause the flag icon to turn grey again.

1. When adding a draft marker: Flag icon should turn red (then go pale-grey "unactivated" after the Timeline disappears); Timeline Mode icon should NOT turn red (since user is not actually entering timeline mode, just adding a marker).

1. Build responsive scrolling feature in Timeline Mode & default to responsive scrolling. See "Responsive scrolling" section below for notes/details.

1. Allow toggle (this can just be in a menu) on/off of responsive scrolling feature.

1. In replay mode, Escape key should bring user back to zero/top of stack in type mode // same as hitting the replay mode button again.

1. Toolbar should reappear all at once on hover (fade in after 500ms)—right now some tools fade in faster than others

1. Timeline mode button: change color to red when timeline mode is activated; back to black when timeline mode is off.

1. User should be able to continue typing IMMEDIATELY after clicking "draft marker add" icon (& continuing typing should make the timeline IMMEDIATELY disappear, overriding its timed fadeout.)

1. Enable editing in replay/timeline mode

1. All text should always be black. Right now, if I copy in colored text (e.g. that blue markdown heading), it pastes in as blue. Midst-allowable formatting (bold, italics) should be retained if copied and pasted in.

1. Timestamps should be logged (date + time) such that they can be displayed in the Midst journal playback engine.

1. File name should appear in header (replacing Untitled) when user saves a file.

1. Fill in icons pale red——this should be subtle, noticeable when you need it but not obtrusive/attention-grabbing—— when they are activated; make mute outlines again (default) when de-activated. (Don't worry too much about how this looks aesthetically, since it will be designed
later.)

1. font selection: Helvetica, Courier, Georgia, Tahoma, Times New Roman, Arial, Verdana, Garamond, Lato. Default to Helvetica.

## Draft marker requirements (for future bug checks?)
1. Adding a new draft marker:
- Clicking flag icon opens the Timeline. A marker appears at frame zero, sticking up out of timeline, with its default name ("Draft 1", "Draft 2", etc.) already highlighted & ready to be edited. Here the user has 2 choices: a) Click anywhere in the Type window to close the timeline (saving the draft marker w/ the default name) & continue writing; or b) Immediately begin typing, in which case they are editing the already-highlighted name of the draft marker; when they are finished, they can click anywhere in the type window to re-enter type mode and continue writing.
- Draft markers should be serially numbered by default. Numbering system should NOT be affected by changing names of draft markers. For example, the first marker will always be either "Draft 1" or a custom name, the second always "Draft 2" or a custom name, etc.

1. Deleting draft markers:
- Draft markers can be deleted in the drawer. Again, this should not change anything about the serial numbering system.

1. Adding/deleting draft markers should NOT be recorded as actions on the timeline.

1. Draft markers appear in the Drawer in chronological order, w/ most recent markers at the top, oldest at the bottom.

1. In Timeline Mode, draft markers and their names should be visible by default. However, in the Drawer, there should be 2 toggle options: a) Show/hide draft marker names, & b) Show/hide draft markers. These options ONLY apply to the Timeline itself, not to the Drawer (which always shows each draft marker and its name).

1. The Timeline is ALWAYS open when the Drawer is open.

1. We may want the option to show more info on a draft marker in the Drawer (eg the date/time it marks on the timeline)? Maybe a feature for later?

## Responsive scrolling requirements (for future bug checks?)
1. In Timeline Mode, the portion of the document being "worked on" in the replay should always be visible. This scrolling/adjustment should be as gentle/subtle/graceful/undistracting as possible — not jumpy feeling (even though edits maybe jumpy), ideally.

1. Note that we want responsive scrolling both WITHIN THE APP (in Timeline Mode) and ON THE WEBSITE (when readers play back poems —— note that poems published on the website are just effectively "always in Timeline Mode", but with additional features like timestamps visible).

## For the Future...
Brain dump, will expand later! full compliment of keyboard shortcuts, draft marker synopses, draft marker thumbnail previews, GitHub-style diff comparison between drafts, support for touch gestures and Surface Dial, limited mobile version, cloud storage...
Precise scrubbing in timeline mode: shift-drag or command-drag (a la Final Cut Pro).
