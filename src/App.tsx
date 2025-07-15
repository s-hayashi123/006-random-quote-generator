import { useEffect, useState } from "react";
import "./App.css";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";

interface Quote {
  id: number;
  author: string;
  quote: string;
}

function App() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const randomId = Math.floor(Math.random() * 100) + 1;
      const res = await fetch(
        `https://b13o.github.io/tech-quotes-api/api/quotes/${randomId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "取得エラーが発生しました");
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleClick = () => {
    fetchQuote();
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>ランダム名言ジェネレーター</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[150px] flex justify-center items-center">
          {isLoading ? (
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : quote ? (
            <div>
              <p className="text-lg font-semibold mb-2">{quote.quote}</p>
              <p className="text-right text-sm text-muted-foreground">
                - {quote.author}
              </p>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {quote && (
            <Button asChild className="w-1/2 bg-blue-500 hover:bg-blue-600">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `"${quote.quote}" - ${quote.author}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xで共有
              </a>
            </Button>
          )}

          <Button
            className="w-1/2 cursor-pointer hover:bg-gray-700"
            onClick={handleClick}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get New Quote"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
