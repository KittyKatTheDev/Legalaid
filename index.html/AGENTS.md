# Business Logic: Case Complexity & Roadmap (Renewals)

## Complexity Assessment Rules
The complexity of a renewal case is determined during the intake flow (Question 4).

### Low Complexity
- **Criteria**: User selects "None / Straightforward Case".
- **Visual Indicator**: Green color.
- **Messaging**: "Your case looks straightforward. You can follow our automated guide or speak with an advisor for extra peace of mind."
- **CTA**: Optional advisor consultation.

### High Complexity
- **Criteria**: User selects any complicating factor, such as:
    - Criminal Record
    - Prior Denials
    - Missing Evidence
    - Tight Deadlines
- **Visual Indicator**: Red color (animated pulse).
- **Messaging**: "This case may be complex — please consult a lawyer."
- **CTA**: Prominent recommendation to consult a lawyer (Links to Premium/Lawyer path).

## Estimated Timeline
- **Default for Renewals**: 8–14 months.
- **Other Cases**: 12–18 months (base estimate).
- Note: Timelines are dynamic and can be updated by administrators via translation files or direct user data modification.

## Integration Guide
1. **Intake Flow**: `src/screens/IntakeFlow.tsx` collects the data and determines complexity in `handleContinue`.
2. **Case Summary**: `src/screens/IntakeFlow.tsx` (CaseSummary component) displays the results.
3. **Roadmap**: `src/screens/Journey.tsx` provides the multi-step visual guide.
4. **Data Model**: `UserData` in `src/types.ts` holds the following fields:
    - `complexity`: String ('Low' | 'High')
    - `estimatedTimeline`: String (e.g., '8-14 months')
    - `caseFactors`: Array of strings explaining the complexity rating.
