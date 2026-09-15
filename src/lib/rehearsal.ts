export type RehearsalBeat = {
  nl: string;
  afFallback: string;
};

export const REHEARSAL: RehearsalBeat[] = [
  {
    nl: "Goedemorgen, fijn dat je er bent. Kun je jezelf kort voorstellen en vertellen waarom je op deze rol reageert?",
    afFallback:
      "Goeiemôre, fyn dat jy hier is. Kan jy jouself kortliks voorstel en sê hoekom jy op hierdie rol reageer?",
  },
  {
    nl: "We zien dat je lokaal wilt draaien. Hoe benut je 128 gigabyte unified memory op een Ryzen AI Max 395?",
    afFallback:
      "Ons sien jy wil plaaslik hardloop. Hoe benut jy 128 gigagreep unified memory op 'n Ryzen AI Max 395?",
  },
  {
    nl: "Faster-Whisper is vooral voor CUDA gebouwd. Wat is je plan op ROCm als CTranslate2 hapert?",
    afFallback:
      "Faster-Whisper is meestal vir CUDA gebou. Wat is jou plan op ROCm as CTranslate2 hakkel?",
  },
  {
    nl: "De interviewer praat in bursts van twee tot drie seconden. Hoe houd je de end-to-end latency onder de twee seconden?",
    afFallback:
      "Die onderhoudvoerder praat in stote van twee tot drie sekondes. Hoe hou jy die end-to-end latency onder twee sekondes?",
  },
  {
    nl: "Waarom Qwen 14B en niet een groter model? Afrikaans is een lagere-resource taal.",
    afFallback:
      "Hoekom Qwen 14B en nie 'n groter model nie? Afrikaans is 'n laer-hulpbron taal.",
  },
  {
    nl: "Laatste vraag: hoe voorkom je dat jouw overlay in een schermdeling terechtkomt?",
    afFallback:
      "Laaste vraag: hoe voorkom jy dat jou oorleg in 'n skermdeling beland?",
  },
];
