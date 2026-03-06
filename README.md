# Bill Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority issue: three-phase bill approval status visibility and filtering. It should display a bills list view with clearly differentiated approval statuses (e.g. 'Awaiting Approval', 'Partially Approved – Awaiting 2nd Approver', 'Partially Approved – Awaiting Final Approval', 'Fully Approved'). A working filter panel should allow users to filter bills by individual approver and by current approval stage. Clicking into a bill should show an approval timeline or step indicator displaying who has approved, who is next, and who is pending. A secondary scope item should mock up the Day Works docket notes feature, showing an internal notes or audit log panel on a submitted docket where team members can add timestamped notes that do not appear on the external docket. If feasible, a basic charge rates management screen should also be included, allowing users to view and upload a rates spreadsheet within Varicon.

## Features shown
- Additional approval status (e.g. 'final approval') to indicate which phase of the three-phase approval a bill is at
- Functional approval filter that correctly filters bills by the specific approver whose action is pending
- Ability to directly adjust the GST figure on a bill independently of the subtotal
- Improved or automated bill syncing with Xero that reduces manual intervention and avoids frequency errors
- Ability to add internal notes or audit log entries to submitted Day Works dockets without the note appearing on the docket itself
- Ability for users to view, upload, and amend Day Works charge rates directly within Varicon
- WBS copy/duplicate functionality to apply the same WBS assignment across all lines of a bill
- In-application approval visibility to replace or supplement ineffective email notifications
- Lost time tracking and reporting for stand-down hours

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
