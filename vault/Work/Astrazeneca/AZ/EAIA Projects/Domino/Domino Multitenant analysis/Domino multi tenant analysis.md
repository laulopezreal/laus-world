# Domino multi tenant analysis

“Today we need a clear decision on **how** we deploy Domino across tenants and **who** owns which plane. Multi-tenant data planes controlled by a central vendor-owned control plane **aren’t a standard pattern in AZ**; the closest analogue is **US SHARP – Databricks Multi-Tenant (2021)**, where we deliberately kept **vendor-owned control plane + AZ-owned data plane**, with strong isolation, logging, and IAM boundaries.

I’ll show three options, the risks and controls for each, the **minimum guardrails** required if we pursue multi-tenancy, and the **validation evidence** Domino must provide. My recommendation is to **proceed only if** those guardrails and proofs are met; otherwise we default to a **per-tenant or per-BU isolation model** aligned to EA standards.”

### 🧯 **DR & Operations**

This section is about **Disaster Recovery (DR)** — how quickly systems can recover from a failure.

- **RTO ≤ 4h** → **Recovery Time Objective**  
    The _maximum acceptable downtime_ after a failure.  
    → It means AstraZeneca expects Domino to **restore service within 4 hours** of an outage.
    
- **RPO ≤ 15min** → **Recovery Point Objective**  
    The _maximum acceptable data loss_ measured in time.  
    → It means backups or replication must be so frequent that **no more than 15 minutes of data** is lost if something breaks.
    

✅ _Together:_ “If the Domino control plane goes down, it must be back online within 4 hours, with data no older than 15 minutes.”

---

### 🔒 **AES-256 at rest, TLS in transit**

These refer to **encryption standards** — how data is protected both while stored and while moving.

- **AES-256 at rest** → “Advanced Encryption Standard with 256-bit keys”  
    Data saved on disks, S3 buckets, or databases must be encrypted using **AES-256**, which is the highest industry standard (used by banks and governments).
    
- **TLS in transit** → “Transport Layer Security”  
    Data travelling over the network (e.g., from the control plane to AZ data planes) must use **TLS version 1.2 or higher**, ensuring secure, encrypted connections.
    

✅ _Together:_ “All stored data must be encrypted with AES-256, and all data transfers must use secure TLS connections.”

Changing responsibility for gxp is great 
reason for AZ to have a gxp env is that our scientist want to use domino to run analysis on sensitive data
If data leakkage 

so, what are the key questions if i need to decide between staying the same or transfer control plane

###### ChatGPT said:

Excellent question, Laura — this is exactly the strategic decision point Enterprise Architecture needs to help answer.

You can think of it as a **“Go / No-Go” framework**:  
👉 Do we stay with the _current, fully AZ-hosted_ model, or  
👉 Do we _transfer the control plane_ to Domino (vendor-hosted, hybrid model)?

Here are the **key decision questions**, grouped by what matters most — governance, risk, operations, and value:

---

## 🧭 1. **Governance & Compliance**

1. Has a **vendor-hosted control plane** ever been approved by AZ InfoSec or Enterprise Architecture before?
    
    - If _no_, are we prepared to treat this as a **new architectural pattern** requiring ISRA, RID, and PIA revalidation?
        
2. Can Domino guarantee **no AZ data or metadata** (including credentials, logs, or models) will leave AZ boundaries?
    
3. Are **regulatory or data-residency** requirements (GxP, GDPR, HIPAA, etc.) compatible with Domino’s hosting region?
    
4. Who **owns compliance** if an audit identifies gaps — Domino or AstraZeneca?
    

✅ _If governance boundaries blur → stay with AZ-hosted model._

---

## 🔒 2. **Security & Control**

1. Will the connection between Domino’s control plane and AZ data planes be **private (PrivateLink/VPN)** or require any public endpoints?
    
2. Who manages **identity and access controls** (Azure AD roles, SCIM sync, privileged access)?
    
3. How will **audit logs** from the control plane be exported and retained in AZ’s SIEM?
    
4. Can Domino prove security posture through **SOC 2 / ISO 27001 / pen test results**?
    

✅ _If visibility or control weakens → stay with AZ-hosted model._

---

## ⚙️ 3. **Operational Reliability**

1. Does vendor-managed hosting improve **availability or recovery times (RTO/RPO)** compared to AZ-managed?
    
2. Who responds to **incidents or outages** — and how fast (MTTA/MTTR SLAs)?
    
3. Can AZ monitor control-plane health through dashboards or API telemetry?
    
4. How frequently will **releases and upgrades** be pushed, and do we get prior notice?
    

✅ _If operations transparency or recovery degrades → stay with AZ-hosted model._

---

## 💰 4. **Cost & Efficiency**

1. Does the vendor-hosted control plane reduce **infrastructure or support costs** for AZ?
    
2. Are there hidden costs — e.g., **PrivateLink traffic, DR replication, audit integrations**?
    
3. How will **chargeback/showback** be managed between BUs if control is externalized?
    
4. What’s the **exit strategy** if the model doesn’t work — can we revert without reimplementation?
    

✅ _If savings are marginal or reversibility is unclear → stay with AZ-hosted model._

---

## 🚀 5. **Strategic Value**

1. Does this change enable **faster innovation or feature adoption** (e.g., Domino Nexus multi-cloud)?
    
2. Will Domino’s control plane support **multi-region AZ data planes** more effectively?
    
3. Does this unlock future benefits (e.g., GPU pooling, agentic automation, AI integration)?
    

✅ _If yes — and risks are fully mitigated — consider a pilot._

---

### 🧩 **Final Framing**

> “We should transfer the control plane **only if** the vendor can provide evidence that:
> 
> - Data never leaves AZ boundaries,
>     
> - Full audit and access visibility are maintained,
>     
> - DR and SLAs improve or remain equal,
>     
> - Governance, cost, and reversibility are clear.”
>     

Otherwise, the **current AZ-hosted model (Option C)** remains the safest, most compliant default.

---

Would you like me to summarize this into a **decision slide** (“Stay vs Transfer — Key Questions & Decision Criteria”) ready for your meeting deck?

## Related
- [[Work/Astrazeneca/AZ/EAIA Projects/Domino/Domino Multitenant analysis/20251016 Thursday meeting with Domino]]
- [[Home]]
