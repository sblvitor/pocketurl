import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Link } from 'lucide-react'
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"

export function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex items-center justify-center w-full">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="size-4" />
              Shorten a Link
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              placeholder="Paste long URL here"
            />
            <Button>
              Get Pocket Link
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
