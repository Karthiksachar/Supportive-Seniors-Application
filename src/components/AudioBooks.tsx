import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface AudioBook {
  id: string;
  title: string;
  author: string;
  audioUrl: string;
  coverImage: string;
  duration: string;
}

const AudioBooks = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const books: AudioBook[] = [
    {
      id: '1',
      title: 'The Secret Garden',
      author: 'Frances Hodgson Burnett',
      audioUrl: '/audio/secret-garden.mp3',
      coverImage: 'https://m.media-amazon.com/images/I/51o1GtZNZeL._AC_UF1000,1000_QL80_.jpg',
      duration: '8h 22m'
    },
    {
      id: '2',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      audioUrl: '/audio/pride-prejudice.mp3',
      coverImage: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
      duration: '12h 45m'
    },
    {
      id: '3',
      title: 'The Adventures of Sherlock Holmes',
      author: 'Arthur Conan Doyle',
      audioUrl: '/audio/sherlock-holmes.mp3',
      coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAds5pA1I_IgjLPPZxf5CQMUHayWnagRt22A&s',
      duration: '10h 15m'
    },
    {
      id: '4',
      title: 'रामायण',
      author: 'वाल्मीकि',
      audioUrl: '/audio/ramayana.mp3',
      coverImage: 'https://miro.medium.com/v2/resize:fit:1200/1*klTOU2c3Xp15Oli8ysDIGg.jpeg',
      duration: '45:30'
    },
    {
      id: '5',
      title: 'महाभारत',
      author: 'वेद व्यास',
      audioUrl: '/audio/mahabharat.mp3',
      coverImage: 'https://5.imimg.com/data5/SELLER/Default/2022/2/XK/HZ/YS/147129650/81gxiu-w93l.jpg',
      duration: '52:15'
    }
  ];

  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleEnded = () => setPlaying(null);
    const handleError = () => {
      toast({
        title: "Audio Error",
        description: "There was an error playing this audiobook. Please try again.",
        variant: "destructive"
      });
      setPlaying(null);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('error', handleError);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  const togglePlay = async (book: AudioBook) => {
    if (!audioRef.current) return;

    try {
      if (playing === book.id) {
        audioRef.current.pause();
        setPlaying(null);
      } else {
        if (playing) {
          audioRef.current.pause();
        }
        audioRef.current.src = book.audioUrl;
        await audioRef.current.play();
        setPlaying(book.id);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast({
        title: "Playback Error",
        description: "Unable to play this audiobook. Please try again.",
        variant: "destructive"
      });
      setPlaying(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Audiobooks Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <img 
                src={book.coverImage} 
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm text-gray-500 mb-3">Duration: {book.duration}</p>
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => togglePlay(book)}
                  variant={playing === book.id ? "secondary" : "default"}
                >
                  {playing === book.id ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Play
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AudioBooks;