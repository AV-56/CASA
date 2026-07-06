// Jab app production me hogi (Render par), tab ye automatically apne hi domain pe call karega ('')
// Jab hum local PC par dev kar rahe honge, tab ye 'http://localhost:5000' use karega
export const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
