### “How are you or your clients using JFrog Cloud today?”

> “We’ve used JFrog Cloud primarily as a centralized artifact repository for container images, Helm charts, and Python packages. The SaaS version simplified administration, improved uptime, and made it easier to integrate with existing CI/CD pipelines on GitHub Actions and AWS CodePipeline. The key value has been governance and visibility across distributed teams.”

---

### ☁️ 2️⃣ “Why move to the cloud version instead of staying on-prem?”

> “Maintenance overhead and scaling were the main reasons. The cloud version eliminated the need to manage local storage and backups. It also integrates better with identity providers and has more consistent performance. The trade-off is that data residency and pricing require more careful planning.”

---

### 🛡️ 3️⃣ “Which of JFrog’s security offerings have you used or evaluated?”

> “Xray is the one we’ve used most extensively — it’s solid for vulnerability and license scanning. We also tested Advanced Security and Curation. Advanced Security adds contextual risk scoring, while Curation is useful to pre-filter packages before ingestion, although it can slow down development if the policies are too strict. Runtime is still early-stage; we only looked at it in a POC.”

---

### ⚙️ 4️⃣ “How effective do you find Xray compared to alternatives like Snyk or Aqua?”

> “Xray performs well in identifying CVEs and enforcing policies. Its strength is the tight integration with Artifactory — you can block risky components before they’re even pulled. Snyk and Aqua are more developer-friendly with richer reporting, but Xray wins on governance and traceability.”

---

### 💸 5️⃣ “How has GenAI affected JFrog usage or spend?”

> “GenAI has increased artifact volume significantly. Teams now store model binaries, embeddings, and AI-related dependencies in Artifactory. That naturally raises storage and scan costs. But the automation and security insights offset part of that spend by saving manual review time. Overall, spend trends slightly up but with higher compliance value.”

---

### 🧠 6️⃣ “Do you see JFrog becoming more relevant because of AI?”

> “Yes — as AI models become regulated assets, enterprises need the same level of version control and SBOM traceability they use for software. JFrog is well positioned to act as an **AI supply chain manager**. It’s not there yet feature-wise, but the direction is right.”

---

### 🧩 7️⃣ “How does JFrog compare with GitLab or GitHub?”

> “GitLab and GitHub offer stronger end-to-end CI/CD experiences since everything — code, pipelines, and security — is integrated. JFrog’s edge is in universal artifact support, governance, and fine-grained control across languages and environments. It’s stronger in complex, regulated setups, weaker in simplicity and developer experience.”

---

### ⚖️ 8️⃣ “What are JFrog’s main disadvantages?”

> “Pricing transparency is a common concern — customers struggle to predict spend as usage scales. The UI could be more intuitive, and the Runtime module still feels immature. Developer friction is another point: strict security gates via Curation or Xray can slow CI/CD if not tuned properly.”

---

### 📈 9️⃣ “Do customers generally see good ROI from JFrog?”

> “Yes, when governance and compliance are key drivers. The ROI comes from policy enforcement and reduced risk exposure rather than cost savings. It’s less compelling for smaller, agile teams that just need CI/CD simplicity — they often prefer GitHub Advanced Security.”

---

### 🧰 10️⃣ “How well does JFrog integrate with other tools?”

> “Integration is broad but not always deep. It connects easily to Jenkins, GitHub Actions, GitLab, and AWS services, but you need to manage orchestration yourself. That’s fine for mature DevOps teams, but for smaller orgs it adds complexity compared to a fully integrated platform.”

---

### 🕵️‍♀️ 11️⃣ “What challenges have you seen in JFrog adoption?”

> “Initial setup and policy tuning require time. Developers need education to understand why components are blocked. Some found the UI unintuitive for quick triage. Support is generally responsive but not always proactive. The platform itself is robust once configured.”

---

### 🔮 12️⃣ “How do you see JFrog evolving over the next few years?”

> “I expect JFrog to expand into AI model management and deeper runtime protection — moving from DevSecOps into AI supply chain security. The growth opportunity is clear, but success will depend on improving UX, cost predictability, and native integration with modern CI/CD and AI workflows.”