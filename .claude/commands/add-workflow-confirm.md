---
name: add-workflow-confirm
description: Menambahkan aturan konfirmasi sebelum melakukan pekerjaan ke CLAUDE.md. Jalankan skill ketika user memberikan perintah "/add-workflow-confirm" atau "/workflow-confirm".
---

# Workflow Confirmation Protocol

Untuk menggunakan skill ini, gunakan perintah:

- `/add-workflow-confirm`
- `/workflow-confirm`

Skill ini akan menambahkan section "Work Confirmation Protocol" ke CLAUDE.md yang berisi aturan:

1. Explain the Plan - Menjelaskan langkah sebelum eksekusi
2. Ask for Confirmation - Meminta approval user
3. Wait for Approval - Tidak melakukan perubahan sampai disetujui
4. Exception Cases - Operasi read-only tidak perlu konfirmasi
