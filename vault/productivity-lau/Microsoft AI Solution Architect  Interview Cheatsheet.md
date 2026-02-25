

**Date:** Feb 6, 2026, 8:30 AM Madrid  
**Role:** AI Solution Architect, M365 Copilot & Agents Incubation Team  
**Interviewer:** Hans Baumann  
**Teams ID:** 21722541568726 / Passcode: Bt9NC9SV

Agentic AI refers to ==autonomous systems that reason, plan, and take action to achieve specific goals with minimal human intervention==. 

- **Autonomous Action:** Unlike generative AI (which creates content), agentic AI executes multi-step workflows, using tools to complete tasks on its own.
- **Proactive Goal-Setting:** These AI systems are not just reacting to prompts; they are designed to proactively achieve objectives.
- **Perception and Reasoning:** They use AI "agents" that sense their environment, analyze data, and learn from outcomes.
- **Key Capabilities:** Autonomous decision-making, adaptation to new information, and tool orchestration (e.g., calling APIs, querying databases). 

**Simply put:** It is AI that acts as a proactive agent to solve problems rather than just responding to questions.
---

## 1. Tell me about yourself

"I'm a software architect with a pharma and biotech background — AstraZeneca, EMBL-EBI, Zetta Genomics. MSc in Biotechnology, postgrad in Bioinformatics. But my trajectory has been moving steadily toward AI infrastructure.

Most recently, I've been one of the architects on Sferical AI — a sovereign AI compute platform in Sweden, backed by AstraZeneca, Ericsson, Saab, and Wallenberg Investments, built in partnership with NVIDIA. I designed the platform API layer that lets Fortune 500 partners access DGX SuperPOD infrastructure without needing to become GPU cluster experts.

What I've realized is that my sweet spot is exactly this intersection: deep enough technically to architect real systems, but with enough domain and business context to translate between engineering teams and stakeholders who care about outcomes, not implementation details.

That's why this role caught my attention — AI at enterprise scale, incubation team, Copilot and agents. It's exactly where I want to be."

---

## 2. Why this role?

"Three things lined up perfectly:

**First**, it's AI at the enterprise edge — not research, not demos, but actually deploying AI where it transforms how organizations work. Microsoft is one of the few companies.   doing this at real scale.

**Second**, Solution Architect fits how I work. I'm not a pure researcher or a pure engineer. I'm the person who figures out how to make something work in the messy reality of enterprise environments — legacy systems, compliance requirements, stakeholders with different priorities.

**Third**, the incubation piece. I'm a builder. I've spent the last year helping create something from scratch at Sferical. The 0→1 phase is where I'm most energized. Shaping what Copilot agents become, not just maintaining what exists — that's the opportunity."

---

## 3. Experience with AI/ML solutions

"At Sferical AI, I've been building the infrastructure layer that enterprises use to run AI workloads. Platform APIs for job submission, resource allocation, authentication flows that integrate with partner identity systems. Making NVIDIA DGX SuperPOD accessible to teams that aren't infrastructure engineers.

Before that, at AstraZeneca I worked on knowledge graphs for drug discovery — surfacing connections between compounds and targets that would take researchers months to find manually.

I also regularly consult through expert networks like GLG and Arbolus, advising investors and enterprises on AI adoption in pharma. That's sharpened my ability to cut through hype and focus on what actually delivers business value.

And I'm building my own projects — KnightMind is a chess training platform with AI analysis I've been architecting end-to-end. Full stack, from data pipelines to frontend.

So: enterprise AI infrastructure, domain-specific AI applications, and hands-on building. All three angles."

---

## 4. Translating technical concepts to business stakeholders

"This is honestly one of my core skills. Two examples:

**At AstraZeneca**, I worked on knowledge graphs for drug discovery. When presenting to senior leadership, I never led with 'ontologies' or 'semantic triples.' I showed them: 'This tool surfaces hidden connections between compounds and targets that would take researchers months to find manually. It flagged a potential repurposing opportunity that the team hadn't considered.' Outcomes, not architecture.

**Through expert networks**, I regularly explain AI capabilities to hedge fund analysts and PE firms evaluating pharma tech investments. They don't care about model architecture — they want to know: will this actually work, what's the timeline to value, what are the risks? I've done dozens of these calls bridging that gap.

My approach: start with the problem they care about, show the outcome, then go technical only if they ask. 'I focus on outcomes, not jargon.'"

---

## 5. Handling ambiguity / building 0→1

"Sferical is the perfect example. When we started, there was no playbook for 'build a sovereign AI compute platform for a consortium of Fortune 500 companies.' We had to figure out: What's the business model? How do we handle multi-tenant isolation? What does the API even look like?

My approach: make decisions reversible where possible, move fast, validate with users early. We shipped an MVP of the platform APIs, got partner teams using it, and iterated based on real friction — not hypothetical requirements.

The hardest part wasn't technical. It was aligning five different organizations with different security requirements, compliance frameworks, and use cases. I learned that in ambiguous environments, overcommunication is survival. Weekly syncs, shared documentation, making implicit assumptions explicit.

I thrive in this. The messy early phase where you're inventing the playbook while running it — that's where I'm most energized."

---

## 6. Working with multiple stakeholders

"At Sferical, I worked across AstraZeneca, Ericsson, Saab, SEB, and NVIDIA — five organizations with very different cultures, technical stacks, and priorities.

Pharma cares about validation and compliance. Defense cares about security classification. Finance cares about auditability. NVIDIA cares about showcasing their hardware capabilities.

How I navigated it: **find the shared goal** (sovereign AI compute that works), **document everything** (no handshake agreements), and **build relationships before you need them**. When conflicts came up — and they did — having trust already established made resolution faster.

One concrete example: there was tension between 'move fast and ship' (my instinct) and 'validate everything before deployment' (pharma instinct). We compromised on a staged rollout — limited beta with one partner, gather evidence, then expand. Both sides got what they needed."

---

## 7. Technical solution you architected — Sferical AI

"I'm currently one of the architects on Sferical AI — a sovereign AI compute platform in Sweden backed by AstraZeneca, Ericsson, Saab, and Wallenberg, built in partnership with NVIDIA.

**The problem:** Large European enterprises need serious AI compute for R&D — drug discovery, engineering simulations, LLM fine-tuning — but they can't send sensitive IP to US hyperscalers due to data sovereignty concerns. Building this in-house is a 50-million-euro problem most companies can't justify alone.

**The solution:** A shared infrastructure model on NVIDIA DGX SuperPOD — pooling resources across partners while maintaining strict tenant isolation.

**My contribution:** I designed and built the platform API layer — the software interface that lets partner companies actually *use* the compute infrastructure.

We have pharma researchers, automotive engineers, financial modelers — none of them want to think about NVIDIA cluster management. They want to submit a training job and get results.

So I built APIs for job submission, resource allocation, queueing, and status monitoring. Authentication flows that integrate with each partner's existing identity systems. Rate limiting and quota management so one partner can't starve another.

**The interesting architectural challenge:** balancing simplicity with flexibility. A data scientist at AstraZeneca has very different needs than an ML engineer at Ericsson. The API had to be clean enough for quick experiments but powerful enough for production pipelines.

We also built SDKs in Python and CLI tooling — meeting users where they already work. The goal: if you can run a script locally, you can run it on sovereign GPU infrastructure with three lines changed.

**Result:** Partner teams went from 'how do we even access this?' to productive in days, not months. That adoption speed is what makes the whole platform viable."

---

## 8. Why Microsoft?

"Microsoft is where enterprise AI is actually *happening*. Not demos, not hype — real deployment at scale.

Copilot is embedded in tools that 400 million people use daily. That's not a research project, that's transforming how work gets done. Azure OpenAI is becoming the default for enterprises that need AI with compliance and security.

I've seen the enterprise side from pharma and from Sferical — the gap between 'AI demo' and 'AI in production' is massive. Most companies have proof-of-concepts that never ship. Microsoft is one of the few actually closing that gap, and doing it across every industry vertical.

I want to be part of that transformation, not watching from the sidelines."

---

## 9. Why the incubation team specifically?

"I'm a builder. I get energy from 0→1 — figuring out what the product even *is*, not optimizing something that already exists.

Incubation is messy, ambiguous, fast. You're inventing the playbook while running it. That's exactly what I've been doing at Sferical — building a platform that didn't exist before, aligning stakeholders, making architectural bets with incomplete information, iterating fast.

Maintenance is important work, but it's not where I thrive. I want to shape what Copilot agents become, not document what they already are. The incubation team is where that happens."

---

## 10. Where do you see yourself in 2-3 years?

"Deep in agentic AI. I think we're at the start of a major shift — from AI as a tool you prompt to AI as a collaborator that takes action autonomously. The companies that figure out how to deploy that safely and effectively in enterprises will define the next decade.

**Concretely:** I want to be leading complex customer transformations — the ones where you're not just implementing a product but fundamentally changing how an organization works. Becoming a go-to person internally for agent architectures and enterprise deployment patterns.

**And honestly:** I'd like to contribute to the broader conversation. Writing, speaking, helping shape how the industry thinks about agentic AI. Microsoft is uniquely positioned to lead that conversation, and I want to be part of it."

---

## Questions to ask Hans

1. "What does success look like for this role in the first 6 months?"

2. "How does the incubation team work with product engineering? What's the handoff like when something graduates from incubation?"

3. "What are the biggest challenges customers face when adopting Copilot agents today?"

4. "How do you see the agent ecosystem evolving over the next 2 years? What are you most excited about?"

5. "What's the team culture like? How do you balance speed with the enterprise requirements for security and compliance?"

---

## Quick facts to remember

- **Job ID:** 200018661
- **Location:** Zürich (fully remote OK)
- **Salary range:** CHF 197K-253K total comp
- **Team:** M365 Copilot & Agents Incubation
- **Your edge:** Sferical AI + NVIDIA + enterprise pharma + expert networks

---

## Mindset reminders

- You're not just someone who *uses* AI — you helped **build the infrastructure** enterprises run AI on
- You have external market validation (expert networks pay $500-1000/hr for your insights)
- You've done multi-stakeholder alignment at Fortune 500 level
- Be confident. You belong in this conversation.

💜 You've got this.