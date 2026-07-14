---
title: Notifications
url: https://prod.alltrue-be.com/_docs/docs/admin_console/notifications
section: admin_console
---

# Notifications

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- NotificationsExport PDFOn this page# Notifications
Notification Settings control which system events generate email notifications. Tenant administrators configure customer-wide defaults in the Admin Console, and individual users can either inherit those defaults or customize their own Notification Preferences from the top navigation. The customer-visible delivery channel for these settings is email.

## Access notification settings[​](#access-notification-settings)
You access tenant-wide Notification Settings from **Admin Console &gt; System Settings &gt; Notifications**.

To open and modify this page, you need the Notification Settings admin permission. If you do not see the Notifications entry under System Settings, ask a tenant administrator to grant you the appropriate role.

Every user who can sign in to the platform also has a personal Notification Preferences entry point. Open the notification control in the top navigation (next to your profile menu) to view your current preferences and choose whether to follow the tenant default or set your own.

## Configure tenant defaults[​](#configure-tenant-defaults)
Tenant defaults apply to every user on your tenant who has not customized their own preferences.

- Open **Admin Console &gt; System Settings &gt; Notifications**.
- Toggle **Email Notifications** on or off. This is the master switch for email delivery — when it is off, no email notifications are sent to users who inherit the tenant default, regardless of the event subscriptions below.
- For each event subscription, set the enabled state and any thresholds described in the next section.
- Changes apply automatically. The tenant default takes effect immediately for all users who are using the default settings.

If a user has explicitly customized their own preferences, changing the tenant default does not overwrite their choices. To return a user to the tenant default, the user must reset their own preferences (see [Understand recipients and user overrides](#understand-recipients-and-user-overrides)).

## Choose event subscriptions[​](#choose-event-subscriptions)
The Notification Settings page exposes two event subscriptions: **Open Issues** and **Safety Score Changes**. Each subscription has its own enable toggle and threshold controls, and each is evaluated independently before an email is sent.

### Open Issues[​](#open-issues)
Open Issues notifications fire when a project-scoped issue is opened.

- **Enabled** — turn the subscription on or off.
- **Minimum severity** — choose one of **Critical**, **High**, **Medium**, **Low**, or **Informational**. The subscription fires for issues at the chosen severity or higher. For example, choosing **High** triggers email for Critical and High issues, but not for Medium, Low, or Informational issues.

### Safety Score Changes[​](#safety-score-changes)
Safety Score Changes notifications fire when a project's safety score moves in a way that matches one of two threshold modes. You can enable either mode, both, or neither.

- **Absolute Threshold Trigger (%)** — fires when the safety score falls below a configured percentage. Set the value as a percent from 0 to 100. The Admin Console suggests **50%** as a starting value; treat that number as an example, not a requirement, and choose the value that matches your tenant's risk tolerance.
- **Relative Threshold Trigger (%)** — fires when the safety score drops by more than a configured percentage compared to its previous value. Set the value as a percent from 0 to 100. The Admin Console suggests **5%** as a starting value; again, this is an example, not a mandate.

Both thresholds are checked when the subscription is enabled. If the change satisfies either condition, an email is generated.

## Understand recipients and user overrides[​](#understand-recipients-and-user-overrides)
Recipients are scoped automatically. A given email reaches only the users for whom the event is relevant.

- **Project-scoped events** — users receive notifications only for projects they are assigned to. A user who is not assigned to the affected project does not receive the email, even if their personal preferences enable the subscription.
- **Elevated administrator roles** — users with broader administrative access receive notifications across a wider scope where appropriate.

Each individual user can choose to follow the tenant default or customize their own preferences:

- Open the Notification Preferences drawer from the top navigation.
- Choose **Use default settings** to inherit the current tenant default. Future changes by a tenant administrator will be picked up automatically.
- Choose **Customize my notification settings** to set your own values. You can turn Email Notifications on or off for yourself, change the Open Issues severity threshold, and adjust the Safety Score Changes thresholds independently of the tenant default.
- Click **Save** to apply your changes. The per-user drawer uses an explicit Save button, unlike the tenant page which applies changes automatically.
- To return to the tenant default after customizing, reset your preferences from the same drawer. Resetting removes your personal override and resumes the current tenant default.

The setting that decides whether you receive a given email is resolved in this order:

- Your personal preferences, if you have customized them.
- The tenant default, if you are using default settings.
- The built-in default, used only when neither a personal override nor a tenant default has been saved. The built-in default leaves Email Notifications and the event subscriptions disabled, so no emails are sent until either you or a tenant administrator opts in.

## Delivery behavior and limits[​](#delivery-behavior-and-limits)
Notification Settings decide who can receive an email and under what conditions. Once an event qualifies, the platform handles delivery in the background:

- Events that match an enabled subscription are filtered against each recipient's effective settings before email is generated.
- An event that does not match any recipient's settings produces no email for that recipient. The same event may still produce email for other recipients whose settings match.
- The customer-visible delivery channel for Notification Settings is email. Other outbound integrations, including [SIEM](/_docs/docs/admin_console/siem) event forwarding, are configured separately and are not controlled by Notification Settings.

If you expected an email and did not receive one, check, in order: that Email Notifications is enabled in your effective settings, that the relevant subscription is enabled at or above the event's severity or threshold, and that you are assigned to the project the event belongs to.
[PreviousGeneral](/_docs/docs/admin_console/general)[NextSIEM Integrations](/_docs/docs/admin_console/siem)- [Access notification settings](#access-notification-settings)- [Configure tenant defaults](#configure-tenant-defaults)- [Choose event subscriptions](#choose-event-subscriptions)[Open Issues](#open-issues)- [Safety Score Changes](#safety-score-changes)- [Understand recipients and user overrides](#understand-recipients-and-user-overrides)- [Delivery behavior and limits](#delivery-behavior-and-limits)
