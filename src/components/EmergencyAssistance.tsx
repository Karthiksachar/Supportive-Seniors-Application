
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Shield, UserRound, Users, Plus, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
}

const EmergencyAssistance = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "Ruthu Raj", relation: "Son", phone: "9742664167" },
    { id: 2, name: "Malvika", relation: "Wife", phone: "7899750008" },
    { id: 3, name: "Pravesh", relation: "Brother", phone: "9345237829" },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '',
    relation: '',
    phone: ''
  });

  const handleEmergencyCall = () => {
    toast({
      title: "Emergency Simulation",
      description: "In a real application, this would initiate an emergency call to 911.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const callContact = (contact: Contact) => {
    toast({
      title: `Calling ${contact.name}`,
      description: `Simulating a call to ${contact.phone}`,
      duration: 3000,
    });
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.relation || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: '', relation: '', phone: '' });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "New contact added successfully",
      duration: 3000,
    });
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Deleted",
      description: "Emergency contact has been removed",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="feature-card bg-destructive/5 border-destructive/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl-acc flex items-center gap-2">
            <Shield className="text-destructive" /> Emergency Assistance
          </CardTitle>
          <CardDescription>
            Quick access to help when you need it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full py-8 text-xl large-target mb-6"
            variant="destructive"
            onClick={handleEmergencyCall}
          >
            <Phone size={28} className="mr-3" /> Emergency Call (911)
          </Button>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Emergency Contacts</h3>
          
          <div className="space-y-3 mb-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="p-3 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.relation} • {contact.phone}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="large-target"
                    onClick={() => callContact(contact)}
                  >
                    <Phone size={16} className="mr-1" /> Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="large-target"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <X size={16} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {showAddForm ? (
            <div className="space-y-3 border rounded-lg p-4 mb-4">
              <Input
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
              />
              <Input
                placeholder="Relation"
                value={newContact.relation}
                onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
              />
              <Input
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
              />
              <div className="flex gap-2">
                <Button 
                  variant="default"
                  className="flex-1"
                  onClick={handleAddContact}
                >
                  Add Contact
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewContact({ name: '', relation: '', phone: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline"
              className="w-full large-target"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} className="mr-2" /> Add Emergency Contact
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyAssistance;
