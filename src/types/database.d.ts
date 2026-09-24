interface User {
  _id: string;
  phoneNumber: string;
  password: string;
  name: string;
  avatar?: string;
  medications: Medication[];
  contacts: Contact[];
  healthData: HealthData;
}

interface Medication {
  _id: string;
  name: string;
  time: string;
  taken: boolean;
  reminderEnabled: boolean;
  lastTaken?: Date;
}

interface HealthData {
  bloodPressure: string;
  heartRate: string;
  lastUpdated: Date;
}