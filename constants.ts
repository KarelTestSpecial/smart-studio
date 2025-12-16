import { EmailTemplate, SmartRule } from './types';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    "id": "fix",
    "name": "Technische Fout / Probleem",
    "subject": "Kleine opmerking over de website van {bedrijfsnaam}",
    "body": "Beste,\n\nIk zocht onlangs de openingsuren van {bedrijfsnaam} en merkte iets op aan uw website: {notitie}.\n\nOmdat dit klanten kan kosten, wilde ik u dit even laten weten.\n\nIk ben een lokale webdeveloper uit de buurt. Ik werk via de payroll-structuur van Smart (SmartBe), wat betekent dat ik 100% zakelijk en verzekerd werk, zonder gedoe.\n\nAls u wilt, kan ik dit probleem snel voor u oplossen. Zal ik een vrijblijvend voorstel sturen?\n\nVriendelijke groet,\n\n{gebruikersnaam}\n(Via Smart ActiviteitenCoöperatie)"
  },
  {
    "id": "modern",
    "name": "Verouderd Design / Modernisering",
    "subject": "De online uitstraling van {bedrijfsnaam}",
    "body": "Beste,\n\nIk kwam vandaag op de website van {bedrijfsnaam}. Het viel me op dat de site niet goed leesbaar is op een smartphone (of er wat verouderd uitziet).\n\nTegenwoordig zoekt 80% van de klanten via hun telefoon. Een frisse, snelle site zorgt direct voor meer vertrouwen en klanten.\n\nIk help lokale ondernemers met betaalbare, moderne websites. Ik werk officieel via SmartBe, dus u ontvangt gewoon een factuur zoals bij elk ander bedrijf.\n\nMag ik u eens een voorbeeld sturen van wat er mogelijk is?\n\nMet vriendelijke groet,\n\n{gebruikersnaam}"
  },
  {
    "id": "nosite",
    "name": "Nog geen website (Alleen Socials)",
    "subject": "Vinden klanten {bedrijfsnaam} wel op Google?",
    "body": "Beste,\n\nIk zocht naar {bedrijfsnaam} op Google, maar ik zag dat u nog geen eigen website heeft (alleen Facebook/Instagram/Maps).\n\nEen eigen site zorgt ervoor dat u ook gevonden wordt door mensen die niet op social media zitten, en het straalt professionaliteit uit.\n\nIk kan voor u een eenvoudige, maar krachtige 'visitekaartje-site' bouwen. Ik regel alles veilig en officieel via de diensten van SmartBe.\n\nInteresse in een korte babbel hierover?\n\nVriendelijke groet,\n\n{gebruikersnaam}"
  }
];

export const SMART_CHECKLIST_STEPS: SmartRule[] = [
  {
    "step": 1,
    "title": "Prijs & Opdracht op papier?",
    "description": "Heb je een e-mail van de klant waarin staat: 'Voor akkoord' op jouw prijs en omschrijving? Mondelinge afspraken tellen niet als bewijs bij discussies.",
    "critical": false
  },
  {
    "step": 2,
    "title": "Klantgegevens compleet?",
    "description": "Je hebt nodig: Bedrijfsnaam, Adres, BTW-nummer (BE0...), en het emailadres van de boekhouding van de klant.",
    "critical": false
  },
  {
    "step": 3,
    "title": "Activiteit ingevoerd bij Smart?",
    "description": "Log in op SmartBe. Ga naar 'Activiteiten' > 'Nieuw'. Omschrijving: 'Webdevelopment'. Startdatum moet in de toekomst liggen!",
    "critical": true
  },
  {
    "step": 4,
    "title": "Contract verstuurd door Smart?",
    "description": "Na jouw invoer stuurt Smart automatisch het contract naar de klant. Jij hoeft zelf geen contract te maken.",
    "critical": false
  },
  {
    "step": 5,
    "title": "Contract GETEKEND door klant?",
    "description": "STOP! Check je Smart-dashboard. Staat het bolletje op groen/getekend? Pas DAN ben je verzekerd. Begin nooit zonder handtekening.",
    "critical": true
  }
];
