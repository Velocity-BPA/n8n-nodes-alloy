# n8n-nodes-alloy

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the **Alloy** compliance orchestration platform, providing complete integration for KYC (Know Your Customer), KYB (Know Your Business), identity verification, document verification, watchlist screening, risk assessment, and compliance workflow automation.

![n8n](https://img.shields.io/badge/n8n-community--node-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)

## Features

### 23 Resource Categories with 200+ Operations

- **Entity Management** - Create, update, merge, and manage individual and business entities
- **Evaluation** - Run verification workflows and manage evaluation outcomes
- **Journey** - Configure and execute verification journeys
- **Application** - Handle onboarding applications and decisions
- **Document Verification** - Upload and verify identity documents (passports, licenses, etc.)
- **Identity Verification (KYC)** - Verify individual identities with multiple data sources
- **Business Verification (KYB)** - Verify business entities, owners, and registrations
- **Watchlist Screening** - Screen against OFAC, UN, EU sanctions, PEP lists, and more
- **Risk Assessment** - Calculate and manage risk scores and factors
- **Decision Management** - Override, approve, deny, and escalate decisions
- **Manual Review** - Manage review queues and complete manual reviews
- **Case Management** - Create and manage investigation cases
- **Workflow** - Execute and monitor verification workflows
- **Rule Management** - View and test decision rules
- **Tag Management** - Organize entities with tags
- **Event Tracking** - Monitor and search compliance events
- **Webhook Management** - Configure and manage webhooks
- **Reporting** - Generate compliance, risk, and volume reports
- **Audit Logging** - Track all compliance activities
- **Integration Management** - Monitor data source integrations
- **Analytics** - Access dashboard stats and metrics
- **User Management** - Manage team users and permissions
- **Utility Operations** - API status, rate limits, and configuration

### Trigger Node

Real-time webhook support for 40+ event types including:
- Evaluation completed/approved/denied
- Identity verified/failed
- Document uploaded/verified
- Watchlist hits detected
- Risk score changes
- Case updates
- And more...

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in n8n
2. Click **Install**
3. Enter `n8n-nodes-alloy`
4. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the package
npm install n8n-nodes-alloy
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-alloy.git
cd n8n-nodes-alloy

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
npm link
cd ~/.n8n
npm link n8n-nodes-alloy

# Restart n8n
```

## Credentials Setup

### Alloy API Credentials

| Field | Description |
|-------|-------------|
| Environment | Production, Sandbox, or Custom |
| API Key | Your Alloy API key |
| API Secret | Your Alloy API secret |
| Workflow Token | Default workflow token for evaluations (optional) |
| Webhook Secret | Secret for webhook signature verification (optional) |

### Alloy Journey Credentials

| Field | Description |
|-------|-------------|
| Environment | Production or Sandbox |
| Journey API Key | Your Journey-specific API key |
| Journey ID | The unique journey identifier |
| Version | Journey version (default: latest) |

## Resources & Operations

### Entity Resource

| Operation | Description |
|-----------|-------------|
| Create | Create a new entity (individual or business) |
| Get | Retrieve entity by token |
| Update | Update entity data |
| Delete | Delete an entity |
| List | List all entities with pagination |
| Search | Search entities by criteria |
| Get by External ID | Retrieve entity by your external reference |
| Get Evaluations | Get all evaluations for an entity |
| Get Documents | Get all documents for an entity |
| Get Events | Get event history for an entity |
| Archive | Archive an entity |
| Restore | Restore an archived entity |
| Merge | Merge two entities into one |
| Get Risk Score | Get current risk score |

### Evaluation Resource

| Operation | Description |
|-----------|-------------|
| Run | Execute a new evaluation |
| Get | Get evaluation details |
| Get Status | Check evaluation status |
| Get Result | Get full evaluation result |
| Get Outcome | Get evaluation outcome (approved/denied/manual_review) |
| List | List evaluations |
| Get by Entity | Get evaluations for a specific entity |
| Retry | Retry a failed evaluation |
| Get Events | Get evaluation event timeline |
| Get Data | Get evaluation input data |
| Get Required Actions | Get pending actions |
| Complete Manual Review | Submit manual review decision |

### Document Resource

| Operation | Description |
|-----------|-------------|
| Upload | Upload a document for verification |
| Get | Get document details |
| List | List all documents |
| Delete | Delete a document |
| Get by Entity | Get documents for an entity |
| Get Status | Get verification status |
| Get Verification | Get verification result |
| Get Data | Get document metadata |
| Get Extracted Fields | Get OCR extracted data |
| Verify | Trigger manual verification |
| Update | Update document metadata |

### Watchlist Resource

| Operation | Description |
|-----------|-------------|
| Screen Entity | Screen an existing entity |
| Screen Individual | Screen individual data |
| Screen Business | Screen business data |
| Get Hits | Get watchlist hits |
| Get Hit Details | Get specific hit details |
| Dismiss Hit | Mark hit as false positive |
| Confirm Hit | Confirm a hit as true match |
| Get History | Get screening history |
| Get Monitoring | Get monitoring status |
| Enable Monitoring | Enable ongoing monitoring |
| Disable Monitoring | Disable ongoing monitoring |
| Get Sources | Get available watchlist sources |

## Trigger Node

The **Alloy Trigger** node receives webhook events in real-time.

### Supported Events

**Entity Events:** created, updated, archived, risk_changed

**Evaluation Events:** started, completed, approved, denied, pending_review, failed, manual_review_required

**Application Events:** created, submitted, approved, denied, pending, updated

**Document Events:** uploaded, verified, failed, expired

**Identity Events:** verified, failed, pending, watchlist_hit, watchlist_cleared

**Business Events:** verified, failed, kyb_completed

**Review Events:** assigned, completed, escalated, timeout

**Case Events:** created, updated, closed, escalated

**Risk Events:** score_changed, high_detected, alert, threshold_exceeded

**Decision Events:** made, overridden, escalated

**Watchlist Events:** new_hit, hit_confirmed, hit_dismissed, monitoring_alert

## Usage Examples

### Create an Entity and Run KYC

```javascript
// 1. Create Entity node
{
  "resource": "entity",
  "operation": "create",
  "entityData": {
    "name_first": "John",
    "name_last": "Doe",
    "email_address": "john.doe@example.com",
    "birth_date": "1990-01-15",
    "ssn": "123456789",
    "address_line_1": "123 Main St",
    "address_city": "New York",
    "address_state": "NY",
    "address_postal_code": "10001",
    "address_country_code": "US"
  }
}

// 2. Run Evaluation node
{
  "resource": "evaluation",
  "operation": "run",
  "entityToken": "{{ $json.entity_token }}"
}

// 3. Check outcome
{
  "resource": "evaluation",
  "operation": "getOutcome",
  "evaluationToken": "{{ $json.evaluation_token }}"
}
```

### Upload and Verify Document

```javascript
// Upload document (with binary data from previous node)
{
  "resource": "document",
  "operation": "upload",
  "entityToken": "ENT_xxx",
  "documentType": "drivers_license",
  "binaryProperty": "data",
  "side": "front"
}
```

### Watchlist Screening

```javascript
{
  "resource": "watchlist",
  "operation": "screenIndividual",
  "individualData": {
    "name_first": "John",
    "name_last": "Doe",
    "birth_date": "1990-01-15",
    "address_country_code": "US"
  }
}
```

### Manual Review Workflow

```javascript
// Complete a manual review
{
  "resource": "review",
  "operation": "complete",
  "reviewToken": "REV_xxx",
  "decision": "approved",
  "reason": "All documents verified manually"
}
```

## Alloy Concepts

| Term | Description |
|------|-------------|
| **Entity** | An individual or business record in Alloy |
| **Evaluation** | A verification process run against an entity |
| **Journey** | A pre-configured verification workflow |
| **Application** | An onboarding request with associated data |
| **Outcome** | The result of an evaluation (approved/denied/manual_review) |
| **Workflow** | A configurable sequence of verification steps |
| **Hit** | A potential match found during watchlist screening |
| **Risk Score** | A calculated numeric risk assessment (0-100) |
| **Manual Review** | A human decision required when automation is inconclusive |
| **Journey Token** | Unique identifier for a verification journey |
| **External ID** | Your internal reference for an entity |

## Error Handling

The node provides detailed error messages for common scenarios:

- **Authentication errors** - Invalid API key or secret
- **Not found errors** - Entity/evaluation/document not found
- **Validation errors** - Missing or invalid parameters
- **Rate limit errors** - Too many requests (automatic retry supported)
- **Webhook signature errors** - Invalid webhook signature

Enable "Continue On Fail" to handle errors gracefully in your workflows.

## Security Best Practices

1. **Store credentials securely** - Use n8n's credential management
2. **Use webhook signatures** - Always verify webhook signatures in production
3. **Limit permissions** - Use API keys with minimal required permissions
4. **Audit regularly** - Monitor audit logs for suspicious activity
5. **Handle PII carefully** - Never log sensitive data like SSN
6. **Use sandbox for testing** - Always test in sandbox before production

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix linting issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Alloy API Docs](https://docs.alloy.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-alloy/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io)

## Acknowledgments

- [Alloy](https://alloy.com) for the compliance orchestration platform
- [n8n](https://n8n.io) for the workflow automation platform
- The open-source community for various libraries used in this project
