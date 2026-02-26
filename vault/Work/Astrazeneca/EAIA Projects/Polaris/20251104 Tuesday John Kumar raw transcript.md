# 20251104 Tuesday John Kumar raw transcript

**Innocenti:** No more CUDA out-of-memory errors. That sounds like a challenge. Well then.  
**Kumar:** Yeah.  
**Innocenti:** We’ll see about that one, but I mean—they claim a lot with unified memory. Let’s test it out and see if that’s really true.  
**Kumar:** Mm.  
**Innocenti:** I’m not too convinced yet, but maybe, maybe.  
**Kumar:** Well, it’s a lot. It’s a lot of memory anyway. So where do you want to start? I mean, I know you two guys, right? I think I’ve known you from your very first days at AstraZeneca.  
**Innocenti:** Yeah, OK.  
**Kumar:** But Laura, I haven’t met you before, so maybe quick intro—and maybe same on my side.  
**Lopez Real:** Definitely. So I think your name sounds familiar to me, but I’m not really sure why. But yeah, I’ve been in AstraZeneca for three years. I used to be part of BioPharma R&D—actually working in Discovery Science in Cambridge. But now I’m based in Barcelona and working in Enterprise AI within Ignite as an Enterprise AI Architect, and I’m supporting these guys through the use-case interviews, gathering requirements, and just helping any way possible on this project, which is quite exciting.  
**Kumar:** OK, cool. Well, I’m John Kumar. Slightly worrying that my name’s familiar but you don’t know why, so we can’t say if it’s a good or a bad thing. I’ve been at AstraZeneca for a while—I used to work in Chris’s team; that’s where I started full time.  
**Lopez Real:** Mhm.  
**Kumar:** Then I moved to Enterprise running the AI platforms, and then changed again. Now I’m in R&D as Head of Engineering at the Centre for AI. So yeah, maybe just about being here so long—you’ve heard of me.  
**Lopez Real:** I hope that’s the other way, like the opposite process as I did. So yeah, it’s funny.  
**Kumar:** So you have your business, so yeah, I went the other way. But yeah, I guess we both have a broad experience of AstraZeneca.  
**Lopez Real:** Yeah. Nice meeting you.  
**Innocenti:** All right, that sounds good. Usually the way we run this is just walking through the questionnaire a little bit, but we can keep it free-form. The questions mostly guide the discussion a bit. John, you guys are doing quite a lot in the Centre for AI. Any chance you can give us that context piece—what’s the main scope of what you deliver to the business?  
**Kumar:** Mhm. So maybe you guys know—DS and AI is a central R&D function. Our remit is to act as a hub function, building anything common, reusable, and used by the various TAs. So we’re that specialised function. For instance, one major project we’re working on is M Lab, which sits in biologics engineering—designing novel antibodies using ML. Then we screen them with higher-throughput machines to measure affinity, so we work directly on business projects delivering value.

Given that, the Centre for AI has become a bit more engaged with AI itself—we have some ability now to chase projects around different areas of the business. Developing reusable components and driving our own roadmap of finding critical business challenges, then having time to deliver solutions.

And in terms of capabilities and workloads that would be primarily intended to run on Polaris…

**Innocenti:** I can give you a short-term view, I guess. The way I see Polaris—it’s like a big compute resource, right? And I think we should absolutely not make the same mistake we made with SCP in saying “oh, it’s a lot of compute, therefore it can do everything.” We should do only what belongs there. 


I think the capabilities we’re interested in running are: model training and model inference. That’s basically it. And I think the application layer should sit somewhere else unless there’s a good reason it needs to sit there.

So I’d be interested in seeing jobs that run across multiple GPUs on Polaris, but also deploying open-source models that need lots of RAM. There’s a lot we can do, right? We can start hosting a lot more than we can currently host. That’ll allow us to be less dependent on the big model providers. We could have a multi-step pipeline that calls different models depending on the size and scope of the task.

**Innocenti:** Yeah.  
**Kumar:** Training and maybe some serving, but now it’s a lot more like multi-GPU jobs.  
**Innocenti:** Building allocations that use the…  
**Kumar:** Agents, if you want. I would say some sort of unified inference-serving framework where we could host models in various formats—LLMs, antibody models for existence, things we’ve trained. It’s not suitable at all yet. You need something else. That serving framework should be flexible, maybe ten groups would own it. Quinn—80 billion requests per day, we don’t want that. We just want to understand how many calls come to that model, scale it appropriately.

So observability then becomes important. We’d like to know who’s using it, how much they’re using it, and turn it up or down.

**Innocenti:** Is that done manually today or is it non-existent at the moment?  
**Kumar:** It’s not like well—it’s non-existent. I mean, we can measure it. For LLM hosting we have access to 140 GB VRAM GPUs. We can host models on there; we can customize size and use LLM production stack, the Helm chart to do it—it has an observability plugin where you can see number of calls and metrics. It’s still in infancy, but it makes sense as a unified service for the company.

Here’s the text from that screenshot (verbatim-style transcript):

**Innocenti, Christopher – 10:33**  
“Yeah. All right. I think that’s pretty good in terms of context. Richard, Laura, anything you were thinking in context? I have a little bit of prior experience with the CAI, so I know some, but is there anything on your end?”

**Andersson, Richard – 10:49**  
“No, I think that was a very good introduction to what you want one out of Alaris and what we would be supporting for you here, so. Uh, that that that would be more on uh the the process.”

**Lopez Real, Laura – 11:12**  
“Definitely.”

**Kumar, John – 11:19**  
“Mm-hmm.”

**Andersson, Richard – 11:19**  
“So how do you work with the model training and development today? What systems, tools do you use here processes?”

**Kumar, John – 11:29**  
“Uh. So today we run on. Well, we run everywhere, but mostly on Azimuth. And so we prototype our—  
Our models in notebooks, so that’s definitely a use case I think. So, you know, there you’ll like launch VS Code and you’ll be sitting on like a full GPU and it’ll be idling most of the time. Mozilla, you know, messing around with your code, changing, changing things, troubleshooting.”

**Lopez Real, Laura – 12:12**  
“Mm.”

**Andersson, Richard – 12:19**  
“Thanks.”

**Kumar, John – 12:21**  
“Ultimately, before we do any large runs, we want to package the software. So package the software committed, get it reviewed, push to main, build like a component out of it, which a component we’re calling like a containerized.  
Stand alone you know environment and set of commands to execute the model training and then we will run that by a Kubernetes job, either the Kubernetes PyTorch operator.  
Or just a, you know, vanilla Kubernetes job. And then that’s how we run our long running stuff we’ve built.  
A like a helper package around this. So it’s just a CLI, so it makes it much easier to fire off these jobs. So like if you’re familiar with Kubernetes, there’s like a ton of boilerplate YAML that uh, you have to have to submit something, so.”

**Andersson, Richard – 13:22**  
“Hmm.”

**Kumar, John – 13:29**  
“We’ve sort of made it into a CLI, so you can just say, you know, dash, dash, what class do you want to train on? Dash, dash, this many GPUs, et cetera, right? And then you can can fire off your job.”

**Innocenti, Christopher – 13:45**  
“So are then the full training of sort of packaged up in the in the container. So when you want to run a full scale training of I don’t know 4 GPUs on some set of database, all of that kind of baked into the Docker container with a launch command inside so that it when it’s deployed on Kubernetes that’s—  
What runs and then it terminates.”

**Kumar, John – 14:08**  
“Uh. Yeah, or we will supply the command, right? So like there may be like a script in there and that’ll be like your command, like, you know, Python run, whatever.”

**Innocenti, Christopher – 14:17**  
“Yeah.  
Yeah.  
OK, so that happens when you run more longer, longer uh activities, then it’s wrapped up. But when you develop, it’s through interactive notebooks.”

**Kumar, John – 14:31**  
“Yeah, and this is like.  
The least efficient thing what we do like when we have all our jobs packaged and we’re like churning through like a antibody discovery campaign or something like our GPU utilisation will be quite high cause it’s really just like you know, cranking the handle on sequences and stuff.  
Um.  
But then like the development, the utilization is at maybe 5%, you know what I mean? It’s quite inefficient. So I don’t know how we get around that, like what our ways of working will be with a Polaris cluster if we.”

**Innocenti, Christopher – 15:06**  
“Yeah.”

**Andersson, Richard – 15:08**  
“Mm.  
Mhm.”

**Kumar, John – 15:16**  
“I would probably say it needs to be like a factory, right? And you need to get to this level of job submission before you submit something to the cluster. I don’t think we can support,  
Well, I don’t know. You tell me, but it seems like a bad idea to support people just.  
Doing nothing on these giant GPUs for.”

**Innocenti, Christopher – 15:35**  
“Maybe unless the fractional GPU comes to the rescue where they they essentially claim that you can emulate many GPUs through one, at least from the user perspective. So you get a timeshare on it and some of them could maybe be dedicated.”

**Andersson, Richard – 15:35**  
“No.”

**Kumar, John – 15:42**  
“Mm-hmm.”

**Innocenti, Christopher – 15:55**  
“To that.  
Oh.”

**Kumar, John – 15:58**  
“Yeah, I mean.”

**Innocenti, Christopher – 15:59**  
“But yeah.”

**Kumar, John – 16:03**  
“It’s probably worth doing. Well, I don’t know. It’s I’ll leave that to you guys to decide. I’ll tell you that, um, we do, we do both and very poor utilisation and the prototyping stuff.”

**Innocenti, Christopher – 16:11**  
“It.”

**Andersson, Richard – 16:19**  
“8.”

**Innocenti, Christopher – 16:20**  
“—”

**Innocenti, Christopher – 16:20**  
“Yeah. And the types of modelling you guys do, are you touching entirely the full stack looking at the the questions on LLMS, vision, generative modelling, is that the full stack or are you mostly LLM based these days in the team?”

**Andersson, Richard – 16:26**  
“OK.”

**Kumar, John – 16:38**  
“Uh, so we do.  
Many things. So part of our work packages for next year revolve around training foundation models for like not LLM, so like protein, RNA, image based, cell based.”

**Innocenti, Christopher – 16:56**  
“Hmm.  
Image based, yeah.”

**Kumar, John – 17:02**  
“So a wide variety.”

**Innocenti, Christopher – 17:04**  
“Yeah, OK. But that that that’s, that’s quite all right. So based on what I saw in CAI, you’re kind of across the space there, there’s been audio, there’s been images, all of these things. So I think that’s fair.”

**Kumar, John – 17:09**  
“Hello also.  
Yeah, so what? Yeah, I mean like LLM is definitely one thing. So like a foundation model looking at SAS code and then.”

**Innocenti, Christopher – 17:20**  
“Uh.”

**Kumar, John – 17:33**  
“Like, yeah, RNA, cell protein, biologics, that’s all in the roadmap just on the foundation model side. Then we have like all the agentic stuff that we’ll do, which will be dependent on inference as I explained to you earlier.”

**Innocenti, Christopher – 17:41**  
“Yeah.”

**Kumar, John – 17:51**  
“Uh.  
Mechanism of action, which I think, yeah, I’m not sure about that, but yes, many, many different things. I should also add that we have um.  
Like when we run our antibody campaigns, it’s not just these protein language models, but we also use some of the structure prediction models, so similar to Alpha fold like bolts and we use those as.  
Oracles for our sequences. So basically it means we’re doing a lot of that sort of structure prediction, uh, routinely.”

**Innocenti, Christopher – 18:33**  
“Yeah, yeah, Bolts and Alpha Phone have come up in several other Uh interviews as well. So uh, it’s certainly an important Uh point.”

**Andersson, Richard – 18:37**  
“Yes.”

**Kumar, John – 18:38**  
“Hey.  
That would be good. I think like, I don’t know if NVIDIA has a NIM for that, but definitely be good to have some sort of bolt service on it that you could just.”

**Innocenti, Christopher – 18:48**  
“Yeah.”

**Kumar, John – 19:01**  
“Mm-hmm. Yeah, that would be good.”

**Andersson, Richard – 19:05**  
“I was thinking on you said you use azimuth. I assume that you're using the complete envelopes stack that they provide.  
Could you maybe give us a a view of of how you work with that M locks in general or if it's based on the tools of estimate or if it's something you?  
You developed yourself.”

**Kumar, John – 19:39**  
“Yeah, we try not to develop much ourselves. So we use Azimuth. If we have like a DAG, you know, like multiple steps, we will use Kube load pipelines in order to execute that.”

**Andersson, Richard – 19:53**  
“OK.”

**Kumar, John – 19:54**  
“Um, for artifact management and experiment tracking, we’re using weights and biases currently. Uh, I think that also is gonna have this AI observability Weave it’s called. Um, I think that will be coming.  
And I mean, yeah, then other services. So we like push all our software to Artifactory.  
3.  
Because we have some large projects where like part of the team will be working on one package, part of the team will be working on another package, but there’ll be dependencies of each other. And so we pushed out of factory, you know, so that people are using latest staple versions and can easily install, right?”

**20:27 – (Unidentified)**  
“Hmm.”

**Kumar, John – 20:41**  
“The packages, so that’s that. Yeah, models we register on Weights and Biases as well.  
What am I missing as part of ML OPS? I think that’s basically it.”

**Innocenti, Christopher – 20:56**  
“Maybe quickly tracing back a little bit, I guess maybe it falls under ML OPS, but you you mentioned the monitoring right with the GPU utilisation is how’s that done today? Is that looking through NVIDI SMI and being happy about it or or do you have something more?”

**20:57 – (Unidentified)**  
“Yes.”

**Kumar, John – 20:58**  
“OK.  
Mhm.  
So.  
No, no. So we bugged and bugged people, uh, to get the NVIDIA GPU operator on the past clusters. So now we can actually get like a live view of actual.  
Uh, GPU utilization like over different time frames like weeks, which has been very very useful and I think any anything Astra Zeneca does from now on should have this because.  
Everybody complains that they don’t have enough GPUs or, you know, and it’s all, as far as I can tell, my suspicion was it was always like this dog ate my homework type excuse, right? Like.”

**Innocenti, Christopher – 21:45**  
“Mm.”

**Andersson, Richard – 21:59**  
“I.”

**Kumar, John – 22:00**  
“And that’s true. We are not suffering from a shortage of compute. We’re suffering from a shortage of utilization, as far as I can tell.”

**Innocenti, Christopher – 22:11**  
“—”

**Innocenti, Christopher – 22:11**  
“I think I’m on board with that and and and Lydia raised a good point the other day. They have some sort of internal ways of working where you have to prove that you can saturate your GPUs before you get more right. And I don’t know, maybe that comes to Polaris, who knows? But it's.”

**Kumar, John – 22:24**  
“Yep.”

**Andersson, Richard – 22:24**  
“Oh.”

**Innocenti, Christopher – 22:30**  
“It’s good. So you have overview tools through in the NVIDIA software stack installed on the on the nodes. Is that fair to say? Yep.”

**Andersson, Richard – 22:30**  
“3.”

**Kumar, John – 22:35**  
“Yeah.  
Yes. So the daemon said every node that launches will get it and then we can and then it will report back to Prometheus or whatever it is.”

**Innocenti, Christopher – 22:47**  
“Yep.”

**Kumar, John – 22:51**  
“But it’s, I think it’s a must have for like maybe maybe we were lenient on the proving that you can 100% saturate them, but we should at least be able to to measure and try and see an improving trend for utilisation.”

**Andersson, Richard – 23:09**  
“Hitting.  
Now that that would be very, very important of course, and I think it’s for us to investigate what the features are provided with the standards of first act on Claris. So if from AI does have this built in.”

**Kumar, John – 23:19**  
“Yeah.”

**Andersson, Richard – 23:30**  
“It it do have this supposedly better mechanism for scheduling CPU jobs.”

**Kumar, John – 23:38**  
“Mhm.”

**Innocenti, Christopher – 23:43**  
“OK, but that that’s good. So but John, are are you guys only on Azimuth at the moment or do you have some on demand AWS stuff going on or or how does that even work? I’m not, I’m completely naive when it comes to Azimuth to be honest.”

**Kumar, John – 23:59**  
“Well.  
Azimuth currently has a like basically PaaS is the platform as a service team that does Kubernetes clusters and they can do it for you on on Prem resources or cloud resources and then Azimuth is just like a set of applications deployed on top of that.  
So we have clusters. We’re actually using three clusters now. One is cloud based, one is on Prem Gothenburg, one is on Prem US, but these are  
DGX nodes and they’re out of their service lifetime right now. So basically we’re living on borrowed time with those. The cloud based one is currently in EU W one and we’re going to move that to EU N one because of the.  
Sustainability angle. Um. Hopefully that gives us access to the P fives and G sixes, which are, uh, slightly upspec from what you can get in Ireland. Um.”

**Innocenti, Christopher – 25:10**  
“I think that will happen. We’re doing the same in the in the deep learning team. So yes, those are available there.”

**Kumar, John – 25:13**  
“Mm.  
But um, yeah, I mean we hope we’re hoping to that Polaris will allow us to remove our dependency on the Um on Prem clusters and use that as our main computation workhorse, but we’ll probably.  
Keep the cloud based one for like interactive work, some prototyping on small GPUs, that sort of thing and then firing. Hopefully we can fire off jobs to the big Polaris cluster when we need them.”

**Andersson, Richard – 25:48**  
“One of our ideas in terms of integrating platforms with Polaris is looking at the azimuth as an overlay top layer as you would on on Polaris too.”

**Innocenti, Christopher – 25:48**  
“Yeah.  
Yeah, that sounds good.”

**Andersson, Richard – 26:08**  
“To complement it with some of the functionality that’s not there. So an idea could be that Polaris is compute layer, the same as passes today, so.”

**Kumar, John – 26:24**  
“Mhm.”

**Andersson, Richard – 26:24**  
“You would be able to choose either past AWS or on premise or there would be a third choice which would be Polaris. So we we haven’t explored this in depth yet. It’s.  
It’s so far an idea and you as a user of Asimuth, do you have any suggestions, ideas that does that make sense for you?”

**Kumar, John – 26:57**  
“I mean, it makes sense for me, I think.  
What I see on the ground is that Azimuth is sort of getting more and more users because of its flexibility. You know, it’s it’s gives you a bit more access to the lower layers of things than something like Domino.  
And I think Domino isn’t really interoperable cause of the whole chip thing, but I think it it makes sense. But again, the interactive thing worries me like if you.  
Put Azimuth on Polaris. Then you know people can open notebooks and sit on GPUs. So maybe you just need some of the tooling out of it. You know, like the Kubeflow pipelines.  
You know, because you might be doing pre-processing job and then a training job and you want to orchestrate this on that. So maybe you want KFP to do that. I think inference wise, Kubeflow is like not good. I think you need. I think you need like another solution.”

**Andersson, Richard – 27:56**  
“Mm.  
Oh, OK.”

**Kumar, John – 28:12**  
“For that, like, what is it? K serve? I don’t think it’s very good. So yeah, I don’t know. You’ll need to work out something better than Kube.”

**Andersson, Richard – 28:23**  
“Yeah, we really investigated and do what might make sense there. Thank you for your view. So on I think we we pretty much covered process. We we dived in a bit into.  
Platform and tech as well. One question on platforms. I know you’ve been a user of SP in the past. Is that anything you’re still using or is all your work today on the data?”

**Kumar, John – 28:53**  
“OK.”

**Andersson, Richard – 29:02**  
“Systems.”

**Kumar, John – 29:04**  
“I think people are doing something on SCP, but we’ve we’ve basically removed it from our stack.  
Because at the time I was having stability and availability problems and we had access to different computer through Azimuth. But it’s the software, right? That’s the thing. Like if you want, that’s what SCP has.”

**Andersson, Richard – 29:21**  
“Yes.”

**Kumar, John – 29:33**  
“Like Schrödinger and all these licensed software which keeps you there. Even the data isn’t as much of a problem as the software. So if maybe that’s something to do.  
To like negotiate the license terms or whatever of the software people so that you can use the SCP software on Polaris. Because I think the way it is right now R&D actually own the licenses to the software, but the SCP team maintained the.  
License servers and so on.  
Um, so it’s just easier to use the software.”

**Andersson, Richard – 30:18**  
“Oh, and as you know, the Polaris system is ARM based, so probably much of the commercial or licensed software will not be able to run out-of-the-box. Maybe there’s some that would reduce functionality, but.”

**Kumar, John – 30:23**  
“Hmm.  
But I did talk to.  
You guys both met Pia, the NVIDIA Rep over there. I talked to her and she was saying that they’re willing to do like work with third parties to get things to work right, like offering engineering assistance for third parties to get it to run on their clusters. So.”

**Andersson, Richard – 30:43**  
“Yeah, yes.”

**Kumar, John – 30:58**  
“Maybe there’s an exercise of like prioritising the software, seeing what will run, what won’t run, and then flagging a few candidates for development to NVIDIA.”

**Andersson, Richard – 31:11**  
“Oh, exactly. If there’s an interest for it, you can of course approach that.  
Very good. So maybe we’re moving to our next section, which is on data.  
So maybe they’re, yeah, sorry.”

**Kumar, John – 31:32**  
“But.  
But I was just gonna say, well, like, yeah, we just need.”

**Andersson, Richard – 31:37**  
“OK.”

**Kumar, John – 31:42**  
“The ability to put.  
The most protected data type at AstraZeneca on there like so PII, let’s call it full track, trace and audit capabilities. I think that just if we just aim for that out-of-the-box, it’ll make everything so much easier.”

**Andersson, Richard – 31:53**  
“Mm.  
Yes, and that’s something we we have in our plans to support, but initially we may not be able to have the right level of security at the first delivery date. So there may be a phased approach where we.  
Or quality initial operating capacity where you’d only be able to basically use public data and it would be for the first. We don’t know for for how long yet, but for the first period it would be public data only then.”

**Kumar, John – 34:59**  
“I don’t know. It’s always a grey area for me because some things are validated, like the central model registry which runs on Databricks now is supposed to be validated, meaning that if you have a GxP process and you’re—  
Pushing your models there and pulling them from there. You don’t need to revalidate that part of the process, so maybe there’s something similar that that is.”

**Andersson, Richard – 35:28**  
“But for for the initial use cases you have for for Claris, is any of that impacting any decisions for patients or operations?”

**Kumar, John – 35:40**  
“I think.  
So right now we split it up like this, like azimuth we do.  
Most of our stuff and some private things, but because the data office has a very favorable view of AI Bench and a less favorable view of Azimuth for whatever reason, anything that.  
Requires that PII data. We keep on AI Bench because it’s just a much easier process to get the data on there. In the future we’re looking to transfer those use cases maybe to Domino and like not be on AI Bench at all.”

**Andersson, Richard – 36:16**  
“Yeah.”

**Kumar, John – 36:26**  
“Um.  
And then we’ll see. But yeah, we have a set of use cases that we could directly put on to Polaris that don’t require strictly confidential or GXP validated processes.”

**Innocenti, Christopher – 36:43**  
“But is it public? So fully public like that?”

**Andersson, Richard – 36:45**  
“See.”

**Kumar, John – 36:47**  
“Is it? Probably that’s harder to find. Um.”

**Andersson, Richard – 36:55**  
“Yeah.”

**Innocenti, Christopher – 36:55**  
“Yes, I think that will be one of the requirements. It can’t be any asset asset because of the way the Polaris is going to be split among all of the the companies. Before all of the security measures are put in place, the only data that can be put there is anything that’s publicly available.”

**Kumar, John – 37:05**  
“Um.  
Um.”

**Andersson, Richard – 37:19**  
“OK.”

**Kumar, John – 37:20**  
“Yeah, I don’t know. I mean, this is the thing, right? This is always the thing. You know, all sandboxes and stuff. We’re always like, yeah, you can use it, but you just can’t put any data in there. Well, OK, so so I guess you’re telling me I can’t use it.”

**Andersson, Richard – 37:28**  
“Hmm.”

**Innocenti, Christopher – 37:33**  
“Yeah.  
Yeah, a sandbox without any of the sand in it. You get the box.”

**Kumar, John – 37:37**  
“Yeah.  
Yeah, exactly. I mean, there’s stuff you can do, but it’s obviously very limited to that impact, right? Um.  
Like even relatively benign things like training this foundation model for.  
SAS code that would have to be all proprietary AZ code that goes in there. So while I think the risk is very small, you couldn’t call it public.”

**Andersson, Richard – 38:10**  
“That’s not on the switch, so.”

**Innocenti, Christopher – 38:10**  
“Hmm.”

**Andersson, Richard – 38:17**  
“If we look at the the stage where where you’re actually able to use the system and put your real data on there, you said you you have different kind of data types. One was the images I I remember and.  
Well, a few others. So if we look at the size of of the data, you’re you’re going to transfer to Polaris be able to give an error of estimates like.  
What’s the average type of, uh work? Uh, and what’s the largest piece of work? Uh, you’re going to transfer there?”

**Kumar, John – 39:00**  
“I don’t know. I can tell you guys something. I can tell you guys something.”

**Andersson, Richard – 39:07**  
“So it it we we just need it in the range like.”

**Kumar, John – 39:11**  
“Oh, it’s, um, it’s gonna be.”

**Andersson, Richard – 39:12**  
“Yeah.”

**Kumar, John – 39:17**  
“Like multiple terabytes. Um.  
Easily like I’m we’re just doing a a clean up of our cluster.  
And I’m I’m just looking for the number that came out of it, about how much data we have on it and it was relatively hilarious.  
247 terabytes of data we had on our cluster, but I’m sure most that was like just scientists.  
Doing copies and checkpoints and whatever else. Um, but that’s about the range, I guess. So you know, for a single training one, we’d probably want to transfer.”

**Andersson, Richard – 40:07**  
“Mhm.”

**Kumar, John – 40:15**  
“Like 10s to up to hundreds of terabytes of data and we would in the worst cases we need them on a fast file system, so like NVMe.  
You know on the on the note.”

**Andersson, Richard – 40:31**  
“Mm.  
That’s really useful information. Could could you maybe, I don’t know if you have any concrete example of of such a training. So, so say you want to train one of those foundational models you mentioned.”

**Kumar, John – 40:52**  
“Mhm.”

**Andersson, Richard – 40:52**  
“Um.”

**Kumar, John – 40:54**  
“I think the the worst ones were the audio ones. So we have like, uh, we were doing training for counting coughs. So you’d have like recording of people coughing that you’d have to process. So these are relatively.  
Like large audio files um and then they would would have to be on a very fast disk right? The faster the better in order to make this work. Um and the data side there was.”

**Andersson, Richard – 41:10**  
“Mhm.”

**Kumar, John – 41:26**  
“Sort of 10 plus terabytes for a single training one. That was like the most technically challenging one in terms of data speed and access.”

**Andersson, Richard – 41:38**  
“That’s so that’s very interesting. Would you mind me sharing that with the because they’ve been asking about different use cases that use a lot of data in their their.”

**Kumar, John – 41:53**  
“Mhm.”

**Andersson, Richard – 41:54**  
“Single run so.”

**Kumar, John – 41:56**  
“Yeah, I can get some more, get some more details on that. But then we also have like, you know, peptide, not peptide, like antibody training runs, which are pretty they have a bit and they’re just sequences. It’s just like text data, so,  
Uh, but it’s a lot.”

**Innocenti, Christopher – 42:18**  
“And in terms of output, John, are you guys generating a lot of data that you need to transfer out or is it mostly the model itself which is going to be a few gigabytes worth of of storage and then maybe some predictions, but are the predictions large or you know the output data is that large?”

**Kumar, John – 42:38**  
“Um.  
Well, not as large as the input data, hopefully.”

**Innocenti, Christopher – 42:43**  
“Terabytes, Uh, gigabytes. What range do you think?”

**Kumar, John – 42:49**  
“I don’t know like a lot of it’s multi step so.  
You know, like we’ll generate, the end goal will be to generate a library of 100,000 sequences or you know around that order. First step is to generate like a million. So you know that I guess it’s still pretty small in terms of data.  
Um.  
I think MB scale outputs for actual data, but then like um, as you say gigabytes for the models and this can there’s a lot of checkpointing that needs to happen, so um.”

**Innocenti, Christopher – 43:25**  
“OK.”

**Kumar, John – 43:30**  
“You know.”

**Kumar, John – 41:30**  
“You know.”

**Innocenti, Christopher – 43:30**  
“Yeah, that’s fair. But usually you’re only interested in a few of the checkpoints and and each of those are not too big, I suppose.”

**Kumar, John – 43:38**  
“Yeah, but I guess the way we’d wanna work is like you just set up weights and biases or equivalent in your software and then every checkpoint gets shipped to your uh artifact management service and then  
You know you can delete them, but at least they’re there so you can watch the training output metrics and then pick pick the checkpoint you want and delete the rest. But it’s still a lot of egress, if you know what I mean from that.”

**Innocenti, Christopher – 44:10**  
“Yeah.  
Any notion on the on on that number that you think would be required to get out of there? I mean it’s OK to say no, I don’t know, but.”

**Kumar, John – 44:23**  
“Yeah, and I got no real feel for it. Uh.  
But it’s probably only gonna get more than what we have now, because I guess now my feeling is these practices are not very widespread at AZ of, you know, integrating with experiment tracking and artifact management. Like people tend to just operate in these of volumes.  
You know, essentially, um. But I think this is a way of working that should be brought in. Um.  
And Polaris might be a good, good time to do it because I think everything has value, right? And uh, doing things in a sort of systematic way helps us, um, better track what we’re doing scientifically.”

**Innocenti, Christopher – 45:15**  
“All right. I think that’s all good. Should we carry on? In the interest of time, we don’t have too much. We already touched a little bit on model development and and things. John, you guys use notebooks, etcetera, and then you submit jobs in a way to to the kube clusters.”

**Kumar, John – 45:20**  
“Mhm.”

**Innocenti, Christopher – 45:33**  
“Um, anything else on that front? The ways of working with?”

**Kumar, John – 45:33**  
“OK.”

**Innocenti, Christopher – 45:39**  
“That that’s worth mentioning.”

**Kumar, John – 45:41**  
“Not really, just we we use VS code.”

**Innocenti, Christopher – 45:43**  
“So.  
Do you guys try and remote attach and things like that or do you just develop through it and then uh you know notebook through the web interface I suppose, but.”

**Kumar, John – 45:57**  
“We can support all of those, I think.  
The idea is to have less depend. Yeah, so we just want people to be able to either use their their laptop or azimuth like through the web, but ultimately to be able to submit jobs, uh, when they need to actually train something.  
For real.”

**Innocenti, Christopher – 46:23**  
“Yep.”

**Innocenti, Christopher – 46:34**  
“And then any preference on how that should be done, the submission of the OPS, anything there that that’s a pain point today or or anything like that?”

**Kumar, John – 46:34**  
“Yeah, well, like I mentioned, just like the CLI approach has been fairly useful because it it can be done both programmatically or, you know, manually just firing it off from the command line, I think.  
Anything where there’s a lot of YAML tends to get a bit of friction from the AI scientist.”

**Innocenti, Christopher – 47:03**  
“Alright, alright. Um.  
So maybe anything else there from any of you on the call with model development? I think we’ve touched on essentially all of this already. The public data resource scheduling is not super important for you guys since you can do it a little bit on demand.  
With the clusters, but maybe then inference is an interesting topic with you did say that you did have some serving needs. So in terms of latency and stuff, do you have demand to be able to have a live service running all the time?”

**Kumar, John – 47:34**  
“Hmm.”

**Innocenti, Christopher – 47:44**  
“Do you get batch submissions of data that you’re going to process and then hand over? How does that look like for you at the moment?”

**Kumar, John – 47:53**  
“Um.  
So.  
It’s hard to say, I mean for.  
So there’s two main worlds we live in, like the protein engineering world and the agentic world, and these all have requirements somewhat different about latency, throughput and concurrency.  
So with the protein, you might want to serve a model, get it to predict your 100,000 sequences or whatever, but time isn’t really.”

**Andersson, Richard – 48:23**  
“Yes.”

**Kumar, John – 48:38**  
“That much of an issue, right? Like you can sort of fire it off, we can go do something in the background. So that could be like async even. But for the agentic stuff, like it’s all sort of pipelines and cycles, right? And like one call is blocking the next call, if you know what I mean.  
I mean, so we’ve even, we’re even doing a little bit of work with what they’re called Cerberus because they have these ultra fast inference services.  
And that’s because it’s better for the Agentic, right? Like the faster you can do a loop, the faster you can like move on to the next loop and so on. Do you know what I mean? So that that means latency throughput, possibly concurrency once Agentic starts to kick off. So that would be the most demanding.”

**Andersson, Richard – 49:20**  
“Mm.”

**Kumar, John – 49:35**  
“In terms of inference needs and the model’s a big, right? They’re like, you know.”

**Andersson, Richard – 49:37**  
“OK.”

**Innocenti, Christopher – 49:42**  
“Would you envision those to be run? So when they’re fully developed and and and trained, would they? Would this be something you would want to run during development or is this when you train the agents, the agent system and you set things up?”

**Kumar, John – 49:43**  
“Unreally reboot.”

**Innocenti, Christopher – 49:58**  
“Do you need all of these, this throughput and concurrency at that phase, or would you only need it when you actually deploy the thing you’re happy with?”

**Kumar, John – 50:08**  
“I think it’s only when you deploy it, right? Like when you’re experimenting, you’ll obviously be.  
Testing more for you know, and it does it reason correctly. Does it get to the right answer? Does it pass the benchmark? These sorts of things, you know, swapping models in and out and then once you have something that.  
Build the task and you can optimize on these things.”

**Andersson, Richard – 50:44**  
“So would would any of these inference workloads be sensitive in terms of availability? I think that might be a challenge in Polaris since it’s.  
Quite a sensitive environment and it’s a single system, so it may be that the cannot guarantee 100% production.  
Availability of the service nodes may go down and they may be need for service and so forth quite regularly. Would you have any critical services depending on on this inference or would it be acceptable if it goes down?”

**Kumar, John – 51:25**  
“Yeah.”

**Andersson, Richard – 51:34**  
“You can do a fall back to some other inference service.”

**Kumar, John – 51:38**  
“Well, you know, we’re R&D. Nothing, nothing we do really matters that much. You know, things can go down. It’s not like it’s manufacturing or something like that.  
Um.  
I don’t know. They’re they’re not critical at this stage. Maybe they get there, but I would say we have.  
No really hard uptime requirements, right?”

**Andersson, Richard – 52:09**  
“Of course we we’ll do the best we we can with with the whole work we’ve got, but it’s it’s a single system. So that’s why why I I need to raise it if you have any demands on high availability of the interference service.”

**Kumar, John – 52:28**  
“I mean, I think that’s when we would get into like, you know, dedicated serving like Cerberus, right? Because then you just, OK, that spinning wafer of silicon belongs to us and.  
And it just, you know, spits out what we needed to, whereas this is more a multipurposing, right? So you never know what job you’re gonna be alongside and you’re gonna lock up your node or or whatever.”

**Andersson, Richard – 52:58**  
“Yeah.”

**Innocenti, Christopher – 53:01**  
“All good. I think we are almost running out of time. So let’s maybe touch on two critical questions that we also want to talk about in terms of collaboration externally. John, do you have that today? So you know other universities or anything like that?  
Because most likely that will be tricky to do with Polaris in in the short term.”

**Andersson, Richard – 53:24**  
“Um.”

**Kumar, John – 53:28**  
“Nothing, nothing on the critical path, right? We may have, you know, collaborations time to time, but right now most of our use cases are AZ internal.”

**Innocenti, Christopher – 53:38**  
“Yeah, and and you don’t need, uh, external parties, direct access to compute resources at this point in time.”

**Kumar, John – 53:45**  
“No.”

**Innocenti, Christopher – 53:48**  
“All right. And then maybe I’m, I’m skipping ahead, but the the last question is with regards to money as they say, how’s your team in the funding side going forward, John, is that anything you have insight into?”

**Kumar, John – 54:04**  
“I mean, we need like, we need a model, right? Like, I think it’s.  
I mean, you know how it is, right? Like, I like we have the amount of money we have now, but we like I asked tom-tom asked Jim, Jim asked Sharon if it’s important enough, some money appears, right? But right now we have no model about.  
Our chargeback is gonna work on this Polaris, so we can’t estimate. So I have a compute budget next year of 700,000 to a million.  
But I have other things I have to keep running until Blaz becomes available, which is like when so I have to keep other services ongoing and then have some transition period and so on.  
You know, once we have the model, we can, we can work out what we need, if we’re short or what. But I mean, I know how much money they want me to spend next year, if that’s realistic or not, I don’t know.”

**Andersson, Richard – 55:09**  
“Hmm.”

**Kumar, John – 55:14**  
“You guys tell me.”

**Innocenti, Christopher – 55:14**  
“Yeah, but you already have a compute budget, so technically speaking you could divert funds from there to say Polaris because at the end of the day it’s training. Obviously you want to know exactly what the cost is, etcetera, but compute resource is already something that that is in demand in your team.”

**Andersson, Richard – 55:24**  
“Hello.”

**Kumar, John – 55:27**  
“OK.”

**Andersson, Richard – 55:28**  
“Cool.”

**Kumar, John – 55:32**  
“Yeah, I mean, I am predicting somewhat naively that that this comes out cheaper for us overall, right? Because.”

**Innocenti, Christopher – 55:33**  
“7.”

**Kumar, John – 55:44**  
“It’s paid for upfront and if it comes out as like more expensive than a reserved P5 N node in EU N one, then we may simply not move. Do you know what I mean? That’s the.”

**Innocenti, Christopher – 56:01**  
“Yeah.”

**Kumar, John – 56:01**  
“That’s the the reality of it. But if it comes out cheaper, yes, I’d love to take advantage of these, these new notes. I’m happy to to pay for it on a on a user page basis. I think that’s important, right? Otherwise people just.  
Get into the SCP situation where people just, you know, **** away resource, resource for nothing.”

**Kumar, John – 55:32**  
“Yeah, I mean, I am predicting somewhat naively that this comes out cheaper for us overall, right? Because.”

**Innocenti, Christopher – 55:33**  
“7.”

**Kumar, John – 55:44**  
“It’s paid for upfront and if it comes out as like more expensive than a reserved P5 N node in EU N one, then we may simply not move. Do you know what I mean? That’s the.”

**Innocenti, Christopher – 56:01**  
“Yeah.”

**Kumar, John – 56:01**  
“That’s the the reality of it. But if it comes out cheaper, yes, I’d love to take advantage of these, these new notes. I’m happy to to pay for it on a on a user page basis. I think that’s important, right? Otherwise people just.  
Get into the SCP situation where people just, you know, **** away resource, resource for nothing.”

**Andersson, Richard – 56:24**  
“Yes.”

**Innocenti, Christopher – 56:28**  
“All right. Yeah, we’re we’re at the, uh, the full hour mark. Any questions from Uh, Richard Laura?”

**Andersson, Richard – 56:32**  
“Mhm.”

**Kumar, John – 56:42**  
“Yeah.”

**Andersson, Richard – 56:43**  
“Appreciate.”

**Kumar, John – 56:45**  
“Thanks guys. I’m always around. So if you have any other questions you you can reach out. I think we’re gonna get something of a steering committee or something together as well. So I’m sure this might be the last time we we talk about it.”

**Innocenti, Christopher – 57:02**  
“That sounds about right to me as well. All right. Thank you very much, John. Have a good rest of your day. Thank you, guys.”

**Kumar, John – 57:05**  
“All right. Have a great day, everyone.”

**Lopez Real, Laura – 57:08**  
“Thanks a lot, John. Take care. Bye.”

**Andersson, Richard – 57:08**  
“Yep. Thanks everyone.”

**Kumar, John – 57:11**  
“Bye.”