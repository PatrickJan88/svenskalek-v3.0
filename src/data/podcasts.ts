export interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  duration: string;
  audioUrl: string;
  imageUrl: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  transcript?: string;
}

export const podcastEpisodes: PodcastEpisode[] = [
  {
    id: 1,
    title: 'Första intryck av Sverige',
    description: 'A beginner-friendly conversation about first impressions of Sweden',
    duration: '5:23',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    imageUrl: '/20190603_stockholm-old-town.jpg',
    difficulty: 'Beginner',
    transcript: `För cirka 14 000 år sedan kom de första människorna till det som långt senare skulle kallas Skandinavien. De kom inte till Sverige, eftersom det skulle dröja många tusen år innan något som kallades så skulle finnas. De var varken skandinaver eller svenskar, utan kallade sig något annat som vi inte känner till. De var inte heller invandrare eftersom de inte passerade någon gräns som man kunde invandra eller utvandra över.

När skapades Sverige?
Vi kan inte tala om Sverige som land, om svenskar eller om svenska som språk när vi talar om forntiden. Det var först under medeltiden som det skapades kungariken och så småningom en stat som kallades Sverige.

Det man kan säga är att forntiden är en historia om tiden innan Sverige. Vi låter historien handla om det geografiska område i östra Skandinavien som idag är svenska statens territorium. Men det är egentligen inte logiskt eftersom de gränserna inte fanns då. Forntidens människogrupper levde i områden som hade en helt annorlunda geografisk utsträckning.`
  },
  {
    id: 2,
    title: 'På restaurangen',
    description: 'Learn how to order food and drinks in Swedish restaurants',
    duration: '7:45',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=300',
    difficulty: 'Beginner',
    transcript: 'Kan jag få menyn, tack? Jag skulle vilja beställa...'
  },
  {
    id: 3,
    title: 'Väder och årstider',
    description: 'Discussing weather and seasons in Sweden',
    duration: '6:12',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    imageUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=300',
    difficulty: 'Intermediate',
    transcript: 'Idag är det kallt ute. Vintern i Sverige är lång och mörk.'
  },
  {
    id: 4,
    title: 'Svensk kultur och traditioner',
    description: 'Explore Swedish culture, traditions, and holidays',
    duration: '9:30',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    imageUrl: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=300',
    difficulty: 'Advanced',
    transcript: 'Midsommar är en av Sveriges viktigaste traditioner...'
  },
  {
    id: 5,
    title: 'Kollektivtrafik i Stockholm',
    description: 'Navigate public transportation in Stockholm',
    duration: '4:56',
    audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    imageUrl: 'https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&w=300',
    difficulty: 'Intermediate',
    transcript: 'Tunnelbanan i Stockholm är mycket effektiv...'
  }
];

export const getRandomPodcast = (): PodcastEpisode => {
  const randomIndex = Math.floor(Math.random() * podcastEpisodes.length);
  return podcastEpisodes[randomIndex];
};