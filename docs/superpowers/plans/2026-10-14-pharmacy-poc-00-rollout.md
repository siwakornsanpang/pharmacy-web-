# Pharmacy POC Refactor Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ปรับโครงสร้างสามแอปโดยคง UI/flows เดิม ย้ายข้อมูลธุรกิจและไฟล์ครบ และส่ง POC ที่มีหลักฐานตรวจรับให้ vendor พัฒนาต่อ

**Architecture:** หนึ่ง monorepo มีสอง Next apps และหนึ่ง modular Fastify backend แต่ละแอป build/deploy แยกได้ ใช้ versioned public contracts และ domain-owned tables/transactions เพื่อเตรียมแยกบริการภายหลัง งาน runtime refactor ใช้ fixtures/test DB ก่อน migration และ deployment จริง

**Tech Stack:** npm workspaces, Node24, Next16/React19/TypeScript เดิม, Fastify/Drizzle/pg, Vercel, Render และ Supabase DB/Storage

**Spec:** [แบบระบบและขอบเขตที่ยืนยัน](/Users/arm/a3/pharmacy-web/docs/superpowers/specs/2026-10-14-pharmacy-poc-refactor-design.md)

สถานะ: ชุดแผนพร้อมให้ผู้ใช้ตรวจ ยังไม่อนุมัติการเริ่ม implementation และยังไม่มี product changes/migration/deployment ที่ทำโดยงานนี้ Paths ภายในแผนย่อยคือไฟล์ใน **monorepo ใหม่**; เอกสารเก็บชั่วคราวใน pharmacy-web เดิมเพราะยังไม่สร้าง repo ใหม่

## Global Constraints

- “คง JSX/CSS, URLs, layouts, labels, navigation, responsive behavior, forms, modals, editor/crop/upload interactions และผลของ mock flows เดิม” — security/logic corrections บันทึกแยกจากภาพเปลี่ยน
- “ไม่ย้ายบัญชี login เจ้าหน้าที่เดิม password hashes หรือ sessions/tokens เดิม” — สร้าง fresh staff/admin ผ่าน controlled setup ภายหลัง; คง role definitions/grants เดิม
- “ย้าย application content/business/configuration ทั้งหมด” และ copy file bytes/metadata ครบ; source38tables ข้ามusers1table แต่ต้องตรวจ live inventory ไม่สรุปจาก sourceอย่างเดียว
- pharmacy-web ใช้10numericmockIDs `11111,22222,33333,44444,55555,66666,77777,88888,99999,00000` และ `ph123`; password12345/OTP111222; mocksอื่นคงเดิม
- “role admin คง full-access policy ตาม UI เดิม” แต่ current session/account/capability/business validation บังคับเสมอ; nonadminไม่ได้capabilitiesใหม่อัตโนมัติ
- Backendอยู่Render; DB/Storageอยู่Supabaseใหม่; frontendสองVercelprojectsใหม่; ConferenceคงRailwayแยกและทดสอบด้วยfixtures ไม่รวมstaffSSO/backoffice
- POCยังไม่เป็นmicroservicesปลายทาง; vendorกำหนดservice/data/trust/distributedconsistencyเพิ่ม ใช้publicports/versionedcontractsและไม่อ่านprivate tablesข้ามdomain
- NextรับboundedJSONmetadata/auth; filebytesใช้one-useuploadticketตรงfixedRender และ authorizeddownloadredirect เพื่อรองรับVercel4.5MBlimit โดยคงUI
- ไม่ใช้realkeys/dumps/privatefilesในGit/log/chat; ไม่ทิ้งnewwritesหลังcutoverโดยกลับstalesource

## Review Focus

1. JWTยังvalidแต่session/account/grantsเปลี่ยนต้องปฏิเสธ/ใช้สิทธิ์ปัจจุบัน — แผน01Tasks3/5/6 และแผน02Task5ticketconsume tests
2. เพิ่มtab/capabilityแล้วownerไม่ต้องเพิ่มSQLkeyเอง และ nonadminไม่ยกระดับผ่านroleassignments — แผน01Tasks1/4/5/8; แผน04Task6clean-checkout exercise
3. Draft/address/privateasset/foreignownerต้องไม่หลุด และDB/uploadล้มเหลวไม่ลบไฟล์เดิม — แผน02Tasks3–6; แผน03Task2/3
4. Sessionแยกกัน/คำขอเก่าตอบทีหลัง/replayedmockpaymentต้องไม่ทับข้อมูลหรือแสดงsuccessผิดรายการ — แผน02Task7; แผน03Tasks2–6
5. ไฟล์หายหรือdatahashไม่ตรงต้องblockcutover; ระบบใหม่มีwritesแล้วต้องรักษาข้อมูลนั้น — แผน04Tasks1–5

---

## ชุดแผนย่อย

1. [Foundation และ Access](/Users/arm/a3/pharmacy-web/docs/superpowers/plans/2026-10-14-pharmacy-poc-01-foundation-access.md): workspace/contracts/config, current staff JWT/session, catalog sync, roles/admin policy, Next auth/proxy และ Backoffice shell
2. [Content, Registry และ Media](/Users/arm/a3/pharmacy-web/docs/superpowers/plans/2026-10-14-pharmacy-poc-02-content-registry-media.md): visual baseline, published content/HTML, registry/requests, safe upload/download/replace และ feature screens
3. [Academy, Conference และ Performance](/Users/arm/a3/pharmacy-web/docs/superpowers/plans/2026-10-14-pharmacy-poc-03-academy-conference-performance.md): atomic mock transitions, member identity, Conference adapter, public auth rendering และ comparable performance evidence
4. [Migration, Deployment และ Handoff](/Users/arm/a3/pharmacy-web/docs/superpowers/plans/2026-10-14-pharmacy-poc-04-migration-deployment.md): inventory/mapping/copy/reconciliation, new projects, controlled cutover/restore และ vendor docs

## ลำดับ execution ที่ใช้จริง

- [ ] เก็บ source versions/overrides และworking-tree state; สร้าง isolated workspaceสำหรับ monorepoใหม่ตามexecution skill ไม่แก้repositoriesเดิมหรือcopy `.git`/real`.env`/buildoutputs
- [ ] แผน01Task1: copy sourceเดิมและวางworkspace/contracts โดยคงappbehavior; แผน02Task1: รันlegacyappsกับofflinefixturesและเก็บvisual/flow/font/performancebaselineก่อนbehaviorchanges
- [ ] แผน01Tasks2–7: config/appfactory, Accessschema0008, sessions/catalog/adminsafety, Nextcookie/CSRFและfiniteproxy/transport
- [ ] แผน02Tasks2–6: contracts/guards/publication/registry/requestsและMediaports; Task5Step4aส่งbrowseruploadhelperให้แผน01Task8; ทำแผน01Task8ก่อนแผน02Task7screenintegration ห้ามdeployintermediateformsที่ยังส่งfilebytesผ่านNext
- [ ] ทำแผน02Task8รวมcache-retry schemaให้ครบและfreeze reviewed0009/media/interfacesก่อนแผน03Task2สร้าง0010; Task03Task1contractworkเริ่มได้เมื่อportsนิ่ง แต่ไม่apply0010ก่อน0009เสร็จ
- [ ] แผน03Tasks1–6: Academy/member/Conference/publicauth/performance; ปิดfocusedtests/build/typecheck/visualทั้งสามแอป พร้อมpublicpackageconsumer/boundarychecks
- [ ] แผน04Tasks1–3: สร้างและทดสอบmigrationtoolingด้วยdisposableDB/fakestorageก่อนlivewrites; เริ่มread-onlyinventoryเมื่อมีsourceaccessได้ แต่canonicalmappingต้องใช้schemaที่freezeแล้ว
- [ ] แผน04Task4Steps1–5: preflightและprovisionnewSupabase/GitHub/Vercel/Render; จึงแผน04Task3Step5rehearsal/import/copy/verify และTask4Step6deployedacceptance อย่าสลับliveapplyมาก่อนมีtarget
- [ ] แผน04Task5: finalwriterfreeze/snapshot/delta/reconcile/cutover/restoreexercise และfreshadminsetup; Task6: handoffที่อ้างactualcommands/resultsและPOClimits

ทุกtaskใช้testsตามแผนย่อยและcommitที่reviewได้; schema numberingคง0000–0007เดิม ต่อ0008_staff_access→0009_media→0010_academy_commands ไม่claimlivepolicy/performanceจากfixturetests

## สิ่งที่ยังต้องเตรียม

ข้อกำหนดที่มีผลต่อdesignหลักครบแล้ว ยังไม่ต้องส่งrawsecretsในchat รายการต่อไปนี้ใช้เมื่อถึงmigration/deploy:

- สิทธิ์/owneraccountของGitHub,Vercel,Render,Supabase และชื่อrepo/project; customdomainเป็นoptional ถ้ายังไม่กำหนดใช้providerdomainsสำหรับPOC
- ReadaccessของNeonและstorageเดิมสำหรับactualschema/objectinventory; ตรวจจำนวน/ขนาดfiles, URLrefs, schema driftและdataqualityก่อนapply ถ้าพบexceptionต้องreviewmappingโดยไม่ทำข้อมูลหาย
- PrivateoperatorconfigสำหรับDB/storage/JWT/session/bridge keys และแผนrotationค่าที่เคยแชร์/commit; Conferenceต้องประสานpublicverificationkeyกับเพื่อนก่อนbridgeใหม่ใช้liveauth
- Credentialsของfreshadminตอนsetup รับผ่านช่องทางที่ไม่log/commit และช่วงหยุดtestwritesสำหรับfinalsnapshot; ไม่ต้องกำหนดก่อนเริ่มrefactor

Speccoverage: §§1–3→01Task1/ทุกdomain/04Task6; §§4–6→01Tasks2–8/03Tasks3/5; §7→02Tasks2–8/03Tasks1–4; §8→03Task5; §9→04Tasks1–3/5; §10→02Tasks1/7/8/03Task6; §11→04Tasks4–6; §12→review/execution gateของชุดนี้

## Review และวิธีลงมือ

- **Subagent-driven — แนะนำ:** agentใหม่ทำแต่ละtask มีreviewerตรวจแต่ละtaskก่อนถัดไปและreviewทั้งbranchตอนจบ ใช้contextมากกว่า เหมาะกับงานนี้ที่auth/media/data/interfacesมีผลต่อกัน
- **Native:** rootทำทุกtaskในsessionนี้และมีindependentreviewerตรวจbranchตอนจบ ใช้contextน้อยและมักเร็วกว่า แต่ไม่มีindependentreviewระหว่างแต่ละtask

ผู้ใช้ตรวจชุดแผน รวมuploadticketexception และเลือกexecutionmethodก่อนเริ่มproductimplementation; การเห็นชอบเอกสารไม่ใช่หลักฐานว่าปัญหาโครงสร้างถูกแก้แล้ว
