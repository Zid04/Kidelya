import AppearanceToggleTab from "@/components/apparence-tabs"
import Heading from "@/components/Heading"

export default function AppearanceSettingsPage() {
  return (
    <div className="space-y-6">
      <Heading
        variant="small"
        title="Paramètres d’apparence"
        description="Personnalisez l’apparence de votre espace Kidelya"
      />

      <AppearanceToggleTab />
    </div>
  )
}
