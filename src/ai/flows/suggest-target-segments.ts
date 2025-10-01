'use server';

/**
 * @fileOverview Suggests potential market segments for a business based on its type and products.
 *
 * - suggestMarketSegments - A function that suggests market segments.
 * - SuggestMarketSegmentsInput - The input type for the suggestMarketSegments function.
 * - SuggestMarketSegmentsOutput - The return type for the suggestMarketSegments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMarketSegmentsInputSchema = z.object({
  businessType: z
    .string()
    .describe('The type of business (e.g., F&B, Fashion, Jasa).'),
  products: z
    .string()
    .describe('The products sold by the business (e.g., clothing, food).'),
});
export type SuggestMarketSegmentsInput = z.infer<
  typeof SuggestMarketSegmentsInputSchema
>;

const SuggestMarketSegmentsOutputSchema = z.object({
  marketSegments: z
    .array(z.string())
    .describe('A list of potential market segments for the business.'),
});
export type SuggestMarketSegmentsOutput = z.infer<
  typeof SuggestMarketSegmentsOutputSchema
>;

export async function suggestMarketSegments(
  input: SuggestMarketSegmentsInput
): Promise<SuggestMarketSegmentsOutput> {
  return suggestMarketSegmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMarketSegmentsPrompt',
  input: {schema: SuggestMarketSegmentsInputSchema},
  output: {schema: SuggestMarketSegmentsOutputSchema},
  prompt: `You are a marketing expert. Suggest potential market segments for a business based on its type and products.

Business Type: {{{businessType}}}
Products: {{{products}}}

Suggest at least 3 market segments. And write it in Indonesian languange.`,
});

const suggestMarketSegmentsFlow = ai.defineFlow(
  {
    name: 'suggestMarketSegmentsFlow',
    inputSchema: SuggestMarketSegmentsInputSchema,
    outputSchema: SuggestMarketSegmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
