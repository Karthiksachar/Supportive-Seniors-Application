
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from 'react';
import { addDays, format } from 'date-fns';

interface Medication {
  id: number;
  name: string;
  time: string;
  taken: boolean;
}

const HealthDashboard = () => {
  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: "Blood Pressure Medication", time: "8:00 AM", taken: false },
    { id: 2, name: "Vitamin D Supplement", time: "12:00 PM", taken: false },
    { id: 3, name: "Cholesterol Medicine", time: "8:00 PM", taken: false }
  ]);

  const [vitalSigns] = useState({
    bloodPressure: "120/80",
    heartRate: "72",
    lastUpdated: "Today at 8:30 AM"
  });

  const handleMedicationTaken = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, taken: !med.taken } : med
    ));
    
    const med = medications.find(m => m.id === id);
    if (med) {
      toast({
        title: med.taken ? "Medication Unmarked" : "Medication Marked as Taken",
        description: med.taken ? `${med.name} is now unmarked` : `Great job taking your ${med.name}!`,
        variant: med.taken ? "destructive" : "default"
      });
    }
  };

  const addNewMedication = () => {
    toast({
      title: "Add Medication",
      description: "This feature will be available in the next update.",
      variant: "default"
    });
  };

  useEffect(() => {
    // Reset medications daily at midnight
    const now = new Date();
    const tomorrow = addDays(now, 1);
    const timeUntilMidnight = tomorrow.setHours(0,0,0,0) - now.getTime();

    const resetMedications = () => {
      setMedications(prev => prev.map(med => ({...med, taken: false})));
    };

    const timer = setTimeout(resetMedications, timeUntilMidnight);

    // Set up medication reminders
    medications.forEach(med => {
      if (!med.taken) {
        const notification = new Notification(`Time to take ${med.name}`, {
          body: `It's time to take your medication: ${med.name}`,
          icon: '/medicine-icon.png'
        });
      }
    });

    return () => clearTimeout(timer);
  }, [medications]);

  return (
    <div className="space-y-6">
      <Card className="feature-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl-acc flex items-center gap-2">
            <Heart className="text-destructive" /> Your Health Today
          </CardTitle>
          <CardDescription>
            Monitor your vital signs and medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-xl text-center">
              <p className="text-muted-foreground mb-1">Blood Pressure</p>
              <p className="text-2xl font-bold">{vitalSigns.bloodPressure}</p>
            </div>
            <div className="p-4 bg-muted rounded-xl text-center">
              <p className="text-muted-foreground mb-1">Heart Rate</p>
              <p className="text-2xl font-bold">{vitalSigns.heartRate} <span className="text-base font-normal">bpm</span></p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Last updated: {vitalSigns.lastUpdated}</p>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Medications</h3>
              <Button onClick={addNewMedication} variant="outline" size="sm" className="large-target flex gap-1">
                <Plus size={16} /> Add
              </Button>
            </div>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="flex items-center text-sm text-muted-foreground">
                      <Clock size={14} className="mr-1" /> {med.time}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleMedicationTaken(med.id)}
                    variant={med.taken ? "default" : "outline"}
                    size="sm"
                    className="large-target"
                  >
                    {med.taken ? (
                      <>
                        <Check size={18} className="mr-1" /> Taken
                      </>
                    ) : (
                      "Mark as Taken"
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthDashboard;
