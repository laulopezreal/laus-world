### 🧾 What is iDAP? **Integrated Data Analysis Platform**

**iDAP** is an internal AstraZeneca framework designed to:

- **Request**, **provision**, and **govern access** to clinical and research datasets.
    
- Provide a **controlled and auditable environment** for data analytics.
    
- Serve as the **gateway** through which users (e.g., data scientists, statisticians) request access to clinical datasets from the R&D Data Lake.
    

### 🔍 iDAP in practice:

- A user submits an **iDAP request** specifying what data they need and what tool they will use (e.g., Domino).
    
- The **Data Provisioning Office (DPO)** fulfills the request by copying the required data (e.g., clinical SAS datasets) from **S3 buckets** into **Domino Datasets**.
    
- The request is associated with a unique **iDAP number** (e.g., `INT-20250303-1847`), which is used to track and audit provisioning.
    

### 🧠 Why is iDAP important?

- Ensures **compliance** with regulatory and privacy standards when accessing sensitive R&D data.
    
- Provides a **structured workflow** for provisioning and access control.
    
- Supports **traceability** through audit logs and naming conventions.
## 🧱 **Data Plane**

### ✅ What is the Data Plane?

**Data Plane** refers to a **governed cloud-based layer for secure access to R&D datasets** at AstraZeneca. It enables:

- **Fine-grained, secure access** to data in AWS S3 buckets (clinical, omics, real-world data, etc.).
    
- **Credential management via IAM roles** to support tools like Domino, EWF, and others.
    
- **Centralized logging, security policies, and access rotation**.
    

### 🔗 Relevance to Domino

- Domino connects to **Data Plane** when provisioning data from S3 buckets.
    
- Future roadmap includes **direct integration**, allowing Domino to query or read from S3 via IAM roles **without manual key management**.
    
- Supports **scalability, automation, and compliance** (e.g., auto-rotating credentials, audit trail enforcement).

## 🔐 **EWF – Enterprise Workbench Framework**

### ✅ What is EWF?

**EWF** stands for **Enterprise Workbench Framework**, an internal AstraZeneca platform that:

- Provides **governed access to analytics tools**, including SAS, R, Python, and cloud notebooks.
    
- Acts as a **centralized access and execution layer** for secure, compliant analytical work.
    
- Is used widely across clinical and biometrics functions.
    
### 🔗 Relevance to Domino

- Users often want to **move workflows or datasets from EWF to Domino** to take advantage of more scalable or cloud-native tools (e.g., ML workflows, Jupyter notebooks, model training).
    
- Integration between **EWF → Domino** is not yet available (marked TBD in your roadmap) and is considered a **complex integration** due to:
    
    - Different authentication models
        
    - Audit trail requirements
        
    - Data residency and compliance