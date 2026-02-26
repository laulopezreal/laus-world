# 🧭 Eisenhower Matrix

Organize tasks by urgency & importance.

---

## ✅ Important & Urgent (Do Now)
```dataview
TASK
FROM "00_Inbox"
WHERE !completed AND contains(text, "#important") AND contains(text, "#urgent")
SORT due ASC
```

---

## 📅 Important but Not Urgent (Plan)
```dataview
TASK
FROM "00_Inbox"
WHERE !completed AND contains(text, "#important") AND !contains(text, "#urgent")
SORT file.mtime ASC
```

---

## 📨 Urgent but Not Important (Delegate / Batch)
```dataview
TASK
FROM "00_Inbox"
WHERE !completed AND contains(text, "#urgent") AND !contains(text, "#important")
SORT file.mtime ASC
```

---

## ❌ Not Important & Not Urgent (Delete / Ignore)
```dataview
TASK
FROM "00_Inbox"
WHERE !completed AND !contains(text, "#urgent") AND !contains(text, "#important")
SORT file.mtime ASC
```
