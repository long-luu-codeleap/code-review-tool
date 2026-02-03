# Manual Test Plan - Claude Quality Improvements

## Test Scenarios

### Test 1: Claude Primary
- Setup: Valid ANTHROPIC_API_KEY
- Expected: All passes use Claude, ~30-40s, specific feedback

### Test 2: Groq Fallback
- Setup: Remove ANTHROPIC_API_KEY
- Expected: Falls back to Groq, still works

### Test 3: Validation Retry
- Expected: Console shows validation failures and retries

## Success Criteria
- [ ] Claude used as primary
- [ ] Graceful fallback works
- [ ] Pass 3 uses Claude only
- [ ] Validation catches generic feedback
- [ ] Source compression reduces tokens
