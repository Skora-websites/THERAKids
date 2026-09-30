# THERAKids Newsletter — Google Sheet Pipeline Setup

The footer's "Stay Updated" form posts each signup straight from the visitor's
browser to a Google Apps Script Web App, which appends a row to a Google Sheet.
No subscriber data is stored on the website's server or database.

## 1. Create the Sheet

Create a Google Sheet, e.g. **"TheraKids Newsletter Subscribers"**.

Row 1 headers (the script writes columns in this order):

| A: Timestamp | B: Email | C: Source |

## 2. Add the Apps Script

In the Sheet: **Extensions → Apps Script**, delete the placeholder code, and paste:

```javascript
/**
 * THERAKids newsletter signup collector.
 *
 * The website sends the payload as a JSON string (Content-Type text/plain —
 * a CORS "simple request", so no preflight), e.g.:
 *   {"email":"parent@example.com","source":"website-footer-newsletter"}
 * The email is therefore read from e.postData.content, NOT e.parameter.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var email = '';
  try {
    var body = JSON.parse(e.postData.contents);
    email = String(body.email || '').trim();
  } catch (err) {
    email = String(e.parameter.email || '').trim();
  }

  if (!email || email.indexOf('@') < 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: 'invalid email' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    email,
    (e.postData && JSON.parse(e.postData.contents).source) || 'website'
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy as a Web App

1. **Deploy → New deployment**
2. Type: **Web app**
3. Description: `TheraKids newsletter signups`
4. Execute as: **Me**
5. Who has access: **Anyone**   ← required, or the browser POST is rejected
6. **Deploy** and authorize the script (it only touches this spreadsheet)
7. Copy the Web App URL — it ends in `/exec`

## 4. Point the website at it

Add the URL to the environment file that matches how you run the site:

- `client/.env.development` — local dev (`npm run dev`)
- `client/.env` — production builds (`npm run build` / deploy)

```
VITE_NEWSLETTER_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Rebuild/restart the dev server. That's it — the form already has all the
sending code; it only needed the endpoint.

## 5. Verify

1. Open the site, scroll to **Stay Updated**, submit an email with the consent box ticked.
2. "You're on the list!" appears.
3. The Sheet gets a new row within a second.

## Notes

- Duplicate emails are NOT filtered — every submit appends a row. Filter or
  de-dupe in Sheets if needed (or ask us to add duplicate detection to the script).
- Every submit is one row; there is no rate limiting. If the form ever gets
  abused, Apps Script logs (Executions) will show the source.
- The script sends no emails. To actually mail the list, either use
  File → Email → Email this sheet to yourself as a routine, or move to a
  proper mail platform (Brevo/Mailchimp) later.
