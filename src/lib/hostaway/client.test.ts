import { describe, expect, it, vi } from "vitest";

import {
  acquireToken,
  HostawayApiError,
  listReservations,
} from "@/lib/hostaway/client";

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

describe("acquireToken", () => {
  it("posts client credentials as form data with scope general", async () => {
    const fetchImpl = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        jsonResponse({ access_token: "tok_123" }),
    );

    const token = await acquireToken({
      accountId: "594701",
      apiKey: "secret",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      warmupMs: 0,
    });

    expect(token).toBe("tok_123");
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.hostaway.com/v1/accessTokens");
    const body = new URLSearchParams(init.body as string);
    expect(body.get("grant_type")).toBe("client_credentials");
    expect(body.get("client_id")).toBe("594701");
    expect(body.get("client_secret")).toBe("secret");
    expect(body.get("scope")).toBe("general");
  });

  it("names the dashboard page to check when the credentials are refused", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, 401));
    await expect(
      acquireToken({
        accountId: "x",
        apiKey: "y",
        fetchImpl: fetchImpl as unknown as typeof fetch,
        warmupMs: 0,
      }),
    ).rejects.toThrow(/Settings > Hostaway API/);
  });

  it("rejects a 200 that carries no token rather than returning undefined", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ status: "success" }));
    await expect(
      acquireToken({
        accountId: "x",
        apiKey: "y",
        fetchImpl: fetchImpl as unknown as typeof fetch,
        warmupMs: 0,
      }),
    ).rejects.toBeInstanceOf(HostawayApiError);
  });

  it("waits before returning, because a fresh token 403s for a second", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ access_token: "tok" }),
    );
    const started = Date.now();
    await acquireToken({
      accountId: "x",
      apiKey: "y",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      warmupMs: 40,
    });
    expect(Date.now() - started).toBeGreaterThanOrEqual(35);
  });
});

describe("listReservations", () => {
  it("sends the listing and arrival window and unwraps result", async () => {
    const fetchImpl = vi.fn(
      async (_url: string, _init?: RequestInit) =>
        jsonResponse({ result: [{ id: 1 }, { id: 2 }] }),
    );

    const out = await listReservations({
      token: "tok",
      listingId: "594702",
      arrivalStartDate: "2026-08-01",
      arrivalEndDate: "2026-09-30",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(out).toHaveLength(2);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("listingId=594702");
    expect(url).toContain("arrivalStartDate=2026-08-01");
    expect(url).toContain("arrivalEndDate=2026-09-30");
    expect(
      (init.headers as Record<string, string>).Authorization,
    ).toBe("Bearer tok");
  });

  it("pages until a short page rather than trusting count", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ count: 2, result: [{ id: 1 }, { id: 2 }] }),
      )
      .mockResolvedValueOnce(jsonResponse({ count: 2, result: [{ id: 3 }] }));

    const out = await listReservations({
      token: "tok",
      listingId: "594702",
      arrivalStartDate: "2026-01-01",
      arrivalEndDate: "2026-12-31",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      pageSize: 2,
    });

    // `count` said 2, but there were 3. Honouring it would have lost
    // a booking, which on a statement is missing revenue.
    expect(out.map((r) => r.id)).toEqual([1, 2, 3]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("stops at maxPages so a paging bug cannot loop forever", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ result: [{ id: 1 }, { id: 2 }] }),
    );

    const out = await listReservations({
      token: "tok",
      listingId: "594702",
      arrivalStartDate: "2026-01-01",
      arrivalEndDate: "2026-12-31",
      fetchImpl: fetchImpl as unknown as typeof fetch,
      pageSize: 2,
      maxPages: 3,
    });

    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(out).toHaveLength(6);
  });

  it("throws on a rejected request instead of reporting zero bookings", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, 403));
    await expect(
      listReservations({
        token: "stale",
        listingId: "594702",
        arrivalStartDate: "2026-01-01",
        arrivalEndDate: "2026-12-31",
        fetchImpl: fetchImpl as unknown as typeof fetch,
      }),
    ).rejects.toBeInstanceOf(HostawayApiError);
  });
});
