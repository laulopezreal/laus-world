# Executive summary

- **Purpose:** Domino briefed AZ on the **option to move the Domino control plane to Domino-managed hosting** (while keeping AZ data planes in AZ). This option **didn’t exist when AZ first deployed** Domino; Domino is now socializing it **before** broader scale-up.
    
- **Positioning:** Domino framed the move as **not “now or never,”** but **easier earlier than later** (before user and project volume grows).
    
- **AZ priorities surfaced:**
    
    - **GxP-first posture** (focus the discussion on the **GxP-governed offering**).
        
    - **Environment lifecycle** expectations (dev → test → prod) with **pre-prod qualification** before production upgrades.
        
    - **Update / release mechanism clarity** (UAT window, cadence, who controls timing).
        
- **Outcome:** Domino will send **(1) hosting proposal & diagrams, (2) data-privacy analysis, (3) security/release/SLA docs.** AZ to review and respond. No decision taken; **next step is evidence review** against AZ guardrails.
    

---

# What Domino proposed (key points)

- **New deployment option:** **Domino-hosted control plane** (Domino SaaS-like) that **AZ didn’t have when first deployed**.
    
- **Why now:** Simpler to migrate **before** usage and complexity balloon.
    
- **Both models viable:** Domino acknowledged **trade-offs**; either can deliver AZ’s target capabilities; choice depends on **cost/benefit + security/privacy acceptance**.
    
- **Migration diligence:** Domino would run a **migration assessment** (configs, customizations, gaps, roadmap) **before** any commitment.
    
- **GxP variant:** Domino has a **more controlled GxP release** process vs. rolling updates for non-GxP.
    

---

# AZ asks / constraints captured

1. **GxP focus:** Evaluate **GxP-compliant control plane** path first (tighter change control, advance notice, timing control).
    
2. **Lifecycle management:**
    
    - AZ requires **dev/test/prod** separation.
        
    - **Pre-prod (test) must be GxP-qualified** prior to promoting to prod.
        
    - Expectation: **upgrade dev → qualify in test → AZ smoke checks → promote to prod**.
        
3. **Versioning & releases:**
    
    - **Advance notice** and **UAT window** required.
        
    - Clarify if **dev/test may share a control plane** (Domino suggested this is possible) **while prod has a separate control plane**, or keep all three separate—**options to be documented**.
        
4. **Documentation delivery:** Domino to provide **hosting diagrams, privacy analysis, security posture, release cadence & SLAs**.
    

---

# Analysis: implications & risk lenses

## Governance & compliance

- Moving CP to Domino creates a **new architectural pattern** at AZ; requires **ISRA/PIA re-validation** and clear **DPA/MSA addendum** on metadata handling, admin access, and audit rights.
    
- **GxP** requirement means **controlled releases**, **qualification evidence**, and **environment segregation** are must-haves.
    

## Security & control

- Need proof that **no sensitive data/metadata or secrets persist in the control plane**.
    
- **Private connectivity** (e.g., PrivateLink/VPN) only; **no public endpoints**.
    
- **Federated identity** (Azure AD SSO + SCIM), **AZ-owned keys/secrets**, and **full audit export** to AZ SIEM.
    

## Operational reliability

- Domino claims **operational offload** (patching/upgrades handled by them). AZ must verify **RTO/RPO**, **maintenance windows**, **notice periods**, and **telemetry access** (dashboards, APIs).
    

## Cost & reversibility

- Early migration may avoid future complexity, but AZ must confirm **actual cost deltas** (PrivateLink, DR, SIEM integration) and **a clean rollback path** if the model is not satisfactory.
    

## Strategy & timing

- Domino’s argument to move **before scaling** is logical from migration complexity standpoint, but **approval hinges on meeting AZ’s GxP, security, and audit guardrails**. A **limited pilot** (non-prod or a constrained tenant) could reduce risk.
    

---

# Decision framing (stay vs transfer)

- **Transfer (Domino CP)** makes sense **only if** Domino demonstrates:
    
    1. **No data/metadata leaves AZ boundaries**,
        
    2. **Private connectivity**, **AZ-owned IAM/keys**, **full auditability**,
        
    3. **Equal or stronger** **SLAs/DR** than today,
        
    4. **Controlled GxP release flow** with **dev→test qualification→prod**,
        
    5. **Reversible migration** (documented rollback), and
        
    6. **Net value** (ops offload, feature velocity) **exceeds integration risks/costs**.
        
- Otherwise, **stay with AZ-hosted CP**.
    

---

# Open questions to close (send to Domino with the doc request)

1. **GxP release mechanics:** Exact **notice periods**, **qualification steps**, **customer gating**, **freeze/rollback** options, and **environment timing independence** (dev/test vs prod).
    
2. **Architectural diagrams:** End-to-end **network flows**, **control plane services**, **where metadata lives**, **log export paths**, **privileged access model**.
    
3. **Security artifacts:** **SOC2 Type II**, **ISO 27001/27701**, **recent pen-test + remediation**, **vuln mgmt SLAs**, **data residency** for CP + backups.
    
4. **Audit & telemetry:** **Real-time audit export** to AZ SIEM; example **dashboards/APIs** for health/usage.
    
5. **DR posture:** **RTO/RPO targets**, last **DR test evidence**, failover comms process.
    
6. **Env topology options:**
    
    - (a) **3 separate CPs** (dev/test/prod), or
        
    - (b) **Shared CP for dev+test** with **separate prod CP**—**trade-offs** and **GxP implications** for each.
        
7. **Migration plan:** **Compatibility assessment**, **cutover approach**, **downtime**, **fallback plan**, and **who does what** (RACI).
    
8. **Cost model:** CP hosting + **PrivateLink/data egress**, **DR**, **SIEM export**, **support tiers**; **showback/chargeback** visibility.
    

---

# Recommended next steps

1. **Collect evidence** Domino promised (hosting proposal, privacy analysis, security/release/SLA docs).
    
2. **Run an internal EA/InfoSec review** against your **guardrails** (the one-pager you built).
    
3. **Decide on evaluation path:**
    
    - **If positive:** Plan a **limited, GxP-aligned pilot** (dev→test only) with **explicit exit criteria** (isolation tests, audit export, release control, DR test).
        
    - **If gaps:** Return a **punch-list** to Domino; reassess after remediation.
        
4. **Prepare stakeholder slide:** “**Stay vs Transfer: Criteria & Guardrails**” (you already have this); add **timeline** and **pilot exit criteria** if proceeding.
    

---

## One-slide quick recap (for your deck)

**Domino CP Transfer – Discussion Synthesis**

- **Why now:** Option didn’t exist at AZ deployment time; easier before scale-up.
    
- **AZ stance:** **GxP-first**, **dev→test qualification→prod**, controlled releases.
    
- **Domino to provide:** **Hosting diagrams**, **privacy analysis**, **security & SLA docs**.
    
- **Key risks to clear:** Data/metadata residency, private connectivity, IAM/keys in AZ, audit export, DR & release control.
    
- **Path to decide:** Evidence → EA/InfoSec review → (optional) limited pilot with clear exit criteria → Go/No-Go.
    

If you want, I can also draft a short **“Thanks & next steps”** email to Domino capturing the asks and setting expectations for the GxP release/qualification flow.