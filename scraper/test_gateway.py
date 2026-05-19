#!/usr/bin/env python3
"""
Diagnostic script for Atlas AI Gateway "Unsanctioned endpoint" error.
Tests the Gateway with both header and URL-path endpoint identifier formats.
"""

import os
import json
import urllib.request
import urllib.error

GATEWAY_BASE_URL = "https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1"
# Per Atlas docs: Bearer token = the LLM provider's actual API key (OpenAI key), NOT the Firewall Proxy key
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
ENDPOINT_ID = os.environ.get("ATLAS_GATEWAY_ENDPOINT_ID", "tadeo-demo-openai")

SIMPLE_PAYLOAD = json.dumps({
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say 'Atlas Gateway test OK' and nothing else."}],
    "max_tokens": 20,
}).encode()


def test_request(label: str, url: str, api_key: str = "", extra_headers: dict = {}):
    print(f"\n{'='*60}")
    print(f"TEST: {label}")
    print(f"URL:  {url}")
    key_display = f"{api_key[:8]}...{api_key[-4:]}" if len(api_key) > 12 else "(empty)"
    print(f"Bearer: {key_display}")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        **extra_headers,
    }
    print("HEADERS:")
    for k, v in headers.items():
        if k == "Authorization":
            print(f"  {k}: Bearer {key_display}")
        else:
            print(f"  {k}: {v}")

    req = urllib.request.Request(url, data=SIMPLE_PAYLOAD, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode()
            print(f"STATUS: {resp.status}")
            print("RESPONSE:")
            try:
                print(json.dumps(json.loads(body), indent=2))
            except Exception:
                print(body[:500])
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"STATUS: {e.code} {e.reason}")
        print("ERROR BODY:")
        try:
            print(json.dumps(json.loads(body), indent=2))
        except Exception:
            print(body[:500])
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    print(f"Gateway URL:  {GATEWAY_BASE_URL}")
    print(f"Endpoint ID:  {ENDPOINT_ID}")
    key_display = f"{OPENAI_API_KEY[:8]}...{OPENAI_API_KEY[-4:]}" if len(OPENAI_API_KEY) > 12 else "(not set — export OPENAI_API_KEY)"
    print(f"OpenAI Key:   {key_display}")

    if not OPENAI_API_KEY:
        print("\nERROR: OPENAI_API_KEY environment variable is not set.")
        print("Export it and re-run: export OPENAI_API_KEY=sk-proj-...")
        exit(1)

    # Test 1: correct pattern per Atlas docs — OpenAI key as Bearer + endpoint identifier header
    test_request(
        label="OpenAI key as Bearer + endpoint identifier header (correct pattern)",
        url=f"{GATEWAY_BASE_URL}/chat/completions",
        api_key=OPENAI_API_KEY,
        extra_headers={"x-alltrue-llm-endpoint-identifier": ENDPOINT_ID},
    )

    # Test 2: OpenAI key as Bearer + endpoint identifier in URL path
    test_request(
        label="OpenAI key as Bearer + endpoint identifier in URL path",
        url=f"{GATEWAY_BASE_URL}/endpoint/{ENDPOINT_ID}/chat/completions",
        api_key=OPENAI_API_KEY,
    )

    # Test 3: OpenAI key as Bearer, no endpoint identifier (see if auth passes at least)
    test_request(
        label="OpenAI key as Bearer, no endpoint identifier",
        url=f"{GATEWAY_BASE_URL}/chat/completions",
        api_key=OPENAI_API_KEY,
    )
