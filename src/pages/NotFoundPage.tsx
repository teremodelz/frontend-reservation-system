import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {Card} from "@/components/ui/card"

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[oklch(21%_0.006_285.885)]">
    <Card className="w-full max-w-lg">
    
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Bląd! - Nie znaleziono</EmptyTitle>
        <EmptyDescription>
          Strona której szukasz nie istnieje. Zerknij na swoje url i upewnij się, że na pewno wszystko jest w porządku.
          Jeśli ci się nie chce na to patrzeć - powróć proszę do strony glównej.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          <a href="/">Powrót do strony glównej.</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>

    </Card>

    </div>
  )
}
export default NotFoundPage
