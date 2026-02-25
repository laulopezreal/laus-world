# 📅 Monthly Review – {{date:MMMM YYYY}}

## 🌟 Top Wins
- 

## 🚀 Progress on Goals
- What big goals moved forward this month?

## 📊 Weekly Outcomes Recap
```dataview
TABLE file.link as "Weekly Notes", outcomes as "Outcomes"
FROM "02_Weekly"
WHERE file.name =~ "Week.*{{date:YYYY}}"
FLATTEN ("🌟 3 Weekly Outcomes") as outcomes
SORT file.name ASC
```

## ✅ Task Archive Summary
```dataview
TASK
FROM "00_Inbox"
WHERE completed AND date(completion) >= date(this.month)
SORT completion DESC
```

## ❌ Challenges
- 

## 🔄 Adjustments for Next Month
- 

## 🎯 Next Month’s Priorities
1. 
2. 
3. 
