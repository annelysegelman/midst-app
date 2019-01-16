
# MIDST TO-DO

<!-- *LAST UPDATE: Annelyse, Jan 6 2019 -->
<!-- *CURRENT STAGING BUILD:
http://hem.rocks/files/midst-builds/Midst_build_1546836592571.zip
 -->

## Ready for review
1. App should give a warning if quitting with unsaved changes!
1. Drawer bug: Opening the drawer opens drawer + timeline (correct), but then typing while drawer is open makes timeline disappear but drawer stays open.
1. Drawer bug: Deleting all draft markers makes drawer stuck open. IRL deleting all markers should automatically close the drawer.
1. When adding a draft marker: default name should appear (Highlighted please!) eg "draft 1"
1. Timeline mode bug: arrow nav in timeline mode is broken (it moves the cursor backwards/forwards in the type window, instead of moving the timeline backwards/forwards). Click+drag in timeline works fine.
1. Doing some user guesswork here but, imo: Draft marker names: Draft markers should be numbered in the order they were created, but, Deleting a draft marker should NEVER Change the name of any past/future Draft markers.
- Right now, for example, if i make markers 1-5, then delete #3, the marker that was #4 is now renamed #3, and #5 is renamed #4.... this could get very confusing for the writer, no? Better imo to simply have (in that instance, e.g.) Draft 1, Draft 2, Draft 4, and Draft 5, w/ no draft 3 marker?
1. #FFFAFA bg color plz thx

## CRITICAL Bugs (Necessary for pilot!)

## Bugs (Necessary for pilot!)
1. In drawer, no way to navigate to Markers that have long names, because clicking anywhere on the marker name just makes me rename it instead of navigating to it. Imo a nice solution here: Add little flag icons to left of each name (like bullet points almost). Click on little flag icon @ left of marker name to navigate to marker; click on name to rename; and click on delete icon (Little red X or little trash can.. we don't need whole word "delete") to the right of the name to delete marker. Leaving a bit of white space between flag icon / marker name / delete icon.
1. Need a way to undo/redo draft marker actions (particularly deleting them by accident).
1. Highlighted text should stay highlighted while changing the font, font size
1. Weird bug happening now: after a global font change, insert a line break after a piece of text, then type in the space above it. Font reverts to sans serif for some reason.
1. Bug when editing in timeline mode: Enter timeline mode; scroll back using arrow keys (not click and drag). Cursor currently defaults to right BEFORE the last character typed in any given frame. This is weird. Cursor should ideally default to remain in last position (prior to entering timeline mode), or, if this isn't possible, at least default to AFTER the last character typed (not before).
1. Responsive scrolling feature needs to support asynchronous editing. Make sure it's responding to edits (& showing them on screen) no matter where in a document they are happening.
1. Long draft marker names in timeline are a problem. Try opaque backgrounds for marker names!
1. Right-click on a draft marker in the timeline --> Delete option

## Minor/lower-priority bugsas
1. Timeline handle should be all the way to the right (top of stack) when entering timeline mode
1. Saving a new document does nothing. In trad. writing apps saving a new empty document redirects the user to a "save as" window. This problem will be solved by adding the "multiple windows" feature. If "save" redirects to "save as" in the current implementation then an internal flag called "hasUnsavedChanges" will need to be set to true by default, which will break a bunch of other functions in the current, monowindow implementation. (Likewise "open" should open a new window, not overwrite a blank empty document.)

## To Do (Hopefully for pilot!)
1. Add shortcut for navigating the timeline in Replay Mode: DOWN ARROW jumps forward to NEXT draft marker sequentially; UP arrow jumps backwards to PREVIOUS draft marker.
1. Add shortcut: Command+ makes text in window bigger, command- makes it smaller (as in chrome when reading a website).
1. Edit > Insert Draft Marker menu item (Cmd+M).
1. Allow user to have multiple Midst documents/windows (in any combination of saved & unsaved) open at the same time
1. On quit menu prompt for unsaved changes, add option to "Save and Quit" (current options are just "quit" or "cancel").
1. Adding a new draft marker: We can maybe have some little animation here, a little glow that means "something happened!"
- Draft marker flag CURRENTLY being added could be red (like the nav icon); previous markers already existing can be black/static.
1. "First time here?" first-time popup for new users who haven't opened the app before. Should link to a random youtube video (ARG will make tutorial vid later). Dismissal button says "Got it!"
- Don't worry too much about the design of this (or the hyperlink), since it will be Designed properly later once the visual ID of Midst is locked in a bit more. For now, let's just make sure it works: appears the first time you open Midst, dismisses on hitting the "Got it!" button, & doesn't keep popping up on repeated opens.
1. Allow user to adjust spacing between lines (add an item for this to the navigation bar): single-spaced, 1.5, and double-spaced options. If possible, also allow user to type a number (e.g. .86) indicating precise line spacing.


## To Do ARG
1. When app ready: write text for first time here prompt / make tut vid :')

## Add New Feature: Autosave (Not for pilot / defer plz)
1. Would be great to have an autosave function. The autosave works like this: docs that have never been saved are autosaved as temporary files that are recovered when the program restarts, with their Timelines intact (see what Word does when you've opened a new .doc, typed some shit, and force-quit, then reopen it). Docs that HAVE been saved simply continue to Autosave to their timelines. (Yes, this means that you really can't delete any history of a document from its timeline. If I open poem.mds that's already got a first draft in it, work on it for a while, and decide I don't like what I did, I can't just quit Midst and delete that progress—— it is autosaved/saved into the Timeline already.)

## Design To-Dos (Not for pilot / defer plz)
1. Choose icons, woooo
1. Develop moar interactions


## -----------everything below this line is low priority-------------


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


1. Bug: When copying and pasting text from an outside source (eg a website) into Midst, Midst should only save Midst-compatible formatting.
1. ALL means of exiting Draft Marker creation (& going back to type mode, natch) should cause the flag icon to turn grey again.
1. When adding a draft marker: Flag icon should turn red (then go pale-grey "unactivated" after the Timeline disappears); Timeline Mode icon should NOT turn red (since user is not actually entering timeline mode, just adding a marker).
1. Build responsive scrolling feature in Timeline Mode & default to responsive scrolling. See "Responsive scrolling" section below for notes/details.
1. Quitting w/ unsaved changes: Prompted to go back and save?
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
1. Text should remain highlighted while doing an alignment change


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