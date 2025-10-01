'use server';
/**
 * @fileOverview An AI agent that suggests a unique niche and positioning strategy for a business.
 *
 * - suggestNicheAndPositioning - A function that handles the niche and positioning suggestion process.
 * - SuggestNicheAndPositioningInput - The input type for the suggestNicheAndPositioning function.
 * - SuggestNicheAndPositioningOutput - The return type for the suggestNicheAndPositioning function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNicheAndPositioningInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  businessType: z.string().describe('The type of business (e.g., F&B, Fashion, Jasa).'),
  productsSold: z.string().describe('The products or services sold by the business.'),
  selectedMarketSegments: z
    .array(z.string())
    .describe('The market segments selected by the user.'),
});
export type SuggestNicheAndPositioningInput = z.infer<
  typeof SuggestNicheAndPositioningInputSchema
>;

const SuggestNicheAndPositioningOutputSchema = z.object({
  nicheSuggestion: z.string().describe('A suggested niche for the business.'),
  positioningStatement: z
    .string()
    .describe('A positioning statement for the business.'),
});
export type SuggestNicheAndPositioningOutput = z.infer<
  typeof SuggestNicheAndPositioningOutputSchema
>;

export async function suggestNicheAndPositioning(
  input: SuggestNicheAndPositioningInput
): Promise<SuggestNicheAndPositioningOutput> {
  return suggestNicheAndPositioningFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNicheAndPositioningPrompt',
  input: {schema: SuggestNicheAndPositioningInputSchema},
  output: {schema: SuggestNicheAndPositioningOutputSchema},
  prompt: `You are a marketing expert specializing in niche identification and positioning strategies.

  Based on the information provided about the business and its selected market segments, suggest a unique niche and a positioning statement that will help the business differentiate itself from competitors.

  Business Name: {{{businessName}}}
  Business Type: {{{businessType}}}
  Products Sold: {{{productsSold}}}
  Selected Market Segments: {{#each selectedMarketSegments}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Niche Suggestion:
  Positioning Statement:
  And write it in Indonesian languange. `,
});

const suggestNicheAndPositioningFlow = ai.defineFlow(
  {
    name: 'suggestNicheAndPositioningFlow',
    inputSchema: SuggestNicheAndPositioningInputSchema,
    outputSchema: SuggestNicheAndPositioningOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
