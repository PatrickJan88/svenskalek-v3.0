// Extended Swedish vocabulary database with Pexels images
export interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
  imageUrl: string;
  category?: string;
}

export const vocabularyDatabase: VocabularyWord[] = [
  // Basic Words
  {
    id: 1,
    word: 'kaffe',
    translation: 'coffee',
    exampleSentence: 'Jag dricker kaffe på morgonen.',
    exampleTranslation: 'I drink coffee in the morning.',
    imageUrl: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 2,
    word: 'hund',
    translation: 'dog',
    exampleSentence: 'Min hund är mycket snäll.',
    exampleTranslation: 'My dog is very kind.',
    imageUrl: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'animals'
  },
  {
    id: 3,
    word: 'bok',
    translation: 'book',
    exampleSentence: 'Jag läser en intressant bok.',
    exampleTranslation: 'I am reading an interesting book.',
    imageUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 4,
    word: 'strand',
    translation: 'beach',
    exampleSentence: 'Vi går till stranden idag.',
    exampleTranslation: 'We are going to the beach today.',
    imageUrl: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 5,
    word: 'cykel',
    translation: 'bicycle',
    exampleSentence: 'Han cyklar till jobbet.',
    exampleTranslation: 'He cycles to work.',
    imageUrl: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 6,
    word: 'äpple',
    translation: 'apple',
    exampleSentence: 'Jag äter ett äpple.',
    exampleTranslation: 'I eat an apple.',
    imageUrl: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 7,
    word: 'bil',
    translation: 'car',
    exampleSentence: 'Jag kör bil till jobbet.',
    exampleTranslation: 'I drive a car to work.',
    imageUrl: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 8,
    word: 'katt',
    translation: 'cat',
    exampleSentence: 'Katten sover på soffan.',
    exampleTranslation: 'The cat is sleeping on the sofa.',
    imageUrl: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'animals'
  },
  {
    id: 9,
    word: 'hus',
    translation: 'house',
    exampleSentence: 'Mitt hus är stort och vitt.',
    exampleTranslation: 'My house is big and white.',
    imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 10,
    word: 'vatten',
    translation: 'water',
    exampleSentence: 'Jag dricker mycket vatten.',
    exampleTranslation: 'I drink a lot of water.',
    imageUrl: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 11,
    word: 'blomma',
    translation: 'flower',
    exampleSentence: 'Blomman är mycket vacker.',
    exampleTranslation: 'The flower is very beautiful.',
    imageUrl: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 12,
    word: 'träd',
    translation: 'tree',
    exampleSentence: 'Trädet är mycket högt.',
    exampleTranslation: 'The tree is very tall.',
    imageUrl: 'https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 13,
    word: 'sol',
    translation: 'sun',
    exampleSentence: 'Solen skiner idag.',
    exampleTranslation: 'The sun is shining today.',
    imageUrl: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 14,
    word: 'måne',
    translation: 'moon',
    exampleSentence: 'Månen är full ikväll.',
    exampleTranslation: 'The moon is full tonight.',
    imageUrl: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 15,
    word: 'bröd',
    translation: 'bread',
    exampleSentence: 'Jag äter bröd till frukost.',
    exampleTranslation: 'I eat bread for breakfast.',
    imageUrl: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 16,
    word: 'mjölk',
    translation: 'milk',
    exampleSentence: 'Barnet dricker mjölk.',
    exampleTranslation: 'The child drinks milk.',
    imageUrl: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 17,
    word: 'fågel',
    translation: 'bird',
    exampleSentence: 'Fågeln sjunger vackert.',
    exampleTranslation: 'The bird sings beautifully.',
    imageUrl: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'animals'
  },
  {
    id: 18,
    word: 'fisk',
    translation: 'fish',
    exampleSentence: 'Vi äter fisk till middag.',
    exampleTranslation: 'We eat fish for dinner.',
    imageUrl: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'animals'
  },
  {
    id: 19,
    word: 'sko',
    translation: 'shoe',
    exampleSentence: 'Mina skor är nya.',
    exampleTranslation: 'My shoes are new.',
    imageUrl: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 20,
    word: 'klocka',
    translation: 'clock/watch',
    exampleSentence: 'Klockan är tre.',
    exampleTranslation: 'The clock is three.',
    imageUrl: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 21,
    word: 'dörr',
    translation: 'door',
    exampleSentence: 'Stäng dörren, tack.',
    exampleTranslation: 'Close the door, please.',
    imageUrl: 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 22,
    word: 'fönster',
    translation: 'window',
    exampleSentence: 'Öppna fönstret.',
    exampleTranslation: 'Open the window.',
    imageUrl: 'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 23,
    word: 'stol',
    translation: 'chair',
    exampleSentence: 'Stolen är bekväm.',
    exampleTranslation: 'The chair is comfortable.',
    imageUrl: 'https://images.pexels.com/photos/116910/pexels-photo-116910.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 24,
    word: 'bord',
    translation: 'table',
    exampleSentence: 'Bordet är av trä.',
    exampleTranslation: 'The table is made of wood.',
    imageUrl: 'https://images.pexels.com/photos/279618/pexels-photo-279618.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 25,
    word: 'säng',
    translation: 'bed',
    exampleSentence: 'Jag sover i min säng.',
    exampleTranslation: 'I sleep in my bed.',
    imageUrl: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 26,
    word: 'telefon',
    translation: 'phone',
    exampleSentence: 'Min telefon ringer.',
    exampleTranslation: 'My phone is ringing.',
    imageUrl: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 27,
    word: 'dator',
    translation: 'computer',
    exampleSentence: 'Jag arbetar på datorn.',
    exampleTranslation: 'I work on the computer.',
    imageUrl: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 28,
    word: 'skola',
    translation: 'school',
    exampleSentence: 'Barnen går till skolan.',
    exampleTranslation: 'The children go to school.',
    imageUrl: 'https://images.pexels.com/photos/289740/pexels-photo-289740.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'places'
  },
  {
    id: 29,
    word: 'sjukhus',
    translation: 'hospital',
    exampleSentence: 'Sjukhuset är stort.',
    exampleTranslation: 'The hospital is big.',
    imageUrl: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'places'
  },
  {
    id: 30,
    word: 'park',
    translation: 'park',
    exampleSentence: 'Vi leker i parken.',
    exampleTranslation: 'We play in the park.',
    imageUrl: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'places'
  },
  {
    id: 31,
    word: 'restaurang',
    translation: 'restaurant',
    exampleSentence: 'Vi äter på restaurangen.',
    exampleTranslation: 'We eat at the restaurant.',
    imageUrl: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'places'
  },
  {
    id: 32,
    word: 'butik',
    translation: 'shop/store',
    exampleSentence: 'Jag handlar i butiken.',
    exampleTranslation: 'I shop in the store.',
    imageUrl: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'places'
  },
  {
    id: 33,
    word: 'tåg',
    translation: 'train',
    exampleSentence: 'Tåget kommer snart.',
    exampleTranslation: 'The train is coming soon.',
    imageUrl: 'https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 34,
    word: 'buss',
    translation: 'bus',
    exampleSentence: 'Bussen är gul.',
    exampleTranslation: 'The bus is yellow.',
    imageUrl: 'https://images.pexels.com/photos/136739/pexels-photo-136739.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 35,
    word: 'flygplan',
    translation: 'airplane',
    exampleSentence: 'Flygplanet flyger högt.',
    exampleTranslation: 'The airplane flies high.',
    imageUrl: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 36,
    word: 'båt',
    translation: 'boat',
    exampleSentence: 'Båten seglar på sjön.',
    exampleTranslation: 'The boat sails on the lake.',
    imageUrl: 'https://images.pexels.com/photos/163236/luxury-yacht-boat-speed-water-163236.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'transport'
  },
  {
    id: 37,
    word: 'pengar',
    translation: 'money',
    exampleSentence: 'Jag behöver pengar.',
    exampleTranslation: 'I need money.',
    imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'objects'
  },
  {
    id: 38,
    word: 'kött',
    translation: 'meat',
    exampleSentence: 'Vi äter kött till middag.',
    exampleTranslation: 'We eat meat for dinner.',
    imageUrl: 'https://images.pexels.com/photos/65175/pexels-photo-65175.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 39,
    word: 'grönsaker',
    translation: 'vegetables',
    exampleSentence: 'Grönsaker är nyttiga.',
    exampleTranslation: 'Vegetables are healthy.',
    imageUrl: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 40,
    word: 'frukt',
    translation: 'fruit',
    exampleSentence: 'Jag äter frukt varje dag.',
    exampleTranslation: 'I eat fruit every day.',
    imageUrl: 'https://images.pexels.com/photos/235294/pexels-photo-235294.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'food'
  },
  {
    id: 41,
    word: 'kläder',
    translation: 'clothes',
    exampleSentence: 'Mina kläder är rena.',
    exampleTranslation: 'My clothes are clean.',
    imageUrl: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 42,
    word: 'jacka',
    translation: 'jacket',
    exampleSentence: 'Jackan är varm.',
    exampleTranslation: 'The jacket is warm.',
    imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 43,
    word: 'byxor',
    translation: 'pants/trousers',
    exampleSentence: 'Byxorna är blå.',
    exampleTranslation: 'The pants are blue.',
    imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 44,
    word: 'tröja',
    translation: 'sweater/shirt',
    exampleSentence: 'Tröjan är röd.',
    exampleTranslation: 'The sweater is red.',
    imageUrl: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 45,
    word: 'hatt',
    translation: 'hat',
    exampleSentence: 'Hatten skyddar från solen.',
    exampleTranslation: 'The hat protects from the sun.',
    imageUrl: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'clothing'
  },
  {
    id: 46,
    word: 'väder',
    translation: 'weather',
    exampleSentence: 'Vädret är fint idag.',
    exampleTranslation: 'The weather is nice today.',
    imageUrl: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 47,
    word: 'regn',
    translation: 'rain',
    exampleSentence: 'Det regnar ute.',
    exampleTranslation: 'It is raining outside.',
    imageUrl: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 48,
    word: 'snö',
    translation: 'snow',
    exampleSentence: 'Snön är vit.',
    exampleTranslation: 'The snow is white.',
    imageUrl: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 49,
    word: 'vind',
    translation: 'wind',
    exampleSentence: 'Vinden blåser starkt.',
    exampleTranslation: 'The wind is blowing strongly.',
    imageUrl: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'nature'
  },
  {
    id: 50,
    word: 'musik',
    translation: 'music',
    exampleSentence: 'Jag lyssnar på musik.',
    exampleTranslation: 'I listen to music.',
    imageUrl: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'entertainment'
  },
  {
    id: 51,
    word: 'film',
    translation: 'movie',
    exampleSentence: 'Filmen är spännande.',
    exampleTranslation: 'The movie is exciting.',
    imageUrl: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'entertainment'
  },
  {
    id: 52,
    word: 'spel',
    translation: 'game',
    exampleSentence: 'Vi spelar ett spel.',
    exampleTranslation: 'We play a game.',
    imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'entertainment'
  },
  {
    id: 53,
    word: 'tid',
    translation: 'time',
    exampleSentence: 'Tiden går fort.',
    exampleTranslation: 'Time goes fast.',
    imageUrl: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'abstract'
  },
  {
    id: 54,
    word: 'kärlek',
    translation: 'love',
    exampleSentence: 'Kärlek är viktigt.',
    exampleTranslation: 'Love is important.',
    imageUrl: 'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'abstract'
  },
  {
    id: 55,
    word: 'vän',
    translation: 'friend',
    exampleSentence: 'Min vän är snäll.',
    exampleTranslation: 'My friend is kind.',
    imageUrl: 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'people'
  }
];

// Helper function to get random words
export const getRandomWords = (count: number = 5): VocabularyWord[] => {
  const shuffled = [...vocabularyDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get word by ID
export const getWordById = (id: number): VocabularyWord | undefined => {
  return vocabularyDatabase.find(word => word.id === id);
};