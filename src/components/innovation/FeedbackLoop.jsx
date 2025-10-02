'use client';
import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { updateProjectData } from '@/lib/project-storage';
import { useToast } from '@/hooks/use-toast';



export function FeedbackLoop({ initialData }) {
  const [feedbacks, setFeedbacks] = useState(initialData?.currentFeedbacks || []);
  const [iterationHistory, setIterationHistory] = useState(initialData?.iterations || []);
  const [lastIterationDate, setLastIterationDate] = useState(() => {
      if (initialData?.iterations && initialData.iterations.length > 0) {
        // Dates from JSON are strings, need to convert back to Date objects
        const sortedIterations = [...initialData.iterations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return new Date(sortedIterations[0].date);
      }
      return new Date();
  });
  const { toast } = useToast();

  const recommendedNextIteration = addDays(lastIterationDate, 60);

  const saveFeedbackToStorage = (dataToSave) => {
    // MOCK MODE: Save to localStorage
    updateProjectData(currentData => ({
        ...currentData,
        innovation: {
            ...currentData.innovation,
            feedback: {
                ...currentData.innovation?.feedback,
                ...dataToSave,
            }
        }
    }));
    toast({
      title: 'Feedback Updated',
      description: 'Your feedback data has been saved to localStorage.',
    });
  }

  const handleAddFeedback = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newFeedback = {
        id: `fb_${Date.now()}`,
        source: formData.get('source'),
        comment: formData.get('comment'),
        rating: Number(formData.get('rating')),
        date: new Date().toISOString(),
    };
    const updatedFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(updatedFeedbacks);
    saveFeedbackToStorage({ currentFeedbacks: updatedFeedbacks });
    form.reset();
  };

  const startNewIteration = () => {
    const newIteration = {
        id: `iter-${Date.now()}`,
        date: new Date().toISOString(),
        feedbacks: feedbacks,
    };
    const updatedHistory = [newIteration, ...iterationHistory];
    setIterationHistory(updatedHistory);
    setFeedbacks([]); // Reset current feedback for the new cycle
    setLastIterationDate(new Date(newIteration.date)); // Set the date of the new iteration
    
    // MOCK MODE: Save to localStorage
    saveFeedbackToStorage({ iterations: updatedHistory, currentFeedbacks: [] });
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Collect Feedback</CardTitle>
            <CardDescription>Manually input feedback from your customers for the current iteration.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFeedback} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select name="source" required>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketplace">Marketplace</SelectItem>
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Internal Form">Internal Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea id="comment" name="comment" required placeholder="Customer's feedback..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input id="rating" name="rating" type="number" min="1" max="5" required />
              </div>
              <Button type="submit" className="w-full">Add Feedback</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Iteration Cycle</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground">Last iteration started: {format(lastIterationDate, 'PPP')}</p>
                    <p className="text-muted-foreground">
                        Next recommended iteration on: <span className="font-bold text-foreground">{format(recommendedNextIteration, 'PPP')}</span>
                    </p>
                </div>
                <Button onClick={startNewIteration} disabled={feedbacks.length === 0}>Start New Iteration</Button>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Feedback</CardTitle>
            <CardDescription>Feedback collected for the current iteration cycle.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedbacks.length > 0 ? (
              feedbacks.map((fb) => (
                <div key={fb.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{fb.source}</p>
                      <p className="text-sm text-muted-foreground">{fb.comment}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                   <p className="text-xs text-muted-foreground mt-2">{format(new Date(fb.date), 'PPP')}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6">No feedback for this iteration yet.</p>
            )}
          </CardContent>
        </Card>

        {iterationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Iteration History</CardTitle>
              <CardDescription>Review feedback from previous iteration cycles.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {iterationHistory.map((iteration) => (
                  <AccordionItem value={iteration.id} key={iteration.id}>
                    <AccordionTrigger>
                        Iteration of {format(new Date(iteration.date), 'PPP')} ({iteration.feedbacks.length} feedback items)
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {iteration.feedbacks.map((fb) => (
                        <div key={fb.id} className="border p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{fb.source}</p>
                              <p className="text-sm text-muted-foreground">{fb.comment}</p>
                            </div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{format(new Date(fb.date), 'PPP')}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
