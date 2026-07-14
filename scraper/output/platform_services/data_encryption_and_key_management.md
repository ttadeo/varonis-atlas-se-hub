---
title: Data Encryption and Key Management
url: https://prod.alltrue-be.com/_docs/docs/platform_services/encryption
section: platform_services
---

# Data Encryption and Key Management

- [](/_docs/)- Platform Services- Data Encryption and Key ManagementExport PDFOn this page# Data Encryption and Key Management
Atlas encrypts sensitive customer data with AES-256-GCM authenticated encryption and an envelope-encryption scheme built around a customer-controlled master key in your cloud KMS. This page explains how the encryption model works end-to-end: what gets encrypted, where the Bring Your Own Key (BYOK) custody boundary actually sits, how runtime LLM content stays encrypted on your data plane before it reaches the control plane, how you register and select the Control Plane Data Encryption Key, and how role-based masking, key rotation, and key revocation behave.

## How It Works[​](#how-it-works)
Atlas uses **envelope encryption**, the pattern recommended by all major cloud providers:

- **Data Encryption Key (DEK)** -- a symmetric AES-256 key that encrypts and decrypts individual field values. A fresh DEK ciphertext is produced for your tenant and used by Atlas at runtime.
- **Key Encryption Key (KEK)** -- the master key in your cloud KMS that wraps (encrypts) the DEK. You own this key and control its lifecycle, including rotation and revocation.

Each encrypted value is stored as a self-contained envelope with the following fields:

FieldMeaning`v`Envelope schema version`alg`Encryption algorithm (AES-256-GCM)`nonce`Per-value random nonce used by AES-GCM`ct`The ciphertext (and authentication tag) for the encrypted value`dek`The KMS-wrapped DEK ciphertext used to encrypt this value`region`The cloud region of the KMS key that wrapped the DEK
Your customer identifier is bound into every value as Additional Authenticated Data (AAD). AES-GCM rejects decryption if the AAD changes, so a ciphertext written under one tenant cannot be decrypted under another -- tenant isolation is enforced cryptographically, not just at the query layer.

When Atlas writes encrypted data, it resolves your tenant DEK, encrypts the value with AES-256-GCM, and stores the envelope. When Atlas reads encrypted data, it uses the wrapped DEK embedded in that specific envelope to unwrap and decrypt -- existing ciphertext is **not** re-keyed to the current DEK on read. This is what keeps previously written data decryptable across rotations.

For performance, the unwrapped DEK is held in memory briefly (for a short configurable interval) and reused across encrypt/decrypt operations within that window before being discarded.

## What Gets Encrypted[​](#what-gets-encrypted)
Atlas applies field-level envelope encryption to sensitive content at write time. Metadata used for analytics and policy dashboards -- such as rule verdicts, action types, model names, and token counts -- is not encrypted.

Data CategoryExamplesWhere EncryptedRuntime LLM contentEnd-user prompts, model responses, conversation messages, tool call arguments, runtime event bodiesOn your data plane, before transmission to the control planeIssue evidenceLLM-related fields captured on detected issues (prompt/response excerpts, tool arguments)On the control plane at write timeUser identityUser email addresses and display namesOn the control plane at write timeAudit trail PIIUser names and email addresses captured in activity logsOn the control plane at write timeCode-scanning credentialsSource-repository credentials and cloud-storage credentials used by scanning jobsOn the control plane at write timeSupport accessEmail addresses captured on support-access grantsOn the control plane at write time
Runtime LLM content -- the most sensitive category -- is always encrypted on your data plane before it leaves your cloud account. See [Data Plane Encryption](#data-plane-encryption) below.

## Bring Your Own Key (BYOK)[​](#bring-your-own-key-byok)
With BYOK you provision and control the master key that protects your tenant DEK:

- **You create a KMS key** in your cloud account. This is the master key that wraps your DEK.
- **Your DEK ciphertext is registered** for your tenant. The DEK is wrapped (encrypted) by your KMS key and the ciphertext is what Atlas stores; the plaintext DEK is never persisted at rest.
- **You grant Atlas the access it needs** to read the wrapped DEK and to call your KMS to unwrap it. You can revoke that access at any time.

### What stays in your KMS, and what does not[​](#what-stays-in-your-kms-and-what-does-not)
The accurate custody boundary is:

- **The KMS master key never leaves your KMS.** Atlas cannot export it. All unwrap operations are performed by your KMS under the access you grant.
- **The DEK ciphertext is stored at rest.** Plaintext DEK material is never persisted at rest by Atlas.
- **The plaintext DEK is unwrapped through your KMS at runtime** so that Atlas can perform field-level encrypt and decrypt operations, and it is held in process memory for a short configurable interval before being discarded. Revoking your KMS access stops *new* unwraps; reads that hit the in-memory cache window can still decrypt successfully until that cache expires, after which any data wrapped under the revoked key becomes cryptographically unrecoverable.

This is an important distinction. Atlas operates the encryption and decryption path on your behalf, which requires the plaintext DEK to be present in Atlas memory at the moment of use. What remains entirely with you is the master key in KMS and the authorization decision -- you control whether Atlas can unwrap at all, and you can withdraw that authorization at any time.

### Where the DEK ciphertext lives[​](#where-the-dek-ciphertext-lives)
Atlas stores DEK ciphertext through a central secret-routing layer. By default, secrets are routed to AWS Secrets Manager in the Atlas-managed cloud account. If you have configured an external secret manager for your tenant, DEK ciphertext (and other tenant secrets) is routed to that store instead. The same routing layer handles the customer-scoped tenant secrets and a separate internal scope used only by platform operations.

### How a DEK is selected at runtime[​](#how-a-dek-is-selected-at-runtime)
When Atlas needs to encrypt or decrypt for your tenant, it resolves the DEK in this order:

- **Your tenant DEK** -- the customer-scoped data encryption key registered for your tenant. This is the normal path for any tenant that has registered a data plane and selected a Control Plane DEK.
- **A platform fallback DEK** -- used only when no tenant DEK is usable (for example, during the very first onboarding writes before a Control Plane DEK has been selected). Once your tenant has a DEK, all subsequent writes use it.

Decryption always uses the wrapped DEK embedded in the envelope of the value being read. A value written under an older DEK does not get re-keyed to the current DEK on read -- the envelope carries everything required to decrypt it, including a reference to the region of the KMS key that originally wrapped the DEK.

### Current implementation boundary[​](#current-implementation-boundary)

- **Control-plane DEK unwrapping currently uses AWS KMS.** This is the only KMS backend used by the Atlas control-plane encryption code today.
- **DEK ciphertext is stored through the secret-routing layer**, which uses AWS Secrets Manager by default or a configured external secret manager for your tenant.
- **Azure data-plane deployment is supported by the install flow.** A data plane can run in either AWS or Azure where the install UI supports it; that selection is independent of the control plane's current AWS KMS backend for DEK unwrapping.
- **The Control Plane DEK role is currently held only by AWS data plane registrations.** Azure registrations can be installed and managed, but they cannot yet be selected as the Control Plane DEK holder. BYOK and runtime DEK custody therefore still require at least one AWS data plane registration on your tenant.

This page is updated as additional cloud KMS backends or external secret managers are added.

### Registering a Data Plane and selecting the Control Plane DEK[​](#registering-a-data-plane-and-selecting-the-control-plane-dek)
The Control Plane DEK is the tenant DEK that the Atlas control plane uses to encrypt and decrypt field-level data for your tenant. It is assigned through the Admin Console:

- Open **Admin Console &gt; Data Plane &gt; Management**.
- Click **Register Data Plane** and follow the cloud-provider install flow (AWS or Azure, where supported) to deploy a data plane in your account. The first registered data plane is automatically assigned as the Control Plane DEK holder for your tenant. The Control Plane DEK holder must currently be an AWS registration; if your first install is an Azure data plane, add an AWS data plane afterwards and assign it as the Control Plane DEK holder.
- To assign the Control Plane DEK role to a different registered data plane later, use the **Control Plane DEK** selector on the Data Plane Management page. Exactly one registered data plane holds this role at a time, and the data plane that currently holds it cannot be deleted -- you must move the role to another registered data plane first.

The Data Plane Details drawer surfaces the Cloud Provider and Assigned Roles -- including whether a given registration is the current Control Plane DEK holder -- so administrators can see the authoritative key holder at a glance.

### Key Rotation[​](#key-rotation)
You can rotate your encryption keys at any time:

- **Rotating the DEK.** Register a new tenant DEK wrapped under your KMS key. New writes are encrypted under the new DEK. Existing data remains readable because each envelope carries the wrapped DEK that originally encrypted it -- the rotation does not require re-encrypting historical rows.
- **Rotating the KMS master key.** Follow your cloud provider's key-rotation process. Atlas does not run an automatic schedule on your behalf; rotation cadence is yours to decide and initiate.

### Key Revocation[​](#key-revocation)
If you revoke Atlas's access to your KMS key or delete the key, Atlas can no longer unwrap any DEK wrapped under it, and therefore can no longer decrypt data that was encrypted under that DEK. Revocation stops *new* unwraps immediately; in-flight reads holding an already-unwrapped plaintext DEK in memory continue to succeed until that cache window expires. Once the cache window has elapsed, the ciphertext is cryptographically unrecoverable. This gives you a hard kill switch over your encrypted data: even though the ciphertext may still exist in the database, it is cryptographically unreadable without your KMS authorization.

## Data Plane Encryption[​](#data-plane-encryption)
When AI Runtime is deployed, runtime LLM content (prompts, responses, tool-call arguments, and conversation messages) is encrypted on your data plane **before** being sent to the control plane for analytics and policy management. This means:

- **No unencrypted LLM data leaves your account.** The data plane encrypts every prompt, response, and related runtime field individually using your tenant DEK before any network transmission to the control plane.
- **The control plane stores pre-encrypted envelopes as-is.** When encrypted values arrive from the data plane, the control plane's encrypted column types detect that they are already envelopes and store them without re-encrypting. There is no double encryption and no plaintext detour through control-plane storage.
- **The envelope format is provider-neutral.** The same AES-256-GCM envelope is used regardless of whether the data plane runs in AWS or Azure. The tenant DEK that backs that envelope is currently rooted in AWS KMS via the Control Plane DEK holder, so a tenant whose only data plane is Azure does not yet have end-to-end encrypted runtime content custody in the same form — see *Current implementation boundary* above.
- **Decryption is on-demand.** The control plane decrypts only when content is rendered in the UI by an authorized viewer or returned through the API to an authorized caller.
- **You control the keys.** Because the encryption uses your BYOK DEK, you decide who can decrypt the data and for how long.

## Role-Based Access to Encrypted Data[​](#role-based-access-to-encrypted-data)
Authorization complements encryption -- it does not replace it. Some encrypted categories, particularly runtime LLM prompts and responses and the LLM evidence captured on issues, are gated by an additional role check at read time. A user must be authenticated, must have the appropriate role assigned, and must be acting in the right tenant context for the ciphertext to be decrypted for them.

When a user without the required role retrieves a record that contains protected LLM fields, those fields are returned as a fixed placeholder ("Insufficient permissions to view this content") instead of the decrypted value. The underlying ciphertext is untouched -- the masking is applied at the read boundary.

Role assignment is managed under **Admin Console &gt; Data Plane &gt; Management &gt; Role Configurations**, which is part of the broader Admin Console role and permission model.

## Failure and Revocation Behavior[​](#failure-and-revocation-behavior)
Encryption and decryption depend on KMS access and on the presence of a usable DEK. The behaviors below summarize what happens when something is missing or unreachable:

- **KMS access is unavailable.** Atlas cannot unwrap the DEK and cannot encrypt or decrypt under that key. Reads of values wrapped under that key surface a data-unreadable condition; writes that require encryption fail rather than store plaintext.
- **The tenant DEK is missing.** Encryption operations for that tenant fail; ciphertext that requires the missing DEK cannot be read.
- **The envelope is malformed.** A value whose envelope cannot be parsed (for example, truncated or tampered) is treated as unreadable; AES-GCM authentication failures result in the same outcome.
- **A protected field cannot be decrypted but is non-essential.** Where the data model allows it, the read surface returns the field as empty rather than failing the entire response, so that surrounding analytics and metadata stay available.
- **The KMS key is deleted or its access is revoked.** All values whose envelopes reference DEKs wrapped under that key become cryptographically unrecoverable. This is the intended kill-switch behavior: the ciphertext remains in storage but no longer decrypts anywhere.

## Security Properties[​](#security-properties)
PropertyDetailAlgorithmAES-256-GCM (authenticated encryption with associated data)Key managementCustomer-managed KMS master key (BYOK); plaintext DEK unwrapped through your KMS at runtime and held in memory only for a short configurable intervalTenant bindingCustomer identifier bound into every envelope as AES-GCM Additional Authenticated DataEnvelope contentsVersion, algorithm, nonce, ciphertext, wrapped DEK, and KMS region per valueKey rotationCustomer/provider/admin initiated; each envelope is self-contained and carries the wrapped DEK that encrypted it, so historical data stays readable across rotationsEncryption scopePer-tenant isolation -- ciphertext is cryptographically bound to your tenant identifierData plane encryptionRuntime LLM content encrypted on the data plane before leaving your cloud account; control plane stores pre-encrypted envelopes as-isAt-rest protectionAll sensitive fields stored as envelopes in the database; plaintext DEK is never persisted at restAccess controlRole-based masking for sensitive content categories, applied at the read boundary in addition to encryptionFailure / revocationKMS access loss, missing DEK, or malformed envelopes surface as unreadable; revoking or deleting the KMS key renders the corresponding ciphertext cryptographically unrecoverable[PreviousIntegrations](/_docs/docs/platform_services/integration)[NextGetting Started with API Calls](/_docs/docs/platform_services/api)- [How It Works](#how-it-works)- [What Gets Encrypted](#what-gets-encrypted)- [Bring Your Own Key (BYOK)](#bring-your-own-key-byok)[What stays in your KMS, and what does not](#what-stays-in-your-kms-and-what-does-not)- [Where the DEK ciphertext lives](#where-the-dek-ciphertext-lives)- [How a DEK is selected at runtime](#how-a-dek-is-selected-at-runtime)- [Current implementation boundary](#current-implementation-boundary)- [Registering a Data Plane and selecting the Control Plane DEK](#registering-a-data-plane-and-selecting-the-control-plane-dek)- [Key Rotation](#key-rotation)- [Key Revocation](#key-revocation)- [Data Plane Encryption](#data-plane-encryption)- [Role-Based Access to Encrypted Data](#role-based-access-to-encrypted-data)- [Failure and Revocation Behavior](#failure-and-revocation-behavior)- [Security Properties](#security-properties)
