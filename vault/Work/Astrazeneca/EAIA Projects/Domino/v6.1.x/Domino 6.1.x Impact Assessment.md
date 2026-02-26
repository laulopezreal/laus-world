### Overview

As a Platform Architect, the purpose of this assessment is to evaluate the impact of upgrading to Domino 6.1.x on the currently approved Domino solution blueprint (v2.0). The goal is to ensure architectural integrity, maintain compliance with AstraZeneca standards (GxP, GDPR, 21 CFR Part 11), and preserve operational continuity and stakeholder alignment.

---

### Summary of Impact

| Area                     | Impact Summary                                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------- |
| Architecture             | Introduction of SSH-enabled workspaces; optional support for NetApp Volumes; enhanced audit logging.    |
| Integration Patterns     | Build propagation for environments; Git branch-based App deployment; Flow outputs as reusable datasets. |
| Security & Compliance    | Idle timeout enforcement, e-signatures, token invalidation, Kerberos support, enhanced audit export.    |
| Operational Enhancements | Monitoring dashboards, cost center visibility, session persistence for home/packages, improved Flows.   |
| Known Limitations        | Azure Blob sync issues, SSH not supported on remote DPs, token reset invalidates long-running tasks.    |

---

### Detailed Analysis by Capability

#### SSH-enabled Local IDE Support

- **Change**: Local IDEs can now connect via SSH to Domino workspaces.
    
- **Blueprint Impact**:
    
    - Update Logical Architecture: Include `domino-connect` component.
        
    - Update Infrastructure: Enable ingress port, SSH reverse proxy config, logging guidance.
        
- **Compliance Note**: SSO enforced via CLI authentication maintains traceability.
    

#### Compute Environments - Build Propagation

- **Change**: Child environments can now subscribe to parent base environments.
    
- **Blueprint Impact**:
    
    - Update environment management SOP to reflect Active Revision propagation.
        
    - Include lifecycle management of subscriptions in governance processes.
        

#### Apps Enhancements

- **Change**: Multiple Apps per Project; Git branch-based publishing; URL customization.
    
- **Blueprint Impact**:
    
    - Update Data Product publication models.
        
    - Define standard for App naming/versioning across enterprise use.
        

#### Audit Trail & e-Signature Enhancements

- **Change**: E-signature workflows and exportable audit trails.
    
- **Blueprint Impact**:
    
    - Update Compliance Controls in Section 6.2.
        
    - Record configuration key: `com.cerebro.domino.eSignatureWorkflowEnabled`
        

#### Workspace Session Persistence

- **Change**: Option to persist home directory and installed packages.
    
- **Blueprint Impact**:
    
    - Update Environments section: `com.cerebro.domino.workspace.persistence.*` toggles.
        
    - Ensure base images support `uv`, `renv`, and `rsync`.
        

#### Domino Flows – Dataset Outputs

- **Change**: Flow outputs can now be saved as versioned Datasets.
    
- **Blueprint Impact**:
    
    - Update Flows usage pattern in Execution Model.
        
    - Record artifact lineage management in Data Architecture section.
        

#### Cost Center Dashboard & Monitoring

- **Change**: New Grafana dashboards for cost & workload insights.
    
- **Blueprint Impact**:
    
    - Update Operational Monitoring design to include these dashboards.
        
    - Map labels (run type, hardware tier, dataplane) to business domains.
        

#### Idle Timeout Configuration

- **Change**: Inactivity-based logout now configurable.
    
- **Blueprint Impact**:
    
    - Update Security Design to include this feature.
        
    - Record default session timeout in governance logs.
        

---

### Risks & Recommendations

|Risk|Recommendation|
|---|---|
|Users unintentionally logged out (multi-tab issue)|Communicate idle timeout behavior; recommend using single-tab workflows.|
|Long-running jobs fail post-password reset due to token invalidation|Warn users in training/docs; recommend using service accounts for critical jobs.|
|Remote Data Plane users lack SSH support|Delay rollout or clearly document limitation in user onboarding.|
|Projects syncing with Azure Blob Storage may fail|Encourage use of Domino CLI for large uploads in Azure-backed Projects.|

---

### Actions & Next Steps

-  Update Solution Architecture (Logical + Physical Diagrams)
    
-  Amend Environment Management SOP
    
-  Publish communication note to platform users on 6.1.x features & limitations
    
-  Review new features against AstraZeneca’s GxP validation framework
    
-  Align e-signature configuration with 21 CFR Part 11 controls
    
-  Review monitoring dashboards with EAIPT for adoption into platform support
    
-  Finalize impact table for audit trail compliance and data lineage tracking
    

---

### Stakeholder Engagement Plan

|Stakeholder|Area of Review|
|---|---|
|EAIPT Platform Team|Infra configuration, SSH enablement, cost monitoring|
|Cyber Security Team|Idle timeout, token invalidation, e-signature validation|
|Governance & Compliance|Audit trail export, dataset versioning, Flows usage|
|DS/AI and R&D Scientists|SSH IDE support, App enhancements, Flow outputs|

---

### Appendix

- Domino 6.1.x Release Notes (Internal link)
    
- Domino 6.1.x Features Presentation (Domino Data Lab)
    
- Current Blueprint: v2.0 (Approved July 2024)
    
- Referenced Configuration Flags:
    
    - `com.cerebro.domino.workspace.persistence.directories.enabled`
        
    - `com.cerebro.domino.workspace.persistence.packages.enabled`
        
    - `com.cerebro.domino.environments.buildPropagation.enabled`
        
    - `com.cerebro.domino.eSignatureWorkflowEnabled`
        

---

_Prepared by: Laura Lopez-Real, Enterprise AI Architect_  
_Date: 2025-08-07_