import RegistrationComponent from "@/components/settings/registration/registration-component";
import { getRegistration } from "@/lib/data";

export default async function Registration() {
  const registration = await getRegistration();
  return <RegistrationComponent data={registration} />;
}
