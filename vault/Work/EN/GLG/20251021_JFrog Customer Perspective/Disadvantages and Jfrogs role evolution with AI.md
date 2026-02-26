### 🧠 **Q: “How have you seen JFrog’s role evolve with AI or GenAI workloads?”**

> “JFrog is starting to play a more strategic role as enterprises apply AI and GenAI in software delivery.
> 
> Traditionally, it was focused on artifact storage and vulnerability scanning, but now teams are using **Artifactory** to manage _AI models, embeddings, and data pipeline binaries_ — so it’s evolving into a sort of **AI supply chain management layer**.
> 
> This shift increases artifact diversity and volume — you’re not just storing application packages anymore, but also large AI assets, which impacts both **storage and Xray scan workloads**.
> 
> In practice, that means JFrog spend can rise modestly as organizations integrate model management into their pipelines. But at the same time, **JFrog’s automation and AI-assisted dependency insights** help reduce manual triage work, which offsets some of that cost.
> 
> So GenAI is a double-edged driver: it inflates data volume but also strengthens JFrog’s positioning as part of the secure AI lifecycle — especially for customers subject to governance or audit requirements.”

---

### ⚖️ **Q: “What are JFrog’s disadvantages or areas for improvement?”**

> “Overall, JFrog’s platform is strong in governance and universality, but there are a few challenges that come up repeatedly among enterprise users:
> 
> • **Cost transparency** – Licensing is modular and usage-based, but it’s not always clear how pricing scales with security features or data volume. Customers often need more predictable cost modeling, especially when adopting multiple modules like Xray + Advanced Security.
> 
> • **Developer friction** – Enabling strict security policies via Curation or Xray can initially slow developers down. It’s a culture shift — great for compliance, but it requires tuning so that developers aren’t constantly blocked.
> 
> • **Integration depth** – While JFrog integrates with most CI/CD tools, **GitLab and GitHub have tighter end-to-end experiences** because their source control, CI, and security scanning are unified. JFrog relies on external orchestration, which adds complexity.
> 
> • **Runtime visibility** – The Runtime module is still evolving. Compared to players like Prisma Cloud or Aqua, runtime detection and remediation are more limited.
> 
> • **UI and analytics** – Reporting dashboards are functional but less intuitive; users often export data to external tools for deeper analysis.
> 
> In short, JFrog is excellent when governance and compliance are top priorities, but it’s less competitive on simplicity, UX, and native integration compared to all-in-one CI/CD platforms.”