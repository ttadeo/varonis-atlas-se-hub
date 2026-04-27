---
title: Data Encryption and Key Management
url: https://prod.alltrue-be.com/_docs/docs/platform_services/encryption
section: platform_services
---

# Data Encryption and Key Management

- [](/_docs/)- Platform Services- Data Encryption and Key ManagementOn this page# Data Encryption and Key Management
The TRiSM Hub encrypts all sensitive data using AES-256-GCM, an industry-standard authenticated encryption algorithm. You retain full control over your encryption keys at all times -- the system supports Bring Your Own Key (BYOK) so that encryption keys never leave your cloud account.

## How It Works[​](#how-it-works)
The system uses **envelope encryption**, a best-practice approach recommended by all major cloud providers:

- **Data Encryption Key (DEK)** -- a symmetric AES-256 key that encrypts and decrypts your data. The DEK is generated and stored in your cloud account's secret manager.
- **Key Encryption Key (KEK)** -- a master key in your cloud KMS that wraps (encrypts) the DEK. You own this key and control its lifecycle, including rotation and revocation.

When data needs to be encrypted, the system unwraps the DEK using your KMS, encrypts the data, and stores the encrypted payload alongside the wrapped DEK. To decrypt, the process is reversed: the wrapped DEK is sent to your KMS for unwrapping, then used to decrypt the data. Your master key never leaves your KMS.

## What Gets Encrypted[​](#what-gets-encrypted)
Data CategoryExamplesWhere EncryptedLLM prompts and responsesUser inputs, model completions, conversation messagesOn your data plane, before transmission to the control planeUser identity informationEmail addresses, display namesOn the control plane at write timeAudit trail fieldsUser names, email addresses in activity logsOn the control plane at write timeIntegration credentialsRepository credentials, cloud storage credentialsOn the control plane at write time
LLM content -- the most sensitive category -- is always encrypted on your data plane before it ever leaves your cloud account. See [Data Plane Encryption](#data-plane-encryption) below for details.

## Bring Your Own Key (BYOK)[​](#bring-your-own-key-byok)
With BYOK, you provision and manage the encryption keys in your own cloud account:

- **You create a KMS key** in your cloud account. This is the master key that protects your DEK.
- **You generate and store an encrypted DEK** in your cloud secret manager. The DEK is encrypted (wrapped) by your KMS key.
- **You grant the system cross-account access** to read the encrypted DEK from your secret manager and to call your KMS to unwrap it.

The system never has access to your KMS master key. It can only use the key to unwrap the DEK through the access you grant -- and you can revoke that access at any time.

### Key Rotation[​](#key-rotation)
You can rotate your encryption keys at any time:

- **Rotating the DEK** -- generate a new DEK, wrap it with your KMS key, and store it in your secret manager. New data is encrypted with the new DEK. Previously encrypted data remains readable because each encrypted value carries the specific wrapped DEK that was used to encrypt it.
- **Rotating the KMS master key** -- follow your cloud provider's key rotation process. The DEK must be re-wrapped with the new key version.

### Key Revocation[​](#key-revocation)
If you revoke access to your KMS key or delete it, the system can no longer decrypt any data encrypted with that key. This gives you a hard kill switch over your data: even though encrypted data may still exist in the database, it is cryptographically unreadable without the key.

## Data Plane Encryption[​](#data-plane-encryption)
When AI Runtime Protection is deployed, all LLM content (prompts, responses, and conversation messages) is encrypted on your data plane before being sent to the control plane for analytics and policy management. This means:

- **No unencrypted LLM data leaves your account.** The data plane encrypts every prompt and response field individually using your DEK before any network transmission.
- **The control plane stores only encrypted data.** When encrypted data arrives from the data plane, the control plane stores it as-is without re-encrypting. It decrypts on-demand only when you view the data in the UI or retrieve it through the API.
- **You control the keys.** Because the encryption uses your BYOK keys, you decide who can decrypt the data and for how long.

Metadata that does not contain LLM content -- such as rule verdicts, action types, model names, and token counts -- is not encrypted, as it is needed for analytics and policy dashboards.

## Role-Based Access to Encrypted Data[​](#role-based-access-to-encrypted-data)
Some encrypted data, particularly LLM prompts and responses, is further protected by role-based access controls. Users must have the appropriate role assigned in addition to being authenticated. Users without the required role see a placeholder message instead of the decrypted content. This ensures that even within your organization, access to sensitive LLM data is limited to authorized personnel.

## Security Properties[​](#security-properties)
PropertyDetailAlgorithmAES-256-GCM (authenticated encryption with associated data)Key managementCustomer-managed via cloud KMS (BYOK)Key rotationSupported -- each encrypted value is self-contained with its own wrapped key referenceEncryption scopePer-customer isolation -- data is cryptographically bound to your customer identityData plane encryptionLLM content encrypted before leaving your cloud accountAt-rest protectionAll sensitive fields stored encrypted in the databaseAccess controlRole-based decryption for sensitive content categories[PreviousIntegrations](/_docs/docs/platform_services/integration)[NextGetting Started with API Calls](/_docs/docs/platform_services/api)- [How It Works](#how-it-works)- [What Gets Encrypted](#what-gets-encrypted)- [Bring Your Own Key (BYOK)](#bring-your-own-key-byok)[Key Rotation](#key-rotation)- [Key Revocation](#key-revocation)- [Data Plane Encryption](#data-plane-encryption)- [Role-Based Access to Encrypted Data](#role-based-access-to-encrypted-data)- [Security Properties](#security-properties)
