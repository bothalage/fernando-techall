# Database & Pipeline Management Features

## Overview

Added comprehensive **Database Management** and **Pipeline Management** features to the admin dashboard. These tools provide complete control over data and automation workflows.

---

## 🗄️ Database Management

### Features

#### 1. **Database Statistics**
- View total record counts per collection
- Real-time collection overview
- Historical backup tracking
- Quick stats cards displaying key metrics

**Endpoint:** `GET /api/database/stats`

```javascript
// Response
{
  collections: {
    users: 42,
    tickets: 156,
    chats: 298,
    contacts: 73,
    careers: 8,
    applications: 23,
    testimonials: 15,
    portfolios: 12,
    products: 45,
    services: 28
  },
  timestamp: "2026-04-25T10:30:00.000Z",
  company: "company_id"
}
```

#### 2. **Collection Management**
- View detailed data from any collection
- Display up to 100 records per collection
- Inspect individual record details
- Real-time record counts

**Endpoint:** `GET /api/database/collections/:collection`

Supported collections:
- `users` - User accounts and profiles
- `tickets` - Support tickets
- `chats` - Chat conversations
- `contacts` - Contact messages
- `careers` - Job postings
- `applications` - Job applications
- `testimonials` - Customer testimonials
- `portfolios` - Portfolio items
- `products` - Products
- `services` - Services

#### 3. **Database Backup**
- Create instant backups of company data
- Track backup history with timestamps
- Store backup metadata (size, record count)
- Support for restoration

**Endpoint:** `POST /api/database/backup`

```javascript
// Response
{
  success: true,
  backup: {
    id: "backup_1703518200000",
    timestamp: "2026-04-25T10:30:00.000Z",
    company: "company_id",
    collections: {
      users: 42,
      tickets: 156,
      chats: 298,
      contacts: 73
    },
    status: "completed",
    size: "~15MB"
  }
}
```

#### 4. **Data Export**
- Export company data to JSON format
- Includes all key collections
- Perfect for data migration or archival

**Endpoint:** `POST /api/database/export`

```javascript
// Response
{
  success: true,
  message: "Database export prepared",
  recordCount: 657,
  timestamp: "2026-04-25T10:30:00.000Z"
}
```

#### 5. **Database Optimization**
- Optimize indexes and database performance
- Remove duplicate/fragmented data
- Reclaim disk space
- Get detailed optimization report

**Endpoint:** `POST /api/database/optimize`

```javascript
// Response
{
  success: true,
  message: "Database optimization completed",
  results: {
    deletedRecords: 12,
    optimizedIndexes: 8,
    spaceSaved: "2.3MB",
    executionTime: "2.4s"
  }
}
```

#### 6. **Data Cleanup**
- Delete old records automatically
- Configurable retention period (default: 90 days)
- Cleanup chats, contacts, and other ephemeral data
- Get cleanup statistics

**Endpoint:** `POST /api/database/cleanup`

```javascript
// Request body
{
  olderThanDays: 90  // Delete records older than this
}

// Response
{
  success: true,
  message: "Cleanup records older than 90 days completed",
  deleted: {
    chats: 45,
    contacts: 23,
    total: 68
  },
  timestamp: "2026-04-25T10:30:00.000Z"
}
```

#### 7. **Recent Backups**
- View all recent backups with metadata
- See backup status and timestamps
- Quick restore functionality
- Backup history tracking

**Endpoint:** `GET /api/database/backups`

---

## 🔄 Pipeline Management

### Features

#### 1. **Pipeline Overview**
- Manage 4 types of pipelines:
  - **CI/CD**: Build, test, deploy automation
  - **Data**: ETL workflows and data processing
  - **Email**: Notification and campaign automation
  - **Analytics**: Real-time data aggregation

#### 2. **Pipeline Monitoring**
- Real-time status tracking (active/paused/error)
- Success rate percentage
- Total runs tracking
- Last run timestamp

**Endpoint:** `GET /api/pipelines`

```javascript
// Response
[
  {
    id: "cicd_main",
    name: "Main CI/CD Pipeline",
    type: "cicd",
    status: "active",
    lastRun: "2026-04-25T10:00:00.000Z",
    nextRun: "2026-04-25T11:00:00.000Z",
    runs: 234,
    successRate: 95.7,
    description: "Build, test, and deploy main branch"
  },
  // ... more pipelines
]
```

#### 3. **Pipeline Details**
- View full pipeline configuration
- Recent run history (last 5 runs)
- Success/failure status
- Execution duration
- Error messages for failed runs

**Endpoint:** `GET /api/pipelines/:id`

```javascript
// Response
{
  id: "cicd_main",
  status: "active",
  runs: [
    {
      runId: "run_001",
      timestamp: "2026-04-25T10:30:00.000Z",
      status: "success",
      duration: "2.3s"
    },
    // ... more runs
  ],
  triggers: [
    { name: "schedule", value: "Every 1 hour", enabled: true },
    { name: "webhook", value: "On push to main", enabled: true }
  ]
}
```

#### 4. **Manual Trigger**
- Manually execute any pipeline
- Useful for urgent deployments
- Real-time execution monitoring

**Endpoint:** `POST /api/pipelines/:id/trigger`

```javascript
// Response
{
  success: true,
  message: "Pipeline triggered successfully",
  run: {
    runId: "run_1703518200000",
    pipelineId: "cicd_main",
    status: "running",
    startTime: "2026-04-25T10:30:00.000Z",
    progress: 0
  }
}
```

#### 5. **Pipeline Logs**
- View complete execution logs
- Timestamped log entries
- Debug information and errors
- Real-time log streaming

**Endpoint:** `GET /api/pipelines/:id/logs`

```javascript
// Response
{
  pipelineId: "cicd_main",
  logs: [
    "[2026-04-25 10:30:15] Pipeline started",
    "[2026-04-25 10:30:16] Installing dependencies...",
    "[2026-04-25 10:30:45] Running tests...",
    "[2026-04-25 10:31:20] Tests passed (245 tests)",
    // ... more logs
  ],
  timestamp: "2026-04-25T10:32:31.000Z"
}
```

#### 6. **Pipeline Statistics**
- Success/failure rate analysis
- Uptime tracking
- Average execution duration
- Failure reason breakdown

**Endpoint:** `GET /api/pipelines/:id/stats`

```javascript
// Response
{
  totalRuns: 234,
  successfulRuns: 224,
  failedRuns: 10,
  successRate: 95.7,
  avgDuration: "2.3s",
  lastRun: "2026-04-25T10:30:00.000Z",
  uptime: "99.7%",
  failureReasons: {
    timeout: 5,
    connection_error: 3,
    resource_exhaustion: 2
  }
}
```

#### 7. **Create New Pipeline**
- Create custom pipelines for specific workflows
- Configure schedule (cron format)
- Set pipeline type and triggers

**Endpoint:** `POST /api/pipelines`

```javascript
// Request body
{
  name: "Custom Data Pipeline",
  type: "data",
  schedule: "0 * * * *"  // Every hour
}

// Response
{
  success: true,
  pipeline: {
    id: "pipeline_1703518200000",
    name: "Custom Data Pipeline",
    type: "data",
    status: "active",
    createdAt: "2026-04-25T10:30:00.000Z"
  }
}
```

#### 8. **Pipeline Management**
- Update pipeline configuration
- Enable/disable pipelines
- Change schedule and triggers
- Delete deprecated pipelines

**Endpoints:**
- `PUT /api/pipelines/:id` - Update pipeline
- `DELETE /api/pipelines/:id` - Delete pipeline

---

## 📊 UI Components

### DatabaseManagement Component
Located: `client/src/components/DatabaseManagement.jsx`

**Features:**
- Statistics cards showing key metrics
- Action buttons for backup, export, optimize, cleanup
- Collections grid with record counts
- Expandable collection details with data preview
- Backup history and restore options
- Multi-collection overview

**Props:** None

**Usage:**
```jsx
import DatabaseManagement from "../components/DatabaseManagement";

<DatabaseManagement />
```

### PipelineManager Component
Located: `client/src/components/PipelineManager.jsx`

**Features:**
- Pipeline overview cards
- Status indicators and success rates
- Detailed pipeline view with run history
- Real-time log viewer
- Manual trigger functionality
- Create new pipeline form
- Pipeline statistics dashboard

**Props:** None

**Usage:**
```jsx
import PipelineManager from "../components/PipelineManager";

<PipelineManager />
```

---

## 🔐 Access Control

All database and pipeline endpoints require:
- **Authentication:** Valid JWT token (`protect` middleware)
- **Authorization:** Admin role only (`allow("admin")` middleware)

```javascript
// Protected route example
router.get("/stats", protect, allow("admin"), async (req, res) => {
  // Only authenticated admins can access
});
```

---

## 🎯 Use Cases

### Database Management
1. **Regular Backups** - Automated backup strategy
2. **Data Archival** - Export historical data
3. **Performance Tuning** - Optimize database periodically
4. **Cleanup** - Remove old, unused data
5. **Collection Analysis** - Monitor growth by collection

### Pipeline Management
1. **CI/CD Automation** - Automated deployments
2. **Data Sync** - Regular data synchronization
3. **Notifications** - Scheduled email/notification campaigns
4. **Analytics** - Periodic data aggregation and reporting
5. **Custom Workflows** - User-defined automation

---

## 🚀 Integration in AdminDashboard

Both components are integrated as tabs in the Admin Dashboard:

```jsx
// AdminDashboard tabs include:
{tab === "database" && <DatabaseManagement />}
{tab === "pipelines" && <PipelineManager />}
```

Access via:
1. Navigate to Admin Dashboard
2. Click **Database** tab or **Pipelines** tab
3. Perform desired operations

---

## 📝 Future Enhancements

- [ ] Scheduled backups with automated retention
- [ ] Pipeline templates for common workflows
- [ ] Database replication and sharding
- [ ] Advanced analytics and metrics
- [ ] Webhook notifications for pipeline events
- [ ] Database migration tools
- [ ] Data encryption at rest
- [ ] Audit logging for all operations
- [ ] Pipeline versioning and rollback
- [ ] Custom trigger creation UI
