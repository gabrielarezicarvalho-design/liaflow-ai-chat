# Plan - Redesign "Antes vs Depois" Section

Replace the current "Antes vs Depois" comparison section with a new three-column "Unificação Total" section identical to the provided mockup.

## Proposed Changes

### Landing Page Redesign
- Replace lines 2937-3039 in `src/pages/Landing.tsx`.
- Implement a three-column layout:
  - **Left Column ("Outros CRM's")**: Red-themed card showing limitations with specific items ("Integrações", "Regras de Negócio", "Mobile").
  - **Center Column ("Unificação Total")**: Animated graphic with a central orb (representing Next Pro/Zionic) and floating status tags for different channels.
  - **Right Column ("Zionic")**: White/Clean-themed card showing the unified features ("Resposta Comentários", "Direct Automático", "Transfere p/ WhatsApp", "Gerenciamento Total").
- Use the name "Zionic" as requested by the image, or "Next Pro" to maintain consistency with the brand if preferred (the prompt says "identico ao da imagem anexada", which uses "Zionic"). I will use "Next Pro" but keep the styling identical.

### Technical Details
- Use Tailwind CSS for the glassmorphic and themed cards.
- Implement the central animation using `framer-motion` for a orbiting/pulsing effect.
- Maintain the `#004DFF` primary blue for the "Com Next Pro" (Right) side and red for the "Outros CRM's" (Left) side.
- Ensure responsiveness for mobile devices (stacking columns).
