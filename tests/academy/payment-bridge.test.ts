// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextRequest } from 'next/server';
import type { VerifiedPharmacyIdentity } from '@/lib/server/pharmacy-auth/adapter';
const { identity, sign } = vi.hoisted(() => ({
  identity: { provider: 'pharmacy-council', subject: 'test-user', pharmacistLicense: '11111', firstName: 'Test', lastName: 'Member' },
  sign: vi.fn().mockResolvedValue('signed-member-token'),
}));
vi.mock('@/lib/api', () => ({API_BASE_URL: 'https://shared-api.test'}));
vi.mock('@/lib/server/conference-assertion', () => ({signPharmacyAssertion: sign}));
vi.mock('@/lib/server/pharmacy-auth/session', () => ({readPharmacySession: () => ({status: 'valid', identity})}));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.clearAllMocks(); });
describe('Academy payment bridge', () => {
  it('uses the shared API and signs the authenticated identity without Academy environment settings', async () => {
    vi.stubEnv('ACADEMY_BRIDGE_KEY', '');
    const upstream = vi.fn().mockResolvedValue(Response.json({success: true, status: 'paid'}));
    vi.stubGlobal('fetch', upstream);
    const { POST } = await import('@/app/api/academy/courses/[id]/order/route');
    const request = {json: async () => ({pharmacistLicense: '99999', displayName: 'Spoofed'})} as NextRequest;
    const response = await POST(request, {params: Promise.resolve({id: '87'})});
    expect(response.status).toBe(200);
    const [url, init] = upstream.mock.calls[0];
    expect(url).toBe('https://shared-api.test/academy/member/orders');
    expect(JSON.parse(init.body)).toMatchObject({courseId: 87, pharmacistLicense: '11111', displayName: 'Test Member'});
    expect(init.headers.get('authorization')).toBe('Bearer signed-member-token');
    expect(sign).toHaveBeenCalledWith(identity, 'pharmacy-academy-api');
  });
  it('preserves a configured bridge key', async () => {
    vi.stubEnv('ACADEMY_BRIDGE_KEY', 'test-bridge-key');
    const upstream = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal('fetch', upstream);
    const { academyMember } = await import('@/lib/server/academy-bridge');
    await academyMember('/academy/member/enrollments', undefined, identity as VerifiedPharmacyIdentity);
    expect(upstream.mock.calls[0][1].headers.get('x-academy-bridge')).toBe('test-bridge-key');
    expect(sign).not.toHaveBeenCalled();
  });
  it('reports connection failure without an unhandled 500', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { academyMember } = await import('@/lib/server/academy-bridge');
    const response = await academyMember('/academy/member/orders');
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({message: expect.stringContaining('เชื่อมต่อ Academy API ไม่สำเร็จ')});
  });
});
