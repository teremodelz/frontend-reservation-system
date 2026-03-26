import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function WelcomeTablesTutorPage() {
  return (
   <div className='flex items-center justify-center p-8'>
  <Tabs defaultValue="lekcja" className="w-full max-w-3xl">
    <TabsList className="w-full h-14">
      <TabsTrigger value="lekcja" className="flex-1 h-full text-lg">Lekcja</TabsTrigger>
      <TabsTrigger value="nasi-nauczyciele" className="flex-1 h-full text-lg">Nasi nauczyciele</TabsTrigger>
      <TabsTrigger value="gwarancja" className="flex-1 h-full text-lg">Gwarancja jakości</TabsTrigger>
    </TabsList>

    <TabsContent value="lekcja">
      <Card>
        <CardHeader className="p-8">
          <CardTitle className="text-2xl">Lekcja</CardTitle>
          <CardDescription className="text-base mt-2">
            W tym miejscu, znajdziesz swojego przyszłego nauczyciela.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base text-muted-foreground px-8 pb-8">
          Wystarczy, że zarezerwujesz lekcję. Resztą zajmiemy się my.
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="nasi-nauczyciele">
      <Card>
        <CardHeader className="p-8">
          <CardTitle className="text-2xl">Nasi nauczyciele</CardTitle>
          <CardDescription className="text-base mt-2">
            Nasi nauczyciele to ludzie pełni pasji, zaangażowania i przede wszystkim kwalifikacji. Dzięki nim możesz być spokojny o końcowy rezultat swojej podróży jaką jest nauka.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base text-muted-foreground px-8 pb-8">
          Nawet, jeśli myślisz, że nie dasz rady - spokojnie. Z nimi nie ma słowa "niemożliwe".
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="gwarancja">
      <Card>
        <CardHeader className="p-8">
          <CardTitle className="text-2xl">Gwarancja jakości</CardTitle>
          <CardDescription className="text-base mt-2">
            Pewni swoich nauczycieli oferujemy Ci gwarancję jakości, albo zwrot pieniędzy. Za pomocą współpracy z najlepszymi profesjonalistami naszego kraju opracowaliśmy
            specjalny test mierzący umiejętności korepetytora tylko po to, żebyś skupiał się na tym co najważniejsze - swoim rozwoju.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-base text-muted-foreground px-8 pb-8">
          Pamiętaj - nauka to nie sprint. Regularność to podstawa.
        </CardContent>
      </Card>
    </TabsContent>

        </Tabs>
    </div>
  )
}
