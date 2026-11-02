# PDF Viewer

This app uses PDF.js locally to display PDF files from the shared account
mirror. It has page and zoom controls, loads only when opened, makes no external
requests, and destroys its worker on close. It does not download files to the PC.
Choose **Open from My files**, then use Previous, Next and the zoom controls.
The page fits the window when its width changes. If the saved PDF changes or is removed, a notice stays visible while paging; select Reload to check the server and open the current account copy. If the server check or reload fails, the displayed page stays available. Sync can also report conflicts that must be resolved in Files. Reload is disabled for an unsaved preview. The viewer checks file metadata rather than rereading the PDF on unrelated file activity. If another PDF cannot open,
the current one stays available. Selectable PDF text is layered over the page. Find text searches the document locally and highlights each selected match; Find next and Find previous move between occurrences on a page and across pages, wrapping around the document. The status gives the selected match count on its page. Search is case-insensitive and literal except that query whitespace matches runs of whitespace, including a line break. PDF text extraction order affects results; there is no OCR or fuzzy matching, and scanned images without embedded text cannot be searched or selected. Annotations, forms and PDF editing are not currently supported.
Run `npm ci --prefix apps/system/pdf-viewer --ignore-scripts` before building.

Use the page number field and **Go** to jump directly to a page in a long
document. The viewer rejects numbers outside the document and keeps the current
page open. Previous, Next and search update the displayed page number when
there is no unsubmitted draft.
While a page number is being edited, zooming or resizing preserves the draft;
successful page navigation applies the entered number. Opening another PDF
starts its page control at page one.
Previous, Next and Go start at the top of the selected page and clear any earlier search result; Find scrolls to
the selected match. Local tests cover rendered multi-page PDFs at desktop,
emulated-phone and 4K sizes; physical touch has not been verified.

After zooming and scrolling sideways, Previous, Next and Go start the new page
at its top left. If rendering fails, the prior page retains its reading position.
The reset also survives a resize while the page is rendering. Local registered-
account desktop and emulated-phone tests cover zoomed navigation, an injected
render failure, search, resize, server sync and fresh-session reopening. A
resize was exercised during navigation, but arbitrary render timing and physical
touch remain unverified.

PDF.js handles rendering and text extraction in the browser. Large documents may take time to search; changing the query or document cancels the old search. The window releases its render and text-layer tasks and worker when closed.

If multiple open or reload requests overlap, a later choice takes precedence;
cancelling the picker keeps the current page. Local desktop, emulated-phone and
4K-sized tests and a live emulated-phone test delay mocked picker results to
check ordering. A separate live emulated-phone test exercises the actual picker.

File-change checks are ordered so a slower earlier check cannot clear a newer
warning. Local desktop and emulated-phone account tests cover delayed metadata,
changes, deletion and reload; physical touch remains unverified.

Before replacing the current document, the viewer checks that the new PDF’s
first page fits its display limit. An oversized first page leaves the prior
document and navigation available. Later pages can still exceed the limit.

A later page is checked before navigation changes the displayed page number. If it exceeds the display limit, the previous page stays visible and navigation remains available. Local desktop and emulated-phone tests and a live emulated-phone test cover an oversized later page. Other rendering failures and physical touch remain unverified.

Pages are drawn offscreen before replacing the visible page. When a later page
fails to render, the previous page and page number remain available. Opening a
new PDF also renders its first page before replacing the current document;
if that render fails, the current document remains open. If a search match cannot be rendered, the viewer reports that instead of claiming the match is visible. Local desktop and
emulated-phone account tests inject canvas-render failures and verify recovery.
Other render failures and physical touch remain unverified.

If a window’s initial PDF is invalid or missing, the failed file reference is cleared and the viewer offers to open another file. The original file remains unchanged. Local desktop/phone and live phone-sized account tests cover invalid-file fallback, opening another PDF and refresh.

If a restored PDF is temporarily unavailable, its saved reference remains in
the window and Reload can retry it. A confirmed missing or invalid PDF clears
the stale reference and leaves the file unchanged.

If retry confirms the saved PDF is invalid or missing, the viewer clears the
stale target and disables Reload; Open from My files can then select another
file. Local desktop and emulated-phone account tests cover a temporary read
failure followed by both successful and invalid-file retries. Physical touch
remains unverified.

In narrow windows, Find uses full-size up/down arrow buttons for previous and next matches, keeping the search field on the same row. The buttons keep descriptive accessibility labels and tooltips. Desktop windows retain text labels.

Use **Fit width** to return to the page-width view after zooming. Its percentage
is relative to that fitted view, not a physical or PDF actual-size percentage.

Fit width uses the available page width on wide desktops instead of capping
ordinary pages at twice their original PDF size. If fitting would exceed the
viewer’s rendering memory limit, the button says **limited** and its accessible
label explains why. Very large individual pages are still refused rather than
replacing the current PDF with a blank or incomplete canvas. Local registered
account tests cover a phone-sized view, a 2560-pixel desktop, a 4K-sized
memory-limited view, and preservation of the current PDF when opening an
oversized page. Physical touch and actual monitor rendering remain unverified.

Password-protected PDFs prompt for their document password inside the viewer.
An incorrect password can be retried; cancel keeps any previously open PDF.
The password is not intentionally saved with the account or sent to the server;
PDF.js uses it in the browser to open the file, and the password field is cleared
after each attempt or close. Reopening the file asks again. Local registered-account
desktop and emulated-phone tests cover a 256-bit encrypted PDF, incorrect and
correct passwords, cancellation, close during entry, unchanged server bytes and
fresh-session reopening. Physical-device input and other PDF encryption types
are unverified; document passwords cannot be recovered by the viewer.

Use **Rotate left** or **Rotate right** to turn the displayed PDF in quarter
turns. The adjustment is view-only, applies as you move between pages, and is
reset when a PDF is opened or reloaded; it does not rewrite or save the file.
The viewer combines this adjustment with each page's built-in orientation.
Local registered-account desktop and emulated-phone tests cover a PDF with
mixed built-in page orientations, rotation, search and navigation, injected
render-failure recovery, unchanged server bytes and fresh-session reopening.
Physical touch and all PDF rotation/rendering combinations remain unverified.
