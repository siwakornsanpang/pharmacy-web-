# Pharmacy POC Migration and Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ย้าย backoffice-managed data และรูป/ไฟล์เดิมครบโดยไม่ย้าย staff accounts แล้วเปิด POC ใหม่พร้อมหลักฐานและเอกสารส่งต่อ vendor

**Architecture:** ใช้ migration tooling แยกจาก runtime APIs ทำ inventory→dry-run→rehearsal→reconcile ก่อน final freeze/cutover โดยไม่ให้ feature modules เข้าตารางของกันและกัน Runtime ใช้หนึ่ง modular backend กับสอง Next apps; บัญชี/session ใหม่สร้างผ่าน controlled setup และlegacyConferenceคงexistingRailwayintegrationเฉพาะcompatibilityจนทีมพัฒนาmoduleภายในสามแอป

**Tech Stack:** npm workspaces, Node 24, TypeScript/tsx, pg/Drizzle, PostgreSQL client tools, Supabase Storage adapter, node:test และ acceptance harness จากแผน 02

**Spec:** [Pharmacy POC design](/Users/arm/a3/pharmacy-web/docs/superpowers/specs/2026-10-14-pharmacy-poc-refactor-design.md) — paths เป้าหมายด้านล่าง relative ต่อ monorepo ใหม่; แผน 01–03 ต้องผ่าน isolated checks ก่อน live apply

**Execution order:** Tasks1–3สร้างtoolingและทดสอบด้วยdisposableDB/fakestorageก่อน; Task4Steps1–5ทำpreflight/สร้างnewSupabaseและresourceconfig ก่อนTask3Step5live rehearsal; แล้วจึงTask4Step6ตรวจdeployedreleaseหลังimport และTask5finalfreeze/cutover ไม่ลองimportก่อนมีtargetและไม่ใช้readinessแทนreconciliation

## Global Constraints

- Deadline18ตุลาคม2026ต้องส่งโค้ด+newdeployments; source/cloud read-only preflightเริ่มแต่ต้นก่อนพบblockerช้า; Conferenceภายในเป็นทีมถัดไป ไม่migratefriendDB/storageหรือสร้างstandaloneprojectเพิ่ม ไม่มีcachecallback/envsecretsในreleaseนี้

- “ไม่ย้ายบัญชี login เจ้าหน้าที่เดิม password hashes หรือ sessions/tokens เดิม” — target users เริ่มว่าง; users sequence ใหม่; role names จาก users.role ย้ายเป็น configuration เท่านั้น
- “ย้าย application content/business/configuration ทั้งหมด” — source ปัจจุบัน 37 non-users tables แต่ live schema/dependencies ต้องตรวจจริงก่อน execution
- “Copy actual object bytes กับ metadata แยกจาก SQL restore” — รวม originals/unreferenced objects; DB restore อย่างเดียวไม่ผ่าน
- “ไม่ overwrite Supabase-managed auth/storage/system schemas” — allowed app schema/table/type manifest เท่านั้น ไม่มี --clean ที่ล้าง managed schemas
- “ไม่ drop/deduplicate/regenerate IDs หรือ reassign historical actor โดยเงียบ ๆ” — unresolved drift/orphans/staff refs ต้อง fail preflight ก่อน apply ไม่แก้ข้อมูลเดิมเอง
- “ก่อน final snapshot หยุด test writes/uploads/background writers ชั่วคราว” — เฉพาะระบบหลัก ไม่ freeze หรือ mutate Railway ของเพื่อน
- “ไม่ทิ้งข้อมูลทดสอบที่สร้างใหม่อัตโนมัติ” — หลัง cutover มี writes ให้กลับ compatible app release บน DB ใหม่หรือ reconcile/reverse migration ก่อนกลับ DB เก่า
- “ไม่เปลี่ยน frontend screens” — visual baseline 1440×900 และ 390×844 จากแผน 02; Conference/member mocks ตามแผน 03
- Secrets/dumps/private file bytes อยู่ private artifact directory นอก Git; config จาก secret file/environment ไม่ใส่ credentials ใน command args/logs หรือข้อความใน chat
- API upload metadata ผ่าน Next; file bytes ส่ง Render ด้วย one-use ticket ของแผน 02; ทดสอบ 8 MiB เพื่อยืนยันว่าไม่ติด Vercel 4.5 MB limit

## Review Focus

1. Config สลับ source/target หรือ output อยู่ใน Git ต้องหยุดก่อนเขียน; managed objects/old staff credentials ห้ามถูก restore — Task 1
2. Role ไม่มี grants ที่พบเฉพาะ users.role, leading-zero license และ nested HTML/JSON file refs ต้องไม่หายหรือผูกกับ fresh staff ID — Tasks 1–2
3. Copy ขาดหนึ่งไฟล์/bytes ไม่ตรง/URL ภายนอกมีคำว่า uploads ต้องไม่ทำให้ reconciliation ผ่านหรือแก้ external URLs — Tasks 2–3
4. Restore ล้มกลางทาง, sequence ชน, drift/duplicate/staff ref ที่ยังไม่ map ต้องไม่ cutover หรือทำ source สูญหาย — Tasks 1–3
5. ระบบใหม่มี writes แล้วต้องไม่กลับไป source เก่าโดยไม่เก็บ rows/assets ใหม่; partial env/cookie/key setup ต้องไม่ดูเหมือนพร้อมใช้งาน — Tasks 4–6

---

## Interfaces และ input ที่ต้องมีเมื่อถึง live stage

Consume แผน 01: independent build/start/typecheck/test scripts, migrations 0008_staff_access, controlled bootstrap-admin, catalog:sync, /health + /ready, getServerConfig และ resolveStoredStaffSession(userId,sessionId). Consume แผน 02: domain asset reference policy, Media ports/0009_media และ root test:visual harness. Consume แผน 03: Academy 0010_academy_commands, mock/Conference fixture checks และ performance evidence.

Migration types อยู่ tools/migration/types.ts: MigrationConfig={sourceDb,targetDb,sourceStorage,targetStorage,artifactDir,expectedTargetProjectRef}; MigrationManifest={version:1,snapshotId,tables,roles,sequences,objects,assetReferences,exceptions}; ObjectManifest={bucket,path,size,sha256,mime,visibility,ownerRefs}; ReferenceRewrite={table,rowId,column,jsonPath,oldValue,newValue,assetId} (jsonPath ว่างสำหรับ column ตรง). Config values โหลดจาก MIGRATION_CONFIG_FILE; manifest/outputsอยู่ MIGRATION_ARTIFACT_DIR และ CLI แสดงเฉพาะ counts/hash/status.

เมื่อถึง Task 4 ต้องมี account/workspace ที่ผู้ใช้เป็นเจ้าของหรือให้สิทธิ์บน GitHub/Vercel/Render/Supabase, source Neon/storage read access, ชื่อ repo/projects/domain ถ้าใช้ custom domain และการประสาน public verification key ใหม่กับเพื่อน Conference ค่าเหล่านี้เป็น operator config ไม่เป็น prerequisites ของแผน 01–03 ไม่ขอ raw secrets ใน chat.

### Task 1: Safe inventory และ exclusions

**Files:** Create tools/migration/{types.ts,config.ts,ownership.ts,inventory.ts,cli.ts}, tools/migration/tests/{fixtures.ts,inventory.test.ts}; Modify root package.json scripts migration:inventory/migration:plan/test:migration; Create docs/operations/migration-inputs.md.
**Script:** root `test:migration="node --import tsx --test"`; commandตามแต่ละTaskระบุtestfilesexplicitlyและfixturesปฏิเสธTEST_DATABASE_URLนอกnamedlocaltestDB `pharmacy_test_*`; migration CLIs ใช้ `tsx tools/migration/cli.ts <subcommand>` และอ่านconfigfile/secret-envไม่รับrawcredentialsผ่านargs
**Interfaces:** getMigrationConfig(file:string):MigrationConfig; inventorySource(config:MigrationConfig):Promise<MigrationManifest>; assertMigrationSafety(config,manifest):void; cli defaults dry-run. Ownership list ครบ source tables/types แต่ exclusions ระบุ users rows/hash/sequence และ sessions; capture distinct role names โดยไม่อ่าน password_hash.
- [ ] **Step 1 — RED:** สร้าง source/target disposable PostgreSQL fixtures กับ fake storage; assert source=target, output ใน Git, unknown managed schema, unhandled created_by staff ref หรือ live extra column → throw ก่อน write; role-only legacy account ส่งเฉพาะ role name และ leading-zero license ไม่ถูกแปลงเป็น number.
```ts
assert.equal(manifest.roles.includes('zero_grant_role'), true);
assert.equal(JSON.stringify(manifest).includes('password_hash'), false);
assert.equal(writes.length, 0); // safety failure
assert.equal(licenses[0], '00000');
```
- [ ] **Step 2 — Run RED:** npm run test:migration -- tools/migration/tests/inventory.test.ts; expected FAIL missing functions/unsafe exclusions ไม่ใช่ connection ไป DB จริง.
- [ ] **Step 3 — Implement:** read-only inventory exact counts/schema/types/relations/triggers/sequence state, approved app table/type list และ SHA256-stream object inventory; artifact directory permission owner-only; config/error redaction; allow target managed schemas แต่ห้าม restore/overwrite; reject credential-bearing refs/logs.
- [ ] **Step 4 — GREEN:** รัน RED command; expected PASS source untouched, no account credentials/old users sequence ใน export plan, unknown staff ref อยู่ exceptions และ apply ถูก block; config missing ไม่มี localhost/production fallback.
- [ ] **Step 5 — Commit:** git add tools/migration docs/operations/migration-inputs.md package.json แล้ว git commit -m "feat: add safe migration inventory and exclusions".

### Task 2: Reference mapping และ classification ที่ไม่ทำข้อมูลหาย

**Files:** Create tools/migration/{references.ts,restore.ts}, tools/migration/tests/{references.test.ts,restore.test.ts}, docs/operations/data-transformations.md.
**Interfaces:** buildReferencePlan(manifest:MigrationManifest):ReferenceRewrite[]; restoreBusinessData(config,manifest,rewrites):Promise<RestoreReport>; RestoreReport={importedTables,excludedStaffRows,recreatedRoles,appliedRewrites,exceptions}; apply requires explicit target-project confirmation + manifest hash.
- [ ] **Step 1 — RED:** fixtures มี source Supabase refs ใน columns/arrays/Quill HTML, shared original/cropped asset, external YouTube/Conference URL ที่มี uploads, private slip, unknown orphan file, duplicate grant และ live drift; assert internal refs mapped once, external untouched, unknown object retained private, target users rows=0, user-only role retained.
```ts
assert.equal(target.users.length, 0); assert.equal(target.roles.includes('zero_grant_role'), true);
assert.equal(target.courseLicense, '00000'); assert.deepEqual(target.businessIds, source.businessIds);
assert.equal(externalUrlAfter, externalUrlBefore); assert.equal(cutoverAllowedWithExceptions, false);
```
- [ ] **Step 2 — Run RED:** npm run test:migration -- tools/migration/tests/references.test.ts tools/migration/tests/restore.test.ts; expected FAIL missing mapping/restoration or unsafe staff import.
- [ ] **Step 3 — Implement:** restore source application data/schema to disposable stagingโดยexcludeusersrowsก่อน; verify historical0000–0007กับactualstaging schemaและreviewdrift/transformations; สร้างemptytargetappschemaด้วยcheckedmigrations0000–0010ครั้งเดียวก่อนimporttransformedbusinessdataแบบdata-onlyในFK-safe transaction/order; ไม่restoreoldDDLทับcanonicaltargetหรือreplaymigrationsซ้ำ รักษาapprovedoriginalrows/IDs/enums/JSON/grants/businesssequences; unresolvedduplicates/extracolumns/actorrefsต้องมีreviewedmappingก่อนapplystricterconstraintsและก่อนimportจริง
- [ ] **Step 4 — Implement:** public refs become stable new storage URLs; private refs persist AssetId/object identity and owning-domain fields, never an expiring signed URL. Register Media asset/pin/reference metadata from the agreed owner/type/slot mapping; zero-grant roles remain, dormant unknown grants stay inert; old users data is excluded rather than reassigned to new users.
- [ ] **Step 5 — GREEN:** Run RED command; expected PASS exact normalized business rows/IDs/relationships, grants preserved, no old staff usernames/hashes/session state, next inserted business ID does not collide, rollback-on-error leaves target unaccepted and source unchanged.
- [ ] **Step 6 — Commit:** git add tools/migration docs/operations/data-transformations.md แล้ว git commit -m "feat: map preserved business data and asset references".

### Task 3: Copy bytes และ deterministic reconciliation

**Files:** Create tools/migration/{storage.ts,reconcile.ts}, tools/migration/tests/{storage.test.ts,reconcile.test.ts}; Modify root package.json scripts migration:copy/migration:apply/migration:verify; Create docs/operations/migration-runbook.md.
**Interfaces:** copyObjects(config,manifest):Promise<CopyReport>; reconcileMigration(config,manifest,rewrites):Promise<ReconciliationReport>; report contains exact counts/ID-set hashes/normalized-data hashes/object size+SHA256 mismatches/sequence errors/exceptions and passed:boolean.
- [ ] **Step 1 — RED:** fake storage + disposable DB inject failure at object N, tamper one byte, missing object, sequence collision, interrupted copy and repeat-run; assert no success/cutover on mismatch, source immutable, completed matching objects skipped safely, all originals/unreferenced objects retained.
```ts
assert.equal(report.passed, false); assert.deepEqual(report.objectMismatches, ['fixture/object.pdf']);
assert.equal(sourceRemoved.length, 0); assert.equal(secondCopy.duplicateWrites, 0);
assert.equal(reportWithBadSequence.passed, false);
```
- [ ] **Step 2 — Run RED:** npm run test:migration -- tools/migration/tests/storage.test.ts tools/migration/tests/reconcile.test.ts; expected FAIL absent byte copy/hash/reconciliation functions.
- [ ] **Step 3 — Implement:** bounded streaming/disk-spool copy using the existing Storage/TUS support where size needs it; checksum actual downloaded bytes, preserve content metadata, classify buckets via plan02 policy, never mark public until allowed. Preflight target maximum object size/storage capacity against source inventory; conflicting target bytes fail rather than overwrite.
- [ ] **Step 4 — GREEN:** run RED command; expected PASS all file/data invariants, safe resume and no deletion. Use synthetic fixture schema representing every owned table for full import reconciliation; actual source size/latency not inferred from unit tests.
- [ ] **Step 5 — Rehearsal:** หลังTask4Steps1–5สร้างnewtargetและมีinputsครบ จึงrun migration:inventory → migration:plan → explicit migration:apply/copy → migration:verify against newisolatedtarget; expected passed:true, zerounresolvedexceptions, usersrows=0beforefreshbootstrap; keepprivatesnapshot/filemanifestsoutsideGitและrecordcounts/hashesonlyinverificationreport
- [ ] **Step 6 — Commit:** git add tools/migration docs/operations/migration-runbook.md package.json แล้ว git commit -m "feat: reconcile migrated rows and storage bytes".

### Task 4: Release configuration และ new projects

**Script:** root `test:deployment="node --import tsx --test"`; `deployment:preflight="tsx tools/deployment/preflight.ts"`; testfixturesไม่มีproviderwriteหรือrealcredentialfallback

**Files:** Create tools/deployment/{config.ts,preflight.ts,database-policy.ts}, tools/deployment/{preflight.test.ts,database-policy.test.ts}, render.yaml, apps/{pharmacy-web,backoffice}/vercel.json, docs/operations/{deployment.md,env-inventory.md}; Modify .github/workflows/ci.yml และ root package.json release:check/deployment:preflight/test:deployment
**Interfaces:** getDeploymentConfig(file:string):DeploymentConfig; DeploymentConfig={githubRepository,vercelPharmacyProject,vercelBackofficeProject,renderService,supabaseProjectRef,frontendOrigins,backendOrigin,customDomains}; validateDeployment(config):Promise<PreflightReport> with no provider writes. Secret values remain outside this DTO/report.
- [ ] **Step 1 — RED:** configtestsrejectoldbackendfallback/partialenv/target-sourcemismatch/wildcardorigins/trackedsecrets/activePOCbypass/privateJWKในpublicenv/inconsistentTTL/invalidfixeduploadorigin; providerfailureต้องไม่reportready ไม่มีcachecallbackconfigในreleaseนี้
- [ ] **Step 2 — Run RED:** npm run test:deployment -- tools/deployment/preflight.test.ts; expected FAIL missing validator.
- [ ] **Step 3 — Implement:** validate required per-app env from plan01 including fixed backend origins, PUBLIC_UPLOAD_BASE_URL, configuredfrontendorigins และisolatedsession/signingkeys ไม่มีrevalidationsecret/callback; run independent build/typecheck/focused tests + root test:visual before deployment. Set Node major24 on Vercel/Render, record actual runtime patch; Vercel manages its own patch updates.
- [ ] **Step 4 — Database/storage policy tooling:** `applyDatabasePolicy(config:MigrationConfig):Promise<void>` ในtools/deployment/database-policy.ts ให้controlledsetupสร้างdedicatedbackendDBprincipalที่มีเฉพาะapptables/sequences/DML; migrationprincipalownsDDL; revokeanon/authenticatedapptableaccessและRLSpolicyเฉพาะbackendprincipal ตามexplicitappmanifest; RED/GREENdisposableDBtests anonSELECTถูกdeny/backendDMLได้/backendDDLdeny/idempotentsetupไม่แตะmanagedschemas; run `npm run test:deployment -- tools/deployment/database-policy.test.ts`; provisionpublic/privatebucketpolicyตามแผน02 เมื่อมีactualtarget ไม่applyก่อนมีproject/schema
- [ ] **Step 5 — Provider setup:** หลังpreflight/ownerinputsสร้างnewSupabaseprojectและrecordrefก่อนlive rehearsal; สร้างprivateGitHubrepoจากsanitizedfreshmonorepohistory, newVercelprojects roots apps/pharmacy-web/apps/backoffice ที่buildcontractsก่อนapp, newRenderservice buildcontracts/backendแล้วstart `npm run start --workspace @pharmacy/backend-api` host0.0.0.0/PORT health/readyตามแผน01; รอcontrolledschemaapplyแล้วapplyDatabasePolicyก่อนเปิดapptarget รักษาoldprojectIDsและrecordnewIDswithoutsecrets
- [ ] **Step 6 — GREEN:** run RED command and deployment:preflight; expected PASS, build/tests/visual checks complete, /health200 and /ready200 after schema/import, anonymous DB/private file denial, public images/docs work, 8MiB ticket upload succeeds without Next body relay. Rotate known shared/committed credentials before use; Conference new verifier public key confirmed with friend before authenticated fixture/live smoke of that bridge, no Railway admin writes by this agent.
- [ ] **Step 7 — Commit:** git add tools/deployment render.yaml apps/pharmacy-web/vercel.json apps/backoffice/vercel.json .github/workflows/ci.yml docs/operations package.json แล้ว git commit -m "chore: prepare isolated POC deployments and policy checks".

### Task 5: Final snapshot, cutover และ restore rehearsal

**Files:** Create tools/migration/{cutover.ts,cutover.test.ts}, docs/operations/{cutover.md,rollback.md}, docs/verification/migration-report.md.
**Interfaces:** evaluateCutover(input:{reconciliation:ReconciliationReport;writersFrozen:boolean;newWrites:boolean;compatibleReleaseAvailable:boolean}):'ready'|'blocked'|'keep-new-db-and-revert-app'|'requires-reconcile'; CLI does not alter routing when blocked.
- [ ] **Step 1 — RED:** assert mismatch/not-frozen→blocked; source snapshot ready/newWrites=false→ready; newWrites=true→keep-new-db-and-revert-app or requires-reconcile; never choose stale source silently.
- [ ] **Step 2 — Run RED:** npm run test:migration -- tools/migration/cutover.test.ts; expected FAIL missing policy.
- [ ] **Step 3 — Implement:** record source writer freeze for backend/storage/background jobs and final snapshot/object inventory; final delta copy/restore/reconcile; enable POC new routes only passed:true. Old owned data stays read-only; Conference is external and unchanged. Immediately re-inventory to detect writes that escaped freeze; block cutover on drift.
- [ ] **Step 4 — Verify:** create fresh admin via controlled CLI after reconciliation, run full role/CRUD/privacy/upload/mock smoke and root test:visual on new environment. Restore a new-environment snapshot to disposable DB/storage target and compare hashes/counts. Before new writes simulate routing rollback; after new writes prove policy retains new data and uses compatible release rather than stale source.
- [ ] **Step 5 — GREEN:** run RED command and migration:verify; expected PASS and private artifacts complete; record snapshot/release IDs, exact exclusions/transformations, file/data hashes and tested rollback limits. No post-cutover old DB reset or blanket force-delete.
- [ ] **Step 6 — Commit:** git add tools/migration/cutover* docs/operations/cutover.md docs/operations/rollback.md docs/verification/migration-report.md แล้ว git commit -m "docs: verify cutover and data-preserving restore".

### Task 6: Vendor handoff และ final coverage

**Files:** Create docs/development/{setup.md,add-module.md}, docs/architecture/{data-ownership.md,service-extraction.md}, docs/verification/{acceptance.md,known-limitations.md}; Modify README.md และcopiedhistoricalarchitecture/conferencedocs; consume add-conference-module.mdจากแผน03Task5
**Interfaces:** handoff links completed commands/results, fixture hashes/release IDs, ownership/interface maps and mock/infrastructure boundaries; no actual backups/secrets in repository.
- [ ] **Step 1 — Verify:** clean disposable checkout can npm ci/build/typecheck/test, setup named test DB, bootstrap test staff, run catalog:sync twice without grant changes, add a sample capability/module in a throwaway branch and observe admin catalog with nonadmin denied by default; do not ship dummy tab.
- [ ] **Step 2 — Assemble:** include per-app env inventory, new resource IDs/ownership, DTO/version/capability workflow, table/transaction boundaries, migration/restore evidence, UI/performance comparison and private artifact custody instructions; historicalConference/Axiosdocsชี้currentfetch/minimallegacyadapterและfutureConferencemoduleภายในสามแอป.
- [ ] **Step 3 — Close evidence gaps:** distinguish actual live checks from fixture-only Conference checks and source baselines; record numeric metrics only measured under matching data/env, declare real member/payment/staff SSO/server production setup vendor work. Any failed required check prevents completed-Poc claim.
- [ ] **Step 4 — Commit:** git add README.md docs/development docs/architecture docs/verification แล้ว git commit -m "docs: hand off reproducible POC and extraction boundaries".

## Execution inputs และ limitations

ตอนเขียนแผนนี้ gh/node/npm/psql/pg_dump/pg_restore พบในเครื่อง แต่ provider login/access, actual schema/object inventory, new resource names/domains, project size/policies และ Conference verification-key change ยังไม่ได้ตรวจ CLI supabase/vercel ยังไม่พบ; ใช้ supported connector/provider UI หรือจัด CLI ในขั้น execution เมื่อจำเป็น ไม่ติดตั้งในรอบ planning.

Plan tests/commands เป็นสิ่งที่จะทำ ไม่ใช่ผลที่ผ่านแล้ว แผนนี้ยังไม่สร้าง GitHub/Vercel/Render/Supabase ไม่ใช้ live credentials ไม่ dump/ย้าย/delete data และไม่เปลี่ยน env ของระบบเดิม.
