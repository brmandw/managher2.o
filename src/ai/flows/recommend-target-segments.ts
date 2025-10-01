'use server';

/**
 * @fileOverview A flow that recommends the best two market segments based on purchasing power, market size, and accessibility.
 *
 * - recommendTargetSegments - A function that handles the market segment recommendation process.
 * - RecommendTargetSegmentsInput - The input type for the recommendTargetSegments function.
 * - RecommendTargetSegmentsOutput - The return type for the recommendTargetSegments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTargetSegmentsInputSchema = z.object({
  businessType: z.string().describe('The type of business (e.g., F&B, Fashion, Jasa).'),
  productsSold: z.string().describe('A description of the products sold by the business.'),
  marketSegments: z.array(z.string()).describe('A list of potential market segments identified.'),
});
export type RecommendTargetSegmentsInput = z.infer<typeof RecommendTargetSegmentsInputSchema>;

const RecommendTargetSegmentsOutputSchema = z.object({
  recommendedSegments: z.array(
    z.object({
      segment: z.string().describe('The name of the recommended market segment.'),
      reason: z.string().describe('The reason for recommending this segment.'),
    })
  ).length(2).describe('The two best market segments recommended for targeting.'),
});
export type RecommendTargetSegmentsOutput = z.infer<typeof RecommendTargetSegmentsOutputSchema>;

export async function recommendTargetSegments(input: RecommendTargetSegmentsInput): Promise<RecommendTargetSegmentsOutput> {
  return recommendTargetSegmentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTargetSegmentsPrompt',
  input: {schema: RecommendTargetSegmentsInputSchema},
  output: {schema: RecommendTargetSegmentsOutputSchema},
  prompt: `You are an expert marketing consultant specializing in market segmentation and targeting.

You will analyze the provided business type, products sold, and potential market segments to recommend the two best segments for the business to target.
Your recommendation will be based on factors such as purchasing power, market size, and accessibility, ensuring data-driven decisions.

Business Type: {{{businessType}}}
Products Sold: {{{productsSold}}}
Potential Market Segments: {{#each marketSegments}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on this information, recommend the two best market segments to target, and explain your reasoning for each recommendation.

Output the recommended segments in JSON format. Each segment object should include the segment name and the reason for recommending that segment.
Ensure that the recommendedSegments array contains exactly two segments. And write it in Indonesian languange.
`,
});

const recommendTargetSegmentsFlow = ai.defineFlow(
  {
    name: 'recommendTargetSegmentsFlow',
    inputSchema: RecommendTargetSegmentsInputSchema,
    outputSchema: RecommendTargetSegmentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
